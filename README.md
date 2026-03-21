# RealFlow Studio

![Aleph Hackathon 2026](https://img.shields.io/badge/Hackathon-Aleph%202026-7C3AED)
![Polygon](https://img.shields.io/badge/Blockchain-Polygon-8247E5)
![AI](https://img.shields.io/badge/AI-OpenAI-10A37F)

**AI-Driven No-Code RWA Marketplace Builder** - Build custom marketplaces for Real-World Assets in minutes, powered by AI.

## Overview

RealFlow Studio enables non-technical users (real estate agents, artists, entrepreneurs) to create and launch custom marketplaces for tokenized RWAs like real estate, art, and commodities. Users can:
- Drag-and-drop to design marketplace UI
- Tokenize assets with AI-generated smart contracts
- Deploy to Polygon in minutes

## Features

### Core Features
- **Drag & Drop Builder** - Visual marketplace designer with React Flow
- **AI-Powered** - Auto-generate Solidity smart contracts with AI
- **RWA Tokenization** - Support for ERC-721 and ERC-1155 tokens
- **Instant Deploy** - Launch on Polygon in minutes

### AI Features
- **Code Generation** - Generate smart contracts from natural language
- **Creative Mode** - Themed UI generation (Luxury, Modern, Playful, Nature, Dark)
- **Vibe Suggestions** - Fun, playful code comments and themes

### Tech Stack
- **Frontend**: React, TypeScript, Vite, TailwindCSS, React Flow
- **Backend**: Express.js, Node.js
- **Smart Contracts**: Solidity, OpenZeppelin, Foundry
- **Blockchain**: Polygon Amoy (chain ID: 80002)
- **AI**: OpenAI GPT-4
- **Storage**: IPFS via Pinata

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- MetaMask or WalletConnect wallet

### Frontend Setup
```bash
# Install dependencies
npm install

# Create .env.local (see .env.example)
cp .env.example .env.local

# Start development server
npm run dev
```

### Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env (see .env.example)
cp .env.example .env

# Start server
npm run dev
```

### Environment Variables

#### Frontend (.env.local)
```env
VITE_PRIVY_APP_ID=your_privy_app_id
VITE_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id
VITE_API_URL=http://localhost:5000
```

#### Backend (.env)
```env
PORT=5000
OPENAI_API_KEY=your_openai_api_key
PINATA_API_KEY=your_pinata_api_key
PINATA_API_SECRET=your_pinata_api_secret
POLYGON_AMOY_RPC_URL=https://polygon-amoy.infura.io/v3/your_project_id
```

## Project Structure

```
realflow-studio/
├── src/                    # React frontend
│   ├── components/         # UI components
│   │   ├── builder/       # Drag-drop builder components
│   │   ├── ai/           # AI components
│   │   └── ui/           # Shadcn/ui components
│   ├── hooks/             # React hooks
│   ├── pages/             # Page components
│   └── services/          # API services
├── backend/               # Express backend
│   └── src/
│       ├── routes/        # API routes
│       └── services/      # Business logic
├── contracts/             # Solidity contracts
└── docs/                  # Documentation
```

## API Endpoints

### Health
```
GET /api/health
```

### AI
```
POST /api/ai/generate-code   # Generate Solidity code
POST /api/ai/optimize        # Optimize existing code
GET  /api/ai/vibe-suggestion # Get theme suggestions
```

### IPFS
```
POST /api/ipfs/upload        # Upload metadata
GET  /api/ipfs/metadata/:cid # Get metadata
POST /api/ipfs/pin/:cid      # Pin content
```

### Web3
```
GET /api/web3/contract/:address  # Get contract info
GET /api/web3/balance/:address   # Get token balance
GET /api/web3/factory             # Get factory info
POST /api/web3/estimate-deployment # Estimate gas
```

## Testing

```bash
# Frontend tests
npm run test

# Backend tests
cd backend && npm test
```

## Demo Flow

1. **Login** - Connect wallet or sign up with email
2. **Build** - Drag components to design marketplace
3. **AI Assist** - Generate contracts with AI
4. **Deploy** - One-click deploy to Polygon
5. **Trade** - Start trading tokenized assets

## Deployed Contracts (Polygon Amoy Testnet)

### RWATokenizer
- **Address**: [0xc9497Ec40951FbB98C02c666b7F9Fa143678E2Be](https://amoy.polygonscan.com/address/0xc9497Ec40951FbB98C02c666b7F9Fa143678E2Be)
- **Purpose**: ERC-1155 token for fractional RWA minting

### MarketplaceFactory
- **Address**: [0x802A6843516f52144b3F1D04E5447A085d34aF37](https://amoy.polygonscan.com/address/0x802A6843516f52144b3F1D04E5447A085d34aF37)
- **Purpose**: Factory for cloning RWA tokenizers

## Hackathon

Built for **Aleph Hackathon 2026** - AI + RWA Track.

## License

MIT
