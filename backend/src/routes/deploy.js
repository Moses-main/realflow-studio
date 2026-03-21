import { Router } from 'express';
import { z } from 'zod';

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
});

router.post('/deploy', async (req, res, next) => {
  try {
    const { nodes, edges, components } = deploySchema.parse(req.body);

    const nodeTypes = [...new Set(nodes.map((n) => n.data?.componentType))];
    const hasMint = nodeTypes.includes('mintButton');
    const hasListing = nodeTypes.includes('listingGrid');
    const hasBuy = nodeTypes.includes('buyButton');
    const hasUpload = nodeTypes.includes('assetUpload');

    const rpcUrl = process.env.RPC_URL || process.env.POLYGON_AMOY_RPC || 'https://rpc-amoy.polygon.technology';
    const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
    const contractAddress = process.env.MARKETPLACE_CONTRACT_ADDRESS;

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

    if (contractAddress) {
      return res.json({
        success: true,
        address: contractAddress,
        type: 'existing',
        message: 'Using existing marketplace contract',
        config: deployData,
      });
    }

    res.json({
      success: true,
      address: '0x' + '0'.repeat(40),
      type: 'simulated',
      message: 'Deployment simulated (configure DEPLOYER_PRIVATE_KEY for real deployment)',
      config: deployData,
    });

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
