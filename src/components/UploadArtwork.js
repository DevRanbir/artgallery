import React, { useState } from 'react';
import { ethers } from 'ethers';

const UploadArtwork = ({ contract, account }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ipfsHash, setIpfsHash] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Validate inputs
      if (!title.trim()) throw new Error('Title cannot be empty');
      if (!ipfsHash.trim()) throw new Error('IPFS hash cannot be empty');
      if (!price || parseFloat(price) <= 0) throw new Error('Price must be greater than 0');

      // Convert price to wei (assuming price is in ETH)
      const priceInWei = ethers.utils.parseEther(price);

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
      setIpfsHash('');
      setPrice('');
      setSuccess(true);
    } catch (err) {
      console.error('Error uploading artwork:', err);
      setError(err.message || 'Error uploading artwork. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-artwork-container">
      {success ? (
        <div className="success-message">
          <p>Artwork uploaded successfully!</p>
          <button onClick={() => setSuccess(false)}>Upload Another</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter artwork title"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter artwork description"
              disabled={loading}
              rows="4"
            />
          </div>

          <div className="form-group">
            <label htmlFor="ipfsHash">IPFS Hash:</label>
            <input
              type="text"
              id="ipfsHash"
              value={ipfsHash}
              onChange={(e) => setIpfsHash(e.target.value)}
              placeholder="Enter IPFS hash of your artwork"
              disabled={loading}
              required
            />
            <small>This is the hash of your artwork image stored on IPFS</small>
          </div>

          <div className="form-group">
            <label htmlFor="price">Price (ETH):</label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price in ETH"
              disabled={loading}
              min="0.001"
              step="0.001"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={loading || !title.trim() || !ipfsHash.trim() || !price}>
            {loading ? 'Uploading...' : 'Upload Artwork'}
          </button>
        </form>
      )}
    </div>
  );
};

export default UploadArtwork;