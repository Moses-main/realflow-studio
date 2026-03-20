import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, CreditCard, List, Image, FileText, ShoppingCart, 
  Tag, BarChart3, Users, DollarSign, Clock, Bell, Globe, 
  Shield, Wallet, Gavel, Percent, Lock, QrCode, X, Eye, Info,
  Wallet2, TrendingUp, Layers, Coins, ArrowRightLeft, Gift
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PaletteItem {
  type: string;
  label: string;
  icon: React.ElementType;
  category: string;
  description?: string;
}

export const paletteItems: PaletteItem[] = [
  { type: "assetUpload", label: "Asset Upload", icon: Upload, category: "Core", description: "Upload RWA assets to IPFS" },
  { type: "mintButton", label: "Token Mint", icon: CreditCard, category: "Core", description: "Mint ERC-721/1155 tokens" },
  { type: "listingGrid", label: "Listing Grid", icon: List, category: "Core", description: "Display asset listings" },
  
  { type: "nftPreview", label: "NFT Preview", icon: Image, category: "Display", description: "Preview token metadata" },
  { type: "assetDetails", label: "Asset Details", icon: FileText, category: "Display", description: "Show detailed asset info" },
  { type: "carousel", label: "Image Carousel", icon: Layers, category: "Display", description: "Gallery slider component" },
  
  { type: "buyButton", label: "Buy / Trade", icon: ShoppingCart, category: "Trading", description: "Purchase button with wallet" },
  { type: "pricingOracle", label: "Price Oracle", icon: Tag, category: "Trading", description: "Dynamic pricing data" },
  { type: "analytics", label: "Analytics", icon: BarChart3, category: "Trading", description: "Market statistics dashboard" },
  { type: "auction", label: "Auction Panel", icon: Gavel, category: "Trading", description: "Timed auction system" },
  { type: "offer", label: "Make Offer", icon: DollarSign, category: "Trading", description: "Bidding & offer system" },
  
  { type: "fractional", label: "Fractional Share", icon: Percent, category: "Ownership", description: "Split token ownership" },
  { type: "royalties", label: "Royalty Config", icon: Shield, category: "Ownership", description: "Configure royalties" },
  { type: "transfer", label: "Transfer Token", icon: ArrowRightLeft, category: "Ownership", description: "Send tokens to others" },
  
  { type: "walletConnect", label: "Wallet Connect", icon: Wallet, category: "Web3", description: "Connect Web3 wallets" },
  { type: "qrCode", label: "QR Code", icon: QrCode, category: "Web3", description: "Mobile payment QR" },
  { type: "networkStatus", label: "Network Status", icon: Globe, category: "Web3", description: "Blockchain network info" },
  
  { type: "countdown", label: "Countdown Timer", icon: Clock, category: "UI", description: "Auction countdown" },
  { type: "notifications", label: "Notifications", icon: Bell, category: "UI", description: "Activity alerts panel" },
  { type: "lockup", label: "Token Lock", icon: Lock, category: "UI", description: "Vesting schedules" },
];

interface Props {
  onDragStart: (item: PaletteItem) => void;
}

