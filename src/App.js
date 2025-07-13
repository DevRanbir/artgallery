import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/main.css';

// Import components
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import LoadingPage from './components/LoadingPage';

// Import pages
import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import MyCollectionPage from './pages/MyCollectionPage';
import RegisterPage from './pages/RegisterPage';
import UploadPage from './pages/UploadPage';

// Simplified ABI for ArtGallery contract
const ArtGalleryABI = [
  // Artist registration
  "function registerAsArtist(string memory _name) public",
  
  // Artwork management
  "function uploadArtwork(string memory _title, string memory _description, string memory _ipfsHash, uint _price) public",
  "function purchaseArtwork(uint _artworkId) public payable",
  "function removeArtwork(uint _artworkId) public payable",
  "function tipArtist(address _artist) public payable",
  
  // Getter functions
  "function artworkCount() public view returns (uint)",
  "function getArtworkBasic(uint _artworkId) public view returns (uint id, address artist, uint price, bool isSold)",
  "function getArtworkDetails(uint _artworkId) public view returns (string memory title, string memory description, string memory ipfsHash)",
  "function getArtistInfo(address _artist) public view returns (string memory name, bool isRegistered)",
  
  // Events
  "event ArtistRegistered(address artist, string name)",
  "event ArtworkUploaded(uint artworkId, address artist)",
  "event ArtworkPurchased(uint artworkId, address buyer)",
  "event ArtworkRemoved(uint artworkId, address artist)",
  "event Tipped(address artist, address tipper, uint amount)"
];

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [isArtist, setIsArtist] = useState(false);
  const [artistName, setArtistName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [networkInfo, setNetworkInfo] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        // Check if MetaMask is installed
        if (!window.ethereum) {
          setError('Please install MetaMask to use this dApp');
          setLoading(false);
          return;
        }

        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length === 0) {
          setError('Please connect your MetaMask wallet');
          setLoading(false);
          return;
        }

        setAccount(accounts[0]);

        // Create ethers provider and signer
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        // Get network information
        const network = await provider.getNetwork();
        setNetworkInfo(`Network: ${network.name} (Chain ID: ${network.chainId})`);
        console.log('Connected to network:', network);

        // Contract address - REPLACE WITH YOUR DEPLOYED CONTRACT ADDRESS
        const contractAddress = '0x15A0812cD344ed83F8e2562Ef8FA18bdab2256A0';
        
        // Verify contract exists at the address
        const code = await provider.getCode(contractAddress);
        if (code === '0x') {
          setError(`No contract found at address ${contractAddress} on ${network.name}. Please verify the contract is deployed on the correct network.`);
          setLoading(false);
          return;
        }

        console.log('Contract code found at address:', contractAddress);

        // Create contract instance
        const artGalleryContract = new ethers.Contract(
          contractAddress,
          ArtGalleryABI,
          signer
        );
        
        setContract(artGalleryContract);

        // Test contract connectivity with a simple call first
        try {
          console.log('Testing contract connectivity...');
          const artworkCount = await artGalleryContract.artworkCount();
          console.log('Contract is accessible. Artwork count:', artworkCount.toString());
        } catch (contractError) {
          console.error('Contract test call failed:', contractError);
          setError(`Contract at ${contractAddress} is not responding correctly. Please check if it's the right contract address and network.`);
          setLoading(false);
          return;
        }

        // Check if current user is a registered artist
        try {
          console.log('Checking artist status for:', accounts[0]);
          const artistInfo = await artGalleryContract.getArtistInfo(accounts[0]);
          console.log('Artist info:', artistInfo);
          setIsArtist(artistInfo.isRegistered);
          setArtistName(artistInfo.name);
        } catch (artistError) {
          console.error('Error checking artist status:', artistError);
          // Don't fail the entire app if artist check fails
          // Just assume user is not an artist
          setIsArtist(false);
          setArtistName('');
          console.log('Assuming user is not a registered artist');
        }

        // Listen for account changes
        window.ethereum.on('accountsChanged', (newAccounts) => {
          console.log('Account changed to:', newAccounts[0]);
          setAccount(newAccounts[0] || '');
          if (newAccounts.length === 0) {
            setError('Please connect your MetaMask wallet');
          } else {
            // Reload to reinitialize with new account
            window.location.reload();
          }
        });

        // Listen for network changes
        window.ethereum.on('chainChanged', (chainId) => {
          console.log('Network changed to:', chainId);
          // Reload the page to reinitialize with new network
          window.location.reload();
        });

        setLoading(false);
        console.log('App initialization completed successfully');

      } catch (err) {
        console.error('Error initializing app:', err);
        setError(`Error connecting to blockchain: ${err.message}`);
        setLoading(false);
      }
    };

    init();

    // Cleanup event listeners on unmount
    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading">
          <h2>Loading...</h2>
          <p>Connecting to blockchain...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="error">
          <h2>Connection Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        {loading ? (
          <LoadingPage />
        ) : error ? (
          <div className="error-page">
            <div className="error-content">
              <h2>Connection Error</h2>
              <p>{error}</p>
              <button className="btn-primary" onClick={() => window.location.reload()}>
                Retry Connection
              </button>
            </div>
          </div>
        ) : (
          <>
            <Navigation 
              account={account} 
              isArtist={isArtist} 
              artistName={artistName}
            />

            <main>
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <HomePage 
                      account={account} 
                      isArtist={isArtist} 
                      artistName={artistName} 
                      networkInfo={networkInfo}
                    />
                  } 
                />
                
                <Route 
                  path="/gallery" 
                  element={
                    <GalleryPage 
                      contract={contract} 
                      account={account} 
                      isArtist={isArtist} 
                    />
                  } 
                />
                
                <Route 
                  path="/collection" 
                  element={
                    <MyCollectionPage 
                      contract={contract} 
                      account={account} 
                      isArtist={isArtist} 
                    />
                  } 
                />
                
                <Route 
                  path="/register" 
                  element={
                    isArtist 
                      ? <Navigate to="/upload" replace /> 
                      : <RegisterPage 
                          contract={contract} 
                          account={account} 
                          setIsArtist={setIsArtist}
                          setArtistName={setArtistName}
                        />
                  } 
                />
                
                <Route 
                  path="/upload" 
                  element={
                    !isArtist 
                      ? <Navigate to="/register" replace /> 
                      : <UploadPage 
                          contract={contract} 
                          account={account}
                        />
                  } 
                />
                
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <Footer />
          </>
        )}
      </div>
    </Router>
  );
}

export default App;