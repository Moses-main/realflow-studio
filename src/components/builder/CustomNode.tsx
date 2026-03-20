import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Upload, CreditCard, List, Image, FileText, ShoppingCart, Tag, BarChart3 } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  assetUpload: Upload,
  mintButton: CreditCard,
  listingGrid: List,
  nftPreview: Image,
  assetDetails: FileText,
  buyButton: ShoppingCart,
  pricingOracle: Tag,
  analytics: BarChart3,
};

const CustomNode = memo(({ data }: NodeProps) => {
  const Icon = iconMap[data.componentType as string] || FileText;

  return (
    <div className="glass rounded-xl p-4 min-w-[180px] node-glow hover:border-primary/40 transition-colors group">
      <Handle type="target" position={Position.Top} className="!bg-primary !w-3 !h-3 !border-2 !border-background" />
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <div>
          <div className="text-sm font-medium">{data.label as string}</div>
          <div className="text-xs text-muted-foreground">{data.componentType as string}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-accent !w-3 !h-3 !border-2 !border-background" />
    </div>
  );
});

CustomNode.displayName = "CustomNode";
export default CustomNode;
