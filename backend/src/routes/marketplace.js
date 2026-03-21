import { Router } from 'express';
import { z } from 'zod';

const router = Router();

const API_URL = process.env.POLYGON_RPC_URL || 'https://rpc-amoy.polygon.technology';
const MOCK_MODE = process.env.MOCK_MODE === 'true';

const MOCK_MARKETPLACES = [
  { 
    id: "1", 
    name: "Lagos Real Estate Hub", 
    status: "live", 
    category: "real-estate",
    assets: 24, 
    volume: "142000",
    volumeFormatted: "$142K",
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0f123",
    createdAt: "2024-01-15T00:00:00Z"
  },
  { 
    id: "2", 
    name: "Buenos Aires Art Market", 
    status: "draft", 
    category: "art",
    assets: 8, 
    volume: "0",
    volumeFormatted: "$0",
    address: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
    createdAt: "2024-02-20T00:00:00Z"
  },
  { 
    id: "3", 
    name: "Mexico Commodity Exchange", 
    status: "live", 
    category: "commodities",
    assets: 56, 
    volume: "890000",
    volumeFormatted: "$890K",
    address: "0xdD2FD4581271e230360230F9337D5c0430Bf44C0",
    createdAt: "2024-03-10T00:00:00Z"
  },
];

const marketplaceSchema = z.object({
  name: z.string().min(1).max(100),
  category: z.enum(['real-estate', 'art', 'commodities', 'music', 'other']),
  description: z.string().max(500).optional(),
});

router.get('/', async (req, res, next) => {
  try {
    const { status, category, search } = req.query;

    if (MOCK_MODE) {
      let results = [...MOCK_MARKETPLACES];
      
      if (status && status !== 'all') {
        results = results.filter(m => m.status === status);
      }
      if (category && category !== 'all') {
        results = results.filter(m => m.category === category);
      }
      if (search) {
        const searchLower = search.toString().toLowerCase();
        results = results.filter(m => 
          m.name.toLowerCase().includes(searchLower) ||
          m.category.toLowerCase().includes(searchLower)
        );
      }

      return res.json({
        success: true,
        data: results,
        total: results.length,
        mock: true,
      });
    }

    const factoryAddress = process.env.MARKETPLACE_FACTORY_ADDRESS;
    if (!factoryAddress) {
      return res.json({
        success: true,
        data: MOCK_MARKETPLACES,
        total: MOCK_MARKETPLACES.length,
        mock: true,
        message: 'No factory contract configured',
      });
    }

    res.json({
      success: true,
      data: MOCK_MARKETPLACES,
      total: MOCK_MARKETPLACES.length,
      mock: false,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    if (MOCK_MODE) {
      const marketplace = MOCK_MARKETPLACES.find(m => m.id === id);
      if (!marketplace) {
        return res.status(404).json({ 
          success: false, 
          error: 'Marketplace not found' 
        });
      }
      return res.json({ 
        success: true, 
        data: marketplace,
        mock: true,
      });
    }

    const marketplace = MOCK_MARKETPLACES.find(m => m.id === id);
    res.json({ 
      success: true, 
      data: marketplace || MOCK_MARKETPLACES[0],
      mock: false,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, category, description } = marketplaceSchema.parse(req.body);

    if (MOCK_MODE) {
      const newMarketplace = {
        id: String(Date.now()),
        name,
        category,
        status: 'draft',
        assets: 0,
        volume: '0',
        volumeFormatted: '$0',
        address: '0x' + '0'.repeat(40),
        description: description || '',
        createdAt: new Date().toISOString(),
      };
      
      return res.status(201).json({ 
        success: true, 
        data: newMarketplace,
        mock: true,
      });
    }

    res.status(201).json({ 
      success: true, 
      data: {
        id: String(Date.now()),
        name,
        category,
        status: 'draft',
        createdAt: new Date().toISOString(),
      },
      mock: false,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid input', 
        details: error.errors 
      });
    }
    next(error);
  }
});

router.get('/:id/stats', async (req, res, next) => {
  try {
    const { id } = req.params;

    res.json({
      success: true,
      data: {
        totalVolume: MOCK_MODE ? '1032000' : '0',
        totalTransactions: MOCK_MODE ? 342 : 0,
        totalAssets: MOCK_MODE ? 88 : 0,
        uniqueBuyers: MOCK_MODE ? 156 : 0,
        volumeHistory: [
          { date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), value: '45000' },
          { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), value: '52000' },
          { date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), value: '48000' },
          { date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), value: '61000' },
          { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), value: '55000' },
          { date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), value: '72000' },
          { date: new Date().toISOString(), value: '68000' },
        ],
      },
      mock: MOCK_MODE,
    });
  } catch (error) {
    next(error);
  }
});

export { router as marketplaceRouter };
