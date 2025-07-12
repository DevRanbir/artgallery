# ArtBlocks - Decentralized Art Gallery

A modern, beautiful decentralized application (dApp) for digital art marketplace built on Ethereum blockchain.

## ✨ Features

- **🎨 Artist Registration**: Register as an artist and showcase your digital artwork
- **🖼️ Art Gallery**: Browse and discover unique digital artworks
- **💰 Purchase Artworks**: Buy digital art directly from artists using ETH
- **💝 Tip Artists**: Support your favorite artists with tips
- **🔒 Blockchain Security**: All transactions secured by Ethereum smart contracts

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navigation.js   # Main navigation bar
│   ├── Footer.js       # Site footer
│   ├── LoadingPage.js  # Loading screen
│   ├── Gallery.js      # Gallery component
│   ├── ArtworkCard.js  # Individual artwork display
│   ├── RegisterArtist.js # Artist registration form
│   ├── UploadArtwork.js # Artwork upload form
│   ├── Purchase.js     # Purchase functionality
│   └── Tip.js          # Artist tipping functionality
├── pages/              # Main application pages
│   ├── HomePage.js     # Landing page
│   ├── GalleryPage.js  # Gallery page
│   ├── RegisterPage.js # Artist registration page
│   └── UploadPage.js   # Artwork upload page
├── App.js             # Main application component
├── theme.css          # Custom styling and theme
└── index.js          # Application entry point
```

## 🎨 Design Features

- **Modern UI**: Clean, responsive design with beautiful color scheme
- **Color Theme**: Purple primary (#6C63FF), Pink secondary (#FF6584), Green accent (#43B97F)
- **Responsive**: Works perfectly on desktop, tablet, and mobile devices
- **Loading States**: Smooth loading animations and feedback
- **Error Handling**: User-friendly error messages and retry options

## Prerequisites

- Node.js and npm
- MetaMask browser extension
- Truffle (for contract deployment)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Smart Contract Integration

The application uses the ArtGallery smart contract which provides the following functionality:

- Artist registration
- Artwork upload and management
- Purchase functionality
- Tipping system

### Deploying the Contract

Make sure you have Truffle installed:

```bash
npm install -g truffle
```

Compile and deploy the contract:

```bash
truffle compile
truffle migrate --network development
```

After deployment, update the contract address in `src/App.js` with your deployed contract address.

## IPFS Integration

To upload images to IPFS, you can use services like:
- Pinata (https://pinata.cloud/)
- IPFS Desktop (https://github.com/ipfs/ipfs-desktop)

After uploading an image to IPFS, use the returned hash when uploading artwork through the dApp.

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Configure MetaMask**
   - Install MetaMask browser extension
   - Connect to your preferred Ethereum network
   - Ensure you have some ETH for transactions

4. **Update Contract Address**
   - Deploy your ArtGallery smart contract
   - Update the contract address in `src/App.js`

## 📱 Pages Overview

### 🏠 Home Page
- Hero section with call-to-action buttons
- Feature highlights
- Easy navigation to main sections

### 🖼️ Gallery Page
- Grid layout of all available artworks
- Search functionality
- Purchase and tip buttons for each artwork

### ✍️ Register Page
- Artist registration form
- Information about benefits
- Automatic redirect to upload page after registration

### 📤 Upload Page
- Artwork upload form with IPFS integration
- Detailed instructions
- Price setting and metadata input

## 🛠️ Technologies Used

- **React 19**: Modern React with hooks
- **React Router**: Client-side routing
- **Ethers.js**: Ethereum blockchain interaction
- **CSS Custom Properties**: Modern styling approach
- **IPFS**: Decentralized file storage

## 💡 Key Improvements

1. **Page-based Architecture**: Clean separation of concerns with dedicated pages
2. **Modern Styling**: Beautiful gradient colors, shadows, and animations
3. **Better UX**: Loading states, error handling, and user feedback
4. **Responsive Design**: Mobile-first approach with proper breakpoints
5. **Accessibility**: Focus states and proper semantic markup

## 🎯 Future Enhancements

- Dark mode support
- Advanced search and filtering
- Artist profiles and portfolios
- Auction functionality
- Collection management
- Social features (comments, likes)

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ for the decentralized art community
