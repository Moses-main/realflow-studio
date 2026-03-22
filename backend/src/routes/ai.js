import { Router } from 'express';
import { z } from 'zod';
import { generateCode, optimizeCode, analyzeCode, chat, getVibeSuggestion } from '../services/ai.js';

const router = Router();

const generateCodeSchema = z.object({
  description: z.string().min(1).max(2000),
  contractType: z.enum(['token', 'marketplace', 'auction', 'custom']).optional(),
  vibeMode: z.boolean().optional()
});

const optimizeSchema = z.object({
  code: z.string().min(10),
  optimizationType: z.enum(['gas', 'security', 'readability', 'all']).optional()
});

const analyzeSchema = z.object({
  code: z.string().min(10)
});

const chatSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string()
  })).min(1),
  vibeMode: z.boolean().optional()
});

router.post('/generate-code', async (req, res, next) => {
  try {
    const { description, contractType, vibeMode } = generateCodeSchema.parse(req.body);
    const result = await generateCode({ description, contractType, vibeMode });
    res.json({ success: true, ...result });
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
    const result = await optimizeCode({ code, optimizationType });
    res.json({ success: true, ...result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    next(error);
  }
});

router.post('/analyze', async (req, res, next) => {
  try {
    const { code } = analyzeSchema.parse(req.body);
    const result = await analyzeCode({ code });
    res.json({ success: true, ...result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    next(error);
  }
});

router.post('/chat', async (req, res, next) => {
  try {
    const { messages, vibeMode } = chatSchema.parse(req.body);
    const result = await chat({ messages, vibeMode });
    res.json({ success: true, ...result });
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

router.get('/capabilities', async (req, res) => {
  const openAiKey = process.env.OPENAI_API_KEY;
  const hasOpenAI = openAiKey && openAiKey !== 'YOUR_API_KEY' && openAiKey !== '';
  
  res.json({
    success: true,
    capabilities: {
      codeGeneration: true,
      codeOptimization: true,
      codeAnalysis: true,
      aiChat: true,
      vibeThemes: true,
      components: Object.keys({
        assetUpload: true,
        mintButton: true,
        listingGrid: true,
        nftPreview: true,
        assetDetails: true,
        carousel: true,
        buyButton: true,
        pricingOracle: true,
        analytics: true,
        auction: true,
        offer: true,
        fractional: true,
        royalties: true,
        transfer: true,
        walletConnect: true,
        qrCode: true,
        networkStatus: true,
        countdown: true,
        notifications: true,
        lockup: true,
      })
    },
    aiPowered: hasOpenAI,
    model: hasOpenAI ? 'gpt-4-turbo-preview' : 'template-based'
  });
});

export { router as aiRouter };
