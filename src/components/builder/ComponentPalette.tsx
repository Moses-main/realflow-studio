import { Upload, CreditCard, List, Image, FileText, ShoppingCart, Tag, BarChart3 } from "lucide-react";

export interface PaletteItem {
  type: string;
  label: string;
  icon: React.ElementType;
  category: string;
}

export const paletteItems: PaletteItem[] = [
  { type: "assetUpload", label: "Asset Upload", icon: Upload, category: "Core" },
  { type: "mintButton", label: "Token Mint", icon: CreditCard, category: "Core" },
  { type: "listingGrid", label: "Listing Grid", icon: List, category: "Core" },
  { type: "nftPreview", label: "NFT Preview", icon: Image, category: "Display" },
  { type: "assetDetails", label: "Asset Details", icon: FileText, category: "Display" },
  { type: "buyButton", label: "Buy / Trade", icon: ShoppingCart, category: "Trading" },
  { type: "pricingOracle", label: "Price Oracle", icon: Tag, category: "Trading" },
  { type: "analytics", label: "Analytics", icon: BarChart3, category: "Trading" },
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
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-grab active:cursor-grabbing hover:bg-secondary/60 transition-colors border border-transparent hover:border-border"
                >
                  <item.icon className="w-4 h-4 text-primary" />
                  <span className="text-sm">{item.label}</span>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ComponentPalette;
