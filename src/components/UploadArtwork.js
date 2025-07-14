import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MetaMaskPrompt from './MetaMaskPrompt';

const UploadArtwork = ({ contract, account, connectWallet }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [priceInr, setPriceInr] = useState(''); // Changed to INR as primary
  const [ethToInr, setEthToInr] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  // Fetch ETH to INR conversion rate
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        // Using a simple API for ETH to INR conversion
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr');
        const data = await response.json();
        setEthToInr(data.ethereum?.inr || 250000); // Fallback to approximate rate
      } catch (error) {
        console.log('Exchange rate fetch failed, using fallback rate');
        setEthToInr(250000); // Fallback rate
      }
    };
    fetchExchangeRate();
  }, []);

  // Calculate ETH equivalent from INR
  const calculateEth = (inrAmount) => {
    if (!inrAmount || !ethToInr) return 0;
    return (parseFloat(inrAmount) / ethToInr).toFixed(6);
  };



  // Handle image URL input and validation
  const handleImageUrlChange = async (url) => {
    setImageUrl(url);
    setError('');
    
    if (!url.trim()) {
      setImagePreview('');
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      setError('Please enter a valid URL');
      setImagePreview('');
      return;
    }

    // Check if it's likely an image URL
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
    const isImageUrl = imageExtensions.some(ext => 
      url.toLowerCase().includes(ext) || 
      url.includes('image') || 
      url.includes('img') ||
      url.includes('photo')
    );

    if (!isImageUrl && !url.includes('unsplash') && !url.includes('imgur') && !url.includes('cloudinary')) {
      setError('URL should point to an image file or image hosting service');
    }

    // Try to load the image to validate it
    setImageLoading(true);
    const img = new Image();
    img.onload = () => {
      setImagePreview(url);
      setImageLoading(false);
      setError('');
    };
    img.onerror = () => {
      setError('Unable to load image from this URL. Please check the URL and try again.');
      setImagePreview('');
      setImageLoading(false);
    };
    img.src = url;
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Validate inputs
      if (!title.trim()) throw new Error('Title cannot be empty');
      if (!imageUrl.trim()) throw new Error('Please provide an image URL');
      if (!imagePreview) throw new Error('Please wait for the image to load or check the URL');
      if (!priceInr || parseFloat(priceInr) <= 0) throw new Error('Price must be greater than 0');

      // Convert INR price to ETH, then to wei
      const priceInEth = calculateEth(priceInr);
      const priceInWei = ethers.utils.parseEther(priceInEth);

      // Call the contract method to upload artwork
      // Now we pass the image URL directly instead of IPFS hash
      const tx = await contract.uploadArtwork(
        title,
        description,
        imageUrl, // Using image URL directly
        priceInWei
      );

      // Wait for the transaction to be mined
      await tx.wait();

      // Reset form and show success message
      setTitle('');
      setDescription('');
      setImageUrl('');
      setImagePreview('');
      setPriceInr('');
      setSuccess(true);
    } catch (err) {
      console.error('Error uploading artwork:', err);
      setError(err.message || 'Error uploading artwork. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-form">
      <div className="upload-form-header">
        <h1 className="upload-title">
          <span className="upload-icon">🎨</span>
          Upload Artwork
        </h1>
        <p className="upload-subtitle">
          Share your creativity with the world
        </p>
      </div>

      {!account ? (
        <MetaMaskPrompt 
          connectWallet={connectWallet}
          message="Connect your wallet to upload and sell your artwork"
        />
      ) : success ? (
        <div className="upload-success">
          <div className="success-content">
            <div className="success-icon">🎉</div>
            <h3 className="success-title">Successfully uploaded!</h3>
            <p className="success-message">Your artwork is now available in the gallery.</p>
            <div className="success-actions">
              <button 
                className="btn btn-primary"
                onClick={() => setSuccess(false)}
              >
                Upload Another
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="upload-form-grid">
          {/* Left Column - Image URL Input */}
          <div className="upload-left">
            <div className="form-section">
              <h3 className="section-title">Artwork Image</h3>
              <div className={`image-upload-area ${imagePreview ? 'has-image' : ''}`}>
                {!imagePreview ? (
                  <div className="url-input-container">
                    <div className="upload-icon-large">🔗</div>
                    <div className="upload-text">Enter Image URL</div>
                    <div className="upload-hint">Direct link to your artwork image</div>
                    <input
                      type="url"
                      className="form-input url-input"
                      value={imageUrl}
                      onChange={(e) => handleImageUrlChange(e.target.value)}
                      placeholder="https://example.com/your-artwork.jpg"
                      disabled={loading}
                    />
                    {imageLoading && (
                      <div className="image-loading">
                        <div className="loading-spinner"></div>
                        <span>Loading image...</span>
                      </div>
                    )}
                    <div className="url-examples">
                      <p className="examples-title">Example sources:</p>
                      <ul className="examples-list">
                        <li>Unsplash, Imgur, Google Drive</li>
                        <li>Your personal website or blog</li>
                        <li>Cloud storage (Dropbox, OneDrive)</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="image-preview-container">
                    <img src={imagePreview} alt="Preview" className="image-preview" />
                    <div className="image-overlay">
                      <div className="image-info">
                        <strong>Image Preview</strong>
                        <span className="image-url-display">{imageUrl.length > 40 ? `${imageUrl.substring(0, 40)}...` : imageUrl}</span>
                      </div>
                      <button 
                        type="button" 
                        className="btn-remove"
                        onClick={() => {
                          setImageUrl('');
                          setImagePreview('');
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Form Fields */}
          <div className="upload-right">
            <div className="form-fields">
              <div className="form-section">
                <h3 className="section-title">Details</h3>
                
                <div className="form-field">
                  <label className="form-label" htmlFor="title">
                    Title <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    className="form-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter artwork title"
                    disabled={loading}
                    required
                  />
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    id="description"
                    className="form-input form-textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your artwork..."
                    disabled={loading}
                    rows="1"
                  />
                </div>

                <div className="form-field">
                  <label className="form-label" htmlFor="priceInr">
                    Price <span className="required">*</span>
                  </label>
                  <div className="price-input-group">
                    <span className="currency-prefix">₹</span>
                    <input
                      type="number"
                      id="priceInr"
                      className="form-input price-input"
                      value={priceInr}
                      onChange={(e) => setPriceInr(e.target.value)}
                      placeholder="0"
                      disabled={loading}
                      min="100"
                      step="100"
                      required
                    />
                  </div>
                  
                  {priceInr && (
                    <div className="price-conversion">
                      <span>≈ {calculateEth(priceInr)} ETH</span>
                    </div>
                  )}
                </div>

                <div className="form-field">
                  <label className="form-label">Image URL</label>
                  <input
                    type="url"
                    className="form-input url-display"
                    value={imageUrl}
                    disabled
                    placeholder="Enter image URL above to see it here"
                  />
                  <div className="field-hint">
                    The direct URL to your artwork image
                  </div>
                </div>
              </div>

              {error && <div className="alert alert-error">{error}</div>}

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-upload"
                  disabled={loading || !title.trim() || !imageUrl.trim() || !imagePreview || !priceInr}
                >
                  {loading ? (
                    <>
                      <span className="loading-spinner"></span>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <span>🚀</span>
                      Upload Artwork
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default UploadArtwork;