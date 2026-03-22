import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Package, Plus, MoreVertical, ExternalLink, Trash2, Edit, 
  Copy, Eye, TrendingUp, Clock, Check, Copy as CopyIcon, Search, Building2, Palette, Coins, Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { ConnectButton } from "@/components/auth/ConnectButton";
import { useMarketplaces } from "@/hooks/useData";

const categories = [
  { id: "all", label: "All", icon: Package },
  { id: "real-estate", label: "Real Estate", icon: Building2 },
  { id: "art", label: "Art & Collectibles", icon: Palette },
  { id: "commodities", label: "Commodities", icon: Coins },
];

const MarketplaceCard = ({ marketplace }: { marketplace: typeof mockMarketplaces[0] }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(marketplace.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = () => {
    const url = `${window.location.origin}/marketplaces/${marketplace.id}`;
    navigator.clipboard.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-6 hover:border-primary/30 transition-all"
      >
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
            marketplace.status === "live" 
              ? "from-primary to-accent" 
              : "from-muted to-muted-foreground/20"
          } flex items-center justify-center`}>
            <Package className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
              marketplace.status === "live" 
                ? "bg-primary/10 text-primary" 
                : "bg-muted text-muted-foreground"
            }`}>
              {marketplace.status === "live" && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
              {marketplace.status === "live" ? "Live" : "Draft"}
            </span>
            <span className="text-xs text-muted-foreground capitalize">
              {marketplace.category?.replace("-", " & ")}
            </span>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 absolute top-4 right-4">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={shareLink}>
              <Share2 className="w-4 h-4 mr-2" />
              {linkCopied ? "Link Copied!" : "Share Link"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowDetails(true)}>
              <Eye className="w-4 h-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/canvas">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={copyAddress}>
              {copied ? <Check className="w-4 h-4 mr-2" /> : <CopyIcon className="w-4 h-4 mr-2" />}
              {copied ? "Copied!" : "Copy Address"}
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href={`https://amoy.polygonscan.com/address/${marketplace.address}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                View on Explorer
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Link to={`/marketplaces/${marketplace.id}`} className="block mb-3">
          <h3 className="font-semibold hover:text-primary transition-colors">{marketplace.name}</h3>
        </Link>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Package className="w-4 h-4" />
            {marketplace.assets} assets
          </span>
          <span className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            {marketplace.volume}
          </span>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {marketplace.createdAt}
          </span>
          <Button variant="outline" size="sm" asChild>
            <Link to="/canvas">Edit</Link>
          </Button>
        </div>
      </motion.div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{marketplace.name}</DialogTitle>
            <DialogDescription>Marketplace Details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium capitalize">{marketplace.status}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-medium capitalize">{marketplace.category?.replace("-", " & ")}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Assets</p>
                <p className="font-medium">{marketplace.assets}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Volume</p>
                <p className="font-medium">{marketplace.volume}</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Contract Address</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm bg-muted p-2 rounded truncate">
                  {marketplace.address}
                </code>
                <Button size="sm" variant="outline" onClick={copyAddress}>
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            <Button asChild className="w-full">
              <a href={`https://amoy.polygonscan.com/address/${marketplace.address}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                View on Explorer
              </a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const MarketplaceList = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<"all" | "live" | "draft">("all");
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");

  const filteredMarketplaces = mockMarketplaces.filter(m => {
    const matchesFilter = filter === "all" || m.status === filter;
    const matchesCategory = category === "all" || m.category === category;
    const matchesSearch = search === "" || 
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.address.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="lg:pl-64">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 glass-strong border-b border-border px-4 py-4 lg:px-8 lg:h-16 flex items-center justify-between lg:justify-end gap-4">
          <h1 className="text-lg font-semibold lg:hidden">My Marketplaces</h1>
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <ConnectButton variant="outline" size="sm" />
            <Button size="sm" className="gap-2" asChild>
              <Link to="/canvas">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New</span>
              </Link>
            </Button>
          </div>
        </header>

        <div className="p-4 lg:p-8 space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search marketplaces..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto">
              {(["all", "live", "draft"] as const).map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(f)}
                  className="capitalize whitespace-nowrap"
                >
                  {f === "all" ? "All" : f === "live" ? "Live" : "Draft"}
                  <span className="ml-2 text-xs opacity-70">
                    ({f === "all" ? mockMarketplaces.length : mockMarketplaces.filter(m => m.status === f).length})
                  </span>
                </Button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Button
                  key={cat.id}
                  variant={category === cat.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategory(cat.id)}
                  className="gap-1.5 whitespace-nowrap"
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cat.label}
                </Button>
              );
            })}
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Total</p>
              <p className="text-2xl font-bold">{mockMarketplaces.length}</p>
            </div>
            <div className="glass rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Live</p>
              <p className="text-2xl font-bold text-primary">{mockMarketplaces.filter(m => m.status === "live").length}</p>
            </div>
            <div className="glass rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Total Assets</p>
              <p className="text-2xl font-bold">{mockMarketplaces.reduce((acc, m) => acc + m.assets, 0)}</p>
            </div>
            <div className="glass rounded-xl p-4">
              <p className="text-sm text-muted-foreground mb-1">Volume</p>
              <p className="text-2xl font-bold">$1.03M</p>
            </div>
          </div>

          {/* Marketplaces Grid */}
          {filteredMarketplaces.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredMarketplaces.map((marketplace) => (
                <MarketplaceCard key={marketplace.id} marketplace={marketplace} />
              ))}
            </div>
          ) : (
            <div className="glass rounded-xl p-12 text-center">
              <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No marketplaces found</h3>
              <p className="text-muted-foreground mb-4">
                {filter === "all" 
                  ? "Create your first marketplace to get started"
                  : `No ${filter} marketplaces`
                }
              </p>
              <Button asChild>
                <Link to="/canvas">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Marketplace
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MarketplaceList;
