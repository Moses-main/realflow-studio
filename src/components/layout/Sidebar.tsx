import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Package, BarChart3, Globe, Settings,
  Menu, X, Blocks, Wallet, LogOut
} from "lucide-react";
import { useAuth, shortenAddress } from "@/hooks/useAuth";
import { ConnectButton } from "@/components/auth/ConnectButton";

interface SidebarProps {
  className?: string;
}

const navItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: Package, label: "Marketplaces", path: "/marketplaces" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: Globe, label: "Explore", path: "/explore" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const Sidebar = ({ className = "" }: SidebarProps) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5">
        <div className="w-7 h-7 rounded-lg bg-[var(--primary)] flex items-center justify-center">
          <Blocks className="w-4 h-4 text-white" />
        </div>
        <span className="font-semibold text-[var(--text-primary)]">RealFlow</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <div className="text-overline px-3 mb-2">Menu</div>
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={isActive ? "sidebar-item-active" : "sidebar-item"}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Wallet Section */}
      <div className="px-3 py-4 border-t border-[var(--sidebar-border)]">
        {user.isAuthenticated ? (
          <div className="surface p-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-xs font-bold text-white">
                {user.email ? user.email.charAt(0).toUpperCase() : "RF"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-[var(--text-primary)] truncate">
                  {user.email || shortenAddress(user.address)}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Polygon Amoy
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 text-xs text-[var(--error)] hover:text-[var(--error)]/80 transition-colors py-1.5 rounded-lg hover:bg-[var(--error-muted)]"
            >
              <LogOut className="w-3 h-3" />
              Sign Out
            </button>
          </div>
        ) : (
          <ConnectButton variant="default" size="md" />
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-3 left-3 z-50 p-2 surface hover:bg-[var(--surface-hover)] rounded-lg lg:hidden transition-colors"
      >
        <Menu className="w-5 h-5 text-[var(--text-secondary)]" />
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-[240px] bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] z-50 lg:hidden flex flex-col"
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-[var(--sidebar-hover)] text-[var(--text-muted)]"
            >
              <X className="w-4 h-4" />
            </button>
            <NavContent />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex lg:flex-col lg:fixed lg:left-0 lg:top-0 lg:h-full lg:w-[240px] bg-[var(--sidebar-bg)] border-r border-[var(--sidebar-border)] ${className}`}>
        <NavContent />
      </aside>
    </>
  );
};

export default Sidebar;
