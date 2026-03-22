import { Router } from 'express';
import { z } from 'zod';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { deployContract } from '../services/web3.js';
import { privateKeyToAccount } from 'viem/accounts';
import { http, createPublicClient, createWalletClient } from 'viem';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Calculate root directory - go up from backend/src/routes to project root
// This handles both local development and production (Render) environments
function getRootDir() {
  // If we're in the backend directory or a subdirectory
  if (__dirname.includes('/backend/') || __dirname.includes('\\backend\\')) {
    // Go up from backend/src/routes to project root
    // backend/src/routes -> backend/src -> backend -> project root (3 levels up from routes)
    return path.resolve(__dirname, '../../..');
  }
  
  // Check if we're in src directory (another possible structure)
  if (__dirname.includes('/src/') || __dirname.includes('\\src\\')) {
    return path.resolve(__dirname, '../..');
  }
  
  // Fallback to current working directory
  return process.cwd();
}

const rootDir = getRootDir();

const router = Router();

const deploySchema = z.object({
  nodes: z.array(z.object({
    id: z.string(),
    type: z.string().optional(),
    position: z.object({ x: z.number(), y: z.number() }),
    data: z.object({
      label: z.string(),
      componentType: z.string(),
      category: z.string().optional(),
    }).passthrough(),
  })).min(1),
  edges: z.array(z.object({
    id: z.string(),
    source: z.string(),
    target: z.string(),
  })).optional(),
  components: z.array(z.string()).optional(),
  owner: z.string().optional(),
  name: z.string().optional().default("RealFlow Marketplace"),
  network: z.enum(['polygon', 'avalanche']).optional().default('polygon'),
});

