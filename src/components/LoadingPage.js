import React from 'react';

const LoadingPage = () => {
  return (
    <div className="loading-page">
      <div className="loading-content">
        <div className="loading-spinner-large"></div>
        <h2>Connecting to Blockchain</h2>
        <p>Please wait while we establish connection to the Ethereum network...</p>
        <div className="loading-steps">
          <div className="step">
            <span className="step-icon">🔗</span>
            <span>Connecting to MetaMask</span>
          </div>
          <div className="step">
            <span className="step-icon">⛓️</span>
            <span>Verifying Network</span>
          </div>
          <div className="step">
            <span className="step-icon">📄</span>
            <span>Loading Smart Contract</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
