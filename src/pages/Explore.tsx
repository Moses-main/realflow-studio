import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Globe, Search, Filter, MapPin, TrendingUp, Users,
  Home, Palette, BarChart3, ExternalLink, Heart, Share2,
  AlertTriangle, RefreshCw, Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Sidebar from "@/components/layout/Sidebar";
import { useMarketplaces } from "@/hooks/useData";

const categories = [
  { value: "all", label: "All Categories", icon: Globe },
  { value: "real-estate", label: "Real Estate", icon: Home },
  { value: "art", label: "Art & Collectibles", icon: Palette },
  { value: "commodities", label: "Commodities", icon: BarChart3 },
];

const Explore = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("trending");
  const { data: marketplaces, loading, error } = useMarketplaces({ 
    status: "live", 
    category: category !== "all" ? category : undefined,
    search: search !== "" ? search : undefined
  });

  const sortedMarketplaces = useMemo(() => {
    if (!marketplaces) return [];
    
    return [...marketplaces].sort((a, b) => {
      if (sortBy === "trending") {
        // For trending, we'll use volume as a proxy since we don't have trend data
        return parseFloat(b.volumeFormatted.replace(/[^0-9.]/g, '')) - 
               parseFloat(a.volumeFormatted.replace(/[^0-9.]/g, ''));
      } else if (sortBy === "volume") {
        return parseFloat(b.volumeFormatted.replace(/[^0-9.]/g, '')) - 
               parseFloat(a.volumeFormatted.replace(/[^0-9.]/g, ''));
      } else if (sortBy === "assets") {
        return b.assets - a.assets;
      }
      return 0;
    });
  }, [marketplaces, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="lg:pl-64">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 glass-strong border-b border-border px-4 py-4 lg:px-8 lg:h-16 flex items-center justify-between">
          <h1 className="text-lg font-semibold lg:hidden">Explore</h1>
          <h1 className="hidden lg:block text-xl font-semibold">Explore Marketplaces</h1>
        </header>

        <div className="p-4 lg:p-8 space-y-6">
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search marketplaces..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trending">Trending</SelectItem>
                  <SelectItem value="volume">Volume</SelectItem>
                  <SelectItem value="assets">Most Assets</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

           {/* Stats Banner */}
           <div className="glass rounded-xl p-4 flex items-center justify-around text-center">
             <div>
               <p className="text-2xl font-bold">{marketplaces?.length || 0}</p>
               <p className="text-xs text-muted-foreground">Marketplaces</p>
             </div>
             <div className="h-8 w-px bg-border" />
             <div>
               <p className="text-2xl font-bold">
                 {marketplaces ? 
                   `$${marketplaces.reduce((sum, m) => sum + parseFloat(m.volumeFormatted.replace(/[^0-9.]/g, '') || 0), 0).toFixed(2)}M` 
                   : '$0M'}
               </p>
               <p className="text-xs text-muted-foreground">Total Volume</p>
             </div>
             <div className="h-8 w-px bg-border" />
             <div>
               <p className="text-2xl font-bold">0</p>
               <p className="text-xs text-muted-foreground">Total Users</p>
             </div>
           </div>

           {/* Marketplaces Grid */}
           {loading ? (
             <div className="flex flex-col items-center justify-center py-12">
               <div className="flex space-x-3">
                 <div className="w-8 h-8 border-2 border-primary rounded-full animate-spin"></div>
                 <div className="w-8 h-8 border-2 border-primary rounded-full animate-spin" style={{ animationDelay: '200ms' }}></div>
                 <div className="w-8 h-8 border-2 border-primary rounded-full animate-spin" style={{ animationDelay: '400ms' }}></div>
               </div>
               <p className="mt-4 text-sm text-muted-foreground">Loading marketplaces...</p>
             </div>
           ) : error ? (
             <div className="glass rounded-xl p-12 text-center">
               <div className="text-destructive">
                 <AlertTriangle className="w-6 h-6 mx-auto mb-3" />
               </div>
               <h3 className="text-lg font-semibold mb-2">Error loading marketplaces</h3>
               <p className="text-sm text-muted-foreground">{error}</p>
               <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                 <RefreshCw className="w-4 h-4 mr-2" />
                 Try Again
               </Button>
             </div>
           ) : sortedMarketplaces.length > 0 ? (
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
               {sortedMarketplaces.map((marketplace, i) => (
                 <motion.div
                   key={marketplace.id || i}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.05 }}
                   className="glass rounded-xl overflow-hidden hover:border-primary/30 transition-all group"
                 >
                   <div className={`h-32 relative`}>
                     {/* Use a default gradient if no image is specified */}
                     <div className={`h-32 bg-gradient-to-br from-blue-500 to-purple-600 relative`}>
                       <div className="absolute top-3 left-3">
                         <Badge variant="secondary" className="bg-black/50 backdrop-blur text-white border-0">
                           {marketplace.category}
                         </Badge>
                       </div>
                       <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-black/50 backdrop-blur hover:bg-black/70">
                           <Heart className="w-4 h-4" />
                         </Button>
                         <Button size="sm" variant="secondary" className="h-8 w-8 p-0 bg-black/50 backdrop-blur hover:bg-black/70">
                           <Share2 className="w-4 h-4" />
                         </Button>
                       </div>
                     </div>
                   </div>
                   <div className="p-4">
                     <div className="flex items-start justify-between mb-2">
                       <div>
                         <h3 className="font-semibold group-hover:text-primary transition-colors">
                           {marketplace.name}
                         </h3>
                         <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                           <MapPin className="w-3 h-3" />
                           {marketplace.location || 'Unknown Location'}
                         </p>
                       </div>
                       <div className={`flex items-center gap-1 text-xs font-medium text-primary ${
                         (marketplace.volumeFormatted || '0').startsWith('-') ? "text-destructive" : ""
                       }`}>
                         <TrendingUp className="w-3 h-3" />
                         {(marketplace.volumeFormatted || '0').replace('$', '')}
                       </div>
                     </div>
                     
                     <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                       <span className="flex items-center gap-1">
                         <BarChart3 className="w-4 h-4" />
                         {marketplace.assets || 0}
                       </span>
                       <span className="flex items-center gap-1">
                         <TrendingUp className="w-4 h-4" />
                         0%
                       </span>
                       <span className="flex items-center gap-1">
                         <Users className="w-4 h-4" />
                         0
                       </span>
                     </div>
 
                     <Button variant="outline" size="sm" className="w-full gap-2" asChild>
                       <a 
                         href={marketplace.address 
                           ? `https://amoy.polygonscan.com/address/${marketplace.address}` 
                           : '#'} 
                         target="_blank" 
                         rel="noopener noreferrer"
                       >
                         View Contract
                         <ExternalLink className="w-3 h-3" />
                       </a>
                     </Button>
                   </div>
                 </motion.div>
               ))}
             </div>
           ) : (
             <div className="glass rounded-xl p-12 text-center">
               <Globe className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
               <h3 className="text-lg font-semibold mb-2">No marketplaces found</h3>
               <p className="text-muted-foreground">
                 Try deploying a marketplace or adjusting your search or filters
               </p>
               {!loading && !error && (
                 <div className="mt-6">
                   <Button variant="outline" size="sm" asChild>
                     <a href="/builder">
                       <Plus className="w-4 h-4 mr-2" />
                       Create Your First Marketplace
                     </a>
                   </Button>
                 </div>
               )}
             </div>
           )}
        </div>
      </main>
    </div>
  );
};

export default Explore;
