import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Wallet, Check, AlertCircle, Loader2, ExternalLink } from "lucide-react";
import { useWallet, shortenAddress } from "@/hooks/useWallet";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WalletModal({ isOpen, onClose }: WalletModalProps) {
  const {
    address,
    isConnected,
    isConnecting,
    error,
    balance,
    chainId,
    connect,
    disconnect,
    isTestnet,
    hasWallet,
    isMetaMask,
  } = useWallet();

  const [showDetails, setShowDetails] = useState(false);

  const handleConnect = async () => {
    await connect();
  };

  const handleDisconnect = () => {
    disconnect();
    setShowDetails(false);
  };

  const getExplorerUrl = () => {
    if (chainId === 80002) {
      return `https://www.oklink.com/amoy/address/${address}`;
    } else if (chainId === 137) {
      return `https://polygonscan.com/address/${address}`;
    }
    return null;
  };

  const getChainName = () => {
    if (chainId === 80002) return "Polygon Amoy Testnet";
    if (chainId === 137) return "Polygon Mainnet";
    if (chainId === 1) return "Ethereum";
    return `Chain ${chainId}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-[var(--surface)] border border-[var(--border)] rounded-xl w-full max-w-md overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
              <h2 className="text-lg font-semibold">
                {isConnected ? "Wallet Connected" : "Connect Wallet"}
              </h2>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-[var(--surface-hover)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4">
              {!hasWallet ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-[var(--warning)] mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Wallet Detected</h3>
                  <p className="text-[var(--text-muted)] text-sm mb-4">
                    Please install MetaMask or another Web3 wallet extension to continue.
                  </p>
                  <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[var(--primary)] hover:underline"
                  >
                    Install MetaMask <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ) : isConnected ? (
                <div className="space-y-4">
                  {/* Connected State */}
                  <div className="bg-[var(--surface-hover)] rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center">
                        <Wallet className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-[var(--success)]" />
                          <span className="text-sm font-medium">Connected</span>
                        </div>
                        <p className="text-xs text-[var(--text-muted)]">
                          {isMetaMask ? "MetaMask" : "Web3 Wallet"}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-[var(--text-muted)]">Address</span>
                        <span className="font-mono">{shortenAddress(address)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[var(--text-muted)]">Balance</span>
                        <span>{balance || "0"} MATIC</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[var(--text-muted)]">Network</span>
                        <span className={isTestnet ? "text-[var(--warning)]" : "text-[var(--success)]"}>
                          {getChainName()}
                        </span>
                      </div>
                    </div>

                    {getExplorerUrl() && (
                      <a
                        href={getExplorerUrl()!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs text-[var(--primary)] hover:underline mt-3"
                      >
                        View on Explorer <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={handleDisconnect}
                      className="flex-1 px-4 py-2 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-hover)] text-sm"
                    >
                      Disconnect
                    </button>
                    <button
                      onClick={onClose}
                      className="flex-1 px-4 py-2 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Connect Options */}
                  <button
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className="w-full flex items-center gap-3 p-4 rounded-lg border border-[var(--border)] hover:bg-[var(--surface-hover)] transition-colors disabled:opacity-50"
                  >
                    {isConnecting ? (
                      <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                        <span className="text-white text-lg">🦊</span>
                      </div>
                    )}
                    <div className="text-left flex-1">
                      <p className="font-medium">MetaMask</p>
                      <p className="text-xs text-[var(--text-muted)]">Connect using browser extension</p>
                    </div>
                  </button>

                  {error && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-[var(--error-muted)] text-[var(--error)] text-sm">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <p className="text-xs text-[var(--text-muted)] text-center pt-2">
                    By connecting, you agree to our Terms of Service
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
