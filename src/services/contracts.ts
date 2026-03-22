import { createPublicClient, http, formatUnits, parseUnits, Chain } from 'viem';

// Define Polygon Amoy chain manually since it's not in viem by default
const polygonAmoy = {
  id: 80002,
  name: 'Polygon Amoy',
  network: 'polygon-amoy',
  nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc-amoy.polygon.technology/'] as string[] },
    public: { http: ['https://rpc-amoy.polygon.technology/'] as string[] },
  },
  blockExplorers: {
    default: { 
      name: 'PolygonScan', 
      url: 'https://amoy.polygonscan.com' 
    },
  },
  testnet: true,
};

// Define Avalanche Fuji Testnet chain
const avalancheFuji = {
  id: 43113,
  name: 'Avalanche Fuji Testnet',
  network: 'avalanche-fuji',
  nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://api.avax-test.network/ext/bc/C/rpc'] as string[] },
    public: { http: ['https://api.avax-test.network/ext/bc/C/rpc'] as string[] },
  },
  blockExplorers: {
    default: { 
      name: 'SnowTrace', 
      url: 'https://testnet.snowtrace.io' 
    },
  },
  testnet: true,
};
import { useWallets } from '@privy-io/react-auth';

// Contract ABIs (simplified versions)
const RWATokenizerABI = [
  {
    inputs: [{ internalType: 'string', name: 'uri', type: 'string' }],
    name: 'setURI',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'id', type: 'uint256' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'id', type: 'uint256' }],
    name: 'totalSupply',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address', name: 'account', type: 'address' },
      { internalType: 'uint256', name: 'id', type: 'uint256' },
    ],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

