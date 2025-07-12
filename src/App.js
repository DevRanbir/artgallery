import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';

// Import components
import RegisterArtist from './components/RegisterArtist';
import UploadArtwork from './components/UploadArtwork';
import Gallery from './components/Gallery';

// Simplified ABI for ArtGallery contract
const ArtGalleryABI = [
  // Artist registration
  "function registerAsArtist(string memory _name) public",
  
  // Artwork management
  "function uploadArtwork(string memory _title, string memory _description, string memory _ipfsHash, uint _price) public",
  "function purchaseArtwork(uint _artworkId) public payable",
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
        const contractAddress = '0x9EE63927bDCf70820dCd4a1a6E25475Db14eFe7A';
        
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
    <div className="app-container">
      <header>
        <h1>Art Gallery dApp</h1>
        <div className="account-info">
          <p>Connected Account: {account}</p>
          <p>{networkInfo}</p>
          {isArtist && <p>Artist Name: {artistName}</p>}
        </div>
      </header>

      <main>
        {!isArtist && (
          <section className="register-section">
            <h2>Register as an Artist</h2>
            <RegisterArtist 
              contract={contract} 
              account={account} 
              setIsArtist={setIsArtist}
              setArtistName={setArtistName}
            />
          </section>
        )}

        {isArtist && (
          <section className="upload-section">
            <h2>Upload Artwork</h2>
            <UploadArtwork 
              contract={contract} 
              account={account} 
            />
          </section>
        )}

        <section className="gallery-section">
          <h2>Art Gallery</h2>
          <Gallery 
            contract={contract} 
            account={account} 
            isArtist={isArtist}
          />
        </section>
      </main>

      <footer>
        <p>&copy; {new Date().getFullYear()} Art Gallery dApp</p>
      </footer>
    </div>
  );
}

export default App;