const componentDetails: Record<string, { 
  features: string[]; 
  useCase: string;
  preview: "upload" | "button" | "grid" | "image" | "info" | "cart" | "price" | "chart" | "auction" | "offer" | "percent" | "shield" | "wallet" | "qr" | "network" | "clock" | "bell" | "lock";
}> = {
  assetUpload: { 
    features: ["Multi-format support", "IPFS upload", "Metadata extraction", "Preview generation"],
    useCase: "Upload real-world assets like property documents, artwork, or commodities to IPFS for on-chain storage",
    preview: "upload"
  },
  mintButton: { 
    features: ["ERC-721 & ERC-1155", "Batch minting", "Custom metadata", "Royalty support"],
    useCase: "Create tokens representing ownership of real-world assets with configurable royalties",
    preview: "button"
  },
  listingGrid: { 
    features: ["Grid/List view", "Filtering", "Sorting", "Pagination", "Real-time updates"],
    useCase: "Display available assets for purchase or trading with advanced filtering options",
    preview: "grid"
  },
  nftPreview: {
    features: ["3D preview", "IPFS media", "Metadata display", "Fullscreen mode"],
    useCase: "Showcase NFT metadata and media in an elegant preview card",
    preview: "image"
  },
  assetDetails: {
    features: ["Rich text", "Attribute display", "Document links", "Verification badges"],
    useCase: "Display comprehensive information about tokenized real-world assets",
    preview: "info"
  },
  carousel: {
    features: ["Touch gestures", "Auto-play", "Thumbnails", "Fullscreen"],
    useCase: "Display multiple images of assets in an interactive slider",
    preview: "image"
  },
  buyButton: {
    features: ["Wallet integration", "Multi-currency", "Price comparison", "Gas estimation"],
    useCase: "Enable users to purchase assets directly with connected wallet",
    preview: "cart"
  },
  pricingOracle: {
    features: ["Real-time feeds", "Multi-source", "Historical data", "Price alerts"],
    useCase: "Display accurate pricing from multiple oracle sources",
    preview: "price"
  },
  analytics: {
    features: ["Trading volume", "Price charts", "Holder stats", "Export data"],
    useCase: "Provide market insights and trading statistics",
    preview: "chart"
  },
  auction: {
    features: ["Timed auctions", "Reserve price", "Bid history", "Auto-extend"],
    useCase: "Run timed auctions for high-value assets with automatic bidding",
    preview: "auction"
  },
  offer: {
    features: ["Counter offers", "Expiration", "Auto-reject", "Negotiation"],
    useCase: "Allow users to make offers on assets with negotiation support",
    preview: "offer"
  },
  fractional: {
    features: ["Share splitting", "Dividend distribution", "Governance", "Trading"],
    useCase: "Split ownership into tradeable fractions for democratized investing",
    preview: "percent"
  },
  royalties: {
    features: ["Creator royalties", "Secondary sales", "Distribution", "Overrides"],
    useCase: "Configure royalty percentages for creators on secondary sales",
    preview: "shield"
  },
  transfer: {
    features: ["Batch transfer", "Multi-chain", "Gas optimization", "History"],
    useCase: "Transfer tokens between wallets with gas-efficient batch support",
    preview: "button"
  },
  walletConnect: {
    features: ["Multiple wallets", "Chain switching", "Account display", "Sign messages"],
    useCase: "Connect Web3 wallets for blockchain interactions",
    preview: "wallet"
  },
  qrCode: {
    features: ["Payment QR", "Deep links", "Wallet scanning", "Dynamic"],
    useCase: "Generate QR codes for mobile wallet payments",
    preview: "qr"
  },
  networkStatus: {
    features: ["Multi-chain", "Gas prices", "Block number", "RPC status"],
    useCase: "Display current blockchain network status and metrics",
    preview: "network"
  },
  countdown: {
    features: ["Custom duration", "Auto-complete", "Sounds", "Themes"],
    useCase: "Display countdown timers for auctions and time-limited offers",
    preview: "clock"
  },
  notifications: {
    features: ["Real-time alerts", "Transaction updates", "Price alerts", "Bids"],
    useCase: "Keep users informed of important marketplace activity",
    preview: "bell"
  },
  lockup: {
    features: ["Vesting schedules", "Cliff periods", "Release tokens", "Dashboard"],
    useCase: "Implement token lockup and vesting schedules for compliance",
    preview: "lock"
  },
};

