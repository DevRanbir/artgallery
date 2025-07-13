import React from 'react';
import { formatWeiToBothCurrencies, truncateAddress } from '../utils/currency';

const ArtworkViewer = ({ 
  artwork, 
  account, 
  onClose, 
  onPurchase, 
  onTip, 
  onRemove,
  loading 
}) => {
  const isOwner = artwork.artist.toLowerCase() === account?.toLowerCase();
  const isPurchasable = !artwork.isSold && !isOwner;
  const canTip = !isOwner && account;
  const priceDisplay = formatWeiToBothCurrencies(artwork.price);

  return (
    <div className="artwork-viewer-overlay" onClick={onClose}>
      {/* Background Image */}
      <div 
        className="artwork-viewer-background"
        style={{ backgroundImage: `url(${artwork.ipfsHash})` }}
      />
      
      {/* Dark Overlay for readability */}
      <div className="artwork-viewer-backdrop" />
      
      {/* Content Overlay */}
      <div className="artwork-viewer-ui" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="artwork-viewer-close" onClick={onClose}>
          ×
        </button>
        
        {/* Top Info Panel */}
        <div className="artwork-info-panel top-panel">
          <div className="artwork-title-section">
            <h1 className="artwork-title">{artwork.title}</h1>
            <p className="artwork-artist">
              by {artwork.artistName || truncateAddress(artwork.artist)}
            </p>
          </div>
          
          <div className="artwork-price-section">
            <div className="price-primary">{priceDisplay.eth}</div>
            <div className="price-secondary">{priceDisplay.inr}</div>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className="artwork-status-badge">
          {artwork.isSold && !artwork.wasRemoved && (
            <div className="status-sold">
              <span>Sold</span>
              {artwork.buyer && (
                <small>to {artwork.buyerName || truncateAddress(artwork.buyer)}</small>
              )}
            </div>
          )}
          {artwork.wasRemoved && <span className="status-removed">Removed</span>}
          {!artwork.isSold && !artwork.wasRemoved && <span className="status-available">Available</span>}
        </div>
        
        {/* Action Buttons */}
        <div className="artwork-actions-panel">
          {isPurchasable && (
            <button 
              className="action-btn primary-action"
              onClick={onPurchase}
              disabled={loading}
            >
              <span className="btn-icon">🛒</span>
              <span className="btn-text">Buy Now</span>
            </button>
          )}
          
          {canTip && (
            <button 
              className="action-btn secondary-action"
              onClick={onTip}
              disabled={loading}
            >
              <span className="btn-icon">💝</span>
              <span className="btn-text">Tip</span>
            </button>
          )}
          
          {isOwner && !artwork.isSold && (
            <button 
              className="action-btn danger-action"
              onClick={onRemove}
              disabled={loading}
            >
              <span className="btn-icon">🗑️</span>
              <span className="btn-text">
                {loading ? 'Processing...' : 'Remove'}
              </span>
            </button>
          )}
        </div>
        
        {/* Bottom Info Panel */}
        <div className="artwork-info-panel bottom-panel">
          {artwork.description && (
            <div className="artwork-description">
              <p>{artwork.description}</p>
            </div>
          )}
          
          <div className="artwork-metadata">
            <span className="metadata-item">ID #{artwork.id}</span>
            <span className="metadata-divider">•</span>
            <span className="metadata-item">{truncateAddress(artwork.artist)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkViewer;
