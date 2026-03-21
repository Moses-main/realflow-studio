import { Router } from 'express';
import { z } from 'zod';
import { 
  getContractInfo, 
  getTokenBalance, 
  estimateDeploymentGas,
  getMarketplaceFactory
} from '../services/web3.js';

const router = Router();

const addressSchema = z.string().regex(/^0x[a-fA-F0-9]{40}$/);

const networkSchema = z.enum([
  'polygon-amoy', 
  'polygon-mainnet', 
  'ethereum-sepolia', 
  'ethereum-mainnet',
  'arbitrum-sepolia',
  'arbitrum-mainnet',
  'base-sepolia',
  'base-mainnet'
]).default('polygon-amoy').optional();

const contractInfoSchema = z.object({
  address: addressSchema,
  network: networkSchema
});

const balanceSchema = z.object({
  address: addressSchema,
  tokenAddress: addressSchema.optional(),
  network: networkSchema
});

const estimateDeploymentSchema = z.object({
  contractType: z.enum(['token', 'marketplace', 'factory', 'custom'])
});

router.get('/contract/:address', async (req, res, next) => {
  try {
    const { address, network } = contractInfoSchema.parse({
      address: req.params.address,
      network: req.query.network
    });
    const info = await getContractInfo(address, network);
    res.json({ success: true, ...info });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid address or network', details: error.errors });
    }
    next(error);
  }
});

router.get('/balance/:address', async (req, res, next) => {
  try {
    const { address, tokenAddress, network } = balanceSchema.parse({
      address: req.params.address,
      tokenAddress: req.query.token,
      network: req.query.network
    });
    const balance = await getTokenBalance(address, tokenAddress, network);
    res.json({ success: true, balance });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid address or network', details: error.errors });
    }
    next(error);
  }
});

router.get('/factory', async (req, res) => {
  const factory = getMarketplaceFactory();
  res.json({ success: true, ...factory });
});

router.post('/estimate-deployment', async (req, res, next) => {
  try {
    const parsed = estimateDeploymentSchema.parse(req.body);
    const estimate = await estimateDeploymentGas(parsed.contractType);
    res.json({ success: true, ...estimate });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid contract type', details: error.errors });
    }
    next(error);
  }
});

export { router as web3Router };
