import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterArtist from '../components/RegisterArtist';
import '../styles/register.css';

const RegisterPage = ({ contract, account, setIsArtist, setArtistName }) => {
  const navigate = useNavigate();
  
  // Callback for successful registration
  const handleSuccessfulRegistration = () => {
    // Redirect to the upload page after successful registration
    setTimeout(() => {
      navigate('/upload');
    }, 2000); // Wait 2 seconds to show success message before redirecting
  };
  
  return (
    <div className="register-page">
      <div className="page-header">
        <h1>Register as an Artist</h1>
        <p>Join our community of creative artists and start selling your digital artwork</p>
      </div>
      
      <div className="register-content">
        <div className="register-info">
          <h2>Why Register?</h2>
          <ul>
            <li>Showcase your artwork to a global audience</li>
            <li>Sell directly to collectors with no middlemen</li>
            <li>Receive tips from admirers of your work</li>
            <li>Build your reputation in the digital art space</li>
          </ul>
        </div>
        
        <div className="register-form-container">
          <RegisterArtist 
            contract={contract} 
            account={account} 
            setIsArtist={setIsArtist} 
            setArtistName={setArtistName}
            onSuccess={handleSuccessfulRegistration}
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
