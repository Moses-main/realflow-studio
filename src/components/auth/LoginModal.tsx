import { usePrivy, useLogin } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { Mail, Wallet, X, Loader2 } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { authenticated, ready } = usePrivy();
  const { login } = useLogin();
  const [email, setEmail] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Close when authenticated
  useEffect(() => {
    if (authenticated && isOpen) {
      onClose();
      setEmail("");
      setShowEmailInput(false);
    }
  }, [authenticated, isOpen, onClose]);

  const handleEmailSubmit = async () => {
    if (!email || !email.includes("@")) return;
    setIsLoading(true);
    try {
      await login({ email });
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletConnect = async () => {
    setIsLoading(true);
    try {
      await login();
    } catch (error) {
      console.error("Wallet connect failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="relative p-6 pb-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-[var(--surface-hover)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-indigo-500 flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Welcome to RealFlow</h2>
            <p className="text-[var(--text-muted)] text-sm mt-2">
              Sign in to start building RWA marketplaces
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 pt-2 space-y-3">
          {!showEmailInput ? (
            <>
              {/* Email Login */}
              <button
                onClick={() => setShowEmailInput(true)}
                disabled={isLoading}
                className="w-full flex items-center gap-3 p-5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-white text-lg">Continue with Email</p>
                  <p className="text-xs text-white/70">No wallet needed - we create one for you</p>
                </div>
              </button>

              {/* Wallet Connect */}
              <button
                onClick={handleWalletConnect}
                disabled={isLoading}
                className="w-full flex items-center gap-3 p-4 rounded-xl border border-[var(--border)] hover:bg-[var(--surface-hover)] transition-all"
              >
                {isLoading ? (
                  <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)]" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <span className="text-xl">🦊</span>
                  </div>
                )}
                <div className="flex-1 text-left">
                  <p className="font-medium">Connect Wallet</p>
                  <p className="text-xs text-[var(--text-muted)]">MetaMask, Coinbase, WalletConnect & more</p>
                </div>
              </button>

              <p className="text-xs text-[var(--text-muted)] text-center pt-2">
                By continuing, you agree to our Terms of Service
              </p>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowEmailInput(false)}
                className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-2"
              >
                ← Back
              </button>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-lg bg-[var(--app-bg)] border border-[var(--border)] focus:border-[var(--primary)] focus:outline-none"
                    autoFocus
                  />
                </div>

                <button
                  onClick={handleEmailSubmit}
                  disabled={!email || !email.includes("@") || isLoading}
                  className="w-full py-3 px-4 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:opacity-50 text-white font-medium flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      Send Magic Link
                    </>
                  )}
                </button>

                <div className="bg-[var(--primary-muted)] rounded-lg p-4 text-sm">
                  <p className="text-[var(--primary)] font-medium mb-1">✨ No wallet needed!</p>
                  <p className="text-[var(--text-muted)]">
                    Click the link in your email to get started. We'll create a secure wallet for you automatically.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
