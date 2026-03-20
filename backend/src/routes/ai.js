import { Router } from 'express';
import { z } from 'zod';
import { generateCode, optimizeCode, getVibeSuggestion } from '../services/ai.js';

const router = Router();

const generateCodeSchema = z.object({
  description: z.string().min(10).max(2000),
  contractType: z.enum(['token', 'marketplace', 'custom']).optional(),
  vibeMode: z.boolean().optional()
});

const optimizeSchema = z.object({
  code: z.string().min(10),
  optimizationType: z.enum(['gas', 'security', 'readability', 'all']).optional()
});

router.post('/generate-code', async (req, res, next) => {
  try {
    const { description, contractType, vibeMode } = generateCodeSchema.parse(req.body);
    const code = await generateCode({ description, contractType, vibeMode });
    res.json({ success: true, code });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    next(error);
  }
});

router.post('/optimize', async (req, res, next) => {
  try {
    const { code, optimizationType } = optimizeSchema.parse(req.body);
    const optimized = await optimizeCode({ code, optimizationType });
    res.json({ success: true, code: optimized });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    next(error);
  }
});

router.get('/vibe-suggestion/:theme', async (req, res, next) => {
  try {
    const { theme } = req.params;
    const suggestion = await getVibeSuggestion(theme);
    res.json({ success: true, suggestion });
  } catch (error) {
    next(error);
  }
});

export { router as aiRouter };
