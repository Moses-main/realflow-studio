import { http, createPublicClient, formatEther } from 'viem';
import { polygonMumbai, polygon, sepolia, mainnet } from 'viem/chains';

const CHAINS = {
  'polygon-mumbai': polygonMumbai,
  'polygon-mainnet': polygon,
  'sepolia': sepolia,
  'mainnet': mainnet
};

const RPC_URLS = {
  'polygon-mumbai': process.env.POLYGON_AMOY_RPC_URL || process.env.INFURA_POLYGON_AMOY_RPC_URL,
  'polygon-mainnet': process.env.POLYGON_MAINNET_RPC_URL,
  'sepolia': process.env.SEPOLIA_RPC_URL || process.env.INFURA_SEPOLIA_RPC_URL,
  'mainnet': process.env.MAINNET_RPC_URL || process.env.INFURA_MAINNET_RPC_URL
};

function getChain(network) {
  const chainKey = network || 'polygon-mumbai';
  return CHAINS[chainKey] || polygonMumbai;
}

function getRPCUrl(network) {
  const chainKey = network || 'polygon-mumbai';
  return RPC_URLS[chainKey] || 'https://rpc-mumbai.maticvigil.com';
}

export async function getContractInfo(address, network) {
  const chain = getChain(network);
  const rpcUrl = getRPCUrl(network);
  
  const client = createPublicClient({
    chain,
    transport: http(rpcUrl)
  });

  try {
    const [balance, code, name] = await Promise.all([
      client.getBalance({ address }),
      client.getBytecode({ address }),
      client.getContractName ? client.getContractName({ address }) : Promise.resolve(null)
    ]);

    return {
      address,
      network: chain.name,
      balance: formatEther(balance),
      hasCode: code && code.length > 2,
      name: name || 'Unknown Contract'
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
    networks: ['polygon-mumbai', 'polygon-mainnet', 'sepolia'],
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
    token: { gas: 2500000, description: 'ERC-721 or ERC-1155 token' },
    marketplace: { gas: 5000000, description: 'Full marketplace contract' },
    factory: { gas: 3000000, description: 'Factory contract' },
    custom: { gas: 2000000, description: 'Custom contract' }
  };

  const estimate = estimates[contractType] || estimates.custom;
  
  return {
    ...estimate,
    network: 'polygon-mumbai',
    estimatedCost: '0.05',
    currency: 'MATIC',
    note: 'Estimate only - actual gas may vary'
  };
}
