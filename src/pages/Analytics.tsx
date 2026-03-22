import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, Users, Package, DollarSign,
  BarChart3, PieChart, Activity, ArrowUpRight, ArrowDownRight,
  RefreshCw, Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useAnalytics, useMarketplaces, useStats } from "@/hooks/useData";
import { ConnectButton } from "@/components/auth/ConnectButton";
import ContractService from "@/services/contracts";

const Analytics = () => {
  const { user } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Fetch real data
  const { data: analyticsData, loading: analyticsLoading, refetch: refetchAnalytics } = useAnalytics();
  const { data: marketplacesData, loading: marketplacesLoading, refetch: refetchMarketplaces } = useMarketplaces();
  const { data: statsData, loading: statsLoading, refetch: refetchStats } = useStats();

  // Handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetchAnalytics(),
        refetchMarketplaces(),
        refetchStats(),
      ]);
    } catch (error) {
      console.error('Error refreshing analytics data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Process real data for display
  const stats = useMemo(() => {
    if (statsData && statsData.length > 0) {
      return statsData;
    }
    
    // Fallback stats when no data available
    return [
      { label: "Total Volume", value: "$0", change: null, up: true, icon: DollarSign },
      { label: "Active Users", value: "0", change: null, up: true, icon: Users },
      { label: "Assets Tokenized", value: "0", change: null, up: true, icon: Package },
      { label: "Marketplaces", value: "0", change: null, up: true, icon: BarChart3 },
    ];
  }, [statsData]);

  const volumeData = useMemo(() => {
    if (analyticsData?.volumeData && analyticsData.volumeData.length > 0) {
      return analyticsData.volumeData;
    }
    
    // Fallback empty data
    return [];
  }, [analyticsData]);

  const assetBreakdown = useMemo(() => {
    if (analyticsData?.assetBreakdown && analyticsData.assetBreakdown.length > 0) {
      return analyticsData.assetBreakdown.map(asset => ({
        type: asset.name,
        count: asset.value,
        percentage: asset.value
      }));
    }
    
    // Fallback empty data
    return [];
  }, [analyticsData]);

  const maxVolume = useMemo(
    () => volumeData.length > 0 ? Math.max(...volumeData.map(d => d.value)) : 100,
    [volumeData]
  );

  const isLoading = analyticsLoading || marketplacesLoading || statsLoading;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="lg:pl-64">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 glass-strong border-b border-border px-4 py-4 lg:px-8 lg:h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold lg:hidden">Analytics</h1>
            <h1 className="hidden lg:block text-xl font-semibold">Analytics</h1>
            {user.isAuthenticated && (
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <Activity className="w-4 h-4" />
                Live Blockchain Data
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            {user.isAuthenticated && (
              <button
                onClick={handleRefresh}
                disabled={isRefreshing || isLoading}
                className="p-2 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] transition-colors disabled:opacity-50"
                title="Refresh data"
              >
                {isRefreshing || isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
              </button>
            )}
            {!user.isAuthenticated && <ConnectButton variant="ghost" size="sm" />}
          </div>
        </header>

        <div className="p-4 lg:p-8 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="glass rounded-xl p-4 lg:p-5 animate-pulse">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-4 h-4 lg:w-5 lg:h-5 bg-[var(--surface-elevated)] rounded" />
                    <div className="w-12 h-4 bg-[var(--surface-elevated)] rounded" />
                  </div>
                  <div className="h-6 lg:h-7 w-16 lg:w-20 bg-[var(--surface-elevated)] rounded mb-2" />
                  <div className="h-3 w-20 bg-[var(--surface-elevated)] rounded" />
                </div>
              ))
            ) : (
              stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass rounded-xl p-4 lg:p-5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className="w-4 h-4 lg:w-5 lg:h-5 text-muted-foreground" />
                    {stat.change && (
                      <span className={`flex items-center gap-0.5 text-xs font-medium ${
                        stat.up ? "text-primary" : "text-destructive"
                      }`}>
                        {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {stat.change}
                      </span>
                    )}
                  </div>
                  <div className="text-xl lg:text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-xs lg:text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))
            )}
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
                  {isLoading ? (
                    <div className="h-48 lg:h-64 flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                    </div>
                  ) : volumeData.length > 0 ? (
                    <div className="h-48 lg:h-64 flex items-end justify-between gap-2">
                      {volumeData.map((d, i) => (
                        <motion.div
                          key={d.date}
                          initial={{ height: 0 }}
                          animate={{ height: `${(d.value / maxVolume) * 100}%` }}
                          transition={{ delay: i * 0.1 }}
                          className="flex-1 bg-gradient-to-t from-primary/80 to-primary rounded-t-lg relative group"
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-muted px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            ${d.value.toLocaleString()}
                          </div>
                          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
                            {d.date}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-48 lg:h-64 flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No volume data available</p>
                        <p className="text-sm">Deploy marketplaces to see trading volume</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assets" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Asset Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoading ? (
                    <div className="space-y-4">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="space-y-2 animate-pulse">
                          <div className="flex items-center justify-between text-sm">
                            <div className="w-20 h-4 bg-[var(--surface-elevated)] rounded" />
                            <div className="w-16 h-4 bg-[var(--surface-elevated)] rounded" />
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-[var(--surface-elevated)] rounded-full w-3/4" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : assetBreakdown.length > 0 ? (
                    assetBreakdown.map((asset) => (
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
                    ))
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <PieChart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No asset data available</p>
                      <p className="text-sm">Tokenize assets to see breakdown</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">User Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-12">
                      <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-muted-foreground" />
                      <p className="text-muted-foreground">Loading user data...</p>
                    </div>
                  ) : marketplacesData && marketplacesData.length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="glass rounded-lg p-4">
                          <Users className="w-8 h-8 text-primary mb-2" />
                          <p className="text-2xl font-bold">{marketplacesData.length}</p>
                          <p className="text-sm text-muted-foreground">Active Marketplaces</p>
                        </div>
                        <div className="glass rounded-lg p-4">
                          <Activity className="w-8 h-8 text-primary mb-2" />
                          <p className="text-2xl font-bold">Live</p>
                          <p className="text-sm text-muted-foreground">Blockchain Status</p>
                        </div>
                      </div>
                      <div className="text-center py-8 text-muted-foreground">
                        <p>Connect your wallet to track detailed user activity</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No user activity yet</p>
                      <p className="text-sm">Deploy marketplaces to see user activity</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="growth">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Growth Metrics</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  {isLoading ? (
                    [...Array(4)].map((_, i) => (
                      <div key={i} className="glass rounded-lg p-4 animate-pulse">
                        <div className="w-8 h-8 bg-[var(--surface-elevated)] rounded mb-2" />
                        <div className="h-6 w-12 bg-[var(--surface-elevated)] rounded mb-2" />
                        <div className="h-4 w-20 bg-[var(--surface-elevated)] rounded" />
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="glass rounded-lg p-4">
                        <TrendingUp className="w-8 h-8 text-primary mb-2" />
                        <p className="text-2xl font-bold">{marketplacesData?.length || 0}</p>
                        <p className="text-sm text-muted-foreground">Total Marketplaces</p>
                      </div>
                      <div className="glass rounded-lg p-4">
                        <Package className="w-8 h-8 text-primary mb-2" />
                        <p className="text-2xl font-bold">0</p>
                        <p className="text-sm text-muted-foreground">Total Volume (MATIC)</p>
                      </div>
                      <div className="glass rounded-lg p-4">
                        <DollarSign className="w-8 h-8 text-primary mb-2" />
                        <p className="text-2xl font-bold">0</p>
                        <p className="text-sm text-muted-foreground">Assets Tokenized</p>
                      </div>
                      <div className="glass rounded-lg p-4">
                        <Activity className="w-8 h-8 text-primary mb-2" />
                        <p className="text-2xl font-bold">Live</p>
                        <p className="text-sm text-muted-foreground">Network Status</p>
                      </div>
                    </>
                  )}
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
