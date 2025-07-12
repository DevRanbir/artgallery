import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ArtworkCard from '../components/ArtworkCard';

const MyCollectionPage = ({ contract, account, isArtist }) => {
  const [myCreations, setMyCreations] = useState([]);
  const [myPurchases, setMyPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('creations');

  useEffect(() => {
    const fetchMyArtworks = async () => {
      if (!contract || !account) return;
      
      try {
        setLoading(true);
        setError('');
        
        // Get the total number of artworks
        const artworkCount = await contract.artworkCount();
        const count = artworkCount.toNumber();
        
        const creations = [];
        const purchases = [];
        
        // Fetch all artworks and filter by user
        for (let i = 1; i <= count; i++) {
          try {
            // Get artwork basic info
            const [id, artist, price, isSold] = await contract.getArtworkBasic(i);
            
            // Get artwork details
            const [title, description, ipfsHash] = await contract.getArtworkDetails(i);
            
            // Get artist name
            const [artistName] = await contract.getArtistInfo(artist);
            
            const artwork = {
              id: id.toNumber(),
              artist,
              artistName,
              title,
              description,
              ipfsHash,
              price: price.toString(),
              isSold
            };
            
            // Check if current user is the artist (creator)
            if (artist.toLowerCase() === account.toLowerCase()) {
              creations.push(artwork);
            }
            
            // For purchases, we'd need to track buyers in the smart contract
            // Since the current contract doesn't store buyer info, we'll use
            // localStorage to track user's purchases as a client-side solution
            const userPurchases = JSON.parse(localStorage.getItem(`purchases_${account}`) || '[]');
            if (userPurchases.includes(artwork.id)) {
              purchases.push(artwork);
            }
          } catch (artworkError) {
            console.error(`Error fetching artwork ${i}:`, artworkError);
          }
        }
        
        setMyCreations(creations);
        setMyPurchases(purchases);
      } catch (err) {
        console.error('Error fetching user artworks:', err);
        setError('Error loading your collection. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyArtworks();
  }, [contract, account]);

  if (loading) {
    return (
      <div className="collection-page">
        <div className="collection-header">
          <div className="container">
            <h1 className="collection-title">My Collection</h1>
            <p className="collection-subtitle">Your created artworks and purchased pieces</p>
          </div>
        </div>
        <div className="collection-content">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your collection...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="collection-page">
        <div className="collection-header">
          <div className="container">
            <h1 className="collection-title">My Collection</h1>
            <p className="collection-subtitle">Your created artworks and purchased pieces</p>
          </div>
        </div>
        <div className="collection-content">
          <div className="alert alert-error">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="collection-page">
      <div className="collection-header">
        <div className="container">
          <h1 className="collection-title">My Collection</h1>
          <p className="collection-subtitle">Your created artworks and purchased pieces</p>
        </div>
      </div>
      
      <div className="collection-content">
        {/* Collection Stats */}
        <div className="collection-stats">
          <div className="stat-card">
            <div className="stat-icon">🎨</div>
            <div className="stat-number">{myCreations.length}</div>
            <div className="stat-label">My Creations</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🛒</div>
            <div className="stat-number">{myPurchases.length}</div>
            <div className="stat-label">My Purchases</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-number">{myCreations.filter(a => a.isSold).length}</div>
            <div className="stat-label">Items Sold</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📈</div>
            <div className="stat-number">{myCreations.length + myPurchases.length}</div>
            <div className="stat-label">Total Items</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="collection-tabs">
          <button 
            className={`tab-button ${activeTab === 'creations' ? 'active' : ''}`}
            onClick={() => setActiveTab('creations')}
          >
            🎨 My Creations 
            <span className="tab-count">({myCreations.length})</span>
          </button>
          <button 
            className={`tab-button ${activeTab === 'purchases' ? 'active' : ''}`}
            onClick={() => setActiveTab('purchases')}
          >
            🛒 My Purchases 
            <span className="tab-count">({myPurchases.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="collection-section">
          {activeTab === 'creations' && (
            <div className="creations-section">
              <div className="section-header">
                <div className="section-title">
                  <span>🎨 My Creations</span>
                  <div className="section-count">{myCreations.length} items</div>
                </div>
                <div className="section-filter">
                  <select className="filter-select">
                    <option>All Status</option>
                    <option>Available</option>
                    <option>Sold</option>
                  </select>
                </div>
              </div>

              {myCreations.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">🎨</div>
                  <h3 className="empty-state-title">No artworks created yet</h3>
                  <p className="empty-state-message">
                    Start your artistic journey by uploading your first masterpiece to the gallery!
                  </p>
                  {isArtist ? (
                    <Link to="/upload" className="empty-state-action">
                      Upload Your First Artwork
                    </Link>
                  ) : (
                    <Link to="/register" className="empty-state-action">
                      Register as Artist
                    </Link>
                  )}
                </div>
              ) : (
                <div className="collection-grid">
                  {myCreations.map(artwork => (
                    <div key={artwork.id} className="collection-artwork-card user-creation">
                      <div className="ownership-badge created">My Creation</div>
                      <div className={`artwork-status ${artwork.isSold ? 'status-sold' : 'status-available'}`}>
                        {artwork.isSold ? 'Sold' : 'Available'}
                      </div>
                      <ArtworkCard 
                        artwork={artwork}
                        contract={contract}
                        account={account}
                        showPurchaseButton={false}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'purchases' && (
            <div className="purchases-section">
              <div className="section-header">
                <div className="section-title">
                  <span>🛒 My Purchases</span>
                  <div className="section-count">{myPurchases.length} items</div>
                </div>
                <div className="section-filter">
                  <select className="filter-select">
                    <option>All Purchases</option>
                    <option>Recent</option>
                    <option>By Artist</option>
                  </select>
                </div>
              </div>

              {myPurchases.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">🛒</div>
                  <h3 className="empty-state-title">No purchases yet</h3>
                  <p className="empty-state-message">
                    Discover amazing artworks in our gallery and start building your collection!
                  </p>
                  <Link to="/gallery" className="empty-state-action">
                    Browse Gallery
                  </Link>
                </div>
              ) : (
                <div className="collection-grid">
                  {myPurchases.map(artwork => (
                    <div key={artwork.id} className="collection-artwork-card user-purchase">
                      <div className="ownership-badge purchased">Owned</div>
                      <ArtworkCard 
                        artwork={artwork}
                        contract={contract}
                        account={account}
                        showPurchaseButton={false}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Collection Actions */}
          <div className="collection-actions">
            {isArtist && (
              <Link to="/upload" className="action-button primary">
                <span>🎨</span>
                Upload New Artwork
              </Link>
            )}
            <Link to="/gallery" className="action-button">
              <span>🖼️</span>
              Browse Gallery
            </Link>
            {!isArtist && (
              <Link to="/register" className="action-button">
                <span>✨</span>
                Become an Artist
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCollectionPage;
