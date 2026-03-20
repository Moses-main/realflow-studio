import { useState } from "react";
import { motion } from "framer-motion";
import {
  Globe, Search, Filter, MapPin, TrendingUp, Users,
  Home, Palette, BarChart3, ExternalLink, Heart, Share2
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

const featuredMarketplaces = [
  {
    id: "1",
    name: "Lagos Real Estate Hub",
    creator: "0x742d...f123",
    location: "Nigeria",
    category: "Real Estate",
    assets: 156,
    volume: "$2.4M",
    trend: "+24%",
    image: "bg-gradient-to-br from-cyan-500 to-blue-600"
  },
  {
    id: "2",
    name: "Buenos Aires Art Collective",
    creator: "0x8626...1199",
    location: "Argentina",
    category: "Art",
    assets: 89,
    volume: "$890K",
    trend: "+18%",
    image: "bg-gradient-to-br from-pink-500 to-purple-600"
  },
  {
    id: "3",
    name: "Mexico City Commodities",
    creator: "0xdD2F...4C0",
    location: "Mexico",
    category: "Commodities",
    assets: 234,
    volume: "$5.1M",
    trend: "+31%",
    image: "bg-gradient-to-br from-amber-500 to-orange-600"
  },
  {
    id: "4",
    name: "Sao Paulo Properties",
    creator: "0xa0C6...3E5",
    location: "Brazil",
    category: "Real Estate",
    assets: 312,
    volume: "$8.7M",
    trend: "+42%",
    image: "bg-gradient-to-br from-green-500 to-emerald-600"
  },
  {
    id: "5",
    name: "LATAM Digital Art",
    creator: "0x4B59...7F8",
    location: "Colombia",
    category: "Art",
    assets: 567,
    volume: "$1.2M",
    trend: "+15%",
    image: "bg-gradient-to-br from-violet-500 to-indigo-600"
  },
  {
    id: "6",
    name: "Nigeria Agriculture DAO",
    creator: "0x18C5...2A9",
    location: "Nigeria",
    category: "Agriculture",
    assets: 445,
    volume: "$3.8M",
    trend: "+28%",
    image: "bg-gradient-to-br from-lime-500 to-green-600"
  },
];

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

  const filteredMarketplaces = featuredMarketplaces.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.location.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || 
      m.category.toLowerCase().replace(" ", "-") === category;
    return matchesSearch && matchesCategory;
  });

  const sortedMarketplaces = [...filteredMarketplaces].sort((a, b) => {
    if (sortBy === "trending") {
      return parseFloat(b.trend) - parseFloat(a.trend);
    } else if (sortBy === "volume") {
      return parseFloat(b.volume.replace(/[^0-9.]/g, '')) - parseFloat(a.volume.replace(/[^0-9.]/g, ''));
    } else if (sortBy === "assets") {
      return b.assets - a.assets;
    }
    return 0;
  });

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
              <p className="text-2xl font-bold">6</p>
              <p className="text-xs text-muted-foreground">Marketplaces</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <p className="text-2xl font-bold">$22.1M</p>
              <p className="text-xs text-muted-foreground">Total Volume</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <p className="text-2xl font-bold">1,803</p>
              <p className="text-xs text-muted-foreground">Total Users</p>
            </div>
          </div>

          {/* Marketplaces Grid */}
          {sortedMarketplaces.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {sortedMarketplaces.map((marketplace, i) => (
                <motion.div
                  key={marketplace.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass rounded-xl overflow-hidden hover:border-primary/30 transition-all group"
                >
                  <div className={`h-32 ${marketplace.image} relative`}>
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
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold group-hover:text-primary transition-colors">
                          {marketplace.name}
                        </h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {marketplace.location}
                        </p>
                      </div>
                      <div className={`flex items-center gap-1 text-xs font-medium text-primary ${
                        marketplace.trend.startsWith("+") ? "" : "text-destructive"
                      }`}>
                        <TrendingUp className="w-3 h-3" />
                        {marketplace.trend}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <BarChart3 className="w-4 h-4" />
                        {marketplace.assets}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        {marketplace.volume}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {Math.floor(parseInt(marketplace.id) * 137.5) + 100}
                      </span>
                    </div>

                    <Button variant="outline" size="sm" className="w-full gap-2" asChild>
                      <a href={`https://amoy.polygonscan.com/address/${marketplace.creator}`} target="_blank" rel="noopener noreferrer">
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
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Explore;