// Visual preview component
const ComponentPreview = ({ type }: { type: string }) => {
  const previewType = componentDetails[type]?.preview || "info";
  
  const previews: Record<string, React.ReactNode> = {
    upload: (
      <div className="flex flex-col items-center justify-center h-full p-4 border-2 border-dashed border-primary/30 rounded-lg">
        <Upload className="w-8 h-8 text-primary mb-2" />
        <p className="text-xs text-muted-foreground text-center">Drop files here<br/>or click to upload</p>
      </div>
    ),
    button: (
      <div className="flex items-center justify-center h-full">
        <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium">
          Mint Token
        </div>
      </div>
    ),
    grid: (
      <div className="grid grid-cols-2 gap-2 p-2 h-full">
        {[1,2,3,4].map(i => (
          <div key={i} className="bg-secondary rounded p-2">
            <div className="w-full h-8 bg-primary/20 rounded mb-1" />
            <div className="h-2 bg-muted rounded w-3/4" />
          </div>
        ))}
      </div>
    ),
    image: (
      <div className="flex items-center justify-center h-full p-2">
        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
          <Image className="w-6 h-6 text-primary/50" />
        </div>
      </div>
    ),
    info: (
      <div className="p-2 space-y-2 h-full">
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="h-2 bg-secondary rounded w-full" />
        <div className="h-2 bg-secondary rounded w-3/4" />
        <div className="flex gap-1 mt-2">
          <div className="h-4 w-8 bg-primary/20 rounded" />
          <div className="h-4 w-8 bg-primary/20 rounded" />
        </div>
      </div>
    ),
    cart: (
      <div className="flex flex-col items-center justify-center h-full">
        <ShoppingCart className="w-6 h-6 text-primary mb-2" />
        <div className="bg-success/20 text-success px-3 py-1 rounded text-xs">Buy Now</div>
      </div>
    ),
    price: (
      <div className="flex flex-col items-center justify-center h-full">
        <Coins className="w-6 h-6 text-warning mb-1" />
        <p className="text-lg font-bold">$1,234.56</p>
        <p className="text-xs text-success">+5.2%</p>
      </div>
    ),
    chart: (
      <div className="flex items-end justify-between h-full p-2 gap-1">
        {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
          <div key={i} className="flex-1 bg-primary/40 rounded-t" style={{ height: `${h}%` }} />
        ))}
      </div>
    ),
    auction: (
      <div className="flex flex-col items-center justify-center h-full">
        <Gavel className="w-6 h-6 text-primary mb-1" />
        <p className="text-xs text-muted-foreground">Current Bid</p>
        <p className="text-sm font-bold">0.5 ETH</p>
        <div className="text-xs bg-primary/20 px-2 py-0.5 rounded mt-1">2h 34m</div>
      </div>
    ),
    offer: (
      <div className="flex flex-col items-center justify-center h-full">
        <DollarSign className="w-6 h-6 text-primary mb-1" />
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground">Offer:</span>
          <span className="text-sm font-bold">0.45 ETH</span>
        </div>
      </div>
    ),
    percent: (
      <div className="flex flex-col items-center justify-center h-full">
        <Percent className="w-6 h-6 text-primary mb-1" />
        <p className="text-lg font-bold">25%</p>
        <p className="text-xs text-muted-foreground">Ownership</p>
      </div>
    ),
    shield: (
      <div className="flex flex-col items-center justify-center h-full">
        <Shield className="w-6 h-6 text-primary mb-1" />
        <p className="text-sm font-medium">5% Royalty</p>
        <p className="text-xs text-muted-foreground">On secondary sales</p>
      </div>
    ),
    wallet: (
      <div className="flex flex-col items-center justify-center h-full">
        <Wallet2 className="w-6 h-6 text-primary mb-1" />
        <p className="text-xs font-mono">0x1234...5678</p>
        <div className="text-xs bg-success/20 text-success px-2 py-0.5 rounded mt-1">Connected</div>
      </div>
    ),
    qr: (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-primary rounded grid grid-cols-3 gap-px p-0.5">
          {[...Array(9)].map((_, i) => (
            <div key={i} className={`bg-primary ${i % 2 === 0 ? 'opacity-100' : 'opacity-30'}`} />
          ))}
        </div>
      </div>
    ),
    network: (
      <div className="flex flex-col items-center justify-center h-full">
        <Globe className="w-6 h-6 text-primary mb-1" />
        <p className="text-xs font-medium">Polygon Amoy</p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <div className="w-1.5 h-1.5 bg-success rounded-full" />
          <span>Connected</span>
        </div>
      </div>
    ),
    clock: (
      <div className="flex flex-col items-center justify-center h-full">
        <Clock className="w-6 h-6 text-primary mb-1" />
        <p className="text-lg font-mono font-bold">02:34:15</p>
        <p className="text-xs text-muted-foreground">Time remaining</p>
      </div>
    ),
    bell: (
      <div className="flex flex-col items-center justify-center h-full">
        <Bell className="w-6 h-6 text-primary mb-1" />
        <div className="text-xs bg-primary text-primary-foreground w-4 h-4 rounded-full flex items-center justify-center">3</div>
        <p className="text-xs text-muted-foreground mt-1">New alerts</p>
      </div>
    ),
    lock: (
      <div className="flex flex-col items-center justify-center h-full">
        <Lock className="w-6 h-6 text-primary mb-1" />
        <p className="text-xs font-medium">10,000 Tokens</p>
        <p className="text-xs text-muted-foreground">Locked for 1 year</p>
      </div>
    ),
  };
  
  return previews[previewType] || previews.info;
};

