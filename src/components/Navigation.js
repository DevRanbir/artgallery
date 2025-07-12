import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = ({ account, isArtist, artistName }) => {
  const location = useLocation();
  const [currentTheme, setCurrentTheme] = useState('light');
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const themes = [
    { id: 'light', name: 'Light', icon: '☀️' },
    { id: 'dark', name: 'Dark', icon: '🌙' },
    { id: 'purple', name: 'Purple', icon: '💜' },
    { id: 'ocean', name: 'Ocean', icon: '🌊' }
  ];

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setCurrentTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const handleThemeChange = (themeId) => {
    setCurrentTheme(themeId);
    localStorage.setItem('theme', themeId);
    document.documentElement.setAttribute('data-theme', themeId);
    setShowThemeDropdown(false);
  };
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const getCurrentThemeIcon = () => {
    return themes.find(theme => theme.id === currentTheme)?.icon || '☀️';
  };
  
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <div className="navbar-brand-icon">AG</div>
          <span>ArtGallery</span>
        </Link>
        
        <ul className={`navbar-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <li><Link to="/" className={isActive('/')}>Home</Link></li>
          <li><Link to="/gallery" className={isActive('/gallery')}>Gallery</Link></li>
          <li><Link to="/collection" className={isActive('/collection')}>My Collection</Link></li>
          {isArtist ? (
            <li><Link to="/upload" className={isActive('/upload')}>Upload</Link></li>
          ) : (
            <li><Link to="/register" className={isActive('/register')}>Register</Link></li>
          )}
        </ul>
        
        <div className="navbar-user">
          
          {/* User Info */}
          {account && (
            <div className="user-info">
                {/* Theme Switcher */}
                <div className="theme-switcher">
                    <button 
                    className="theme-toggle"
                    onClick={() => setShowThemeDropdown(!showThemeDropdown)}
                    >
                    <span className="theme-icon">{getCurrentThemeIcon()}</span>
                    </button>
                    
                    <div className={`theme-dropdown ${showThemeDropdown ? 'open' : ''}`}>
                    {themes.map(theme => (
                        <button
                        key={theme.id}
                        className={`theme-option ${currentTheme === theme.id ? 'active' : ''}`}
                        onClick={() => handleThemeChange(theme.id)}
                        >
                        <div className={`theme-option-icon theme-${theme.id}`}></div>
                        <span>{theme.name}</span>
                        </button>
                    ))}
                    </div>
                </div>
              <div className="user-details">
                <div className="user-address">
                  {`${account.slice(0, 6)}...${account.slice(-4)}`}
                </div>
                {isArtist && (
                  <div className="account-balance">Artist: {artistName}</div>
                )}
              </div>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
