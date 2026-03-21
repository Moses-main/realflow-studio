import { useAuth, shortenAddress } from "@/hooks/useAuth";
import { useLoginModal } from "@/providers/LoginModalProvider";
import { Wallet, LogOut, ChevronDown, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface ConnectButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  showBalance?: boolean;
  showDropdown?: boolean;
}

export function ConnectButton({ 
  variant = "default", 
  size = "md", 
  showBalance = false,
  showDropdown = true 
}: ConnectButtonProps) {
  const { user, logout, ready } = useAuth();
  const { openLoginModal } = useLoginModal();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!ready) {
    return (
      <button className={`btn-${variant} btn-${size}`} disabled>
        <Loader2 className="w-4 h-4 animate-spin" />
      </button>
    );
  }

  // Not authenticated - show connect button
  if (!user.isAuthenticated) {
    const baseClasses = variant === "default" 
      ? "btn-primary" 
      : variant === "outline" 
        ? "btn-secondary" 
        : "btn-ghost";
    
    const sizeClasses = size === "sm" ? "text-sm px-3 py-1.5" : size === "lg" ? "text-base px-6 py-3" : "text-sm px-4 py-2";

    return (
      <button
        onClick={openLoginModal}
        className={`${baseClasses} ${sizeClasses} flex items-center gap-2 rounded-lg transition-colors`}
      >
        <Wallet className="w-4 h-4" />
        <span>Connect</span>
      </button>
    );
  }

  // Authenticated - show user info with dropdown
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => showDropdown && setDropdownOpen(!dropdownOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--surface-hover)] hover:bg-[var(--surface-active)] transition-colors ${!showDropdown ? 'cursor-default' : ''}`}
      >
        <div className="w-6 h-6 rounded-full bg-[var(--primary)] flex items-center justify-center">
          <User className="w-3 h-3 text-white" />
        </div>
        <span className="text-xs font-mono">{shortenAddress(user.address)}</span>
        {showDropdown && <ChevronDown className="w-3 h-3" />}
      </button>

      {dropdownOpen && showDropdown && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-lg py-2 z-50">
          <div className="px-4 py-2 border-b border-[var(--border)]">
            <p className="text-xs text-[var(--text-muted)]">Signed in as</p>
            <p className="text-sm font-medium truncate">{user.email || shortenAddress(user.address)}</p>
          </div>
          {user.address && (
            <div className="px-4 py-2 border-b border-[var(--border)]">
              <p className="text-xs text-[var(--text-muted)]">Wallet</p>
              <p className="text-xs font-mono truncate">{user.address}</p>
            </div>
          )}
          <button
            onClick={() => {
              logout();
              setDropdownOpen(false);
            }}
            className="w-full px-4 py-2 text-left text-sm text-[var(--error)] hover:bg-[var(--surface-hover)] flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

// Simple loader component
function Loader2({ className }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}
