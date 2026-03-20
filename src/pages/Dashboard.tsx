import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Blocks, Plus, TrendingUp, Package, Users, DollarSign,
  ArrowRight, BarChart3, Settings, Wallet, Globe, Menu, X, LogOut, Eye, Building2, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface Template {
  name: string;
  desc: string;
  color: string;
  icon: React.ElementType;
  features: string[];
  components: string[];
}

const templates: Template[] = [
  { 
    name: "Real Estate Marketplace", 
    desc: "Tokenize properties & fractional ownership", 
    color: "from-primary to-cyan-400", 
    icon: DollarSign,
    features: ["Property tokenization", "Fractional ownership", "Rental income distribution", "KYC/AML compliance"],
    components: ["Property Upload", "Token Mint", "Listing Grid", "Ownership Ledger", "Dividend Distributor"]
  },
  { 
    name: "Art & Collectibles", 
    desc: "NFT marketplace for physical art", 
    color: "from-accent to-pink-400", 
    icon: Package,
    features: ["Physical asset backing", "Provenance tracking", "Auction functionality", "Royalty distribution"],
    components: ["Art Upload", "NFT Mint", "Gallery Grid", "Bid Engine", "Provenance Tracker"]
  },
  { 
    name: "Commodity Exchange", 
    desc: "Trade tokenized commodities", 
    color: "from-amber-500 to-orange-400", 
    icon: BarChart3,
    features: ["Real-time pricing", "Multi-commodity support", "Settlement automation", "Warehouse verification"],
    components: ["Commodity Upload", "Token Mint", "Exchange Grid", "Price Oracle", "Settlement Engine"]
  },
];

const recentMarketplaces = [
  { name: "Lagos Real Estate Hub", status: "Live", assets: 24, volume: "$142K" },
  { name: "Buenos Aires Art Market", status: "Draft", assets: 8, volume: "$0" },
  { name: "Mexico Commodity Exchange", status: "Live", assets: 56, volume: "$890K" },
];

