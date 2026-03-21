import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Eye, Info,
  Upload, ShoppingCart, CreditCard, List, Image, FileText, 
  Tag, BarChart3, DollarSign, Clock, Bell, Globe, 
  Shield, Wallet, Gavel, Percent, Lock, QrCode, 
  Wallet2, Layers, Coins, ArrowRightLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { paletteItems, componentDetails, type PaletteItem } from "./paletteData";

export type { PaletteItem };

interface Props {
  onDragStart: (item: PaletteItem) => void;
}

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
                .map((item) => {
                  const Icon = item.icon;
                  return (
                  <div
                    key={item.type}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("application/json", JSON.stringify(item));
                      e.dataTransfer.effectAllowed = "move";
                      onDragStart(item);
                    }}
                    onClick={() => setPreviewItem(item)}
                    onMouseEnter={() => setHoveredItem(item)}
                    onMouseLeave={() => setHoveredItem(null)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-grab active:cursor-grabbing hover:bg-primary/10 hover:border-primary/30 transition-all border border-transparent group"
                  >
                  <Icon className="w-4 h-4 text-primary shrink-0" />
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
                  );
                })}
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
