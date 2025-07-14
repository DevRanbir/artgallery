import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './styles/main.css';

// Import components
import Navigation from './components/Navigation';
import Footer from './components/Footer';

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
  const [error, setError] = useState('');
  const [networkInfo, setNetworkInfo] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        // Check if MetaMask is installed
        if (!window.ethereum) {
          console.log('MetaMask not installed');
          return;
        }

        // Try to get connected accounts without requesting access
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length === 0) {
            console.log('No accounts connected');
            return;
          }
          setAccount(accounts[0]);

          // Only initialize contract if account is connected
          await initializeContract(accounts[0]);
        } catch (accountError) {
          console.log('Could not get accounts:', accountError);
          return;
        }

        console.log('App initialization completed successfully');

      } catch (err) {
        console.error('Error initializing app:', err);
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

  const initializeContract = async (userAccount) => {
    try {
      // Create ethers provider and signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Get network information
      const network = await provider.getNetwork();
      setNetworkInfo(`Network: ${network.name} (Chain ID: ${network.chainId})`);
      console.log('Connected to network:', network);

      // Contract address - REPLACE WITH YOUR DEPLOYED CONTRACT ADDRESS
      const contractAddress = '0x0be6339b6cc21ae512c38c4ee55fe43ff20976e4';
      
      // Verify contract exists at the address
      const code = await provider.getCode(contractAddress);
      if (code === '0x') {
        setError(`No contract found at address ${contractAddress} on ${network.name}. Please verify the contract is deployed on the correct network.`);
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
        return;
      }

      // Check if current user is a registered artist
      try {
        console.log('Checking artist status for:', userAccount);
        const artistInfo = await artGalleryContract.getArtistInfo(userAccount);
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
        // Don't reload, just update state
        if (newAccounts.length > 0) {
          // Reinitialize contract if account is connected
          window.location.reload();
        } else {
          // Clear contract and artist state if disconnected
          setContract(null);
          setIsArtist(false);
          setArtistName('');
          setNetworkInfo('');
        }
      });

      // Listen for network changes
      window.ethereum.on('chainChanged', (chainId) => {
        console.log('Network changed to:', chainId);
        // Reload the page to reinitialize with new network
        window.location.reload();
      });

    } catch (err) {
      console.error('Error initializing contract:', err);
      setError(`Error connecting to blockchain: ${err.message}`);
    }
  };

  // Function to request MetaMask connection
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('Please install MetaMask to connect your wallet');
        return;
      }
      
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        // Initialize contract with the new account
        await initializeContract(accounts[0]);
      }
    } catch (err) {
      console.error('Error connecting wallet:', err);
      alert('Failed to connect wallet');
    }
  };

  // Remove the loading state completely
  // if (loading) { ... } - REMOVED

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
    <Router basename="/artgallery">
      <div className="app-container">
        <Navigation 
          account={account} 
          isArtist={isArtist} 
          artistName={artistName}
          connectWallet={connectWallet}
        />

        <main>
          <Routes>
            <Route 
              path="/" 
              element={<Navigate to="/home" replace />}
            />
            
            <Route 
              path="/home" 
              element={
                <HomePage 
                  account={account} 
                  isArtist={isArtist} 
                  artistName={artistName} 
                  networkInfo={networkInfo}
                  connectWallet={connectWallet}
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
                  connectWallet={connectWallet}
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
                  connectWallet={connectWallet}
                />
              } 
            />
            
            <Route 
              path="/register" 
              element={
                !account ? <Navigate to="/home" replace /> :
                isArtist 
                  ? <Navigate to="/upload" replace /> 
                  : <RegisterPage 
                      contract={contract} 
                      account={account} 
                      setIsArtist={setIsArtist}
                      setArtistName={setArtistName}
                      connectWallet={connectWallet}
                    />
              } 
            />
            
            <Route 
              path="/upload" 
              element={
                !account ? <Navigate to="/home" replace /> :
                !isArtist 
                  ? <Navigate to="/register" replace /> 
                  : <UploadPage 
                      contract={contract} 
                      account={account}
                      connectWallet={connectWallet}
                    />
              } 
            />
            
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;