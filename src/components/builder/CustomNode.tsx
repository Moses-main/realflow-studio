import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { 
  Upload, CreditCard, List, Image, FileText, ShoppingCart, 
  Tag, BarChart3, Users, DollarSign, Clock, Bell, Globe, 
  Shield, Wallet, Gavel, Percent, Lock, QrCode
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  assetUpload: Upload,
  mintButton: CreditCard,
  listingGrid: List,
  nftPreview: Image,
  assetDetails: FileText,
  carousel: Image,
  buyButton: ShoppingCart,
  pricingOracle: Tag,
  analytics: BarChart3,
  auction: Gavel,
  offer: DollarSign,
  fractional: Percent,
  royalties: Shield,
  transfer: Users,
  walletConnect: Wallet,
  qrCode: QrCode,
  networkStatus: Globe,
  countdown: Clock,
  notifications: Bell,
  lockup: Lock,
};

const colorMap: Record<string, string> = {
  Core: "from-primary to-cyan-400",
  Display: "from-purple-500 to-pink-400",
  Trading: "from-amber-500 to-orange-400",
  Ownership: "from-emerald-500 to-teal-400",
  Web3: "from-blue-500 to-indigo-400",
  UI: "from-rose-500 to-red-400",
};

const CustomNode = memo(({ data }: NodeProps) => {
  const Icon = iconMap[data.componentType as string] || FileText;
  const category = (data.category as string) || "Core";
  const colorClass = colorMap[category] || colorMap.Core;

  return (
    <div className="glass rounded-xl p-4 min-w-[180px] node-glow hover:border-primary/40 transition-colors group">
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!bg-primary !w-3 !h-3 !border-2 !border-background" 
      />
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${colorClass} flex items-center justify-center shrink-0`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">{data.label as string}</div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{data.componentType as string}</span>
          </div>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-border/50">
        <span className="text-xs text-muted-foreground">{category}</span>
      </div>
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="!bg-accent !w-3 !h-3 !border-2 !border-background" 
      />
    </div>
  );
});

CustomNode.displayName = "CustomNode";
export default CustomNode;
