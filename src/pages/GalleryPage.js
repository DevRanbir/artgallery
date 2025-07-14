import React from 'react';
import Gallery from '../components/Gallery';

const GalleryPage = ({ contract, account, isArtist, connectWallet }) => {
  return (
    <div className="gallery-page">
      <div className="gallery-header">
        <div className="container">
          <h1 className="gallery-title">Art Gallery</h1>
          <p className="gallery-subtitle">
            Discover and collect unique digital artworks from talented artists around the world
          </p>
          <div className="developer-credit-header">
            <small>Developed by <strong>DevRanbir</strong></small>
          </div>
        </div>
      </div>
      
      <div className="gallery-content">
        <Gallery contract={contract} account={account} isArtist={isArtist} connectWallet={connectWallet} />
      </div>
    </div>
  );
};

export default GalleryPage;
