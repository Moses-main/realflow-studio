import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { 
  Upload, CreditCard, List, Image, FileText, ShoppingCart, 
  Tag, BarChart3, DollarSign, Clock, Bell, Globe, 
  Shield, Wallet, Gavel, Percent, Lock, QrCode, Layers, ArrowRightLeft
} from "lucide-react";

// Icon mapping for each component type
const iconMap: Record<string, React.ElementType> = {
  assetUpload: Upload,
  mintButton: CreditCard,
  listingGrid: List,
  nftPreview: Image,
  assetDetails: FileText,
  carousel: Layers,
  buyButton: ShoppingCart,
  pricingOracle: Tag,
  analytics: BarChart3,
  auction: Gavel,
  offer: DollarSign,
  fractional: Percent,
  royalties: Shield,
  transfer: ArrowRightLeft,
  walletConnect: Wallet,
  qrCode: QrCode,
  networkStatus: Globe,
  countdown: Clock,
  notifications: Bell,
  lockup: Lock,
};

// Color scheme per category
const colorMap: Record<string, { text: string; border: string; handle: string; bg: string }> = {
  Core: { 
    text: "text-blue-400", 
    border: "border-blue-500/50", 
    handle: "bg-blue-500", 
    bg: "bg-gradient-to-br from-blue-600 to-cyan-500" 
  },
  Display: { 
    text: "text-purple-400", 
    border: "border-purple-500/50", 
    handle: "bg-purple-500", 
    bg: "bg-gradient-to-br from-purple-600 to-pink-500" 
  },
  Trading: { 
    text: "text-amber-400", 
    border: "border-amber-500/50", 
    handle: "bg-amber-500", 
    bg: "bg-gradient-to-br from-amber-600 to-orange-500" 
  },
  Ownership: { 
    text: "text-emerald-400", 
    border: "border-emerald-500/50", 
    handle: "bg-emerald-500", 
    bg: "bg-gradient-to-br from-emerald-600 to-teal-500" 
  },
  Web3: { 
    text: "text-indigo-400", 
    border: "border-indigo-500/50", 
    handle: "bg-indigo-500", 
    bg: "bg-gradient-to-br from-indigo-600 to-blue-500" 
  },
  UI: { 
    text: "text-rose-400", 
    border: "border-rose-500/50", 
    handle: "bg-rose-500", 
    bg: "bg-gradient-to-br from-rose-600 to-red-500" 
  },
};

/**
 * CustomNode - RWA Marketplace Component Node
 * 
 * Features:
 * - Color-coded by category
 * - Always-visible connection handles
 * - Drag handle for repositioning
 * - Selection highlight
 */
const CustomNode = memo(({ data, selected }: NodeProps) => {
  // Get icon for this component type
  const Icon = iconMap[data.componentType as string] || FileText;
  
  // Get category (default to Core)
  const category = (data.category as string) || "Core";
  
  // Get colors for this category
  const colors = colorMap[category] || colorMap.Core;

  return (
    <div 
      className={`
        relative rounded-xl p-4 min-w-[200px] max-w-[250px]
        bg-[#1a1c1e] border-2 ${colors.border}
        ${selected ? "ring-2 ring-primary ring-offset-2 ring-offset-[#0a0b0d]" : ""}
        shadow-lg shadow-black/50
        hover:shadow-xl transition-shadow duration-200
      `}
    >
      {/* Connection Handles - Always visible for easy access */}
      
      {/* Top Handle (Input) */}
      <Handle
        type="target"
        position={Position.Top}
        className={`!${colors.handle} !w-4 !h-4 !border-2 !border-[#0a0b0d] !-top-2 !opacity-100`}
        style={{ left: "50%", transform: "translateX(-50%)" }}
      />
      
      {/* Bottom Handle (Output) */}
      <Handle
        type="source"
        position={Position.Bottom}
        className={`!${colors.handle} !w-4 !h-4 !border-2 !border-[#0a0b0d] !-bottom-2 !opacity-100`}
        style={{ left: "50%", transform: "translateX(-50%)" }}
      />
      
      {/* Left Handle (Input) */}
      <Handle
        type="target"
        position={Position.Left}
        className={`!${colors.handle} !w-4 !h-4 !border-2 !border-[#0a0b0d] !-left-2 !opacity-100`}
        style={{ top: "50%", transform: "translateY(-50%)" }}
      />
      
      {/* Right Handle (Output) */}
      <Handle
        type="source"
        position={Position.Right}
        className={`!${colors.handle} !w-4 !h-4 !border-2 !border-[#0a0b0d] !-right-2 !opacity-100`}
        style={{ top: "50%", transform: "translateY(-50%)" }}
      />

      {/* Node Content */}
      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center shrink-0 shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        
        {/* Labels */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-white truncate">{data.label as string}</div>
          <div className={`text-xs ${colors.text} font-medium`}>{category}</div>
        </div>
      </div>
      
      {/* Component Type */}
      <div className="mt-3 pt-2 border-t border-white/10">
        <span className="text-xs text-gray-400 font-mono">{data.componentType as string}</span>
      </div>
      
      {/* Selection/Delete indicator */}
      {selected && (
        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary animate-pulse" />
      )}
    </div>
  );
});

CustomNode.displayName = "CustomNode";

export default CustomNode;
