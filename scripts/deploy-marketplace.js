#!/usr/bin/env node

/**
 * RealFlow Studio - Deploy Real Estate RWA Marketplace
 * Deploys a complete real estate marketplace to Avalanche Fuji testnet
 */

import path from 'path';
import { fileURLToPath } from 'node:url';
import { createPublicClient, createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Deployer private key
const DEPLOYER_PRIVATE_KEY = '0xcb601f9647fa12dea8081b5bfed574f40f4f41996401ea5901bcb314392e90e9';

// Network configuration
const NETWORKS = {
  avalanche: {
    chain: {
      id: 43113,
      name: 'Avalanche Fuji',
      network: 'avalanche-fuji',
      nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
      rpcUrls: {
        default: { http: ['https://api.avax-test.network/ext/bc/C/rpc'] },
        public: { http: ['https://api.avax-test.network/ext/bc/C/rpc'] },
      },
      blockExplorers: {
        default: { name: 'SnowTrace', url: 'https://testnet.snowtrace.io' },
      },
      testnet: true,
    },
    rpcUrl: 'https://api.avax-test.network/ext/bc/C/rpc',
    explorerBaseUrl: 'https://testnet.snowtrace.io',
  },
  polygon: {
    chain: {
      id: 80002,
      name: 'Polygon Amoy',
      network: 'polygon-amoy',
      nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
      rpcUrls: {
        default: { http: ['https://rpc-amoy.polygon.technology/'] },
        public: { http: ['https://rpc-amoy.polygon.technology/'] },
      },
      blockExplorers: {
        default: { name: 'PolygonScan', url: 'https://amoy.polygonscan.com' },
      },
      testnet: true,
    },
    rpcUrl: 'https://rpc-amoy.polygon.technology/',
    explorerBaseUrl: 'https://amoy.polygonscan.com',
  },
};

const MARKETPLACE_NAME = 'Real Estate RWA Marketplace';
const MARKETPLACE_DESCRIPTION = 'Fractional real estate ownership marketplace';
const NETWORK = process.argv[2] || 'avalanche';

async function main() {
  console.log('🚀 RealFlow Studio - Real Estate Marketplace Deployment\n');
  console.log(`Network: ${NETWORK}`);
  console.log(`Marketplace: ${MARKETPLACE_NAME}\n`);

  const config = NETWORKS[NETWORK];
  if (!config) {
    console.error(`❌ Unknown network: ${NETWORK}`);
    console.log('Available networks: avalanche, polygon');
    process.exit(1);
  }

  // Use the hardcoded private key
  const account = privateKeyToAccount(DEPLOYER_PRIVATE_KEY);
  console.log(`Deployer wallet: ${account.address}`);

  // Create clients
  const publicClient = createPublicClient({
    chain: config.chain,
    transport: http(config.rpcUrl),
  });

  const walletClient = createWalletClient({
    account,
    chain: config.chain,
    transport: http(config.rpcUrl),
  });

  // Check balance
  const balance = await publicClient.getBalance({ address: account.address });
  console.log(`Balance: ${Number(balance) / 1e18} ${config.chain.nativeCurrency.symbol}`);
  
  if (balance < BigInt(1e17)) { // Less than 0.1 AVAX/MATIC
    console.error('❌ Insufficient balance. Need at least 0.1 AVAX/MATIC for deployment.');
    process.exit(1);
  }

  // Load artifacts
  const rootDir = path.resolve(__dirname, '..');
  const tokenizerPath = path.join(rootDir, 'src/out/RWATokenizer.sol/RWATokenizer.json');
  const factoryPath = path.join(rootDir, 'src/out/MarketplaceFactory.sol/MarketplaceFactory.json');

  console.log('\n📦 Loading contract artifacts...');
  
  if (!fs.existsSync(tokenizerPath)) {
    console.error(`❌ Tokenizer artifact not found at ${tokenizerPath}`);
    console.log('Run: cd contracts && forge build');
    process.exit(1);
  }

  if (!fs.existsSync(factoryPath)) {
    console.error(`❌ Factory artifact not found at ${factoryPath}`);
    console.log('Run: cd contracts && forge build');
    process.exit(1);
  }

  const tokenizerArtifact = JSON.parse(fs.readFileSync(tokenizerPath, 'utf8'));
  const factoryArtifact = JSON.parse(fs.readFileSync(factoryPath, 'utf8'));
  console.log('✅ Artifacts loaded');

  // Deploy RWATokenizer
  console.log('\n🔨 Deploying RWATokenizer...');
  const tokenizerHash = await walletClient.deployContract({
    abi: tokenizerArtifact.abi,
    bytecode: tokenizerArtifact.bytecode.object,
    args: ['https://api.realflow.io/metadata/', account.address],
  });
  console.log(`   Transaction: ${config.explorerBaseUrl}/tx/${tokenizerHash}`);

  const tokenizerReceipt = await publicClient.waitForTransactionReceipt({ hash: tokenizerHash });
  const tokenizerAddress = tokenizerReceipt.contractAddress;
  console.log(`   ✅ Deployed at: ${tokenizerAddress}`);
  console.log(`   Explorer: ${config.explorerBaseUrl}/address/${tokenizerAddress}`);

  // Deploy MarketplaceFactory
  console.log('\n🏭 Deploying MarketplaceFactory...');
  const factoryHash = await walletClient.deployContract({
    abi: factoryArtifact.abi,
    bytecode: factoryArtifact.bytecode.object,
    args: [tokenizerAddress],
  });
  console.log(`   Transaction: ${config.explorerBaseUrl}/tx/${factoryHash}`);

  const factoryReceipt = await publicClient.waitForTransactionReceipt({ hash: factoryHash });
  const factoryAddress = factoryReceipt.contractAddress;
  console.log(`   ✅ Deployed at: ${factoryAddress}`);
  console.log(`   Explorer: ${config.explorerBaseUrl}/address/${factoryAddress}`);

  // Create marketplace instance
  console.log('\n🏠 Creating marketplace instance...');
  
  // Check if factory has createMarketplace function
  const createMarketplaceFn = factoryArtifact.abi.find(
    f => f.name === 'createMarketplace' && f.type === 'function'
  );

  let marketplaceAddress = factoryAddress;

  if (createMarketplaceFn) {
    try {
      const createHash = await walletClient.writeContract({
        address: factoryAddress,
        abi: factoryArtifact.abi,
        functionName: 'createMarketplace',
        args: [MARKETPLACE_NAME],
      });
      console.log(`   Transaction: ${config.explorerBaseUrl}/tx/${createHash}`);

      const createReceipt = await publicClient.waitForTransactionReceipt({ hash: createHash });
      
      // Try to get marketplace address from logs or contract
      try {
        const marketplaceCount = await publicClient.readContract({
          address: factoryAddress,
          abi: factoryArtifact.abi,
          functionName: 'getMarketplaceCount',
        });
        
        if (marketplaceCount > 0n) {
          marketplaceAddress = await publicClient.readContract({
            address: factoryAddress,
            abi: factoryArtifact.abi,
            functionName: 'getMarketplace',
            args: [marketplaceCount - 1n],
          });
        }
      } catch (e) {
        console.log('   Note: Could not retrieve marketplace instance address from factory');
      }
      
      console.log(`   ✅ Marketplace created successfully`);
    } catch (e) {
      console.log(`   Note: createMarketplace not available or failed: ${e.message}`);
      console.log('   Using factory address as marketplace');
    }
  } else {
    console.log('   Note: Factory does not have createMarketplace function');
    console.log('   Using factory address as marketplace');
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📋 DEPLOYMENT SUMMARY');
  console.log('='.repeat(60));
  console.log(`Network:           ${config.chain.name}`);
  console.log(`RPC URL:           ${config.rpcUrl}`);
  console.log(`Deployer:          ${account.address}`);
  console.log(`RWATokenizer:      ${tokenizerAddress}`);
  console.log(`Factory:           ${factoryAddress}`);
  console.log(`Marketplace:       ${marketplaceAddress}`);
  console.log('='.repeat(60));

  // Save deployment info
  const deploymentInfo = {
    network: NETWORK,
    chainId: config.chain.id,
    chainName: config.chain.name,
    rpcUrl: config.rpcUrl,
    explorerBaseUrl: config.explorerBaseUrl,
    deployer: account.address,
    contracts: {
      RWATokenizer: tokenizerAddress,
      MarketplaceFactory: factoryAddress,
      Marketplace: marketplaceAddress,
    },
    marketplace: {
      name: MARKETPLACE_NAME,
      description: MARKETPLACE_DESCRIPTION,
      createdAt: new Date().toISOString(),
    },
    transactionHashes: {
      tokenizer: tokenizerHash,
      factory: factoryHash,
    },
  };

  const deploymentPath = path.join(rootDir, 'deployment.json');
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`\n💾 Deployment info saved to: ${deploymentPath}`);

  // Update backend .env with contract address
  const envPath = path.join(rootDir, 'backend', '.env');
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  const networkKey = NETWORK === 'avalanche' ? 'AVALANCHE_CONTRACT_ADDRESS' : 'MARKETPLACE_FACTORY_ADDRESS';
  const networkRpcKey = NETWORK === 'avalanche' ? 'AVALANCHE_FUJI_RPC_URL' : 'POLYGON_AMOY_RPC_URL';
  
  // Update or add the contract address
  if (envContent.includes(networkKey)) {
    envContent = envContent.replace(
      new RegExp(`${networkKey}=.*`),
      `${networkKey}=${factoryAddress}`
    );
  } else {
    envContent += `\n${networkKey}=${factoryAddress}`;
  }

  fs.writeFileSync(envPath, envContent);
  console.log(`✅ Updated ${envPath} with contract address`);

  console.log('\n🎉 Deployment complete!\n');
}

main().catch((error) => {
  console.error('\n❌ Deployment failed:');
  console.error(error.message || error);
  process.exit(1);
});
