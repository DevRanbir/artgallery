import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = ({ account, isArtist, artistName, networkInfo }) => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to ArtGallery</h1>
          <p className="hero-subtitle">
            Discover, collect, and trade unique digital artworks on the blockchain. 
            Support artists and build your exclusive collection <i>-DevRanbir</i>
          </p>
          
          <div className="hero-actions">
            <Link to="/gallery" className="btn btn-primary btn-large">
              🎨 Browse Gallery
            </Link>
            {!isArtist && (
              <Link to="/register" className="btn btn-secondary btn-large">
                ✨ Become an Artist
              </Link>
            )}
            {isArtist && (
              <Link to="/upload" className="btn btn-secondary btn-large">
                📤 Upload Artwork
              </Link>
            )}
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">150+</span>
              <span className="stat-label">Artworks</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Artists</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">2.5K+</span>
              <span className="stat-label">Sales</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">1M+</span>
              <span className="stat-label">Volume (ETH)</span>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="features">
        <div className="container">
          <div className="features-header">
            <h2 className="features-title">Why Choose ArtGallery?</h2>
            <p className="features-subtitle">
              Experience the future of digital art with our secure, transparent, and artist-friendly platform
            </p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3 className="feature-title">Secure Blockchain</h3>
              <p className="feature-description">
                All transactions are secured by Ethereum blockchain technology, ensuring transparent and immutable ownership records.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3 className="feature-title">Direct Artist Support</h3>
              <p className="feature-description">
                Artists receive 100% of sale proceeds directly, with no hidden fees or intermediaries taking a cut.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎨</div>
              <h3 className="feature-title">Verified Authenticity</h3>
              <p className="feature-description">
                Every artwork is digitally signed and verified, guaranteeing authenticity and preventing fraud.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <div className="features-header">
            <h2 className="features-title">How It Works</h2>
            <p className="features-subtitle">
              Get started in three simple steps
            </p>
          </div>

          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <h3 className="step-title">Connect Wallet</h3>
              <p className="step-description">
                Connect your MetaMask wallet to start exploring and purchasing artworks
              </p>
            </div>

            <div className="step">
              <div className="step-number">2</div>
              <h3 className="step-title">Discover Art</h3>
              <p className="step-description">
                Browse our curated gallery of unique digital artworks from talented artists
              </p>
            </div>

            <div className="step">
              <div className="step-number">3</div>
              <h3 className="step-title">Collect & Trade</h3>
              <p className="step-description">
                Purchase artworks and build your collection or trade with other collectors
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2 className="cta-title">Ready to Start Your Art Journey?</h2>
          <p className="cta-subtitle">
            Join thousands of art enthusiasts and discover your next masterpiece
          </p>
          <Link to="/gallery" className="btn cta-button btn-large">
            🚀 Explore Gallery Now
          </Link>
        </div>
      </section>
      
      {/* Developer Credit */}
      <section className="developer-credit-section">
        <div className="container">
          <p className="developer-credit-text">
            Developed by <strong>DevRanbir</strong>
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
