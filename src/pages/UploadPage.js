import React from 'react';
import UploadArtwork from '../components/UploadArtwork';

const UploadPage = ({ contract, account, connectWallet }) => {
  return (
    <div className="upload-page">
      <div className="page-header">
        <div className="developer-credit-header">
          <small>Developed by <strong>DevRanbir</strong></small>
        </div>
      </div>
      <div className="upload-container">
        <div className="upload-form-wrapper">
          <UploadArtwork contract={contract} account={account} connectWallet={connectWallet} />
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
