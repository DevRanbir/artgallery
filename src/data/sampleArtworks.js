// Sample Artwork Data Generator
// This creates 10 sample artworks with different artists and descriptions

export const sampleArtworks = [
  {
    id: 1,
    title: "Digital Dreams",
    description: "A vibrant exploration of the digital realm where reality meets fantasy. This piece captures the essence of our modern digital age through bold colors and geometric patterns.",
    artist: "0x1234567890123456789012345678901234567890",
    artistName: "Alex Chen",
    price: "15000", // ₹15,000
    ipfsHash: "QmYx8ynZKnoH7DGRB4dXzP7ZtGZ8fQ2yUv9MqJKj3rPxLm",
    isSold: false,
    imageUrl: "https://via.placeholder.com/400x400/6366f1/ffffff?text=Digital+Dreams"
  },
  {
    id: 2,
    title: "Cosmic Harmony",
    description: "An abstract representation of celestial bodies dancing in perfect harmony. The swirling galaxies and nebulae create a mesmerizing visual experience.",
    artist: "0x2345678901234567890123456789012345678901",
    artistName: "Priya Sharma",
    price: "22000", // ₹22,000
    ipfsHash: "QmZy9ynZKnoH7DGRB4dXzP7ZtGZ8fQ2yUv9MqJKj3rPyNn",
    isSold: false,
    imageUrl: "https://via.placeholder.com/400x400/8b5cf6/ffffff?text=Cosmic+Harmony"
  },
  {
    id: 3,
    title: "Urban Pulse",
    description: "The heartbeat of the city captured in digital form. Neon lights, bustling streets, and the energy of urban life come together in this dynamic piece.",
    artist: "0x3456789012345678901234567890123456789012",
    artistName: "Marcus Rodriguez",
    price: "18500", // ₹18,500
    ipfsHash: "QmAz9ynZKnoH7DGRB4dXzP7ZtGZ8fQ2yUv9MqJKj3rPzOo",
    isSold: false,
    imageUrl: "https://via.placeholder.com/400x400/ec4899/ffffff?text=Urban+Pulse"
  },
  {
    id: 4,
    title: "Nature's Algorithm",
    description: "Where technology meets nature. This artwork explores the mathematical patterns found in natural forms, from fractals in ferns to the Fibonacci sequence in sunflowers.",
    artist: "0x4567890123456789012345678901234567890123",
    artistName: "Emily Johnson",
    price: "25000", // ₹25,000
    ipfsHash: "QmBa9ynZKnoH7DGRB4dXzP7ZtGZ8fQ2yUv9MqJKj3rPaPp",
    isSold: false,
    imageUrl: "https://via.placeholder.com/400x400/10b981/ffffff?text=Nature%27s+Algorithm"
  },
  {
    id: 5,
    title: "Emotional Spectrum",
    description: "A visual journey through the human emotional experience. Each color and form represents a different feeling, creating a powerful narrative of the human condition.",
    artist: "0x5678901234567890123456789012345678901234",
    artistName: "Rajesh Patel",
    price: "12000", // ₹12,000
    ipfsHash: "QmCb9ynZKnoH7DGRB4dXzP7ZtGZ8fQ2yUv9MqJKj3rPbQq",
    isSold: false,
    imageUrl: "https://via.placeholder.com/400x400/f59e0b/ffffff?text=Emotional+Spectrum"
  },
  {
    id: 6,
    title: "Quantum Entanglement",
    description: "Inspired by quantum physics, this piece visualizes the mysterious connections between particles across space and time. A mind-bending exploration of reality.",
    artist: "0x6789012345678901234567890123456789012345",
    artistName: "Sarah Kim",
    price: "30000", // ₹30,000
    ipfsHash: "QmDc9ynZKnoH7DGRB4dXzP7ZtGZ8fQ2yUv9MqJKj3rPcRr",
    isSold: false,
    imageUrl: "https://via.placeholder.com/400x400/0ea5e9/ffffff?text=Quantum+Entanglement"
  },
  {
    id: 7,
    title: "Digital Renaissance",
    description: "A modern take on classical art forms. This piece bridges the gap between traditional artistic techniques and contemporary digital mediums.",
    artist: "0x7890123456789012345678901234567890123456",
    artistName: "Antonio Silva",
    price: "20000", // ₹20,000
    ipfsHash: "QmEd9ynZKnoH7DGRB4dXzP7ZtGZ8fQ2yUv9MqJKj3rPdSs",
    isSold: false,
    imageUrl: "https://via.placeholder.com/400x400/84cc16/ffffff?text=Digital+Renaissance"
  },
  {
    id: 8,
    title: "Cyber Lotus",
    description: "The fusion of Eastern philosophy and Western technology. A lotus flower reimagined in the digital age, symbolizing purity and enlightenment in our connected world.",
    artist: "0x8901234567890123456789012345678901234567",
    artistName: "Yuki Tanaka",
    price: "17500", // ₹17,500
    ipfsHash: "QmFe9ynZKnoH7DGRB4dXzP7ZtGZ8fQ2yUv9MqJKj3rPeTt",
    isSold: false,
    imageUrl: "https://via.placeholder.com/400x400/ef4444/ffffff?text=Cyber+Lotus"
  },
  {
    id: 9,
    title: "Infinite Recursion",
    description: "A hypnotic pattern that seems to go on forever. This piece explores the concept of infinity through repeating geometric forms and mathematical precision.",
    artist: "0x9012345678901234567890123456789012345678",
    artistName: "Dmitri Volkov",
    price: "14000", // ₹14,000
    ipfsHash: "QmGf9ynZKnoH7DGRB4dXzP7ZtGZ8fQ2yUv9MqJKj3rPfUu",
    isSold: false,
    imageUrl: "https://via.placeholder.com/400x400/a855f7/ffffff?text=Infinite+Recursion"
  },
  {
    id: 10,
    title: "Data Visualization",
    description: "The beauty of big data transformed into art. This piece takes complex datasets and turns them into a visually stunning representation of information flow.",
    artist: "0x0123456789012345678901234567890123456789",
    artistName: "Fatima Al-Zahra",
    price: "28000", // ₹28,000
    ipfsHash: "QmHg9ynZKnoH7DGRB4dXzP7ZtGZ8fQ2yUv9MqJKj3rPgVv",
    isSold: false,
    imageUrl: "https://via.placeholder.com/400x400/06b6d4/ffffff?text=Data+Visualization"
  }
];

