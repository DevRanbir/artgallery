import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="container">
          <div className="footer-grid">
            {/* Brand Section */}
            <div className="footer-brand">
              <div className="brand-logo">
                <span className="brand-icon">🎨</span>
                <span className="brand-name">ArtBlocks</span>
              </div>
              <p className="brand-description">
                A decentralized marketplace for digital art built on blockchain technology. 
                Empowering artists and collectors worldwide.
              </p>
              <div className="brand-stats">
                <div className="stat-item">
                  <span className="stat-number">500+</span>
                  <span className="stat-label">Artists</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">2.5K+</span>
                  <span className="stat-label">Artworks</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">50+</span>
                  <span className="stat-label">ETH Volume</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h4 className="footer-title">Marketplace</h4>
              <ul className="footer-links">
                <li><a href="/gallery" className="footer-link">Browse Gallery</a></li>
                <li><a href="/upload" className="footer-link">Upload Artwork</a></li>
                <li><a href="/register" className="footer-link">Become Artist</a></li>
                <li><a href="/collection" className="footer-link">My Collection</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div className="footer-section">
              <h4 className="footer-title">Resources</h4>
              <ul className="footer-links">
                <li><a href="#about" className="footer-link">About Us</a></li>
                <li><a href="#how-it-works" className="footer-link">How It Works</a></li>
                <li><a href="#faq" className="footer-link">FAQ</a></li>
                <li><a href="#support" className="footer-link">Support</a></li>
              </ul>
            </div>

            {/* Legal & Social */}
            <div className="footer-section">
              <h4 className="footer-title">Connect</h4>
              <div className="social-links">
                <a href="#twitter" className="social-link" title="Twitter">
                  <span>🐦</span>
                </a>
                <a href="#discord" className="social-link" title="Discord">
                  <span>💬</span>
                </a>
                <a href="#telegram" className="social-link" title="Telegram">
                  <span>✈️</span>
                </a>
                <a href="#github" className="social-link" title="GitHub">
                  <span>🔗</span>
                </a>
              </div>
              
              <div className="footer-legal">
                <a href="#terms" className="footer-link">Terms of Service</a>
                <a href="#privacy" className="footer-link">Privacy Policy</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p className="copyright">
              &copy; {currentYear} ArtBlocks. All rights reserved.
            </p>
            <div className="footer-meta">
              <span className="network-status">
                <span className="status-dot"></span>
                Ethereum Network
              </span>
              <span className="version">v1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
