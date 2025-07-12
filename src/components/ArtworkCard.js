import React from 'react';
import { ethers } from 'ethers';
import Purchase from './Purchase';
import Tip from './Tip';

const ArtworkCard = ({ artwork, contract, account, isArtist }) => {
  // Format price from wei to ETH for display
  const formatPrice = (priceInWei) => {
    try {
      return ethers.utils.formatEther(priceInWei);
    } catch (error) {
      console.error('Error formatting price:', error);
      return '0';
    }
  };

  // IPFS gateway URL for displaying images
  const ipfsGatewayUrl = 'https://ipfs.io/ipfs/';
  
  // Check if the current user is the artist of this artwork
  const isArtworkCreator = artwork.artist.toLowerCase() === account.toLowerCase();

  return (
    <div className="artwork-card">
      <div className="artwork-image">
        <img 
          src={`${ipfsGatewayUrl}${artwork.ipfsHash}`} 
          alt={artwork.title} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Available';
          }}
        />
      </div>
      
      <div className="artwork-details">
        <h3>{artwork.title}</h3>
        <p className="artist">Artist: {artwork.artistName}</p>
        <p className="description">{artwork.description}</p>
        <p className="price">Price: {formatPrice(artwork.price)} ETH</p>
        <p className="status">{artwork.isSold ? 'Sold' : 'Available'}</p>
      </div>
      
      <div className="artwork-actions">
        {/* Show purchase button only if artwork is not sold and user is not the creator */}
        {!artwork.isSold && !isArtworkCreator && (
          <Purchase 
            artworkId={artwork.id} 
            price={artwork.price} 
            contract={contract} 
          />
        )}
        
        {/* Show tip button if user is not the creator */}
        {!isArtworkCreator && (
          <Tip 
            artistAddress={artwork.artist} 
            artistName={artwork.artistName} 
            contract={contract} 
          />
        )}
      </div>
    </div>
  );
};

export default ArtworkCard;