const MarketplaceFactoryABI = [
  {
    inputs: [
      { internalType: 'address', name: 'implementation', type: 'address' },
      { internalType: 'string', name: 'baseURI', type: 'string' },
      { internalType: 'address', name: 'initialOwner', type: 'address' },
    ],
    name: 'createMarketplace',
    outputs: [{ internalType: 'address', name: 'marketplace', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getMarketplaces',
    outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'marketplaces',
    outputs: [
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'address', name: 'tokenizer', type: 'address' },
      { internalType: 'uint256', name: 'createdAt', type: 'uint256' },
      { internalType: 'bool', name: 'active', type: 'bool' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// Contract addresses from deployment
const CONTRACTS = {
  // Polygon Amoy
  RWATokenizer: '0x6ead743c9122a6c47212e4808edd49e260c1172b' as const,
  MarketplaceFactory: '0x895605cfacb5f0d9de464dce03b81df73bd3783c' as const,
  // Avalanche Fuji
  RWATokenizerAvalanche: '0xc880af5d5ac3ea27c26c47d132661a710c245ea5' as const,
  MarketplaceFactoryAvalanche: '0x62f0be8a94f7e348f15f6f373e35ae5c34f7d40f' as const,
} as const;

// Deployed marketplace addresses
const DEPLOYED_MARKETPLACES = [
  {
    address: '0x06Cebc9403C00d972e014E452509d04c7C350880',
    network: 'avalanche' as const,
    name: 'Real Estate RWA Marketplace',
    category: 'real-estate',
  },
  {
    address: '0x32176423853891a310A874132185C02EF90A03ce',
    network: 'polygon' as const,
    name: 'Polygon Real Estate Hub',
    category: 'real-estate',
  },
] as const;

// Network selection - default to Polygon Amoy for backward compatibility
let activeChain = polygonAmoy;
let activeRpcUrl = 'https://rpc-amoy.polygon.technology';

// Function to set the active network
export const setActiveNetwork = (chain: 'polygon' | 'avalanche') => {
  if (chain === 'avalanche') {
    activeChain = avalancheFuji;
    activeRpcUrl = 'https://api.avax-test.network/ext/bc/C/rpc';
  } else {
    activeChain = polygonAmoy;
    activeRpcUrl = 'https://rpc-amoy.polygon.technology';
  }
};

// Create public client for read operations - will be updated when network changes
export const createPublicClientForNetwork = () => {
  return createPublicClient({
    chain: activeChain,
    transport: http(activeRpcUrl),
  });
};

// Initialize default public client
export const publicClient = createPublicClientForNetwork();

// Create wallet client for write operations - to be implemented with Privy
// export const createWalletClient = (walletAddress: string) => {
//   // This would need to be integrated with Privy wallet
//   // For now, return null to indicate wallet integration needed
//   return null;
// };

// Contract instances
export const rwatTokenizerContract = {
  address: CONTRACTS.RWATokenizer,
  abi: RWATokenizerABI,
} as const;

export const marketplaceFactoryContract = {
  address: CONTRACTS.MarketplaceFactory,
  abi: MarketplaceFactoryABI,
} as const;

// Service functions
export class ContractService {
  // Get marketplace data from deployed marketplaces
  static async getMarketplaces() {
    try {
      // Get data for each deployed marketplace from both networks
      const polygonClient = createPublicClient({
        chain: polygonAmoy,
        transport: http('https://rpc-amoy.polygon.technology/'),
      });

      const avalancheClient = createPublicClient({
        chain: avalancheFuji,
        transport: http('https://api.avax-test.network/ext/bc/C/rpc'),
      });

      const marketplaceDetails = await Promise.all(
        DEPLOYED_MARKETPLACES.map(async (mp) => {
          try {
            const client = mp.network === 'avalanche' ? avalancheClient : polygonClient;
            const factoryAddress = mp.network === 'avalanche' 
              ? CONTRACTS.MarketplaceFactoryAvalanche 
              : CONTRACTS.MarketplaceFactory;

            // Try to get marketplace info from the factory
            let owner = 'Unknown';
            let active = true;
            
            try {
              const result = await client.readContract({
                address: factoryAddress,
                abi: MarketplaceFactoryABI,
                functionName: 'marketplaces',
                args: [mp.address as `0x${string}`],
              });
              owner = result[0] || 'Unknown';
              active = result[3] || true;
            } catch {
              // Use default values if read fails
            }

            return {
              address: mp.address,
              owner,
              name: mp.name,
              category: mp.category,
              network: mp.network,
              createdAt: new Date().toISOString(),
              active,
            };
          } catch (error) {
            console.error(`Error fetching marketplace ${mp.address}:`, error);
            return {
              address: mp.address,
              owner: 'Unknown',
              name: mp.name,
              category: mp.category,
              network: mp.network,
              createdAt: new Date().toISOString(),
              active: true,
            };
          }
        })
      );

      return marketplaceDetails.filter(m => m.active);
    } catch (error) {
      console.error('Error fetching marketplaces:', error);
      return [];
    }
  }

  // Get marketplaces for a specific network
  static async getMarketplacesByNetwork(network: 'polygon' | 'avalanche') {
    const allMarketplaces = await this.getMarketplaces();
    return allMarketplaces.filter(m => m.network === network);
  }

  // Get token supply for a specific token ID
  static async getTokenSupply(tokenId: number) {
    try {
      const publicClient = createPublicClientForNetwork();
      const supply = await publicClient.readContract({
        ...rwatTokenizerContract,
        functionName: 'totalSupply',
        args: [BigInt(tokenId)],
      });

      return Number(supply);
    } catch (error) {
      console.error('Error fetching token supply:', error);
      return 0;
    }
  }

  // Get balance of tokens for an address
  static async getTokenBalance(address: string, tokenId: number) {
    try {
      const publicClient = createPublicClientForNetwork();
      const balance = await publicClient.readContract({
        ...rwatTokenizerContract,
        functionName: 'balanceOf',
        args: [address as `0x${string}`, BigInt(tokenId)],
      });

      return Number(balance);
    } catch (error) {
      console.error('Error fetching token balance:', error);
      return 0;
    }
  }

  // Get platform stats
  static async getPlatformStats() {
    try {
      const marketplaces = await this.getMarketplaces();
      const totalMarketplaces = marketplaces.length;
      
      // Get total supply for common token IDs (0: LAND, 1: BUILDING)
      const [landSupply, buildingSupply] = await Promise.all([
        this.getTokenSupply(0),
        this.getTokenSupply(1),
      ]);

      const totalTokensMinted = landSupply + buildingSupply;
      const activeMarketplaces = marketplaces.filter(m => m.active).length;

      return {
        totalMarketplaces,
        activeMarketplaces,
        totalTokensMinted,
        totalVolume: '0', // Would need to track actual transaction volume
        platformFee: '0.5%',
      };
    } catch (error) {
      console.error('Error fetching platform stats:', error);
      return {
        totalMarketplaces: 0,
        activeMarketplaces: 0,
        totalTokensMinted: 0,
        totalVolume: '0',
        platformFee: '0.5%',
      };
    }
  }

  // Get marketplace details
  static async getMarketplaceDetails(address: string) {
    try {
      const [owner, tokenizer, createdAt, active] = await publicClient.readContract({
        ...marketplaceFactoryContract,
        functionName: 'marketplaces',
        args: [address as `0x${string}`],
      });

      return {
        address,
        owner,
        tokenizer,
        createdAt: new Date(Number(createdAt) * 1000).toISOString(),
        active,
      };
    } catch (error) {
      console.error('Error fetching marketplace details:', error);
      return null;
    }
  }

  // Format address for display
  static formatAddress(address: string) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  // Get transaction URL
  static getTransactionUrl(txHash: string) {
    return `https://amoy.polygonscan.com/tx/${txHash}`;
  }

  // Get address URL
  static getAddressUrl(address: string) {
    return `https://amoy.polygonscan.com/address/${address}`;
  }
}

export default ContractService;
