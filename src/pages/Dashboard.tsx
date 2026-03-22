import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Blocks, Rocket, ArrowRight, Plus, Settings, Bell,
  TrendingUp, Wallet, ExternalLink, Clock, BarChart3, Home,
  Loader2, RefreshCw, Package, Globe, Activity
} from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import { ThemeToggleDropdown } from "@/components/theme/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/components/theme/LanguageSwitcher";
import { useStats, useMarketplaces, useTemplates } from "@/hooks/useData";
import { ConnectButton } from "@/components/auth/ConnectButton";
import ContractService from "@/services/contracts";

const navItems = [
  { icon: Blocks, label: "Dashboard", path: "/dashboard" },
  { icon: Package, label: "My Marketplaces", path: "/marketplaces" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: Globe, label: "Explore", path: "/explore" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Dynamic data from hooks (now with real blockchain data)
  const { data: statsData, loading: statsLoading, refetch: refetchStats } = useStats();
  const { data: marketplacesData, loading: marketplacesLoading, refetch: refetchMarketplaces } = useMarketplaces();
  const { data: templatesData, loading: templatesLoading, refetch: refetchTemplates } = useTemplates();

  // Map icon strings to components
  const iconMap: Record<string, React.ElementType> = {
    TrendingUp,
    Wallet,
  };

  const stats = statsData?.map(s => ({
    ...s,
    icon: iconMap[s.icon] || TrendingUp,
  })) || [];

  const recentMarketplaces = marketplacesData || [];
  const templates = templatesData || [];

  // Handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetchStats(),
        refetchMarketplaces(),
        refetchTemplates(),
      ]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--app-bg)] flex">
      <Sidebar />
      
      <main className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-[var(--app-bg)]/80 backdrop-blur-md border-b border-[var(--border)]">
          <div className="flex items-center justify-between px-6 h-14">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </button>
              <div className="w-px h-4 bg-[var(--border)]" />
              <h1 className="text-base font-semibold text-[var(--text-primary)]">{t("dashboard.title")}</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] transition-colors disabled:opacity-50"
                title="Refresh data"
              >
                {isRefreshing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
              </button>
              <ThemeToggleDropdown />
              <button className="p-2 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] transition-colors">
                <Bell className="w-4 h-4" />
              </button>
              <ConnectButton variant="outline" size="sm" />
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Quick Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-heading text-xl mb-1">Welcome back{user?.name ? `, ${user.name}` : ''}</h2>
              <p className="text-sm text-[var(--text-secondary)]">Build and manage your RWA marketplaces on Polygon</p>
            </div>
            <button
              onClick={() => navigate("/canvas")}
              className="btn-primary flex items-center gap-2 shadow-lg hover:shadow-xl transition-shadow"
            >
              <Plus className="w-4 h-4" />
              Create Marketplace
            </button>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <button
              onClick={() => navigate("/canvas")}
              className="p-4 rounded-lg surface hover:surface-hover text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center mb-3 group-hover:bg-[var(--primary)]/20 transition-colors">
                <Plus className="w-4 h-4 text-[var(--primary)]" />
              </div>
              <div className="text-sm font-medium text-[var(--text-primary)] mb-1">Create Marketplace</div>
              <div className="text-xs text-[var(--text-muted)]">Build new RWA marketplace</div>
            </button>
            
            <button
              onClick={() => navigate("/marketplaces")}
              className="p-4 rounded-lg surface hover:surface-hover text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-[var(--surface-elevated)] flex items-center justify-center mb-3 group-hover:bg-[var(--surface-elevated-hover)] transition-colors">
                <Package className="w-4 h-4 text-[var(--text-muted)]" />
              </div>
              <div className="text-sm font-medium text-[var(--text-primary)] mb-1">My Marketplaces</div>
              <div className="text-xs text-[var(--text-muted)]">Manage deployed marketplaces</div>
            </button>
            
            <button
              onClick={() => navigate("/analytics")}
              className="p-4 rounded-lg surface hover:surface-hover text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-[var(--surface-elevated)] flex items-center justify-center mb-3 group-hover:bg-[var(--surface-elevated-hover)] transition-colors">
                <BarChart3 className="w-4 h-4 text-[var(--text-muted)]" />
              </div>
              <div className="text-sm font-medium text-[var(--text-primary)] mb-1">Analytics</div>
              <div className="text-xs text-[var(--text-muted)]">View performance metrics</div>
            </button>
            
            <button
              onClick={() => navigate("/explore")}
              className="p-4 rounded-lg surface hover:surface-hover text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-[var(--surface-elevated)] flex items-center justify-center mb-3 group-hover:bg-[var(--surface-elevated-hover)] transition-colors">
                <Globe className="w-4 h-4 text-[var(--text-muted)]" />
              </div>
              <div className="text-sm font-medium text-[var(--text-primary)] mb-1">Explore</div>
              <div className="text-xs text-[var(--text-muted)]">Discover marketplaces</div>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statsLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="flex items-start justify-between mb-3">
                    <div className="h-3 w-20 bg-[var(--surface-elevated)] rounded" />
                    <div className="w-8 h-8 rounded-lg bg-[var(--surface-elevated)]" />
                  </div>
                  <div className="h-7 w-24 bg-[var(--surface-elevated)] rounded mb-2" />
                  <div className="h-3 w-16 bg-[var(--surface-elevated)] rounded" />
                </div>
              ))
            ) : stats.length > 0 ? stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="card"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-overline">{stat.label}</span>
                  <div className="w-8 h-8 rounded-lg bg-[var(--surface-elevated)] flex items-center justify-center">
                    <stat.icon className="w-4 h-4 text-[var(--text-muted)]" />
                  </div>
                </div>
                <div className="text-2xl font-semibold text-[var(--text-primary)] mb-1">{stat.value}</div>
                {stat.change && (
                  <span className={`text-xs ${stat.positive ? 'text-[var(--success)]' : 'text-[var(--error)]'}`}>
                    {stat.change}
                  </span>
                )}
                <div className="text-xs text-[var(--text-muted)] mt-1">
                  {stat.label === "Total Marketplaces" && "Deployed contracts"}
                  {stat.label === "Active Marketplaces" && "Live on Polygon"}
                  {stat.label === "Tokens Minted" && "ERC-1155 tokens"}
                  {stat.label === "Platform Fee" && "Per transaction"}
                </div>
              </motion.div>
            )) : (
              <div className="col-span-4 text-center py-8 text-[var(--text-muted)]">No stats available</div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Marketplaces */}
            <div className="lg:col-span-2 surface p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-subheading">Recent Marketplaces</h3>
                <button onClick={() => navigate("/marketplaces")} className="btn-ghost text-xs">
                  View all
                </button>
              </div>
              
              <div className="space-y-2">
                {marketplacesLoading ? (
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg surface-hover animate-pulse">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--surface-elevated)]" />
                        <div>
                          <div className="h-4 w-24 bg-[var(--surface-elevated)] rounded mb-1" />
                          <div className="h-3 w-16 bg-[var(--surface-elevated)] rounded" />
                        </div>
                      </div>
                      <div className="h-6 w-16 bg-[var(--surface-elevated)] rounded" />
                    </div>
                  ))
                ) : recentMarketplaces.length > 0 ? (
                  recentMarketplaces.map((marketplace) => (
                  <div
                    key={marketplace.id}
                    className="flex items-center justify-between p-3 rounded-lg surface-hover cursor-pointer"
                    onClick={() => navigate(`/marketplaces/${marketplace.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[var(--surface-elevated)] flex items-center justify-center">
                        <Blocks className="w-5 h-5 text-[var(--primary)]" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[var(--text-primary)]">{marketplace.name}</div>
                        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                          <Clock className="w-3 h-3" />
                          {new Date(marketplace.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`badge-${marketplace.status === "live" ? "success" : "warning"} mb-1`}>
                        {marketplace.status}
                      </div>
                      <div className="text-xs text-[var(--text-muted)]">
                        {marketplace.assets} assets • {marketplace.volumeFormatted}
                      </div>
                      <a
                        href={ContractService.getAddressUrl(marketplace.address)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[var(--primary)] hover:underline flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-3 h-3" />
                        View
                      </a>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-[var(--text-muted)] text-sm">
                    <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No marketplaces found on blockchain
                    <br />
                    <button
                      onClick={() => navigate("/canvas")}
                      className="text-[var(--primary)] hover:underline mt-2"
                    >
                      Deploy your first marketplace
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Start Templates */}
            <div className="surface p-5">
              <h3 className="text-subheading mb-4">Quick Start</h3>
              <div className="space-y-3">
                {templatesLoading ? (
                  [...Array(4)].map((_, i) => (
                    <div key={i} className="w-full p-3 rounded-lg surface-hover animate-pulse flex items-center justify-between">
                      <div>
                        <div className="h-4 w-24 bg-[var(--surface-elevated)] rounded mb-1" />
                        <div className="h-3 w-32 bg-[var(--surface-elevated)] rounded" />
                      </div>
                      <div className="w-4 h-4 bg-[var(--surface-elevated)] rounded" />
                    </div>
                  ))
                ) : templates.length > 0 ? (
                  templates.slice(0, 4).map((template) => (
                    <button
                      key={template.id}
                      onClick={() => navigate(`/canvas?template=${template.id}`)}
                      className="w-full p-3 rounded-lg surface-hover text-left flex items-center justify-between group"
                    >
                      <div>
                        <div className="text-sm font-medium text-[var(--text-primary)]">{template.name}</div>
                        <div className="text-xs text-[var(--text-muted)]">{template.desc} • {template.components} components</div>
                        <div className="text-xs text-[var(--primary)] mt-1">{template.category}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--primary)] transition-colors" />
                    </button>
                  ))
                ) : (
                  <div className="text-center py-4 text-[var(--text-muted)] text-sm">
                    <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    No templates available
                  </div>
                )}
              </div>
              
              <button
                onClick={() => navigate("/marketplaces")}
                className="w-full mt-4 btn-secondary text-sm flex items-center justify-center gap-2"
              >
                Browse All Templates
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Blockchain Activity */}
          <div className="mt-6 surface p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-subheading">Recent Blockchain Activity</h3>
              <div className="flex items-center gap-2">
                <a
                  href="https://amoy.polygonscan.com/address/0x802A6843516f52144b3F1D04E5447A085d34aF37"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[var(--primary)] hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  Factory Contract
                </a>
              </div>
            </div>
            <div className="space-y-3">
              {recentMarketplaces.length > 0 ? (
                recentMarketplaces.slice(0, 3).map((marketplace) => (
                  <div key={marketplace.id} className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface-elevated)]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
                        <Rocket className="w-4 h-4 text-[var(--primary)]" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[var(--text-primary)]">
                          {marketplace.name} deployed
                        </div>
                        <div className="text-xs text-[var(--text-muted)]">
                          {new Date(marketplace.createdAt).toLocaleDateString()} • {marketplace.status}
                        </div>
                      </div>
                    </div>
                    <a
                      href={ContractService.getAddressUrl(marketplace.address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[var(--primary)] hover:underline flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View
                    </a>
                  </div>
                ))
              ) : (
                <div className="h-32 bg-[var(--surface-elevated)] rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2 opacity-50" />
                    <p className="text-sm text-[var(--text-muted)] mb-2">No recent activity</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      Deploy your first marketplace to see activity
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-4 pt-4 border-t border-[var(--border)]">
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Polygon Amoy</span>
                  </div>
                  <span>Chain ID: 80002</span>
                </div>
                <a
                  href="https://amoy.polygonscan.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--primary)] hover:underline"
                >
                  View Explorer
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
