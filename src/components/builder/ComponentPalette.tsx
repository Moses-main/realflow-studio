import { 
  Upload, CreditCard, List, Image, FileText, ShoppingCart, 
  Tag, BarChart3, Users, DollarSign, Clock, Bell, Globe, 
  Shield, Wallet, Gavel, Percent, Lock, QrCode
} from "lucide-react";

export interface PaletteItem {
  type: string;
  label: string;
  icon: React.ElementType;
  category: string;
  description?: string;
}

export const paletteItems: PaletteItem[] = [
  { type: "assetUpload", label: "Asset Upload", icon: Upload, category: "Core", description: "Upload RWA assets" },
  { type: "mintButton", label: "Token Mint", icon: CreditCard, category: "Core", description: "Mint ERC-721/1155 tokens" },
  { type: "listingGrid", label: "Listing Grid", icon: List, category: "Core", description: "Display asset listings" },
  
  { type: "nftPreview", label: "NFT Preview", icon: Image, category: "Display", description: "Preview token metadata" },
  { type: "assetDetails", label: "Asset Details", icon: FileText, category: "Display", description: "Show asset information" },
  { type: "carousel", label: "Image Carousel", icon: Image, category: "Display", description: "Gallery slider" },
  
  { type: "buyButton", label: "Buy / Trade", icon: ShoppingCart, category: "Trading", description: "Purchase button" },
  { type: "pricingOracle", label: "Price Oracle", icon: Tag, category: "Trading", description: "Dynamic pricing" },
  { type: "analytics", label: "Analytics", icon: BarChart3, category: "Trading", description: "Market statistics" },
  { type: "auction", label: "Auction Panel", icon: Gavel, category: "Trading", description: "Timed auctions" },
  { type: "offer", label: "Make Offer", icon: DollarSign, category: "Trading", description: "Bidding system" },
  
  { type: "fractional", label: "Fractional Share", icon: Percent, category: "Ownership", description: "Split ownership" },
  { type: "royalties", label: "Royalty Config", icon: Shield, category: "Ownership", description: "Set royalties" },
  { type: "transfer", label: "Transfer Token", icon: Users, category: "Ownership", description: "Send tokens" },
  
  { type: "walletConnect", label: "Wallet Connect", icon: Wallet, category: "Web3", description: "Connect wallets" },
  { type: "qrCode", label: "QR Code", icon: QrCode, category: "Web3", description: "Mobile payments" },
  { type: "networkStatus", label: "Network Status", icon: Globe, category: "Web3", description: "Chain info" },
  
  { type: "countdown", label: "Countdown Timer", icon: Clock, category: "UI", description: "Auction timer" },
  { type: "notifications", label: "Notifications", icon: Bell, category: "UI", description: "Activity alerts" },
  { type: "lockup", label: "Token Lock", icon: Lock, category: "UI", description: "Vesting schedule" },
];

interface Props {
  onDragStart: (item: PaletteItem) => void;
}

const ComponentPalette = ({ onDragStart }: Props) => {
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
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-grab active:cursor-grabbing hover:bg-secondary/60 transition-colors border border-transparent hover:border-border group"
                  title={item.description}
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
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ComponentPalette;
