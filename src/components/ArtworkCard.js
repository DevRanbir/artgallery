import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ethers } from 'ethers';
import { formatWeiToEth, formatWeiToBothCurrencies, truncateAddress } from '../utils/currency';
import Purchase from './Purchase';
import Tip from './Tip';
import ArtworkViewer from './ArtworkViewer';
import '../styles/artwork-viewer.css';

const ArtworkCard = ({ 
  artwork, 
  contract, 
  account, 
  showPurchaseButton = true,
  onArtworkRemoved
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOpenModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
    // Prevent body scroll when modal opens
    document.body.classList.add('modal-open');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    // Re-enable body scroll when modal closes
    document.body.classList.remove('modal-open');
  };

  const handleOpenViewer = () => {
    setIsViewerOpen(true);
    document.body.classList.add('modal-open');
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    document.body.classList.remove('modal-open');
  };

  const handleViewerAction = (action) => {
    // Close viewer first
    handleCloseViewer();
    // Small delay to ensure smooth transition
    setTimeout(() => {
      handleOpenModal(action);
    }, 100);
  };

  // Cleanup on unmount and handle escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        if (isModalOpen) {
          handleCloseModal();
        } else if (isViewerOpen) {
          handleCloseViewer();
        }
      }
    };

    if (isModalOpen || isViewerOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.body.classList.remove('modal-open');
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isModalOpen, isViewerOpen]);

  const isOwner = artwork.artist.toLowerCase() === account?.toLowerCase();
  const isPurchasable = !artwork.isSold && !isOwner && showPurchaseButton;
  const canTip = !isOwner && account;

  // Handle artwork deletion (only for owner)
  const handleRemoveArtwork = async () => {
    try {
      // Reset previous errors
      setError('');
      
      // Get the account's balance
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(account);
      console.log(`Account balance: ${ethers.utils.formatEther(balance)} ETH`);
      
      // Get the artwork details fresh from the contract to ensure we have the latest price
      console.log(`Fetching artwork ID ${artwork.id} from contract for removal`);
      const [id, artist, price, isSold] = await contract.getArtworkBasic(artwork.id);
      
      console.log(`Artwork details from contract:
        ID: ${id.toString()}
        Artist: ${artist}
        Price: ${price.toString()} wei (${ethers.utils.formatEther(price)} ETH)
        Is Sold: ${isSold}`);
      
      if (isSold) {
        setError("This artwork has already been sold or removed");
        return;
      }
      
      // Ensure price is valid
      if (price.eq(0)) {
        setError("Artwork price is invalid");
        return;
      }
      
      // Calculate 5% fee directly from the contract price
      let removalFee = price.mul(5).div(100);
      
      // Ensure minimum fee (1 wei) if calculation results in zero
      if (removalFee.eq(0)) {
        removalFee = ethers.BigNumber.from(1);
      }
      
      console.log(`Removal fee calculation:
        5% of ${price.toString()} = ${removalFee.toString()} wei
        (${ethers.utils.formatEther(removalFee)} ETH)`);
      
      // Check if account has enough balance for fee + gas
      const gasPrice = await provider.getGasPrice();
      const estimatedGas = 300000; // Reasonable estimate
      const estimatedGasCost = gasPrice.mul(estimatedGas);
      const totalCost = removalFee.add(estimatedGasCost);
      
      console.log(`Transaction cost estimation:
        Gas price: ${gasPrice.toString()} wei
        Estimated gas: ${estimatedGas}
        Gas cost: ~${ethers.utils.formatEther(estimatedGasCost)} ETH
        Fee: ${ethers.utils.formatEther(removalFee)} ETH
        Total: ~${ethers.utils.formatEther(totalCost)} ETH
        Balance: ${ethers.utils.formatEther(balance)} ETH`);
      
      if (balance.lt(totalCost)) {
        setError(`Insufficient funds. You need approximately ${ethers.utils.formatEther(totalCost)} ETH for this transaction.`);
        return;
      }
      
      const formattedFee = ethers.utils.formatEther(removalFee);
      if (!window.confirm(`Are you sure you want to remove "${artwork.title}"? This requires a 5% fee of ${formattedFee} ETH`)) return;
      
      setLoading(true);
      
      // Make sure artwork ID is a proper number
      const artworkId = artwork.id;
      console.log(`Initiating contract call to remove artwork ID: ${artworkId}, with fee: ${removalFee.toString()} wei`);
      
      // Call the contract with the proper fee amount and explicit gas settings
      const transaction = await contract.removeArtwork(
        artworkId, 
        { 
          value: removalFee,
          gasLimit: 300000 // Reasonable gas limit for this operation
        }
      );
      
      console.log('Transaction submitted:', transaction.hash);
      
      // Wait for transaction to be mined with timeout and status updates
      console.log('Waiting for transaction to be mined...');
      
      const receipt = await new Promise((resolve, reject) => {
        const checkReceipt = async () => {
          try {
            const receipt = await provider.getTransactionReceipt(transaction.hash);
            if (receipt) {
              clearTimeout(timeout);
              resolve(receipt);
            } else {
              setTimeout(checkReceipt, 2000); // Check every 2 seconds
            }
          } catch (error) {
            console.error('Error checking transaction receipt:', error);
            clearTimeout(timeout);
            reject(error);
          }
        };
        
        // Set a timeout of 2 minutes
        const timeout = setTimeout(() => {
          reject(new Error('Transaction confirmation timed out after 2 minutes'));
        }, 120000);
        
        // Start checking
        checkReceipt();
      });
      
      console.log('Transaction mined:', receipt);
      
      if (receipt.status === 0) {
        throw new Error('Transaction failed on the blockchain');
      }
      
      console.log('Transaction successful!');
      
      // Update UI
      if (onArtworkRemoved) {
        onArtworkRemoved(artwork.id);
      }
      
      // Store removal in localStorage as backup (in case of page refresh before contract state updates)
      const removedArtworks = JSON.parse(localStorage.getItem(`removed_${account}`) || '[]');
      if (!removedArtworks.includes(artwork.id)) {
        removedArtworks.push(artwork.id);
        localStorage.setItem(`removed_${account}`, JSON.stringify(removedArtworks));
      }
      
      // Show success message
      window.alert(`Artwork "${artwork.title}" has been successfully removed.`);
      
    } catch (err) {
      console.error('Error removing artwork:', err);
      
      // Log detailed information about the error
      console.log('Error object details:', JSON.stringify({
        code: err.code,
        message: err.message,
        data: err.data,
        reason: err.reason,
        transaction: err.transaction
      }, null, 2));
      
      // Extract meaningful error message from blockchain error
      let errorMessage = 'Failed to remove artwork';
      
      // Handle specific RPC errors
      if (err.code === -32603) {
        // Internal JSON-RPC error
        if (err.data && err.data.message) {
          console.log('RPC Error data:', JSON.stringify(err.data, null, 2));
          
          if (err.data.message.includes('execution reverted')) {
            // Extract revert reason if available
            const revertReason = err.data.message.match(/execution reverted: (.*?)(?:$|")/);
            if (revertReason && revertReason[1]) {
              errorMessage = `Contract error: ${revertReason[1]}`;
              
              // Provide specific guidance based on common errors
              if (revertReason[1].includes('Invalid artwork ID')) {
                errorMessage = 'This artwork no longer exists in the contract';
              } else if (revertReason[1].includes('Only the artist')) {
                errorMessage = 'Only the creator of this artwork can remove it';
              } else if (revertReason[1].includes('Cannot remove artwork that has been sold')) {
                errorMessage = 'Artwork has already been sold and cannot be removed';
              } else if (revertReason[1].includes('Removal requires a 5% fee')) {
                errorMessage = 'The removal fee is incorrect. Please try again.';
              }
            } else {
              errorMessage = 'Contract execution reverted. Check your wallet has enough ETH for fees.';
            }
          } else if (err.data.message.includes('insufficient funds')) {
            errorMessage = 'You don\'t have enough ETH to pay for the removal fee and gas';
          } else {
            errorMessage = `RPC Error: ${err.data.message}`;
          }
        } else {
          errorMessage = 'Internal JSON-RPC error. Make sure you have enough ETH to pay for gas and the removal fee.';
        }
      } else if (err.reason) {
        errorMessage += `: ${err.reason}`;
      } else if (err.data && err.data.message) {
        errorMessage += `: ${err.data.message}`;
      } else if (err.message) {
        // Check for common MetaMask errors
        if (err.message.includes('user rejected')) {
          errorMessage = 'Transaction was rejected in your wallet';
        } else if (err.message.includes('insufficient funds')) {
          errorMessage = 'You don\'t have enough ETH for the removal fee and gas';
        } else if (err.message.includes('gas required exceeds')) {
          errorMessage = 'Gas estimation failed. The transaction might fail.';
        } else if (err.message.includes('transaction underpriced')) {
          errorMessage = 'Transaction fee too low. Try increasing gas price or try again later.';
        } else if (err.message.includes('nonce too low')) {
          errorMessage = 'Transaction conflict. Please reload the page and try again.';
        } else {
          errorMessage += `: ${err.message}`;
        }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="artwork-card">
      {/* Artwork Viewer Modal */}
      {isViewerOpen && createPortal(
        <ArtworkViewer
          artwork={artwork}
          account={account}
          onClose={handleCloseViewer}
          onPurchase={() => handleViewerAction('purchase')}
          onTip={() => handleViewerAction('tip')}
          onRemove={handleRemoveArtwork}
          loading={loading}
        />,
        document.body
      )}

      {/* Action Modals */}
      {isModalOpen && modalType === 'purchase' && createPortal(
        <Purchase 
          artworkId={artwork.id}
          price={artwork.price}
          contract={contract}
          account={account}
          onClose={handleCloseModal}
        />,
        document.body
      )}
      
      {isModalOpen && modalType === 'tip' && createPortal(
        <Tip 
          artistAddress={artwork.artist}
          artistName={artwork.artistName}
          contract={contract}
          account={account}
          onClose={handleCloseModal}
        />,
        document.body
      )}
      
      {/* Artwork Image - Click to open viewer */}
      <div className="artwork-image-container" onClick={handleOpenViewer}>
        <img 
          src={artwork.ipfsHash} 
          alt={artwork.title} 
          className="artwork-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder-art.jpg';
          }}
        />
        
        {/* Overlay for actions */}
        <div className="artwork-overlay">
          <div className="artwork-actions">
            {isPurchasable && (
              <button 
                className="artwork-action-btn purchase-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenModal('purchase');
                }}
                disabled={loading}
              >
                Buy Now
              </button>
            )}
            
            {canTip && (
              <button 
                className="artwork-action-btn tip-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenModal('tip');
                }}
                disabled={loading}
              >
                Tip Artist
              </button>
            )}
            
            {isOwner && (
              <button 
                className="artwork-action-btn remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveArtwork();
                }}
                disabled={loading || artwork.isSold}
                title={artwork.isSold ? "Sold artworks cannot be removed" : "Remove artwork (5% fee applies)"}
              >
                {loading ? 'Processing...' : 'Remove'}
              </button>
            )}
          </div>
        
        </div>
      </div>
      
      {/* Artwork Info */}
      <div className="artwork-info">
        <h3 className="artwork-title">{artwork.title}</h3>
        
        <div className="artwork-creator">
          <span className="artist-label">By</span>
          <span className="artist-name">{artwork.artistName || truncateAddress(artwork.artist)}</span>
        </div>
        
        <div className="artwork-description">
          {artwork.description?.length > 100 
            ? `${artwork.description.substring(0, 100)}...` 
            : artwork.description}
        </div>
        
        <div className="artwork-footer">
          <div className="artwork-price">
            <div className="price-values">
              <span className="price-eth">
                {artwork.price ? formatWeiToEth(artwork.price) : '0 ETH'}
              </span>
              {artwork.price && (
                <span className="price-inr">
                  {formatWeiToBothCurrencies(artwork.price).inr}
                </span>
              )}
            </div>
            <div className="artwork-badges">
              {artwork.isSold && !artwork.wasRemoved && (
                <div className="sold-info">
                  <span className="sold-badge">Sold</span>
                  {artwork.buyer && (
                    <div className="buyer-info">
                      <span className="buyer-label">to</span>
                      <span className="buyer-name">
                        {artwork.buyerName || truncateAddress(artwork.buyer)}
                      </span>
                    </div>
                  )}
                </div>
              )}
              {artwork.wasRemoved && <span className="removed-badge">Removed</span>}
            </div>
          </div>
          
          {error && <div className="error-message">⚠️ {error}</div>}
        </div>
      </div>
    </div>
  );
};

export default ArtworkCard;