router.post('/', async (req, res, next) => {
  try {
     const { nodes, edges, components, owner, name, network } = deploySchema.parse(req.body);

    const nodeTypes = [...new Set(nodes.map((n) => n.data?.componentType))];
    const hasMint = nodeTypes.includes('mintButton');
    const hasListing = nodeTypes.includes('listingGrid');
    const hasBuy = nodeTypes.includes('buyButton');
    const hasUpload = nodeTypes.includes('assetUpload');

    const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
    const existingContractAddress = network === 'avalanche' 
      ? process.env.AVALANCHE_CONTRACT_ADDRESS 
      : process.env.MARKETPLACE_CONTRACT_ADDRESS;

    if (!privateKey) {
      return res.status(500).json({
        success: false,
        error: 'Deployment not configured: DEPLOYER_PRIVATE_KEY not set',
      });
    }

     const deployData = {
       components: nodeTypes,
       hasMint,
       hasListing,
       hasBuy,
       hasUpload,
       metadata: {
         nodeCount: nodes.length,
         edgeCount: edges?.length || 0,
         timestamp: new Date().toISOString(),
       },
       name: name || "RealFlow Marketplace",
     };

    // If we have an existing contract address, we just return it (historical behavior)
    if (existingContractAddress) {
      return res.json({
        success: true,
        address: existingContractAddress,
        type: 'existing',
        message: 'Using existing marketplace contract',
        config: deployData,
      });
    }

    // REAL DEPLOYMENT LOGIC
    try {
      // 1. Load RWATokenizer artifact
      console.log(`Root directory: ${rootDir}`);
      const tokenizerPath = path.join(rootDir, 'src/out/RWATokenizer.sol/RWATokenizer.json');
      console.log(`Tokenizer path: ${tokenizerPath}`);
      if (!fs.existsSync(tokenizerPath)) {
        throw new Error(`Tokenizer artifact not found at ${tokenizerPath}. Please run 'forge build' in the contracts directory.`);
      }
      const tokenizerArtifact = JSON.parse(fs.readFileSync(tokenizerPath, 'utf8'));

      // 2. Load MarketplaceFactory artifact
      const factoryPath = path.join(rootDir, 'src/out/MarketplaceFactory.sol/MarketplaceFactory.json');
      if (!fs.existsSync(factoryPath)) {
        throw new Error(`Factory artifact not found at ${factoryPath}. Please run 'forge build' in the contracts directory.`);
      }
      const factoryArtifact = JSON.parse(fs.readFileSync(factoryPath, 'utf8'));

       const formattedPrivateKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
       const account = privateKeyToAccount(formattedPrivateKey);

       console.log(`Deploying marketplace system with account: ${account.address} on ${network || 'polygon'}`);

       // Define chain configurations for supported networks
       const networks = {
         polygon: {
           chain: {
             id: 80002,
             name: 'Polygon Amoy',
             network: 'polygon-amoy',
             nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
             rpcUrls: {
               default: { http: [process.env.POLYGON_AMOY_RPC_URL || 'https://rpc-amoy.polygon.technology/'] },
               public: { http: [process.env.POLYGON_AMOY_RPC_URL || 'https://rpc-amoy.polygon.technology/'] },
             },
             blockExplorers: {
               default: { 
                 name: 'PolygonScan', 
                 url: 'https://amoy.polygonscan.com' 
               },
             },
             testnet: true,
           },
           rpcUrl: process.env.POLYGON_AMOY_RPC_URL || 'https://rpc-amoy.polygon.technology/',
           explorerName: 'Polygonscan',
           explorerBaseUrl: 'https://amoy.polygonscan.com',
         },
         avalanche: {
           chain: {
             id: 43113,
             name: 'Avalanche Fuji',
             network: 'avalanche-fuji',
             nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
             rpcUrls: {
               default: { http: [process.env.AVALANCHE_FUJI_RPC_URL || 'https://api.avax-test.network/ext/bc/C/rpc'] },
               public: { http: [process.env.AVALANCHE_FUJI_RPC_URL || 'https://api.avax-test.network/ext/bc/C/rpc'] },
             },
             blockExplorers: {
               default: { 
                 name: 'SnowTrace', 
                 url: 'https://testnet.snowtrace.io' 
               },
             },
             testnet: true,
           },
           rpcUrl: process.env.AVALANCHE_FUJI_RPC_URL || 'https://api.avax-test.network/ext/bc/C/rpc',
           explorerName: 'SnowTrace',
           explorerBaseUrl: 'https://testnet.snowtrace.io',
         },
       };

       const selectedNetwork = networks[network || 'polygon'];
       const { chain, rpcUrl, explorerName, explorerBaseUrl } = selectedNetwork;

       const publicClient = createPublicClient({
         chain,
         transport: http(rpcUrl)
       });

       const walletClient = createWalletClient({
         account,
         chain,
         transport: http(rpcUrl)
       });

         // 3. Deploy Tokenizer (Implementation)
         const tokenizerResult = await deployContract(
           tokenizerArtifact.abi,
           tokenizerArtifact.bytecode.object,
           ['https://api.realflow.io/metadata/', owner || account.address],
           network || 'polygon'
         );

         console.log(`Tokenizer deployed at: ${tokenizerResult.address}`);

         // 4. Deploy Factory (constructor only needs token implementation address)
         const factoryResult = await deployContract(
           factoryArtifact.abi,
           factoryArtifact.bytecode.object,
           [tokenizerResult.address],
           network || 'polygon'
         );

        console.log(`Factory deployed at: ${factoryResult.address}`);

        // 5. Use the factory to create a marketplace instance with the specified name
        // We need to make a contract call to createMarketplace on the deployed factory
        console.log(`Creating marketplace with name: "${name || "RealFlow Marketplace"}"`);

        // Execute the createMarketplace transaction
        const createMarketplaceHash = await walletClient.writeContract({
          address: factoryResult.address,
          abi: factoryArtifact.abi,
          functionName: 'createMarketplace',
          args: [name || "RealFlow Marketplace"],
        });

        console.log(`Marketplace creation transaction submitted: ${createMarketplaceHash}`);

        // Wait for the transaction to be mined
        console.log(`Waiting for marketplace creation transaction to be mined...`);
        const createMarketplaceReceipt = await publicClient.waitForTransactionReceipt({
          hash: createMarketplaceHash,
          confirmations: 1
        });

        console.log(`Marketplace creation receipt:`, createMarketplaceReceipt);
        
        // The createMarketplace function should return the address of the created marketplace
        // However, if the contractAddress is null, we need to check the logs or try another approach
        let marketplaceAddress = createMarketplaceReceipt.contractAddress;
        
        // If contractAddress is null, the marketplace address might be in the logs or we need to check the factory
        if (!marketplaceAddress) {
          console.log(`Contract address is null in receipt, checking logs or making a view call...`);
          
          // Try to get the latest marketplace from the factory
          try {
            const marketplaceCount = await publicClient.readContract({
              address: factoryResult.address,
              abi: factoryArtifact.abi,
              functionName: 'getMarketplaceCount'
            });
            
            console.log(`Marketplace count: ${marketplaceCount}`);
            
            if (marketplaceCount > 0) {
              const latestMarketplace = await publicClient.readContract({
                address: factoryResult.address,
                abi: factoryArtifact.abi,
                functionName: 'getMarketplace',
                args: [marketplaceCount - 1n] // Get the last one (0-indexed)
              });
              
              console.log(`Latest marketplace from factory: ${latestMarketplace}`);
              marketplaceAddress = latestMarketplace;
            }
          } catch (readError) {
            console.log(`Error reading from factory:`, readError);
          }
        }

        console.log(`Marketplace created at: ${marketplaceAddress}`);

        return {
          success: true,
          address: marketplaceAddress || factoryResult.address,
          transactionHash: createMarketplaceHash,
          tokenizerAddress: tokenizerResult.address,
          factoryAddress: factoryResult.address,
          type: 'real',
          network: network || 'polygon',
          message: `Deployment successful! Marketplace deployed to ${chain.name}.`,
          explorerUrl: `${explorerBaseUrl}/tx/${createMarketplaceHash}`,
          explorerBaseUrl: explorerBaseUrl,
          explorerName: explorerName,
          status: createMarketplaceReceipt.status
        };

      // Prepare response data
      const responseData = {
        success: true,
        address: factoryResult.address,
        transactionHash: factoryResult.transactionHash,
        tokenizerAddress: tokenizerResult.address,
        type: 'real',
        network: network || 'polygon',
        message: `Deployment successful! Marketplace Factory deployed to ${chain.name}.`,
        explorerUrl: factoryResult.explorerUrl,
        explorerBaseUrl: explorerBaseUrl,
        explorerName: explorerName,
        config: deployData,
        name: name || "RealFlow Marketplace",
      };

     // Attempt contract verification if API key is available
      const verificationApiKey = network === 'avalanche' 
        ? process.env.SNOWTRACE_API_KEY 
        : process.env.POLYGONSCAN_API_KEY;
      const verificationApiBase = network === 'avalanche'
        ? 'https://api-testnet.snowtrace.io/api'
        : 'https://api.polygonscan.com/api';
      
      if (verificationApiKey) {
        try {
          const verificationResponse = await fetch(
            `${verificationApiBase}?module=contract&action=verifysourcecode&address=${factoryResult.address}&apikey=${verificationApiKey}`
          );
          const verificationData = await verificationResponse.json();
          
          if (verificationData.status === '1' && verificationData.message.includes('Pass')) {
            responseData.verified = true;
            responseData.verificationMessage = `Contract source code verified on ${explorerName}`;
          } else {
            responseData.verified = false;
            responseData.verificationMessage = verificationData.result || 'Verification submitted, pending...';
          }
        } catch (verificationError) {
          console.log('Verification attempt failed:', verificationError);
          responseData.verified = false;
          responseData.verificationMessage = 'Verification could not be completed automatically';
        }
      }

     res.json(responseData);

    } catch (deployError) {
      console.error('Deployment flow failed:', deployError);
      res.status(500).json({
        success: false,
        error: deployError.message,
        details: 'Failed during blockchain deployment steps'
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: 'Invalid deployment data',
        details: error.errors,
      });
    }
    next(error);
  }
});

