import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'RealFlow Studio API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      ai: '/api/ai/generate-code, /api/ai/optimize',
      ipfs: '/api/ipfs/upload, /api/ipfs/metadata/:cid',
      web3: '/api/web3/contract/:address, /api/web3/balance/:address'
    }
  });
});

export { router as healthRouter };
