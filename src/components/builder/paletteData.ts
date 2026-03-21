import { 
  Upload, CreditCard, List, Image, FileText, ShoppingCart, 
  Tag, BarChart3, Users, DollarSign, Clock, Bell, Globe, 
  Shield, Wallet, Gavel, Percent, Lock, QrCode, 
  Wallet2, Layers, Coins, ArrowRightLeft
} from "lucide-react";

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

export const componentDetails: Record<string, { 
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
