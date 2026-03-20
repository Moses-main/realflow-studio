# RealFlow Studio Backend API

Backend API for RealFlow Studio - AI-driven RWA Marketplace Builder

## Features

- **AI Code Generation**: Generate Solidity smart contracts with AI
- **IPFS Integration**: Upload and pin asset metadata
- **Web3 Integration**: Query blockchain data and contract info
- **Security**: CORS, rate limiting, helmet security headers

## Setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

## Environment Variables

See `.env.example` for all required variables.

## API Endpoints

### Health Check
```
GET /api/health
```

### AI Endpoints
```
POST /api/ai/generate-code
POST /api/ai/optimize
GET  /api/ai/vibe-suggestion/:theme
```

### IPFS Endpoints
```
POST /api/ipfs/upload
GET  /api/ipfs/metadata/:cid
POST /api/ipfs/pin/:cid
```

### Web3 Endpoints
```
GET /api/web3/contract/:address
GET /api/web3/balance/:address
GET /api/web3/factory
POST /api/web3/estimate-deployment
```

## Testing

```bash
npm test
```
