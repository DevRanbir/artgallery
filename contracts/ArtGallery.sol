// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ArtGallery {
    struct Artist {
        string name;
        bool isRegistered;
    }

    struct Artwork {
        uint id;
        address artist;
        string title;
        string description;
        string ipfsHash;
        uint price;
        bool isSold;
    }

    uint public artworkCount;
    mapping(address => Artist) public artists;
    mapping(uint => Artwork) public artworks;

    event ArtistRegistered(address artist, string name);
    event ArtworkUploaded(uint artworkId, address artist);
    event ArtworkPurchased(uint artworkId, address buyer);
    event Tipped(address artist, address tipper, uint amount);

    modifier onlyRegisteredArtist() {
        require(artists[msg.sender].isRegistered, "Not a registered artist");
        _;
    }

    function registerAsArtist(string memory _name) public {
        require(!artists[msg.sender].isRegistered, "Already registered");
        require(bytes(_name).length > 0, "Name cannot be empty");
        artists[msg.sender] = Artist(_name, true);
        emit ArtistRegistered(msg.sender, _name);
    }

    function uploadArtwork(
        string memory _title, 
        string memory _description, 
        string memory _ipfsHash, 
        uint _price
    ) public onlyRegisteredArtist {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty");
        require(_price > 0, "Price must be greater than 0");
        
        artworkCount++;
        artworks[artworkCount] = Artwork({
            id: artworkCount,
            artist: msg.sender,
            title: _title,
            description: _description,
            ipfsHash: _ipfsHash,
            price: _price,
            isSold: false
        });
        
        emit ArtworkUploaded(artworkCount, msg.sender);
    }

    function purchaseArtwork(uint _artworkId) public payable {
        require(_artworkId > 0 && _artworkId <= artworkCount, "Invalid artwork ID");
        
        Artwork storage art = artworks[_artworkId];
        require(!art.isSold, "Already sold");
        require(msg.value >= art.price, "Not enough Ether");
        require(art.artist != msg.sender, "Cannot buy your own artwork");
        
        payable(art.artist).transfer(msg.value);
        art.isSold = true;

        emit ArtworkPurchased(_artworkId, msg.sender);
    }

    function tipArtist(address _artist) public payable {
        require(_artist != address(0), "Invalid artist address");
        require(artists[_artist].isRegistered, "Artist not registered");
        require(msg.value > 0, "Tip amount must be greater than 0");
        
        payable(_artist).transfer(msg.value);
        emit Tipped(_artist, msg.sender, msg.value);
    }

    // Split the getter into multiple functions to avoid stack too deep errors
    function getArtworkBasic(uint _artworkId) public view returns (
        uint id,
        address artist,
        uint price,
        bool isSold
    ) {
        require(_artworkId > 0 && _artworkId <= artworkCount, "Invalid artwork ID");
        Artwork memory art = artworks[_artworkId];
        return (art.id, art.artist, art.price, art.isSold);
    }

    function getArtworkDetails(uint _artworkId) public view returns (
        string memory title,
        string memory description,
        string memory ipfsHash
    ) {
        require(_artworkId > 0 && _artworkId <= artworkCount, "Invalid artwork ID");
        Artwork memory art = artworks[_artworkId];
        return (art.title, art.description, art.ipfsHash);
    }

    function getArtistInfo(address _artist) public view returns (
        string memory name,
        bool isRegistered
    ) {
        Artist memory artist = artists[_artist];
        return (artist.name, artist.isRegistered);
    }
}