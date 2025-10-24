// Contract addresses - Update these after deployment
export const PREDICTION_MARKET_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000') as `0x${string}`;

// Default bet amount (0.001 ETH)
export const DEFAULT_BET_AMOUNT = '0.001';

// Contract configuration
export const CONTRACT_CONFIG = {
  address: PREDICTION_MARKET_ADDRESS,
  chainId: {
    testnet: 97,  // BSC Testnet
    mainnet: 56,  // BSC Mainnet
  },
};

