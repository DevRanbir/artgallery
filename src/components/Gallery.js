import React, { useState, useEffect } from 'react';
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
        
        setArtworks(artworksList);
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
    return <div className="loading">Loading artworks...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (artworks.length === 0) {
    return <div className="no-artworks">No artworks available yet.</div>;
  }

  return (
    <div className="gallery-container">
      <div className="artworks-grid">
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
  );
};

export default Gallery;