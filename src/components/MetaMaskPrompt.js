import React from 'react';

const MetaMaskPrompt = ({ connectWallet, message = "Connect your wallet to view this content" }) => {
  return (
    <div className="metamask-prompt">
      <div className="metamask-prompt-content">
        <div className="metamask-icon">🦊</div>
        <p className="metamask-message">{message}</p>
        <button className="connect-wallet-btn-prompt" onClick={connectWallet}>
          Connect MetaMask
        </button>
      </div>
    </div>
  );
};

export default MetaMaskPrompt;
