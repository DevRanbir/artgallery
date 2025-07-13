import React, { useState, useEffect, useCallback, useRef } from 'react';
import ArtworkCard from './ArtworkCard';

const Gallery = ({ contract, account, isArtist }) => {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    availability: 'available', // 'all', 'available', 'sold'
    sortBy: 'newest', // 'newest', 'price-low-high', 'price-high-low'
  });
  const [search, setSearch] = useState('');
  const [isSticky, setIsSticky] = useState(false);
  const controlsRef = useRef(null);

  const fetchArtworks = useCallback(async () => {
    if (!contract) {
      setLoading(false);
      setError('Wallet not connected or contract not loaded. Please connect your wallet.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const artworkCount = await contract.artworkCount();
      const count = artworkCount.toNumber();
      
      const artworksList = [];
      
      // Get all ArtworkPurchased events to map buyers to artworks
      let buyerMap = {};
      try {
        const purchaseEvents = await contract.queryFilter(contract.filters.ArtworkPurchased());
        
        // Create a map of artworkId -> buyer address
        purchaseEvents.forEach(event => {
          const artworkId = event.args.artworkId.toNumber();
          const buyer = event.args.buyer;
          buyerMap[artworkId] = buyer;
        });
      } catch (eventError) {
        console.warn('Could not fetch purchase events:', eventError);
        // Continue without buyer info if events can't be fetched
      }
      
      for (let i = 1; i <= count; i++) {
        try {
          // Get artwork basic info
          const [id, artist, price, isSold] = await contract.getArtworkBasic(i);
          
          // If the artwork is marked as sold in the contract, we'll check if it's
          // in our local storage to determine if it's actually sold or was removed
          let wasRemoved = false;
          
          // Check if artwork is removed by the creator (client-side tracking)
          const removedArtworks = JSON.parse(localStorage.getItem(`removed_${artist}`) || '[]');
          if (removedArtworks.includes(id.toNumber())) {
            wasRemoved = true;
            // We still want to include removed artworks in the list but mark them as removed
            // so they can be filtered out by the availability filter
          }
          
          // Get artwork details
          const [title, description, imageUrl] = await contract.getArtworkDetails(i);
          
          // Get artist name
          const [artistName] = await contract.getArtistInfo(artist);
          
          // Get buyer info if artwork is sold
          let buyer = null;
          let buyerName = null;
          if (isSold && buyerMap[id.toNumber()]) {
            buyer = buyerMap[id.toNumber()];
            try {
              // Try to get buyer's artist name if they're registered
              const [name, isRegistered] = await contract.getArtistInfo(buyer);
              if (isRegistered && name) {
                buyerName = name;
              }
            } catch (buyerError) {
              // Buyer might not be a registered artist, that's okay
              console.log(`Buyer ${buyer} is not a registered artist`);
            }
          }
          
          artworksList.push({
            id: id.toNumber(),
            artist,
            artistName,
            title,
            description,
            ipfsHash: imageUrl, // Using ipfsHash property for consistency
            price: price.toString(),
            isSold,
            wasRemoved,
            buyer,
            buyerName
          });
        } catch (artworkError) {
          console.error(`Error fetching artwork ${i}:`, artworkError);
        }
      }
      
      setArtworks(artworksList);
    } catch (err) {
      console.error('Error fetching artworks:', err);
      setError('Error loading artworks. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [contract]);

  useEffect(() => {
    fetchArtworks();
  }, [fetchArtworks]);

  // Handle sticky controls behavior on scroll
  useEffect(() => {
    let controlsOriginalOffsetTop = null;
    
    const handleScroll = () => {
      if (controlsRef.current) {
        // Get the original offset position if we haven't already
        if (controlsOriginalOffsetTop === null) {
          controlsOriginalOffsetTop = controlsRef.current.offsetTop;
        }
        
        // Check if we've scrolled past the original position of the controls
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const shouldBeSticky = scrollTop > (controlsOriginalOffsetTop - 110);
        
        if (shouldBeSticky !== isSticky) {
          setIsSticky(shouldBeSticky);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Call once to set initial state
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isSticky]);

  // Filter and sort artworks based on current filters
  const filteredArtworks = artworks.filter(artwork => {
    // Filter by availability
    if (filters.availability === 'available') {
      // Available: not sold and not removed
      if (artwork.isSold || artwork.wasRemoved) return false;
    } else if (filters.availability === 'sold') {
      // Sold: marked as sold but not removed
      if (!artwork.isSold || artwork.wasRemoved) return false;
    } else if (filters.availability === 'removed') {
      // Removed: specifically marked as removed
      if (!artwork.wasRemoved) return false;
    } else if (filters.availability === 'all-active') {
      // All active: everything except removed artworks
      if (artwork.wasRemoved) return false;
    }
    // For 'all', we show everything including removed
    
    // Search filter
    if (search && !artwork.title?.toLowerCase().includes(search.toLowerCase()) && 
        !artwork.description?.toLowerCase().includes(search.toLowerCase()) && 
        !artwork.artistName?.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // Sort by selected option
    if (filters.sortBy === 'price-low-high') {
      return parseInt(a.price) - parseInt(b.price);
    } else if (filters.sortBy === 'price-high-low') {
      return parseInt(b.price) - parseInt(a.price);
    }
    // Default: newest first (higher IDs first, as they are more recent)
    return b.id - a.id;
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  // Handle artwork removal - instead of removing from state, mark it as removed
  const handleArtworkRemoved = (removedArtworkId) => {
    setArtworks(prevArtworks => 
      prevArtworks.map(artwork => 
        artwork.id === removedArtworkId 
          ? { ...artwork, wasRemoved: true, isSold: true }  // Mark as both removed and sold
          : artwork
      )
    );
  };

  if (loading) {
    return (
      <div className="gallery-loading">
        <div className="loading-spinner"></div>
        <p>Loading masterpieces...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="gallery-error">
        <div className="error-icon">⚠️</div>
        <h3>Something went wrong</h3>
        <p>{error}</p>
        <button onClick={fetchArtworks} className="retry-button">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="gallery-container">
      {/* Gallery Controls */}
      <div className={`gallery-controls ${isSticky ? 'sticky-active' : ''}`} ref={controlsRef}>
        <div className="gallery-search">
          <input
            type="text"
            placeholder="Search artworks, artists..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="gallery-filters">
          <div className="filter-group">
            <label>Show: </label>
            <select 
              name="availability" 
              value={filters.availability} 
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="all">All Artworks</option>
              <option value="all-active">Active Artworks</option>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="removed">Removed</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Sort by: </label>
            <select 
              name="sortBy" 
              value={filters.sortBy} 
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="newest">Newest</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Gallery Stats */}
      <div className="gallery-stats">
        <div className="stat-item">
          <span className="stat-value">{artworks.length}</span>
          <span className="stat-label">Total Artworks</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{artworks.filter(a => !a.isSold && !a.wasRemoved).length}</span>
          <span className="stat-label">Available Now</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{artworks.filter(a => a.isSold && !a.wasRemoved).length}</span>
          <span className="stat-label">Totally Sold</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{new Set(artworks.map(a => a.artist)).size}</span>
          <span className="stat-label">Total Artists</span>
        </div>
      </div>

      {/* Gallery Grid */}
      {filteredArtworks.length === 0 ? (
        <div className="empty-gallery">
          <div className="empty-icon">🖼️</div>
          <h3>No artworks found</h3>
          <p>
            {search
              ? "No artworks match your search. Try different keywords."
              : filters.availability !== 'all'
              ? `No ${filters.availability} artworks available.`
              : "The gallery is empty. Be the first to upload your masterpiece!"}
          </p>
          {isArtist && (
            <a href="/upload" className="cta-button">
              Upload Your Artwork
            </a>
          )}
        </div>
      ) : (
        <div className="gallery-grid">
          {filteredArtworks.map((artwork) => (
            <div key={artwork.id} className="gallery-item">
              <ArtworkCard 
                artwork={artwork} 
                contract={contract}
                account={account}
                onArtworkRemoved={handleArtworkRemoved}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;
