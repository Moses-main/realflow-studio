import { 
  http, 
  createPublicClient, 
  createWalletClient, 
  formatEther, 
  parseEther 
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { polygon, sepolia, mainnet, avalanche } from 'viem/chains';

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

const avalancheFuji = {
  id: 43113,
  name: 'Avalanche Fuji',
  network: 'avalanche-fuji',
  nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://api.avax-test.network/ext/bc/C/rpc'] },
    public: { http: ['https://api.avax-test.network/ext/bc/C/rpc'] },
  },
  blockExplorers: {
    default: { 
      name: 'SnowTrace', 
      url: 'https://testnet.snowtrace.io' 
    },
  },
  testnet: true,
};

const CHAINS = {
  'polygon-amoy': polygonAmoy,
  'polygon-mumbai': polygonAmoy,
  'polygon-mainnet': polygon,
  'sepolia': sepolia,
  'mainnet': mainnet,
  'avalanche': avalancheFuji,
  'avalanche-fuji': avalancheFuji,
};

const RPC_URLS = {
  'polygon-amoy': process.env.POLYGON_AMOY_RPC_URL || 'https://rpc-amoy.polygon.technology/',
  'polygon-mumbai': process.env.POLYGON_AMOY_RPC_URL || 'https://rpc-amoy.polygon.technology/',
  'polygon-mainnet': process.env.POLYGON_MAINNET_RPC_URL,
  'sepolia': process.env.SEPOLIA_RPC_URL,
  'mainnet': process.env.MAINNET_RPC_URL,
  'avalanche': process.env.AVALANCHE_FUJI_RPC_URL || 'https://api.avax-test.network/ext/bc/C/rpc',
  'avalanche-fuji': process.env.AVALANCHE_FUJI_RPC_URL || 'https://api.avax-test.network/ext/bc/C/rpc',
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
    throw new Error(`Failed to get contract info: ${error.message}`);
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
    throw new Error(`Failed to get balance: ${error.message}`);
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

/**
 * Deploys a contract using the configured private key
 * @param {string} abi - Contract ABI
 * @param {string} bytecode - Contract bytecode
 * @param {Array} args - Constructor arguments
 * @param {string} network - Network key (default: polygon-amoy)
 */
export async function deployContract(abi, bytecode, args = [], network = 'polygon-amoy') {
  const chain = getChain(network);
  const rpcUrl = getRPCUrl(network);
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY;

  if (!privateKey) {
    throw new Error('DEPLOYER_PRIVATE_KEY is not set');
  }

  // Ensure private key has 0x prefix
  const formattedPrivateKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
  const account = privateKeyToAccount(formattedPrivateKey);

  const publicClient = createPublicClient({
    chain,
    transport: http(rpcUrl)
  });

  const walletClient = createWalletClient({
    account,
    chain,
    transport: http(rpcUrl)
  });

  try {
    console.log(`Starting deployment on ${chain.name}...`);
    
    const hash = await walletClient.deployContract({
      abi,
      bytecode,
      args
    });

    console.log(`Transaction submitted: ${hash}`);

    const receipt = await publicClient.waitForTransactionReceipt({ 
      hash,
      confirmations: 1 
    });

    console.log(`Deployment successful! Address: ${receipt.contractAddress}`);

    return {
      success: true,
      address: receipt.contractAddress,
      transactionHash: hash,
      blockNumber: receipt.blockNumber.toString(),
      explorerUrl: `${chain.blockExplorers.default.url}/tx/${hash}`,
      status: receipt.status
    };
  } catch (error) {
    console.error('Deployment execution error:', error);
    const parsed = parseBlockchainError(error);
    throw new Error(parsed);
  }
}

/**
 * Parses complex viem/blockchain errors into human-readable strings
 */
function parseBlockchainError(error) {
  if (!error) return 'Unknown blockchain error';

  // Handle viem BaseError/TransactionExecutionError
  if (error.shortMessage) {
    return error.shortMessage;
  }

  const msg = error.message || '';
  
  if (msg.includes('insufficient funds')) {
    const deployer = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
    return `Insufficient funds: The backend deployer (${deployer}) needs MATIC for gas. Please fund it or update DEPLOYER_PRIVATE_KEY in .env`;
  }

  if (msg.includes('gas required exceeds allowance') || msg.includes('intrinsic gas too low')) {
    return 'Gas error: The transaction requires more gas than provided or allowed.';
  }

  if (msg.includes('nonce too low')) {
    return 'Transaction sync error: The deployer nonce is out of sync. Please wait a moment and try again.';
  }

  if (msg.includes('user rejected')) {
    return 'Transaction rejected by signer.';
  }

  // Fallback to the first line of the message if it's too long
  return msg.split('\n')[0] || 'Blockchain deployment failed';
}