const ComponentPalette = ({ onDragStart }: Props) => {
  const [previewItem, setPreviewItem] = useState<PaletteItem | null>(null);
  const [hoveredItem, setHoveredItem] = useState<PaletteItem | null>(null);
  const categories = [...new Set(paletteItems.map((p) => p.category))];

  return (
    <div className="space-y-5">
      {categories.map((cat) => (
        <div key={cat}>
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">{cat}</div>
          <div className="space-y-1">
            {paletteItems
              .filter((p) => p.category === cat)
              .map((item) => (
                <div
                  key={item.type}
                  draggable
                  onDragStart={() => onDragStart(item)}
                  onClick={() => setPreviewItem(item)}
                  onMouseEnter={() => setHoveredItem(item)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-grab active:cursor-grabbing hover:bg-secondary/60 transition-colors border border-transparent hover:border-border group"
                >
                  <item.icon className="w-4 h-4 text-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm">{item.label}</div>
                    {item.description && (
                      <div className="text-xs text-muted-foreground truncate opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.description}
                      </div>
                    )}
                  </div>
                  <Eye className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
              ))}
          </div>
        </div>
      ))}

      {/* Click Preview Modal */}
      <AnimatePresence>
        {previewItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setPreviewItem(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-strong rounded-xl max-w-lg w-full border border-border overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Preview */}
              <div className="relative bg-gradient-to-br from-primary/10 to-transparent p-6 border-b border-border">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                      <previewItem.icon className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{previewItem.label}</h3>
                      <span className="text-sm text-muted-foreground">{previewItem.category} Component</span>
                    </div>
                  </div>
                  <button onClick={() => setPreviewItem(null)} className="p-1.5 hover:bg-secondary rounded-lg transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Visual Preview */}
              <div className="p-6 border-b border-border">
                <div className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Preview
                </div>
                <div className="h-32 bg-[var(--surface)] rounded-lg border border-border">
                  <ComponentPreview type={previewItem.type} />
                </div>
              </div>

              {/* Description */}
              <div className="p-6 border-b border-border">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {previewItem.description}
                </p>
              </div>

              {/* Details */}
              <div className="p-6 border-b border-border">
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-sm font-medium mb-2">
                    <Info className="w-4 h-4" />
                    Use Case
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {componentDetails[previewItem.type]?.useCase || "Component for building your marketplace"}
                  </p>
                </div>

                <div>
                  <div className="text-sm font-medium mb-2">Features</div>
                  <div className="flex flex-wrap gap-2">
                    {(componentDetails[previewItem.type]?.features || ["Standard component", "Easy integration", "Customizable UI"]).map((feature) => (
                      <span key={feature} className="text-xs px-2.5 py-1 rounded-full bg-secondary text-muted-foreground">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 bg-[var(--surface)]">
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setPreviewItem(null)}>
                    Close
                  </Button>
                  <Button className="flex-1" onClick={() => {
                    onDragStart(previewItem);
                    setPreviewItem(null);
                  }}>
                    Add to Canvas
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ComponentPalette;
