import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Package, TrendingUp, Clock, ExternalLink, Edit,
  Users, DollarSign, Activity, Share2, Check, Copy as CopyIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "@/hooks/useAuth";

const mockMarketplaces: Record<string, {
  id: string;
  name: string;
  status: string;
  category: string;
  assets: number;
  volume: string;
  address: string;
  createdAt: string;
  owner: string;
  description: string;
}> = {
  "1": {
    id: "1",
    name: "Lagos Real Estate Hub",
    status: "live",
    category: "Real Estate",
    assets: 24,
    volume: "$142K",
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f0f123",
    createdAt: "2024-01-15",
    owner: "0x1234...5678",
    description: "A marketplace for tokenizing real estate properties in Lagos, Nigeria. Users can buy fractional ownership of properties and earn rental income."
  },
  "2": {
    id: "2",
    name: "Buenos Aires Art Market",
    status: "draft",
    category: "Art & Collectibles",
    assets: 8,
    volume: "$0",
    address: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
    createdAt: "2024-02-20",
    owner: "0xabcd...efgh",
    description: "A marketplace for tokenizing art and collectibles from Buenos Aires galleries and artists."
  },
  "3": {
    id: "3",
    name: "Mexico Commodity Exchange",
    status: "live",
    category: "Commodities",
    assets: 56,
    volume: "$890K",
    address: "0xdD2FD4581271e230360230F9337D5c0430Bf44C0",
    createdAt: "2024-03-10",
    owner: "0x9876...4321",
    description: "A marketplace for trading tokenized commodities including precious metals, agricultural products, and energy resources."
  },
};

const MarketplaceDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [linkCopied, setLinkCopied] = useState(false);

  const marketplace = id ? mockMarketplaces[id] : null;

  const shareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  if (!marketplace) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <main className="lg:pl-64">
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Marketplace Not Found</h2>
              <p className="text-muted-foreground mb-4">The marketplace you're looking for doesn't exist.</p>
              <Button asChild>
                <Link to="/marketplaces">Back to Marketplaces</Link>
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="lg:pl-64">
        <header className="sticky top-0 z-30 glass-strong border-b border-border px-4 py-4 lg:px-8 lg:h-16 flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/marketplaces">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </Button>
          <h1 className="text-lg font-semibold flex-1">{marketplace.name}</h1>
          <Button variant="outline" size="sm" onClick={shareLink}>
            {linkCopied ? <Check className="w-4 h-4 mr-2" /> : <Share2 className="w-4 h-4 mr-2" />}
            {linkCopied ? "Copied!" : "Share"}
          </Button>
          <Button size="sm" asChild>
            <Link to="/builder">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Link>
          </Button>
        </header>

        <div className="p-4 lg:p-8 space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Status</span>
              </div>
              <p className="text-2xl font-bold capitalize">{marketplace.status}</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="glass rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Volume</span>
              </div>
              <p className="text-2xl font-bold">{marketplace.volume}</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Assets</span>
              </div>
              <p className="text-2xl font-bold">{marketplace.assets}</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="glass rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Created</span>
              </div>
              <p className="text-2xl font-bold">{marketplace.createdAt}</p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-xl p-6"
          >
            <h2 className="text-lg font-semibold mb-4">About</h2>
            <p className="text-muted-foreground mb-4">{marketplace.description}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Category</p>
                <p className="font-medium">{marketplace.category}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Owner</p>
                <p className="font-mono text-sm">{marketplace.owner}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="glass rounded-xl p-6"
          >
            <h2 className="text-lg font-semibold mb-4">Contract</h2>
            <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Contract Address</p>
                <p className="font-mono text-sm">{marketplace.address}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  navigator.clipboard.writeText(marketplace.address);
                }}
              >
                <CopyIcon className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              asChild
            >
              <a href={`https://amoy.polygonscan.com/address/${marketplace.address}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                View on PolygonScan
              </a>
            </Button>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default MarketplaceDetail;
