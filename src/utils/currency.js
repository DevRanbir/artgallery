import { ethers } from 'ethers';

/**
 * Format wei value to ETH with appropriate decimal places
 * @param {string|number} weiValue - The amount in wei as string or number
 * @param {number} [decimals=4] - Number of decimal places to display
 * @returns {string} Formatted ETH value with symbol
 */
export const formatWeiToEth = (weiValue, decimals = 4) => {
  if (!weiValue) return '0 ETH';
  
  try {
    // Handle various input types safely
    let bigNumberValue;
    
    if (ethers.BigNumber.isBigNumber(weiValue)) {
      bigNumberValue = weiValue;
    } else if (typeof weiValue === 'string' || typeof weiValue === 'number') {
      try {
        bigNumberValue = ethers.BigNumber.from(String(weiValue));
      } catch (err) {
        // If parsing as BigNumber fails, try formatting directly
        return `${parseFloat(weiValue).toFixed(decimals)} ETH`;
      }
    } else {
      return `${weiValue} ETH`;
    }
      
    // Format to ETH
    const ethValue = ethers.utils.formatEther(bigNumberValue);
    
    // Parse float and fix decimals
    const formatted = parseFloat(ethValue).toFixed(decimals);
    
    // Remove trailing zeros
    return `${parseFloat(formatted)} ETH`;
  } catch (error) {
    console.error('Error formatting wei to ETH:', error, weiValue);
    // Return the original value if formatting fails
    return `${weiValue} ETH`;
  }
};

/**
 * Truncates an Ethereum address for display
 * @param {string} address - The Ethereum address to truncate
 * @param {number} [startChars=6] - Number of characters to keep at start
 * @param {number} [endChars=4] - Number of characters to keep at end
 * @returns {string} Truncated address
 */
export const truncateAddress = (address, startChars = 6, endChars = 4) => {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;
  
  return `${address.substring(0, startChars)}...${address.substring(address.length - endChars)}`;
};

/**
 * Format price with appropriate currency symbol
 * @param {number|string} price - Price to format
 * @param {string} [currency='ETH'] - Currency symbol
 * @returns {string} Formatted price with currency symbol
 */
export const formatPrice = (price, currency = 'ETH') => {
  if (!price) return `0 ${currency}`;
  
  const formattedPrice = typeof price === 'string' 
    ? parseFloat(price).toFixed(4) 
    : price.toFixed(4);
    
  // Remove trailing zeros
  return `${parseFloat(formattedPrice)} ${currency}`;
};

/**
 * Calculate gas price in ETH
 * @param {number|string} gasPrice - Gas price in Gwei
 * @param {number} gasLimit - Gas limit
 * @returns {string} Estimated gas cost in ETH
 */
export const calculateGasCost = (gasPrice, gasLimit) => {
  if (!gasPrice || !gasLimit) return '0 ETH';
  
  try {
    // Convert gas price from Gwei to wei
    const gasPriceWei = ethers.utils.parseUnits(String(gasPrice), 'gwei');
    
    // Calculate total gas cost in wei
    const gasCostWei = gasPriceWei.mul(ethers.BigNumber.from(String(gasLimit)));
    
    // Format to ETH
    return formatWeiToEth(gasCostWei);
  } catch (error) {
    console.error('Error calculating gas cost:', error);
    return '? ETH';
  }
};

/**
 * Convert ETH to Indian Rupees (INR) using approximate exchange rate
 * @param {string|number} ethAmount - Amount in ETH
 * @param {number} [ethToInrRate=280000] - Current ETH to INR exchange rate (approximate)
 * @returns {string} Formatted INR value
 */
export const formatEthToInr = (ethAmount, ethToInrRate = 280000) => {
  if (!ethAmount || ethAmount === '0') return '₹0';
  
  try {
    const ethValue = typeof ethAmount === 'string' ? parseFloat(ethAmount) : ethAmount;
    const inrValue = ethValue * ethToInrRate;
    
    // Format with Indian number system (lakhs, crores)
    if (inrValue >= 10000000) { // 1 crore
      return `₹${(inrValue / 10000000).toFixed(2)}Cr`;
    } else if (inrValue >= 100000) { // 1 lakh
      return `₹${(inrValue / 100000).toFixed(2)}L`;
    } else if (inrValue >= 1000) { // 1 thousand
      return `₹${(inrValue / 1000).toFixed(1)}K`;
    } else {
      return `₹${Math.round(inrValue).toLocaleString('en-IN')}`;
    }
  } catch (error) {
    console.error('Error converting ETH to INR:', error);
    return '₹?';
  }
};

/**
 * Format wei value to both ETH and INR
 * @param {string|number} weiValue - The amount in wei
 * @param {number} [decimals=4] - Number of decimal places for ETH
 * @param {number} [ethToInrRate=280000] - Current ETH to INR exchange rate
 * @returns {object} Object containing eth and inr formatted values
 */
export const formatWeiToBothCurrencies = (weiValue, decimals = 4, ethToInrRate = 280000) => {
  if (!weiValue) return { eth: '0 ETH', inr: '₹0' };
  
  try {
    // Get ETH value
    const ethFormatted = formatWeiToEth(weiValue, decimals);
    const ethValue = parseFloat(ethFormatted.replace(' ETH', ''));
    
    // Get INR value
    const inrFormatted = formatEthToInr(ethValue, ethToInrRate);
    
    return {
      eth: ethFormatted,
      inr: inrFormatted
    };
  } catch (error) {
    console.error('Error formatting to both currencies:', error);
    return { eth: '0 ETH', inr: '₹0' };
  }
};
