import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Package, BarChart3, Globe, Settings,
  Menu, X, Blocks, Wallet, LogOut, User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface SidebarProps {
  className?: string;
}

const navItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: Package, label: "My Marketplaces", path: "/marketplaces" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: Globe, label: "Explore", path: "/explore" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const Sidebar = ({ className = "" }: SidebarProps) => {
  const location = useLocation();
  const { user, connectWallet, disconnectWallet } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavContent = () => (
    <>
      <div className="flex items-center gap-2 p-5 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Blocks className="w-4 h-4 text-primary-foreground" />
        </div>
        <Link to="/dashboard" className="font-bold tracking-tight">RealFlow</Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border space-y-2">
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
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full gap-2"
            onClick={connectWallet}
          >
            <Wallet className="w-4 h-4" />
            Connect Wallet
          </Button>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 glass rounded-lg lg:hidden"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-[280px] glass-strong border-r border-border z-50 flex flex-col lg:hidden"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 p-1 hover:bg-secondary rounded"
              >
                <X className="w-5 h-5" />
              </button>
              <NavContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex w-64 glass-strong border-r border-border z-40 flex-col shrink-0 fixed left-0 top-0 h-full ${className}`}>
        <NavContent />
      </aside>
    </>
  );
};

export default Sidebar;
