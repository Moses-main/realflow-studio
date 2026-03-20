import { Router } from 'express';
import { z } from 'zod';
import { uploadToIPFS, getFromIPFS, pinMetadata } from '../services/ipfs.js';

const router = Router();

const uploadSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(2000).optional(),
  image: z.string().optional(),
  properties: z.record(z.any()).optional(),
  assetType: z.enum(['real_estate', 'art', 'commodity', 'ip', 'other']).optional()
});

// CID v0 and v1 regex pattern
const cidSchema = z.string().regex(/^(Qm[a-zA-Z0-9]{44}|baf[a-zA-Z0-9]{56})$/);

const cidParamsSchema = z.object({
  cid: cidSchema
});

router.post('/upload', async (req, res, next) => {
  try {
    const data = uploadSchema.parse(req.body);
    const result = await uploadToIPFS(data);
    res.json({ success: true, ...result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    next(error);
  }
});

router.get('/metadata/:cid', async (req, res, next) => {
  try {
    const { cid } = cidParamsSchema.parse(req.params);
    const metadata = await getFromIPFS(cid);
    res.json({ success: true, metadata });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid CID format', details: error.errors });
    }
    next(error);
  }
});

router.post('/pin/:cid', async (req, res, next) => {
  try {
    const { cid } = cidParamsSchema.parse(req.params);
    const result = await pinMetadata(cid);
    res.json({ success: true, result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid CID format', details: error.errors });
    }
    next(error);
  }
});

export { router as ipfsRouter };
