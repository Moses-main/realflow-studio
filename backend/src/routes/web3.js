import { Router } from 'express';
import { z } from 'zod';
import { 
  getContractInfo, 
  getTokenBalance, 
  estimateDeploymentGas,
  getMarketplaceFactory
} from '../services/web3.js';

const router = Router();

const contractInfoSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  network: z.enum(['polygon-mumbai', 'polygon-mainnet', 'sepolia']).optional()
});

const balanceSchema = z.object({
  address: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  tokenAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  network: z.enum(['polygon-mumbai', 'polygon-mainnet', 'sepolia']).optional()
});

router.get('/contract/:address', async (req, res, next) => {
  try {
    const { address } = contractInfoSchema.parse({
      address: req.params.address,
      network: req.query.network
    });
    const info = await getContractInfo(address, req.query.network);
    res.json({ success: true, ...info });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid address', details: error.errors });
    }
    next(error);
  }
});

router.get('/balance/:address', async (req, res, next) => {
  try {
    const { address } = balanceSchema.parse({
      address: req.params.address,
      tokenAddress: req.query.token,
      network: req.query.network
    });
    const balance = await getTokenBalance(address, req.query.token, req.query.network);
    res.json({ success: true, balance });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid address', details: error.errors });
    }
    next(error);
  }
});

router.get('/factory', async (req, res, next) => {
  try {
    const factory = getMarketplaceFactory();
    res.json({ success: true, ...factory });
  } catch (error) {
    next(error);
  }
});

router.post('/estimate-deployment', async (req, res, next) => {
  try {
    const { contractType } = req.body;
    const estimate = await estimateDeploymentGas(contractType);
    res.json({ success: true, ...estimate });
  } catch (error) {
    next(error);
  }
});

export { router as web3Router };
