import React, { useState } from 'react';
import MetaMaskPrompt from './MetaMaskPrompt';

const RegisterArtist = ({ contract, account, setIsArtist, setArtistName, onSuccess, connectWallet }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      if (!name.trim()) {
        throw new Error('Name cannot be empty');
      }

      // Call the contract method to register as an artist
      const tx = await contract.registerAsArtist(name);
      
      // Wait for the transaction to be mined
      await tx.wait();
      
      // Update state
      setIsArtist(true);
      setArtistName(name);
      setSuccess(true);
      setName('');
      
      // Call the onSuccess callback if provided
      if (typeof onSuccess === 'function') {
        onSuccess();
      }
    } catch (err) {
      console.error('Error registering as artist:', err);
      setError(err.message || 'Error registering as artist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      {!account ? (
        <MetaMaskPrompt 
          connectWallet={connectWallet}
          message="Connect your wallet to register as an artist"
        />
      ) : success ? (
        <div className="alert alert-success">
          <h3>🎨 Welcome to ArtBlocks!</h3>
          <p>Successfully registered as an artist! You can now upload your artwork.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h3>✨ Become an Artist</h3>
          <div className="form-group">
            <label htmlFor="artistName">Your Artist Name:</label>
            <input
              type="text"
              id="artistName"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your unique artist name"
              disabled={loading}
              required
            />
          </div>
          
          {error && <div className="alert alert-error">{error}</div>}
          
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading || !name.trim()}
            style={{ width: '100%' }}
          >
            {loading ? (
              <span className="loading-indicator">
                <span className="loading-spinner"></span>
                Registering...
              </span>
            ) : (
              'Register as Artist'
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default RegisterArtist;