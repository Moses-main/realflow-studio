import { http, createPublicClient, formatEther } from 'viem';
import { polygon, sepolia, mainnet } from 'viem/chains';

const polygonAmoy = {
  id: 80002,
  name: 'Polygon Amoy',
  network: 'polygon-amoy',
  nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc-amoy.polygon.technology/'] },
    public: { http: ['https://rpc-amoy.polygon.technology/'] },
  },
  blockExplorers: {
    default: { 
      name: 'PolygonScan', 
      url: 'https://amoy.polygonscan.com' 
    },
  },
  testnet: true,
};

const CHAINS = {
  'polygon-amoy': polygonAmoy,
  'polygon-mumbai': polygonAmoy,
  'polygon-mainnet': polygon,
  'sepolia': sepolia,
  'mainnet': mainnet
};

const RPC_URLS = {
  'polygon-amoy': process.env.POLYGON_AMOY_RPC_URL || 'https://rpc-amoy.polygon.technology/',
  'polygon-mumbai': process.env.POLYGON_AMOY_RPC_URL || 'https://rpc-amoy.polygon.technology/',
  'polygon-mainnet': process.env.POLYGON_MAINNET_RPC_URL,
  'sepolia': process.env.SEPOLIA_RPC_URL,
  'mainnet': process.env.MAINNET_RPC_URL
};

function getChain(network) {
  const chainKey = network || 'polygon-amoy';
  return CHAINS[chainKey] || polygonAmoy;
}

function getRPCUrl(network) {
  const chainKey = network || 'polygon-amoy';
  return RPC_URLS[chainKey] || 'https://rpc-amoy.polygon.technology/';
}

export async function getContractInfo(address, network) {
  const chain = getChain(network);
  const rpcUrl = getRPCUrl(network);
  
  const client = createPublicClient({
    chain,
    transport: http(rpcUrl)
  });

  try {
    const [balance, code] = await Promise.all([
      client.getBalance({ address }),
      client.getBytecode({ address })
    ]);

    return {
      address,
      network: chain.name,
      explorerUrl: chain.blockExplorers?.default?.url || 'https://amoy.polygonscan.com',
      balance: formatEther(balance),
      hasCode: code && code.length > 2,
      name: 'RealFlow Contract'
    };
  } catch (error) {
    console.error('Contract info error:', error);
    throw new Error('Failed to get contract info');
  }
}

export async function getTokenBalance(address, tokenAddress, network) {
  const chain = getChain(network);
  const rpcUrl = getRPCUrl(network);
  
  const client = createPublicClient({
    chain,
    transport: http(rpcUrl)
  });

  try {
    if (!tokenAddress) {
      const balance = await client.getBalance({ address });
      return {
        symbol: chain.nativeCurrency?.symbol || 'MATIC',
        balance: formatEther(balance),
        decimals: 18
      };
    }

    return {
      symbol: 'TOKEN',
      balance: '0',
      decimals: 18,
      note: 'Token balance requires ABI - use frontend wallet connection'
    };
  } catch (error) {
    console.error('Balance check error:', error);
    throw new Error('Failed to get balance');
  }
}

export function getMarketplaceFactory() {
  const factoryAddress = process.env.MARKETPLACE_FACTORY_ADDRESS;
  
  return {
    name: 'MarketplaceFactory',
    address: factoryAddress || null,
    deployed: !!factoryAddress,
    networks: ['polygon-amoy', 'polygon-mainnet', 'sepolia'],
    explorer: 'https://amoy.polygonscan.com',
    functions: [
      'createMarketplace(string name, address tokenAddress)',
      'getMarketplaceCount()',
      'getMarketplace(uint256 index)',
      'listAllMarketplaces()'
    ]
  };
}

export async function estimateDeploymentGas(contractType) {
  const estimates = {
    token: { gas: 2500000n, description: 'ERC-721 or ERC-1155 token' },
    marketplace: { gas: 5000000n, description: 'Full marketplace contract' },
    factory: { gas: 3000000n, description: 'Factory contract' },
    custom: { gas: 2000000n, description: 'Custom contract' }
  };

  const estimate = estimates[contractType] || estimates.custom;
  
  return {
    ...estimate,
    network: 'polygon-amoy',
    explorerUrl: 'https://amoy.polygonscan.com',
    estimatedCost: '0.05',
    currency: 'MATIC',
    note: 'Estimate only - actual gas may vary'
  };
}
