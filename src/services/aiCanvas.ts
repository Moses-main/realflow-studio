import { type Node } from "@xyflow/react";
import { type PaletteItem } from "@/components/builder/paletteData";

export interface AIComponentSuggestion {
  type: string;
  label: string;
  reason: string;
  confidence: number;
}

export const COMPONENT_KEYWORDS: Record<string, string[]> = {
  assetUpload: ["upload", "asset", "file", "document", "image", "metadata", "ipfs", "minting", "create token"],
  mintButton: ["mint", "tokenize", "create token", "issue", "nft", "erc-1155", "erc-721", "ownership"],
  listingGrid: ["listing", "marketplace", "display", "grid", "showcase", "catalog", "browse", "gallery"],
  nftPreview: ["preview", "view", "display", "show", "image", "media", "visualization", "gallery"],
  assetDetails: ["details", "info", "information", "description", "specifications", "documentation", "report"],
  carousel: ["carousel", "slider", "gallery", "slideshow", "images", "rotate"],
  buyButton: ["buy", "purchase", "trade", "checkout", "pay", "transaction", "acquire"],
  pricingOracle: ["price", "pricing", "oracle", "feed", "valuation", "worth", "cost", "rate", "exchange"],
  analytics: ["analytics", "stats", "statistics", "dashboard", "metrics", "charts", "data", "insights"],
  auction: ["auction", "bid", "bidding", "gavel", "timed sale", "highest bidder"],
  offer: ["offer", "bid", "proposal", "negotiate", "counter", "make offer"],
  fractional: ["fractional", "fraction", "share", "split", "divide", "partnership", "ownership"],
  royalties: ["royalty", "royalties", "creator fee", "secondary sales", "revenue share"],
  transfer: ["transfer", "send", "move", "wallet", "transaction", "payment"],
  walletConnect: ["wallet", "connect", "web3", "metamask", "connection"],
  qrCode: ["qr", "code", "mobile", "payment qr", "scan"],
  networkStatus: ["network", "chain", "blockchain", "status", "gas", "rpc", "polygon", "avalanche"],
  countdown: ["countdown", "timer", "time", "clock", "auction end", "deadline", "expiration"],
  notifications: ["notification", "alert", "notify", "message", "activity", "updates"],
  lockup: ["lock", "lockup", "vesting", "schedule", "release", "cliff", "timelock"],
};

export const USER_INTENT_PATTERNS: Record<string, { components: string[]; response: string }> = {
  "real estate": {
    components: ["assetUpload", "mintButton", "listingGrid", "assetDetails", "buyButton", "fractional", "royalties"],
    response: "I'll add components for real estate tokenization: asset upload, minting, listings, details view, purchase button, fractional ownership, and royalty configuration."
  },
  "art marketplace": {
    components: ["assetUpload", "mintButton", "listingGrid", "nftPreview", "carousel", "buyButton", "auction", "analytics"],
    response: "Setting up an art marketplace with: image upload, minting, gallery grid, preview cards, carousel, purchase options, auctions, and analytics."
  },
  "trading platform": {
    components: ["listingGrid", "buyButton", "offer", "pricingOracle", "analytics", "walletConnect", "networkStatus"],
    response: "Creating a trading platform with: listings, buy functionality, offers, price feeds, analytics, wallet connection, and network status."
  },
  "auction house": {
    components: ["listingGrid", "auction", "countdown", "nftPreview", "buyButton", "notifications", "analytics"],
    response: "Building an auction house with: listings, auction panels, countdown timers, previews, bidding, notifications, and analytics."
  },
  "fractional ownership": {
    components: ["mintButton", "fractional", "listingGrid", "buyButton", "royalties", "transfer", "analytics"],
    response: "Setting up fractional ownership with: minting, share splitting, listings, purchases, royalties, transfers, and tracking."
  },
  "simple mint": {
    components: ["mintButton", "walletConnect"],
    response: "Adding a simple minting interface with wallet connection."
  },
  "marketplace": {
    components: ["listingGrid", "nftPreview", "buyButton", "walletConnect", "search"],
    response: "Creating a basic marketplace with listings, previews, purchase buttons, and wallet connection."
  },
  "dashboard": {
    components: ["analytics", "walletConnect", "networkStatus", "notifications"],
    response: "Adding a dashboard with analytics, wallet info, network status, and notifications."
  }
};

