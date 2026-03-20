import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Blocks, Plus, TrendingUp, Package, Users, DollarSign,
  ArrowRight, Home, BarChart3, Settings, Wallet, Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";

const templates = [
  { name: "Real Estate Marketplace", desc: "Tokenize properties & fractional ownership", color: "from-primary to-cyan-400", icon: Home },
  { name: "Art & Collectibles", desc: "NFT marketplace for physical art", color: "from-accent to-pink-400", icon: Package },
  { name: "Commodity Exchange", desc: "Trade tokenized commodities", color: "from-amber-500 to-orange-400", icon: BarChart3 },
];

const recentMarketplaces = [
  { name: "Lagos Real Estate Hub", status: "Live", assets: 24, volume: "$142K" },
  { name: "Buenos Aires Art Market", status: "Draft", assets: 8, volume: "$0" },
  { name: "Mexico Commodity Exchange", status: "Live", assets: 56, volume: "$890K" },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 glass-strong border-r border-border z-40 flex flex-col">
        <div className="flex items-center gap-2 p-5 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Blocks className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-bold tracking-tight">RealFlow</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { icon: Home, label: "Dashboard", active: true },
            { icon: Package, label: "My Marketplaces" },
            { icon: BarChart3, label: "Analytics" },
            { icon: Globe, label: "Explore" },
            { icon: Settings, label: "Settings" },
          ].map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                item.active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <div className="glass rounded-lg p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-primary-foreground">
              RF
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">0x7a3...f9e2</div>
              <div className="text-xs text-muted-foreground">Polygon Mumbai</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 glass-strong border-b border-border px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Wallet className="w-4 h-4" />
              12.4 MATIC
            </Button>
            <Button size="sm" className="gap-2" onClick={() => navigate("/builder")}>
              <Plus className="w-4 h-4" />
              New Marketplace
            </Button>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                className="glass rounded-xl p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <s.icon className="w-5 h-5 text-muted-foreground" />
                  <span className="text-xs text-primary">{s.change}</span>
                </div>
                <div className="text-2xl font-bold mb-1">{s.val}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Templates */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Start from a Template</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {templates.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  onClick={() => navigate("/builder")}
                  className="glass rounded-xl p-6 cursor-pointer group hover:border-primary/30 transition-all"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center mb-4`}>
                    <t.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold mb-1">{t.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{t.desc}</p>
                  <div className="flex items-center gap-1 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Use Template <ArrowRight className="w-4 h-4" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Your Marketplaces</h2>
            <div className="glass rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-sm text-muted-foreground">
                    <th className="text-left p-4 font-medium">Name</th>
                    <th className="text-left p-4 font-medium">Status</th>
                    <th className="text-left p-4 font-medium">Assets</th>
                    <th className="text-left p-4 font-medium">Volume</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {recentMarketplaces.map((m) => (
                    <tr key={m.name} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                      <td className="p-4 font-medium">{m.name}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${
                          m.status === "Live" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${m.status === "Live" ? "bg-primary" : "bg-muted-foreground"}`} />
                          {m.status}
                        </span>
                      </td>
                      <td className="p-4 text-muted-foreground">{m.assets}</td>
                      <td className="p-4 text-muted-foreground">{m.volume}</td>
                      <td className="p-4">
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
      </main>
    </div>
  );
};

export default Dashboard;
