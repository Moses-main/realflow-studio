# RealFlow Studio Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Pages     │  │  Components │  │        Hooks            │  │
│  │  - Index    │  │  - Builder  │  │  - useAuth              │  │
│  │  - Dashboard│  │  - AI       │  │  - useAI                 │  │
│  │  - Builder  │  │  - UI       │  │  - useToast              │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
│         │                │                    │                 │
│         └────────────────┼────────────────────┘                 │
│                          │                                      │
│  ┌───────────────────────┴───────────────────────────────────┐  │
│  │                   React Flow Canvas                        │  │
│  │   ┌──────────┐     ┌──────────┐     ┌──────────┐          │  │
│  │   │ Asset    │────▶│ Token   │────▶│ Listing  │          │  │
│  │   │ Upload   │     │ Mint     │     │ Grid     │          │  │
│  │   └──────────┘     └──────────┘     └──────────┘          │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │ HTTP
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (Express)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │    Routes    │  │   Services   │  │   Middleware │          │
│  │  - /api/ai   │  │  - AI        │  │  - CORS      │          │
│  │  - /api/ipfs │  │  - IPFS      │  │  - Rate Limit│          │
│  │  - /api/web3 │  │  - Web3      │  │  - Helmet    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   OpenAI API    │  │  IPFS/Pinata    │  │   Polygon RPC    │
│   (Code Gen)    │  │  (Metadata)     │  │   (Blockchain)   │
└─────────────────┘  └─────────────────┘  └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                   SMART CONTRACTS (Solidity)                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐│
│  │ RWATokenizer    │  │ Marketplace     │  │ Marketplace     ││
│  │ (ERC-721/1155)  │  │ Factory         │  │ Contract        ││
│  └─────────────────┘  └─────────────────┘  └─────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

## Component Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Provider Stack                           │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ WagmiConfig (Web3)                                          ││
│  │   └── PrivyProvider (Auth)                                   ││
│  │         └── QueryClient (Data Fetching)                      ││
│  │               └── App                                       ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
User Action → Component → Hook → Service → API → Response → State Update
     │                    │
     ▼                    ▼
  UI Update         Optimistic Update
```

## Key Files

| Path | Description |
|------|-------------|
| `src/main.tsx` | App entry, providers setup |
| `src/App.tsx` | Routes and layout |
| `src/pages/Builder.tsx` | Main builder canvas |
| `src/components/builder/*` | Builder components |
| `src/components/ai/*` | AI integration |
| `src/hooks/useAuth.ts` | Authentication hook |
| `src/hooks/useAI.ts` | AI conversation hook |
| `backend/src/server.js` | Express server |
| `backend/src/routes/*` | API routes |
| `backend/src/services/*` | Business logic |
| `contracts/src/*.sol` | Smart contracts |
