import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ArtworkCard from './ArtworkCard';

const Gallery = ({ contract, account, isArtist }) => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArtworks = async () => {
      if (!contract) return;
      
      try {
        setLoading(true);
        setError('');
        
        // Get the total number of artworks
        const artworkCount = await contract.artworkCount();
        const count = artworkCount.toNumber();
        
        // Fetch all artworks
        const artworksList = [];
        for (let i = 1; i <= count; i++) {
          // Get artwork basic info
          const [id, artist, price, isSold] = await contract.getArtworkBasic(i);
          
          // Get artwork details
          const [title, description, ipfsHash] = await contract.getArtworkDetails(i);
          
          // Get artist name
          const [artistName] = await contract.getArtistInfo(artist);
          
          artworksList.push({
            id: id.toNumber(),
            artist,
            artistName,
            title,
            description,
            ipfsHash,
            price: price.toString(),
            isSold
          });
        }
        
        // Filter out sold artworks (they should only appear in collection page)
        const availableArtworks = artworksList.filter(artwork => !artwork.isSold);
        setArtworks(availableArtworks);
      } catch (err) {
        console.error('Error fetching artworks:', err);
        setError('Error loading artworks. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, [contract]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading artworks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        {error}
      </div>
    );
  }

  if (artworks.length === 0) {
    return (
      <div className="gallery-container">
        <div className="container">
          <div className="no-artworks">
            <div className="empty-state-icon">🎨</div>
            <h3>No artworks available yet.</h3>
            {isArtist && (
              <p>
                You're registered as an artist! 
                <Link to="/upload" className="btn btn-primary" style={{marginLeft: '10px'}}>
                  Upload your first artwork
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-container">
      <div className="filters-container">
        <div className="container">
          <div className="filters-wrapper">
            <div className="search-box">
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                className="search-input" 
                placeholder="Search artworks, artists..." 
              />
            </div>
            
            <div className="filter-buttons">
              <button className="filter-btn active">All</button>
              <button className="filter-btn">Available</button>
              <button className="filter-btn">Recently Added</button>
            </div>
            
            <div className="sort-dropdown">
              <select className="sort-select">
                <option>Sort by: Latest</option>
                <option>Sort by: Price</option>
                <option>Sort by: Popular</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container">
        <div className="artwork-grid">
          {artworks.map(artwork => (
            <ArtworkCard
              key={artwork.id}
              artwork={artwork}
              contract={contract}
              account={account}
              isArtist={isArtist}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;