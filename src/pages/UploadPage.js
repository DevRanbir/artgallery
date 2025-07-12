import React from 'react';
import UploadArtwork from '../components/UploadArtwork';

const UploadPage = ({ contract, account }) => {
  return (
    <div className="upload-page">
      <div className="upload-container">
        <div className="upload-form-wrapper">
          <UploadArtwork contract={contract} account={account} />
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