// Function to format price in INR
export const formatPrice = (priceInr) => {
  return `₹${parseInt(priceInr).toLocaleString('en-IN')}`;
};

// Function to get random sample artwork
export const getRandomArtwork = () => {
  const randomIndex = Math.floor(Math.random() * sampleArtworks.length);
  return sampleArtworks[randomIndex];
};

// Function to simulate loading sample data into the gallery
export const loadSampleData = () => {
  // This would be used in development to populate the gallery
  console.log('Loading sample artwork data...');
  return sampleArtworks;
};

// Artists data for registration simulation
export const sampleArtists = [
  { address: "0x1234567890123456789012345678901234567890", name: "Alex Chen", isRegistered: true },
  { address: "0x2345678901234567890123456789012345678901", name: "Priya Sharma", isRegistered: true },
  { address: "0x3456789012345678901234567890123456789012", name: "Marcus Rodriguez", isRegistered: true },
  { address: "0x4567890123456789012345678901234567890123", name: "Emily Johnson", isRegistered: true },
  { address: "0x5678901234567890123456789012345678901234", name: "Rajesh Patel", isRegistered: true },
  { address: "0x6789012345678901234567890123456789012345", name: "Sarah Kim", isRegistered: true },
  { address: "0x7890123456789012345678901234567890123456", name: "Antonio Silva", isRegistered: true },
  { address: "0x8901234567890123456789012345678901234567", name: "Yuki Tanaka", isRegistered: true },
  { address: "0x9012345678901234567890123456789012345678", name: "Dmitri Volkov", isRegistered: true },
  { address: "0x0123456789012345678901234567890123456789", name: "Fatima Al-Zahra", isRegistered: true }
];

export default sampleArtworks;
