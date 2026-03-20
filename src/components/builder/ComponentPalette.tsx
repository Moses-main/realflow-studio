import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, CreditCard, List, Image, FileText, ShoppingCart, 
  Tag, BarChart3, Users, DollarSign, Clock, Bell, Globe, 
  Shield, Wallet, Gavel, Percent, Lock, QrCode, X, Eye, Info
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

const componentDetails: Record<string, { features: string[]; useCase: string }> = {
  assetUpload: { 
    features: ["Multi-format support", "IPFS upload", "Metadata extraction", "Preview generation"],
    useCase: "Upload real-world assets like property documents, artwork, or commodities"
  },
  mintButton: { 
    features: ["ERC-721 & ERC-1155", "Batch minting", "Custom metadata", "Royalty support"],
    useCase: "Create tokens representing ownership of real-world assets"
  },
  listingGrid: { 
    features: ["Grid/List view", "Filtering", "Sorting", "Pagination"],
    useCase: "Display available assets for purchase or trading"
  },
  auction: { 
    features: ["Timed auctions", "Reserve price", "Bid history", "Auto-extend"],
    useCase: "Run timed auctions for high-value assets"
  },
};

const ComponentPalette = ({ onDragStart }: Props) => {
  const [previewItem, setPreviewItem] = useState<PaletteItem | null>(null);
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
              className="glass-strong rounded-xl max-w-md w-full p-6 border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <previewItem.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{previewItem.label}</h3>
                    <span className="text-xs text-muted-foreground">{previewItem.category}</span>
                  </div>
                </div>
                <button onClick={() => setPreviewItem(null)} className="p-1 hover:bg-secondary rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-muted-foreground mb-4">{previewItem.description}</p>

              <div className="mb-4">
                <div className="flex items-center gap-2 text-sm font-medium mb-2">
                  <Info className="w-4 h-4" />
                  Use Case
                </div>
                <p className="text-sm text-muted-foreground">
                  {componentDetails[previewItem.type]?.useCase || "Component for building your marketplace"}
                </p>
              </div>

              <div className="mb-6">
                <div className="text-sm font-medium mb-2">Features</div>
                <div className="flex flex-wrap gap-2">
                  {(componentDetails[previewItem.type]?.features || ["Standard component", "Easy integration", "Customizable UI"]).map((feature) => (
                    <span key={feature} className="text-xs px-2.5 py-1 rounded-full bg-secondary text-muted-foreground">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ComponentPalette;
