import { motion } from "framer-motion";
import {
  TrendingUp, TrendingDown, Users, Package, DollarSign,
  BarChart3, PieChart, Activity, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "@/hooks/useAuth";

const stats = [
  { label: "Total Volume", value: "$1.03M", change: "+12.5%", up: true, icon: DollarSign },
  { label: "Active Users", value: "2,847", change: "+340", up: true, icon: Users },
  { label: "Assets Tokenized", value: "88", change: "+15", up: true, icon: Package },
  { label: "Marketplaces", value: "3", change: "+1", up: true, icon: BarChart3 },
];

const volumeData = [
  { month: "Jan", volume: 42000 },
  { month: "Feb", volume: 58000 },
  { month: "Mar", volume: 45000 },
  { month: "Apr", volume: 72000 },
  { month: "May", volume: 89000 },
  { month: "Jun", volume: 105000 },
];

const assetBreakdown = [
  { type: "Real Estate", count: 35, percentage: 40 },
  { type: "Art & Collectibles", count: 28, percentage: 32 },
  { type: "Commodities", count: 15, percentage: 17 },
  { type: "Other", count: 10, percentage: 11 },
];

const Analytics = () => {
  const { user, connectWallet } = useAuth();
  const maxVolume = Math.max(...volumeData.map(d => d.volume));

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="lg:pl-64">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 glass-strong border-b border-border px-4 py-4 lg:px-8 lg:h-16 flex items-center justify-between">
          <h1 className="text-lg font-semibold lg:hidden">Analytics</h1>
          <h1 className="hidden lg:block text-xl font-semibold">Analytics</h1>
          <div className="flex items-center gap-3">
            {user.isWalletConnected ? (
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <Activity className="w-4 h-4" />
                Live
              </div>
            ) : (
              <button
                onClick={connectWallet}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Connect wallet to view live data
              </button>
            )}
          </div>
        </header>

        <div className="p-4 lg:p-8 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-xl p-4 lg:p-5"
              >
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground" />
                  <span className={`flex items-center gap-0.5 text-xs font-medium ${
                    stat.up ? "text-primary" : "text-destructive"
                  }`}>
                    {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {stat.change}
                  </span>
                </div>
                <div className="text-xl lg:text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-xs lg:text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Charts */}
          <Tabs defaultValue="volume" className="space-y-4">
            <TabsList className="grid w-full lg:w-auto grid-cols-2 lg:grid-cols-4 h-auto p-1">
              <TabsTrigger value="volume" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Volume</span>
              </TabsTrigger>
              <TabsTrigger value="assets" className="gap-2">
                <PieChart className="w-4 h-4" />
                <span className="hidden sm:inline">Assets</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="gap-2">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Users</span>
              </TabsTrigger>
              <TabsTrigger value="growth" className="gap-2">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Growth</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="volume" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Trading Volume</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 lg:h-64 flex items-end justify-between gap-2">
                    {volumeData.map((d, i) => (
                      <motion.div
                        key={d.month}
                        initial={{ height: 0 }}
                        animate={{ height: `${(d.volume / maxVolume) * 100}%` }}
                        transition={{ delay: i * 0.1 }}
                        className="flex-1 bg-gradient-to-t from-primary/80 to-primary rounded-t-lg relative group"
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-muted px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          ${d.volume.toLocaleString()}
                        </div>
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
                          {d.month}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assets" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Asset Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {assetBreakdown.map((asset) => (
                    <div key={asset.type} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>{asset.type}</span>
                        <span className="text-muted-foreground">{asset.count} ({asset.percentage}%)</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${asset.percentage}%` }}
                          className="h-full bg-primary rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">User Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>User analytics coming soon</p>
                    <p className="text-sm">Connect your wallet to track activity</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="growth">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Growth Metrics</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="glass rounded-lg p-4">
                    <TrendingUp className="w-8 h-8 text-primary mb-2" />
                    <p className="text-2xl font-bold">+340</p>
                    <p className="text-sm text-muted-foreground">New Users (30d)</p>
                  </div>
                  <div className="glass rounded-lg p-4">
                    <TrendingUp className="w-8 h-8 text-primary mb-2" />
                    <p className="text-2xl font-bold">+$23K</p>
                    <p className="text-sm text-muted-foreground">Volume Growth (30d)</p>
                  </div>
                  <div className="glass rounded-lg p-4">
                    <TrendingUp className="w-8 h-8 text-primary mb-2" />
                    <p className="text-2xl font-bold">+15</p>
                    <p className="text-sm text-muted-foreground">New Assets (30d)</p>
                  </div>
                  <div className="glass rounded-lg p-4">
                    <TrendingUp className="w-8 h-8 text-primary mb-2" />
                    <p className="text-2xl font-bold">+1</p>
                    <p className="text-sm text-muted-foreground">New Marketplaces (30d)</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
