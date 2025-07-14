# 🎨 On-Chain Art Gallery DApp

> **A decentralized art marketplace where artists register, upload artwork metadata, and buyers can purchase or tip directly on the blockchain.**

[Deployed Site](https://devranbir.github.io/artgallery)

## ✨ Features

🎨 **Artist Registration** - One-time registration to become a verified artist  
🖼️ **Upload Artwork** - Store metadata and image URLs directly on-chain  
🏛️ **Public Gallery** - Browse all available artworks  
💰 **Direct Purchase** - Buy artwork with ETH, payment goes directly to artist  
💝 **Artist Tipping** - Support artists with direct tips  
🔒 **Blockchain Security** - All transactions secured by Ethereum smart contracts

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [MetaMask](https://metamask.io/) browser extension
- [Truffle](https://trufflesuite.com/) for smart contract deployment

### Installation

```bash
# Clone the repository
git clone https://github.com/DevRanbir/artgallery.git
cd artgallery

# Install dependencies
npm install

# Start development server
npm start
```

### Smart Contract Deployment

```bash
# Install Truffle globally
npm install -g truffle

# Compile contracts
truffle compile

# Deploy to local network (Ganache)
truffle migrate --network development

# Deploy to testnet (optional)
truffle migrate --network goerli
```

## 🏗️ Architecture

### Smart Contract (`ArtGallery.sol`)
```solidity
struct Artist {
    string name;
    bool isRegistered;
}

struct Artwork {
    uint id;
    address artist;
    string title;
    string description;
    string imageUrl;  // Direct image URL
    uint price;
    bool isSold;
}
```

### Key Functions
- `registerAsArtist(string name)` - Register as verified artist
- `uploadArtwork(...)` - Upload artwork metadata 
- `purchaseArtwork(uint id)` - Buy artwork with ETH
- `tipArtist(address artist)` - Send tip to artist

### Frontend Architecture
```
src/
├── components/          # Reusable UI components
├── pages/              # Application pages  
├── styles/             # CSS styling
└── utils/              # Helper functions
```

## 🎯 Core Workflows

### For Artists
1. **Register** → Connect MetaMask → Register as artist
2. **Upload** → Add artwork details → Provide image URL → Set price
3. **Earn** → Receive payments directly when artwork sells

### For Buyers  
1. **Browse** → View gallery of available artworks
2. **Purchase** → Connect MetaMask → Buy with ETH
3. **Tip** → Support favorite artists directly

## 💾 Data Storage

- **Metadata**: Stored on-chain (title, description, price)
- **Images**: Direct image URLs stored on-chain
- **Payments**: Direct ETH transfers via smart contract

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | React 19, React Router |
| **Blockchain** | Solidity, Truffle |
| **Web3** | Ethers.js, MetaMask |
| **Storage** | On-chain (metadata & image URLs) |
| **Styling** | CSS3, Custom Properties |
| **Deployment** | GitHub Pages, Ethereum Networks |

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Run development server |
| `npm test` | Run test suite |
| `npm run build` | Build for production |
| `npm run deploy` | Deploy to GitHub Pages |
| `truffle compile` | Compile smart contracts |
| `truffle migrate` | Deploy contracts |

## 🌐 Image Hosting

For artwork images, you can use any reliable image hosting service:
- **[Imgur](https://imgur.com/)** - Free image hosting
- **[Cloudinary](https://cloudinary.com/)** - Professional image management  
- **[GitHub](https://github.com/)** - Host images in repository
- **Direct URLs** - Any publicly accessible image URL

Simply provide the direct image URL when uploading artwork through the dApp.

## � Configuration

### MetaMask Setup
1. Install [MetaMask](https://metamask.io/)
2. Create/import wallet
3. Add test network (Ganache/Goerli)
4. Get test ETH from faucet

### Contract Address
Update contract address in `src/App.js` after deployment:
```javascript
const CONTRACT_ADDRESS = "0x..."; // Your deployed contract address
```

## 🎨 Features Showcase

### 🏠 Landing Page
- Hero section with clear call-to-action
- Feature highlights and benefits
- Easy navigation to main sections

### 🖼️ Gallery
- Grid layout of available artworks
- Real-time price display in ETH
- One-click purchase and tipping

### ✍️ Artist Dashboard  
- Registration workflow
- Artwork upload with direct image URLs
- Sales tracking and analytics

## � Deployment

### GitHub Pages (Frontend)
```bash
npm run deploy
```

### Smart Contract Networks
- **Local**: Ganache (development)
- **Testnet**: Goerli, Sepolia  
- **Mainnet**: Ethereum (production)

## 🎯 Future Roadmap

- [ ] NFT Integration (ERC-721)
- [ ] Auction System
- [ ] Artist Royalties
- [ ] Advanced Search & Filters
- [ ] Mobile App (React Native)
- [ ] Layer 2 Support (Polygon, Arbitrum)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Developer**: [DevRanbir (Ranbir Khurana)](https://github.com/DevRanbir)
- Built with [Create React App](https://create-react-app.dev/)
- Inspired by decentralized art communities
- Thanks to the Ethereum ecosystem

---

**🌟 Star this repo if you found it helpful!**

Built with ❤️ by **DevRanbir (Ranbir Khurana)** for the decentralized art community
