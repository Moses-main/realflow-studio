# RealFlow Studio Demo Script

## Demo Overview
Build a real estate marketplace in under 10 minutes, tokenize a mock property, and simulate a trade.

## Pre-Demo Checklist
- [ ] Metamask installed with Mumbai MATIC
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Demo wallet with test funds

---

## Step 1: Connect Wallet (30 seconds)

1. Open RealFlow Studio at http://localhost:5173
2. Click "Connect Wallet" in the navigation
3. Select MetaMask or WalletConnect
4. Approve the connection

**Expected:** Wallet address displayed, MATIC balance shown

---

## Step 2: Start Building (1 minute)

1. Click "Start Building" on the homepage
2. View the pre-loaded template (Asset Upload → Token Mint → Listing Grid)
3. Drag new components from the left sidebar:
   - Drag "Asset Upload" to canvas
   - Drag "NFT Preview" to canvas
   - Drag "Buy Button" to canvas

**Expected:** Components appear on canvas, can connect them with arrows

---

## Step 3: AI Code Generation (2 minutes)

1. Open the AI sidebar (right panel)
2. Toggle "Creative Mode" 🔥
3. Type: "Generate a real estate token contract with 5% royalties"
4. View the generated Solidity code
5. Copy the code to clipboard

**Expected:** AI generates contract with vibe comments

---

## Step 4: Customize Theme (1 minute)

1. In Creative Mode, click "Themes" tab
2. Select "Luxury Estate" theme
3. View the color palette
4. Click "Generate CSS" to get theme styles

**Expected:** Theme colors applied, CSS generated

---

## Step 5: Save & Export (30 seconds)

1. Click "Save" button (bottom left)
2. Click "Export" to download JSON config
3. Config saved to localStorage

**Expected:** Toast notification "Saved!", JSON file downloaded

---

## Step 6: Deploy Marketplace (2 minutes)

1. Click "Deploy Marketplace" button
2. Confirm in MetaMask (if prompted)
3. Wait for deployment simulation

**Expected:** Success modal with PolygonScan link

---

## Step 7: View Dashboard (1 minute)

1. Navigate to Dashboard
2. View mock marketplace stats
3. See "New Marketplace" in the table

**Expected:** Dashboard with statistics and marketplace list

---

## Key Features to Highlight

### Authentication
- Email login via Privy
- Wallet connection via WalletConnect
- Seamless Web3 integration

### Drag & Drop Builder
- Visual component palette
- React Flow canvas
- Real-time updates

### AI Integration
- Natural language code generation
- Creative Mode with themed UIs
- Vibe-coded Solidity

### Deployment
- One-click Polygon deploy
- Gas estimation
- Transaction tracking

---

## Troubleshooting

### "Wallet not connecting"
- Check MetaMask is unlocked
- Ensure correct network selected

### "AI not responding"
- Verify backend is running
- Check API_URL in .env.local

### "Build fails"
- Run `npm install`
- Clear localStorage
- Restart dev server

---

## Post-Demo Next Steps

1. Deploy contracts to Mumbai testnet
2. Set up IPFS pinning
3. Configure OpenAI API
4. Customize themes
5. Add real RWA listings
