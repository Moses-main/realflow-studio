import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wallet, Copy, Check, ExternalLink, RefreshCw, 
  ChevronDown, ChevronUp, LogOut, User
} from "lucide-react";
import { useAuth, shortenAddress } from "@/hooks/useAuth";
import { useLoginModal } from "@/providers/LoginModalProvider";

interface AccountBalance {
  address: string;
  balance: string;
  loading: boolean;
}

export function WalletAccountPanel() {
  const { 
    user, 
    logout, 
    ready, 
    allAccounts, 
    getBalance, 
    copyAddress,
    connectWallet 
  } = useAuth();
  const { openLoginModal } = useLoginModal();
  const [isOpen, setIsOpen] = useState(false);
  const [balances, setBalances] = useState<Record<string, string>>({});
  const [loadingBalances, setLoadingBalances] = useState<Record<string, boolean>>({});
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  // Fetch balances for all accounts
  const fetchBalances = async () => {
    if (!allAccounts.length) return;

    const newBalances: Record<string, string> = {};
    const newLoading: Record<string, boolean> = {};

    // Set loading state
    allAccounts.forEach(acc => {
      newLoading[acc.address] = true;
    });
    setLoadingBalances(newLoading);

    // Fetch balances
    for (const account of allAccounts) {
      const balance = await getBalance(account.address);
      newBalances[account.address] = balance;
      setLoadingBalances(prev => ({ ...prev, [account.address]: false }));
    }

    setBalances(newBalances);
  };

  useEffect(() => {
    if (isOpen && allAccounts.length > 0) {
      fetchBalances();
    }
  }, [isOpen, allAccounts]);

  const handleCopy = async (address: string) => {
    const success = await copyAddress(address);
    if (success) {
      setCopiedAddress(address);
      setTimeout(() => setCopiedAddress(null), 2000);
    }
  };

  const getWalletIcon = (walletType: string) => {
    if (walletType === "privy") return "🔐";
    if (walletType.includes("metamask")) return "🦊";
    if (walletType.includes("coinbase")) return "🔵";
    if (walletType.includes("walletconnect")) return "🔗";
    return "👛";
  };

  if (!ready) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--surface-hover)]">
        <div className="w-4 h-4 animate-pulse bg-[var(--border)] rounded" />
        <div className="w-16 h-4 animate-pulse bg-[var(--border)] rounded" />
      </div>
    );
  }

  if (!user.isAuthenticated) {
    return (
      <button
        onClick={openLoginModal}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white transition-colors"
      >
        <Wallet className="w-4 h-4" />
        <span className="text-sm font-medium">Connect</span>
      </button>
    );
  }

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--surface-hover)] hover:bg-[var(--surface-active)] transition-colors border border-[var(--border)]"
      >
        <div className="w-6 h-6 rounded-full bg-[var(--primary)] flex items-center justify-center">
          <Wallet className="w-3 h-3 text-white" />
        </div>
        <span className="text-sm font-mono">{shortenAddress(user.address)}</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-[var(--text-muted)]" />
        ) : (
          <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
        )}
      </button>

      {/* Account Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-80 bg-[var(--surface)] border border-[var(--border)] rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-[var(--border)] bg-[var(--surface-elevated)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-[var(--primary)]" />
                    <span className="font-semibold">Wallet Accounts</span>
                  </div>
                  <button
                    onClick={fetchBalances}
                    className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
                    title="Refresh balances"
                  >
                    <RefreshCw className="w-4 h-4 text-[var(--text-muted)]" />
                  </button>
                </div>
                {user.email && (
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Signed in as {user.email}
                  </p>
                )}
              </div>

              {/* Accounts List */}
              <div className="max-h-80 overflow-y-auto">
                {allAccounts.length === 0 ? (
                  <div className="p-4 text-center text-[var(--text-muted)] text-sm">
                    No wallets connected
                  </div>
                ) : (
                  allAccounts.map((account, index) => (
                    <div
                      key={account.address}
                      className={`p-4 border-b border-[var(--border)] last:border-0 ${
                        account.address === user.address 
                          ? "bg-[var(--primary-muted)]" 
                          : "hover:bg-[var(--surface-hover)]"
                      } transition-colors`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Account Icon */}
                        <div className="w-10 h-10 rounded-full bg-[var(--app-bg)] flex items-center justify-center text-xl flex-shrink-0">
                          {getWalletIcon(account.walletClientType)}
                        </div>

                        {/* Account Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              Account {index + 1}
                            </span>
                            {account.address === user.address && (
                              <span className="text-xs px-1.5 py-0.5 rounded bg-[var(--primary)] text-white">
                                Active
                              </span>
                            )}
                          </div>
                          
                          {/* Address with copy */}
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs font-mono text-[var(--text-muted)] truncate">
                              {shortenAddress(account.address)}
                            </span>
                            <button
                              onClick={() => handleCopy(account.address)}
                              className="p-1 rounded hover:bg-[var(--surface-active)] transition-colors"
                              title="Copy address"
                            >
                              {copiedAddress === account.address ? (
                                <Check className="w-3 h-3 text-[var(--success)]" />
                              ) : (
                                <Copy className="w-3 h-3 text-[var(--text-muted)]" />
                              )}
                            </button>
                          </div>

                          {/* Full address (selectable) */}
                          <div className="mt-2 p-2 rounded bg-[var(--app-bg)] border border-[var(--border)]">
                            <p className="text-xs font-mono break-all text-[var(--text-secondary)] select-all">
                              {account.address}
                            </p>
                          </div>

                          {/* Balance */}
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-[var(--text-muted)]">Balance:</span>
                            <span className="text-sm font-medium">
                              {loadingBalances[account.address] ? (
                                <span className="animate-pulse">Loading...</span>
                              ) : (
                                `${balances[account.address] || "0.0000"} MATIC`
                              )}
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 mt-2">
                            <a
                              href={`https://www.oklink.com/amoy/address/${account.address}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs text-[var(--primary)] hover:underline"
                            >
                              Explorer <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Actions */}
              <div className="p-3 border-t border-[var(--border)] bg-[var(--surface-elevated)]">
                <div className="flex gap-2">
                  <button
                    onClick={connectWallet}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm transition-colors"
                  >
                    <Wallet className="w-4 h-4" />
                    Add Wallet
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-hover)] text-sm transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
