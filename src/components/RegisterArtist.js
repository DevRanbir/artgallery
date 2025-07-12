import React, { useState } from 'react';

const RegisterArtist = ({ contract, account, setIsArtist, setArtistName }) => {
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
    } catch (err) {
      console.error('Error registering as artist:', err);
      setError(err.message || 'Error registering as artist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-artist-container">
      {success ? (
        <div className="success-message">
          <p>Successfully registered as an artist!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="artistName">Your Artist Name:</label>
            <input
              type="text"
              id="artistName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your artist name"
              disabled={loading}
              required
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" disabled={loading || !name.trim()}>
            {loading ? 'Registering...' : 'Register as Artist'}
          </button>
        </form>
      )}
    </div>
  );
};

export default RegisterArtist;