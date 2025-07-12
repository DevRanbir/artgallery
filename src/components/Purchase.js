import React, { useState } from 'react';

const Purchase = ({ artworkId, price, contract, account, className = "" }) => {
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

      // Store purchase in localStorage for tracking in collection page
      if (account) {
        const userPurchases = JSON.parse(localStorage.getItem(`purchases_${account}`) || '[]');
        if (!userPurchases.includes(artworkId)) {
          userPurchases.push(artworkId);
          localStorage.setItem(`purchases_${account}`, JSON.stringify(userPurchases));
        }
      }

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
      <div className="alert alert-success">
        Artwork purchased successfully! 🎉
      </div>
    );
  }

  return (
    <div className="purchase-container">
      <button 
        className={`btn-primary ${className}`} 
        onClick={handlePurchase} 
        disabled={loading}
        style={{ width: '100%' }}
      >
        {loading ? (
          <span className="loading-indicator">
            <span className="loading-spinner"></span>
            Processing...
          </span>
        ) : (
          'Buy Now'
        )}
      </button>
      
      {error && <div className="alert alert-error">{error}</div>}
    </div>
  );
};

export default Purchase;