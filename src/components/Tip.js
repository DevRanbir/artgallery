import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const Tip = ({ artistAddress, artistName, contract, compact = false, onClose }) => {
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
      
      // Auto-close modal after success (optional)
      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 2000); // Close after 2 seconds
      }
    } catch (err) {
      console.error('Error tipping artist:', err);
      setError(err.message || 'Error tipping artist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="tip-container">
          {success ? (
            <div className="alert alert-success">
              <p>Tip sent successfully! 💰</p>
              <div className="tip-success-actions">
                <button 
                  className="btn-secondary" 
                  onClick={() => setSuccess(false)}
                >
                  Send Another Tip
                </button>
                {onClose && (
                  <button 
                    className="btn-primary" 
                    onClick={onClose}
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleTip} className="tip-form">
              <h4>💝 Tip {artistName}</h4>
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
                  <div className="inr-equivalent">
                    ≈ ₹{calculateInr(tipAmount)} INR
                  </div>
                )}
              </div>
              
              {error && <div className="alert alert-error">{error}</div>}
              
              <button 
                type="submit" 
                className="btn-secondary"
                disabled={loading || !tipAmount}
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
      </div>
    </div>
  );
};

export default Tip;