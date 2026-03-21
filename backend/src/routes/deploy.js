import { Router } from 'express';
import { z } from 'zod';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { deployContract } from '../services/web3.js';
import { privateKeyToAccount } from 'viem/accounts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
});

router.post('/', async (req, res, next) => {
  try {
    const { nodes, edges, components, owner } = deploySchema.parse(req.body);

    const nodeTypes = [...new Set(nodes.map((n) => n.data?.componentType))];
    const hasMint = nodeTypes.includes('mintButton');
    const hasListing = nodeTypes.includes('listingGrid');
    const hasBuy = nodeTypes.includes('buyButton');
    const hasUpload = nodeTypes.includes('assetUpload');

    const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
    const existingContractAddress = process.env.MARKETPLACE_CONTRACT_ADDRESS;

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
      const rootDir = path.resolve(__dirname, '../../../');
      
      // 1. Load RWATokenizer artifact
      const tokenizerPath = path.join(rootDir, 'contracts/out/RWATokenizer.sol/RWATokenizer.json');
      if (!fs.existsSync(tokenizerPath)) {
        throw new Error(`Tokenizer artifact not found at ${tokenizerPath}. Please run 'forge build' in the contracts directory.`);
      }
      const tokenizerArtifact = JSON.parse(fs.readFileSync(tokenizerPath, 'utf8'));

      // 2. Load MarketplaceFactory artifact
      const factoryPath = path.join(rootDir, 'contracts/out/MarketplaceFactory.sol/MarketplaceFactory.json');
      if (!fs.existsSync(factoryPath)) {
        throw new Error(`Factory artifact not found at ${factoryPath}. Please run 'forge build' in the contracts directory.`);
      }
      const factoryArtifact = JSON.parse(fs.readFileSync(factoryPath, 'utf8'));

      const formattedPrivateKey = privateKey.startsWith('0x') ? privateKey : `0x${privateKey}`;
      const account = privateKeyToAccount(formattedPrivateKey);

      console.log(`Deploying marketplace system with account: ${account.address}`);

      // 3. Deploy Tokenizer (Implementation)
      const tokenizerResult = await deployContract(
        tokenizerArtifact.abi,
        tokenizerArtifact.bytecode.object,
        ['https://api.realflow.io/metadata/', owner || account.address]
      );

      console.log(`Tokenizer deployed at: ${tokenizerResult.address}`);

      // 4. Deploy Factory
      const factoryResult = await deployContract(
        factoryArtifact.abi,
        factoryArtifact.bytecode.object,
        [tokenizerResult.address]
      );

      console.log(`Factory deployed at: ${factoryResult.address}`);

      res.json({
        success: true,
        address: factoryResult.address,
        transactionHash: factoryResult.transactionHash,
        tokenizerAddress: tokenizerResult.address,
        type: 'real',
        message: 'Deployment successful! Marketplace Factory deployed to Polygon Amoy.',
        explorerUrl: factoryResult.explorerUrl,
        config: deployData,
      });

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
    const rootDir = path.resolve(__dirname, '../../../');
    
    // 1. Load RWATokenizer artifact
    const tokenizerPath = path.join(rootDir, 'contracts/out/RWATokenizer.sol/RWATokenizer.json');
    if (!fs.existsSync(tokenizerPath)) {
      return res.status(404).json({ success: false, error: 'Tokenizer artifact not found' });
    }
    const tokenizerArtifact = JSON.parse(fs.readFileSync(tokenizerPath, 'utf8'));

    // 2. Load MarketplaceFactory artifact
    const factoryPath = path.join(rootDir, 'contracts/out/MarketplaceFactory.sol/MarketplaceFactory.json');
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
