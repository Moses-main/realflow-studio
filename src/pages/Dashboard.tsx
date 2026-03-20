import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Blocks, Rocket, ArrowRight, Plus, Settings, Bell,
  TrendingUp, Wallet, ExternalLink, Clock, BarChart3, Home
} from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import { ThemeToggleDropdown } from "@/components/theme/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";

const stats = [
  { label: "Total Value Locked", value: "$124,500", change: "+12.5%", icon: TrendingUp, positive: true },
  { label: "Transactions", value: "1,284", change: "+8.2%", icon: TrendingUp, positive: true },
  { label: "NFTs Minted", value: "892", change: "+15.3%", icon: TrendingUp, positive: true },
  { label: "Platform Fee", value: "0.5%", change: null, icon: Wallet, positive: true },
];

const recentMarketplaces = [
  { name: "Real Estate Fund #1", status: "active", txs: 234, value: "$45,200", date: "2h ago" },
  { name: "Art Collection", status: "active", txs: 89, value: "$12,500", date: "5h ago" },
  { name: "Commodity Tokens", status: "pending", txs: 0, value: "$0", date: "1d ago" },
  { name: "Music Rights NFTs", status: "active", txs: 156, value: "$28,300", date: "2d ago" },
];

const templates = [
  { name: "NFT Marketplace", desc: "Basic trading", components: 5 },
  { name: "Creator Portfolio", desc: "Showcase works", components: 4 },
  { name: "Digital Gallery", desc: "Browse collections", components: 4 },
  { name: "Full Platform", desc: "All features", components: 6 },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, connectWallet } = useAuth();

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
              <h1 className="text-base font-semibold text-[var(--text-primary)]">Dashboard</h1>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggleDropdown />
              <button className="p-2 rounded-lg hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] transition-colors">
                <Bell className="w-4 h-4" />
              </button>
              {user.isWalletConnected ? (
                <div className="flex items-center gap-2 px-3 py-1.5 surface rounded-lg">
                  <div className="status-dot-success" />
                  <span className="text-xs font-mono text-[var(--text-secondary)]">
                    {user.address?.slice(0, 6)}...{user.address?.slice(-4)}
                  </span>
                </div>
              ) : (
                <button onClick={connectWallet} className="btn-primary text-sm">
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Quick Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-heading text-xl mb-1">Welcome back</h2>
              <p className="text-sm text-[var(--text-secondary)]">Build and manage your RWA marketplaces</p>
            </div>
            <button
              onClick={() => navigate("/builder")}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Marketplace
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
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
                    {stat.change} from last month
                  </span>
                )}
              </motion.div>
            ))}
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
                {recentMarketplaces.map((marketplace) => (
                  <div
                    key={marketplace.name}
                    className="flex items-center justify-between p-3 rounded-lg surface-hover cursor-pointer"
                    onClick={() => navigate("/builder")}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[var(--surface-elevated)] flex items-center justify-center">
                        <Blocks className="w-5 h-5 text-[var(--primary)]" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[var(--text-primary)]">{marketplace.name}</div>
                        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                          <Clock className="w-3 h-3" />
                          {marketplace.date}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`badge-${marketplace.status === "active" ? "success" : "warning"} mb-1`}>
                        {marketplace.status}
                      </div>
                      <div className="text-xs text-[var(--text-muted)]">{marketplace.txs} txns • {marketplace.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Start Templates */}
            <div className="surface p-5">
              <h3 className="text-subheading mb-4">Quick Start</h3>
              <div className="space-y-3">
                {templates.map((template) => (
                  <button
                    key={template.name}
                    onClick={() => navigate("/builder")}
                    className="w-full p-3 rounded-lg surface-hover text-left flex items-center justify-between group"
                  >
                    <div>
                      <div className="text-sm font-medium text-[var(--text-primary)]">{template.name}</div>
                      <div className="text-xs text-[var(--text-muted)]">{template.desc} • {template.components} components</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--primary)] transition-colors" />
                  </button>
                ))}
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

          {/* Activity Chart Placeholder */}
          <div className="mt-6 surface p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-subheading">Activity</h3>
              <div className="flex items-center gap-2">
                <button className="badge-primary">7D</button>
                <button className="badge bg-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]">30D</button>
                <button className="badge bg-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]">90D</button>
              </div>
            </div>
            <div className="h-48 bg-[var(--surface-elevated)] rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-2 opacity-50" />
                <p className="text-sm text-[var(--text-muted)]">Activity chart placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