export function analyzeUserIntent(input: string): AIComponentSuggestion[] {
  const normalizedInput = input.toLowerCase();
  const suggestions: AIComponentSuggestion[] = [];
  
  for (const [componentType, keywords] of Object.entries(COMPONENT_KEYWORDS)) {
    let matchCount = 0;
    for (const keyword of keywords) {
      if (normalizedInput.includes(keyword)) {
        matchCount++;
      }
    }
    
    if (matchCount > 0) {
      const confidence = Math.min(matchCount / keywords.length + 0.2, 1);
      suggestions.push({
        type: componentType,
        label: getComponentLabel(componentType),
        reason: `Matched ${matchCount} keywords related to ${componentType}`,
        confidence
      });
    }
  }
  
  for (const [intent, config] of Object.entries(USER_INTENT_PATTERNS)) {
    if (normalizedInput.includes(intent)) {
      for (const componentType of config.components) {
        if (!suggestions.find(s => s.type === componentType)) {
          suggestions.push({
            type: componentType,
            label: getComponentLabel(componentType),
            reason: `Suggested for ${intent}`,
            confidence: 0.8
          });
        }
      }
    }
  }
  
  return suggestions.sort((a, b) => b.confidence - a.confidence);
}

export function getComponentLabel(type: string): string {
  const labels: Record<string, string> = {
    assetUpload: "Asset Upload",
    mintButton: "Token Mint",
    listingGrid: "Listing Grid",
    nftPreview: "NFT Preview",
    assetDetails: "Asset Details",
    carousel: "Image Carousel",
    buyButton: "Buy / Trade",
    pricingOracle: "Price Oracle",
    analytics: "Analytics",
    auction: "Auction Panel",
    offer: "Make Offer",
    fractional: "Fractional Share",
    royalties: "Royalty Config",
    transfer: "Transfer Token",
    walletConnect: "Wallet Connect",
    qrCode: "QR Code",
    networkStatus: "Network Status",
    countdown: "Countdown Timer",
    notifications: "Notifications",
    lockup: "Token Lock",
  };
  return labels[type] || type;
}

export function createCanvasNode(item: PaletteItem, index: number = 0): Node {
  const baseX = 100;
  const baseY = 100;
  const spacing = 250;
  
  const row = Math.floor(index / 3);
  const col = index % 3;
  
  return {
    id: `${item.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: "custom",
    position: { 
      x: baseX + col * spacing + Math.random() * 50, 
      y: baseY + row * spacing + Math.random() * 50 
    },
    data: {
      label: item.label,
      componentType: item.type,
      category: item.category,
    },
  };
}

export function generateAIPromptSuggestions(input: string): string[] {
  const suggestions: string[] = [];
  
  if (input.toLowerCase().includes("mint") || input.toLowerCase().includes("token")) {
    suggestions.push("Add royalty fees for creators");
    suggestions.push("Include batch minting");
  }
  
  if (input.toLowerCase().includes("buy") || input.toLowerCase().includes("trade")) {
    suggestions.push("Add price oracle for dynamic pricing");
    suggestions.push("Include auction functionality");
  }
  
  if (input.toLowerCase().includes("list") || input.toLowerCase().includes("market")) {
    suggestions.push("Add filtering and sorting");
    suggestions.push("Include analytics dashboard");
  }
  
  if (input.toLowerCase().includes("auction")) {
    suggestions.push("Add countdown timer");
    suggestions.push("Include bid notifications");
  }
  
  if (suggestions.length === 0) {
    suggestions.push("Add wallet connection");
    suggestions.push("Include marketplace analytics");
    suggestions.push("Add network status indicator");
  }
  
  return suggestions;
}