const navItems = [
  { icon: Blocks, label: "Dashboard", path: "/dashboard" },
  { icon: Package, label: "My Marketplaces", path: "/marketplaces" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: Globe, label: "Explore", path: "/explore" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, connectWallet, disconnectWallet } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 glass-strong border-b border-border px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 -ml-2 hover:bg-secondary rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Blocks className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="font-bold tracking-tight">RealFlow</span>
          </div>
        </div>
        <Button size="sm" className="gap-2" onClick={() => navigate("/builder")}>
          <Plus className="w-4 h-4" />
          New
        </Button>
      </header>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-[280px] glass-strong border-r border-border z-50 flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Blocks className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="font-bold tracking-tight">RealFlow</span>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 hover:bg-secondary rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors bg-primary/10 text-primary"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="p-4 border-t border-border">
                {user.isWalletConnected ? (
                  <div className="glass rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-primary-foreground">
                        {user.address ? `${user.address.slice(2,4)}` : "RF"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {user.address ? `${user.address.slice(0,6)}...${user.address.slice(-4)}` : "Not Connected"}
                        </div>
                        <div className="text-xs text-muted-foreground">Polygon Amoy</div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full gap-2 text-destructive"
                      onClick={disconnectWallet}
                    >
                      <LogOut className="w-4 h-4" />
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" className="w-full gap-2" onClick={connectWallet}>
                    <Wallet className="w-4 h-4" />
                    Connect Wallet
                  </Button>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 glass-strong border-r border-border z-40 flex-col shrink-0 fixed left-0 top-0 h-full">
        <div className="flex items-center gap-2 p-5 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Blocks className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold tracking-tight">RealFlow</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors bg-primary/10 text-primary"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          {user.isWalletConnected ? (
            <div className="glass rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-primary-foreground">
                  {user.address ? `${user.address.slice(2,4)}` : "RF"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {user.address ? `${user.address.slice(0,6)}...${user.address.slice(-4)}` : "Not Connected"}
                  </div>
                  <div className="text-xs text-muted-foreground">Polygon Amoy</div>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full gap-2 text-destructive"
                onClick={disconnectWallet}
              >
                <LogOut className="w-4 h-4" />
                Disconnect
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" className="w-full gap-2" onClick={connectWallet}>
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </Button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64 pt-16 lg:pt-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 glass-strong border-b border-border px-4 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-lg lg:text-xl font-semibold hidden lg:block">Dashboard</h1>
          <div className="flex items-center gap-2 lg:gap-3 w-full lg:w-auto justify-end">
            {user.isWalletConnected ? (
              <Button variant="outline" size="sm" className="gap-2">
                <Wallet className="w-4 h-4" />
                <span className="hidden sm:inline">12.4 MATIC</span>
              </Button>
            ) : (
              <Button size="sm" className="gap-2" onClick={connectWallet}>
                <Wallet className="w-4 h-4" />
                Connect
              </Button>
            )}
            <Button size="sm" className="gap-2 hidden lg:flex" onClick={() => navigate("/builder")}>
              <Plus className="w-4 h-4" />
              New Marketplace
            </Button>
          </div>
        </header>

        <div className="p-4 lg:p-8 space-y-6 lg:space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {[
              { icon: Package, label: "Active Marketplaces", val: "3", change: "+1 this week" },
              { icon: DollarSign, label: "Total Volume", val: "$1.03M", change: "+12.5%" },
              { icon: Users, label: "Total Users", val: "2,847", change: "+340" },
              { icon: TrendingUp, label: "Assets Tokenized", val: "88", change: "+15" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-xl p-4 lg:p-5"
              >
                <div className="flex items-center justify-between mb-2 lg:mb-3">
                  <s.icon className="w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground" />
                  <span className="text-xs text-primary">{s.change}</span>
                </div>
                <div className="text-xl lg:text-2xl font-bold mb-1">{s.val}</div>
                <div className="text-xs lg:text-sm text-muted-foreground hidden sm:block">{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Templates */}
          <div>
            <h2 className="text-base lg:text-lg font-semibold mb-3 lg:mb-4">Start from a Template</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
              {templates.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  onClick={() => setSelectedTemplate(t)}
                  className="glass rounded-xl p-4 lg:p-6 cursor-pointer group hover:border-primary/30 transition-all"
                >
                  <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center mb-3 lg:mb-4`}>
                    <t.icon className="w-5 h-5 lg:w-6 lg:h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold mb-1 text-sm lg:text-base">{t.name}</h3>
                  <p className="text-xs lg:text-sm text-muted-foreground mb-3 lg:mb-4 line-clamp-2">{t.desc}</p>
                  <div className="flex items-center gap-1 text-xs lg:text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Preview <Eye className="w-3 h-3 lg:w-4 lg:h-4" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent */}
          <div>
            <h2 className="text-base lg:text-lg font-semibold mb-3 lg:mb-4">Your Marketplaces</h2>
            <div className="glass rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="border-b border-border text-xs lg:text-sm text-muted-foreground">
                      <th className="text-left p-3 lg:p-4 font-medium">Name</th>
                      <th className="text-left p-3 lg:p-4 font-medium hidden sm:table-cell">Status</th>
                      <th className="text-left p-3 lg:p-4 font-medium">Assets</th>
                      <th className="text-left p-3 lg:p-4 font-medium hidden md:table-cell">Volume</th>
                      <th className="p-3 lg:p-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentMarketplaces.map((m) => (
                      <tr key={m.name} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="p-3 lg:p-4 font-medium text-sm">{m.name}</td>
                        <td className="p-3 lg:p-4 hidden sm:table-cell">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                            m.status === "Live" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${m.status === "Live" ? "bg-primary" : "bg-muted-foreground"}`} />
                            {m.status}
                          </span>
                        </td>
                        <td className="p-3 lg:p-4 text-muted-foreground text-sm">{m.assets}</td>
                        <td className="p-3 lg:p-4 text-muted-foreground text-sm hidden md:table-cell">{m.volume}</td>
                        <td className="p-3 lg:p-4">
                          <Button variant="ghost" size="sm" onClick={() => navigate("/builder")}>
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {selectedTemplate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedTemplate(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-strong rounded-2xl max-w-lg w-full p-6 border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedTemplate.color} flex items-center justify-center`}>
                    <selectedTemplate.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedTemplate.name}</h3>
                    <p className="text-sm text-muted-foreground">Template Preview</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedTemplate(null)}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-muted-foreground mb-4">{selectedTemplate.desc}</p>

              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Included Components
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.components.map((comp) => (
                    <span 
                      key={comp}
                      className="text-xs px-2.5 py-1 rounded-full bg-secondary text-muted-foreground"
                    >
                      {comp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium mb-2">Key Features</h4>
                <ul className="space-y-1.5">
                  {selectedTemplate.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 gap-2"
                  onClick={() => setSelectedTemplate(null)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 gap-2"
                  onClick={() => {
                    setSelectedTemplate(null);
                    navigate("/builder");
                  }}
                >
                  <Building2 className="w-4 h-4" />
                  Use This Template
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
