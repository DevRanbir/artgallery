import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const Tip = ({ artistAddress, artistName, contract, compact = false }) => {
  const [tipAmount, setTipAmount] = useState('');
  const [ethToInr, setEthToInr] = useState(250000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Fetch ETH to INR conversion rate
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr');
        const data = await response.json();
        setEthToInr(data.ethereum?.inr || 250000);
      } catch (error) {
        console.log('Exchange rate fetch failed, using fallback rate');
      }
    };
    fetchExchangeRate();
  }, []);

  // Calculate INR equivalent
  const calculateInr = (ethAmount) => {
    if (!ethAmount || !ethToInr) return 0;
    return (parseFloat(ethAmount) * ethToInr).toLocaleString('en-IN');
  };

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
        <div className="alert alert-success">
          <p>Tip sent successfully! 💰</p>
          <button 
            className="btn-secondary" 
            onClick={() => setSuccess(false)}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            Send Another Tip
          </button>
        </div>
      ) : (
        <form onSubmit={handleTip} className={`tip-form ${compact ? 'compact' : ''}`}>
          <h4>{compact ? '💝 Tip' : '💝 Tip'} {artistName}</h4>
          <div className="form-group">
            <label htmlFor="tipAmount">Amount (ETH):</label>
            <input
              type="number"
              id="tipAmount"
              className="form-control"
              value={tipAmount}
              onChange={(e) => setTipAmount(e.target.value)}
              placeholder="0.01"
              min="0.001"
              step="0.001"
              disabled={loading}
              required
            />
            {tipAmount && (
              <small style={{ color: 'var(--primary-color)', fontSize: '0.9rem', fontWeight: '500' }}>
                ≈ ₹{calculateInr(tipAmount)} INR
              </small>
            )}
          </div>
          
          {error && <div className="alert alert-error">{error}</div>}
          
          <button 
            type="submit" 
            className="btn-secondary"
            disabled={loading || !tipAmount}
            style={{ width: '100%' }}
          >
            {loading ? (
              <span className="loading-indicator">
                <span className="loading-spinner"></span>
                Sending...
              </span>
            ) : (
              'Send Tip'
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default Tip;