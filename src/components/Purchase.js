import React, { useState } from 'react';

const Purchase = ({ artworkId, price, contract }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Call the contract method to purchase the artwork
      const tx = await contract.purchaseArtwork(artworkId, {
        value: price // Send the exact price amount
      });

      // Wait for the transaction to be mined
      await tx.wait();

      // Show success message
      setSuccess(true);
    } catch (err) {
      console.error('Error purchasing artwork:', err);
      setError(err.message || 'Error purchasing artwork. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="purchase-success">
        <p>Artwork purchased successfully!</p>
      </div>
    );
  }

  return (
    <div className="purchase-container">
      <button 
        className="purchase-button" 
        onClick={handlePurchase} 
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Purchase'}
      </button>
      
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Purchase;