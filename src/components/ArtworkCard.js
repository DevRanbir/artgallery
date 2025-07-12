import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Purchase from './Purchase';
import Tip from './Tip';

const ArtworkCard = ({ artwork, contract, account, isArtist, showPurchaseButton = true }) => {
  const [ethToInr, setEthToInr] = useState(250000); // Fallback rate
  const [showTip, setShowTip] = useState(false);

  // Fetch ETH to INR conversion rate
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr');
        const data = await response.json();
        setEthToInr(data.ethereum?.inr || 250000);
      } catch (error) {
        console.log('Exchange rate fetch failed, using fallback rate');
      }
    };
    fetchExchangeRate();
  }, []);

  // Format price from wei to ETH for display
  const formatPrice = (priceInWei) => {
    try {
      return ethers.utils.formatEther(priceInWei);
    } catch (error) {
      console.error('Error formatting price:', error);
      return '0';
    }
  };

  // Calculate INR equivalent
  const calculateInr = (ethAmount) => {
    if (!ethAmount || !ethToInr) return 0;
    return (parseFloat(ethAmount) * ethToInr).toLocaleString('en-IN');
  };

  // IPFS gateway URL for displaying images
  const ipfsGatewayUrl = 'https://ipfs.io/ipfs/';
  
  // Get image source - try localStorage first, then IPFS
  const getImageSrc = () => {
    // Try to get image from localStorage first
    const localImages = Object.keys(localStorage).filter(key => key.startsWith('artwork_'));
    for (const key of localImages) {
      const storedImage = localStorage.getItem(key);
      if (storedImage) {
        // In a real app, you'd match this properly with the artwork
        // For demo, we'll show local images for recent artworks
        return storedImage;
      }
    }
    // Fallback to IPFS
    return `${ipfsGatewayUrl}${artwork.ipfsHash}`;
  };
  
  // Check if the current user is the artist of this artwork
  const isArtworkCreator = artwork.artist.toLowerCase() === account.toLowerCase();

  return (
    <div className="artwork-card">
      <div className="artwork-image">
        <img 
          src={getImageSrc()} 
          alt={artwork.title} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
          }}
        />
        {artwork.isSold && (
          <div className="sold-badge">SOLD</div>
        )}
      </div>
      
      <div className="artwork-info">
        <h3 className="artwork-title">{artwork.title}</h3>
        <p className="artwork-artist">By {artwork.artistName}</p>
        <p className="artwork-description">{artwork.description.length > 80 
          ? `${artwork.description.substring(0, 80)}...` 
          : artwork.description}
        </p>
        <div className="artwork-price-container">
          <p className="artwork-price">{formatPrice(artwork.price)} ETH</p>
          <p className="artwork-price-inr">≈ ₹{calculateInr(formatPrice(artwork.price))}</p>
        </div>
        
        <div className="artwork-action">
          {/* Show purchase/tip buttons only if user is not the creator */}
          {!isArtworkCreator ? (
            <>
              <div className="artwork-actions-row">
                {!artwork.isSold && showPurchaseButton && (
                  <Purchase 
                    artworkId={artwork.id} 
                    price={artwork.price} 
                    contract={contract} 
                    account={account}
                    className="btn-small"
                  />
                )}
                <button 
                  onClick={() => setShowTip(!showTip)}
                  className={`tip-toggle-btn ${showTip ? 'active' : ''}`}
                >
                  {showTip ? '🙈 Hide' : '💝 Tip'}
                </button>
              </div>
              
              {showTip && (
                <Tip 
                  artistAddress={artwork.artist} 
                  artistName={artwork.artistName} 
                  contract={contract} 
                  compact={true}
                />
              )}
            </>
          ) : (
            <div className="creator-badge">
              ✨ Your Artwork
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
};

export default ArtworkCard;