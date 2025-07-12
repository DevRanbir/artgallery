import React, { useState } from 'react';
import { ethers } from 'ethers';

const Tip = ({ artistAddress, artistName, contract }) => {
  const [tipAmount, setTipAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleTip = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Validate tip amount
      if (!tipAmount || parseFloat(tipAmount) <= 0) {
        throw new Error('Tip amount must be greater than 0');
      }

      // Convert tip amount to wei
      const tipAmountWei = ethers.utils.parseEther(tipAmount);

      // Call the contract method to tip the artist
      const tx = await contract.tipArtist(artistAddress, {
        value: tipAmountWei
      });

      // Wait for the transaction to be mined
      await tx.wait();

      // Reset form and show success message
      setTipAmount('');
      setSuccess(true);
    } catch (err) {
      console.error('Error tipping artist:', err);
      setError(err.message || 'Error tipping artist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tip-container">
      {success ? (
        <div className="success-message">
          <p>Tip sent successfully!</p>
          <button onClick={() => setSuccess(false)}>Send Another Tip</button>
        </div>
      ) : (
        <form onSubmit={handleTip}>
          <h4>Tip {artistName}</h4>
          <div className="form-group">
            <label htmlFor="tipAmount">Amount (ETH):</label>
            <input
              type="number"
              id="tipAmount"
              value={tipAmount}
              onChange={(e) => setTipAmount(e.target.value)}
              placeholder="0.01"
              min="0.001"
              step="0.001"
              disabled={loading}
              required
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" disabled={loading || !tipAmount}>
            {loading ? 'Sending...' : 'Send Tip'}
          </button>
        </form>
      )}
    </div>
  );
};

export default Tip;