router.get('/artifacts', async (req, res, next) => {
  try {
    // 1. Load RWATokenizer artifact
    const tokenizerPath = path.join(rootDir, 'src/out/RWATokenizer.sol/RWATokenizer.json');
    if (!fs.existsSync(tokenizerPath)) {
      return res.status(404).json({ success: false, error: 'Tokenizer artifact not found' });
    }
    const tokenizerArtifact = JSON.parse(fs.readFileSync(tokenizerPath, 'utf8'));

    // 2. Load MarketplaceFactory artifact
    const factoryPath = path.join(rootDir, 'src/out/MarketplaceFactory.sol/MarketplaceFactory.json');
    if (!fs.existsSync(factoryPath)) {
      return res.status(404).json({ success: false, error: 'Factory artifact not found' });
    }
    const factoryArtifact = JSON.parse(fs.readFileSync(factoryPath, 'utf8'));

    res.json({
      success: true,
      tokenizer: {
        abi: tokenizerArtifact.abi,
        bytecode: tokenizerArtifact.bytecode.object,
      },
      factory: {
        abi: factoryArtifact.abi,
        bytecode: factoryArtifact.bytecode.object,
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get('/status/:address', async (req, res, next) => {
  try {
    const { address } = req.params;

    if (!address || !address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid contract address',
      });
    }

    const rpcUrl = process.env.RPC_URL || 'https://rpc-amoy.polygon.technology';
    const apiKey = process.env.POLYGONSCAN_API_KEY;

    const verificationStatus = {
      address,
      verified: false,
      sourceCode: null,
      compilerVersion: null,
      license: null,
    };

    if (apiKey) {
      try {
        const verifyResponse = await fetch(
          `https://api.polygonscan.com/api?module=contract&action=getsourcecode&address=${address}&apikey=${apiKey}`
        );
        const verifyData = await verifyResponse.json();

        if (verifyData.status === '1' && verifyData.result[0]) {
          const result = verifyData.result[0];
          verificationStatus.verified = true;
          verificationStatus.sourceCode = result.SourceCode;
          verificationStatus.compilerVersion = result.CompilerVersion;
          verificationStatus.license = result.LicenseType;
        }
      } catch (err) {
        console.error('Verification check failed:', err);
      }
    }

    res.json({
      success: true,
      ...verificationStatus,
    });
  } catch (error) {
    next(error);
  }
});

export { router as deployRouter };
