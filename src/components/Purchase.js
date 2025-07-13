import React, { useState } from 'react';
import { ethers } from 'ethers';
import { formatWeiToBothCurrencies } from '../utils/currency';

const Purchase = ({ artworkId, price, contract, account, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Ensure price is properly formatted as BigNumber
      const priceInWei = ethers.BigNumber.from(price.toString());
      
      // Call the contract method to purchase the artwork
      const tx = await contract.purchaseArtwork(artworkId, {
        value: priceInWei // Send the exact price amount as BigNumber
      });

      // Wait for the transaction to be mined
      await tx.wait();

      // Store purchase in localStorage for tracking in collection page
      if (account) {
        const userPurchases = JSON.parse(localStorage.getItem(`purchases_${account}`) || '[]');
        if (!userPurchases.includes(artworkId)) {
          userPurchases.push(artworkId);
          localStorage.setItem(`purchases_${account}`, JSON.stringify(userPurchases));
        }
      }

      // Show success message
      setSuccess(true);
    } catch (err) {
      console.error('Error purchasing artwork:', err);
      setError(err.message || 'Error purchasing artwork. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get formatted price for display
  const priceDisplay = formatWeiToBothCurrencies(price);

  if (success) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="purchase-container">
            <div className="alert alert-success">
              <h3>🎉 Purchase Successful!</h3>
              <p>Artwork purchased successfully! The artwork is now yours.</p>
              <div className="purchase-actions">
                {onClose && (
                  <button 
                    className="btn-primary" 
                    onClick={onClose}
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="purchase-container">
          <div className="purchase-header">
            <h3 className="purchase-title">🎨 Purchase Artwork</h3>
            <p className="purchase-subtitle">Complete your purchase to own this artwork</p>
          </div>
          
          <div className="purchase-details">
            <div className="purchase-price">
              <div className="purchase-price-eth">{priceDisplay.eth}</div>
              <div className="purchase-price-inr">{priceDisplay.inr}</div>
            </div>
          </div>
          
          {error && <div className="alert alert-error">{error}</div>}
          
          <button 
            className="purchase-button" 
            onClick={handlePurchase} 
            disabled={loading}
          >
            {loading ? (
              <span className="loading-indicator">
                <span className="loading-spinner"></span>
                Processing...
              </span>
            ) : (
              'Confirm Purchase'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Purchase;