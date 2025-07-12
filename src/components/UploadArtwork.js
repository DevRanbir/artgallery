import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const UploadArtwork = ({ contract, account }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');
  const [priceInr, setPriceInr] = useState(''); // Changed to INR as primary
  const [ethToInr, setEthToInr] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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



  // Handle image file upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10MB');
      return;
    }

    setImageFile(file);
    setError('');

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Image = e.target.result;
      setImagePreview(base64Image);
      
      // Save to localStorage with artwork ID (using timestamp for uniqueness)
      const artworkId = `artwork_${Date.now()}`;
      localStorage.setItem(artworkId, base64Image);
      
      // Generate a mock IPFS hash for demonstration
      // In real implementation, you would upload to IPFS here
      const mockHash = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      setIpfsHash(mockHash);
    };
    reader.readAsDataURL(file);
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Validate inputs
      if (!title.trim()) throw new Error('Title cannot be empty');
      if (!imageFile) throw new Error('Please upload an artwork image');
      if (!ipfsHash.trim()) throw new Error('Image processing failed, please try uploading again');
      if (!priceInr || parseFloat(priceInr) <= 0) throw new Error('Price must be greater than 0');

      // Convert INR price to ETH, then to wei
      const priceInEth = calculateEth(priceInr);
      const priceInWei = ethers.utils.parseEther(priceInEth);

      // Call the contract method to upload artwork
      const tx = await contract.uploadArtwork(
        title,
        description,
        ipfsHash,
        priceInWei
      );

      // Wait for the transaction to be mined
      await tx.wait();

      // Reset form and show success message
      setTitle('');
      setDescription('');
      setImageFile(null);
      setImagePreview('');
      setIpfsHash('');
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

      {success ? (
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
          {/* Left Column - Image Upload */}
          <div className="upload-left">
            <div className="form-section">
              <h3 className="section-title">Artwork Image</h3>
              <div className={`image-upload-area ${imagePreview ? 'has-image' : ''}`}>
                {!imagePreview ? (
                  <>
                    <input
                      type="file"
                      id="imageUpload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={loading}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="imageUpload" className="upload-dropzone">
                      <div className="upload-icon-large">📁</div>
                      <div className="upload-text">Drop image here or click to upload</div>
                      <div className="upload-hint">PNG, JPG, GIF up to 10MB</div>
                    </label>
                  </>
                ) : (
                  <div className="image-preview-container">
                    <img src={imagePreview} alt="Preview" className="image-preview" />
                    <div className="image-overlay">
                      <div className="image-info">
                        <strong>{imageFile?.name}</strong>
                        <span>{(imageFile?.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                      <button 
                        type="button" 
                        className="btn-remove"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview('');
                          setIpfsHash('');
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
                  <label className="form-label">Generated Hash</label>
                  <input
                    type="text"
                    className="form-input hash-input"
                    value={ipfsHash}
                    disabled
                    placeholder="Upload image to generate"
                  />
                </div>
              </div>

              {error && <div className="alert alert-error">{error}</div>}

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn btn-upload"
                  disabled={loading || !title.trim() || !imageFile || !priceInr}
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