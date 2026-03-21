import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Wallet, Loader2, Check, AlertCircle, ArrowRight } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login, authenticated } = usePrivy();
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"select" | "email">("select");
  const [isLoading, setIsLoading] = useState(false);

  // Close modal when authenticated
  if (authenticated && isOpen) {
    onClose();
  }

  const handleEmailLogin = async () => {
    if (!email || !email.includes("@")) return;
    
    setIsLoading(true);
    try {
      await login({ 
        loginMechanism: "email",
        email: email,
      });
      onClose();
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWalletLogin = async () => {
    setIsLoading(true);
    try {
      await login({ loginMechanism: "wallet" });
      onClose();
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
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
                  Create your account to start building RWA marketplaces
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 pt-2 space-y-3">
              {step === "select" ? (
                <>
                  {/* Email Login - Primary Option */}
                  <button
                    onClick={() => setStep("email")}
                    disabled={isLoading}
                    className="w-full flex items-center gap-3 p-5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] transition-all group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-white text-lg">Continue with Email</p>
                      <p className="text-xs text-white/70">Get a magic link - no password needed</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-white/70 group-hover:text-white" />
                  </button>

                  {/* Wallet Login - Secondary Option */}
                  <button
                    onClick={handleWalletLogin}
                    disabled={isLoading}
                    className="w-full flex items-center gap-3 p-4 rounded-xl border border-[var(--border)] hover:bg-[var(--surface-hover)] hover:border-[var(--primary)]/50 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                      <span className="text-xl">🦊</span>
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium">I have a Crypto Wallet</p>
                      <p className="text-xs text-[var(--text-muted)]">Connect with MetaMask or other Web3 wallet</p>
                    </div>
                  </button>

                  <div className="bg-[var(--primary-muted)] rounded-lg p-4 mt-4">
                    <p className="text-sm text-[var(--primary)] font-medium mb-1">✨ New to crypto?</p>
                    <p className="text-xs text-[var(--text-muted)]">
                      No problem! Just enter your email above and we'll create a secure wallet for you automatically. 
                      No downloads, no seed phrases - just email login like any regular app.
                    </p>
                  </div>

                  <p className="text-xs text-[var(--text-muted)] text-center pt-2">
                    By continuing, you agree to our Terms of Service and Privacy Policy
                  </p>
                </>
              ) : (
                <>
                  {/* Email Input Step */}
                  <button
                    onClick={() => setStep("select")}
                    className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] mb-4"
                  >
                    ← Back to options
                  </button>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 rounded-lg bg-[var(--app-bg)] border border-[var(--border)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 transition-all"
                        autoFocus
                      />
                    </div>

                    <button
                      onClick={handleEmailLogin}
                      disabled={!email || !email.includes("@") || isLoading}
                      className="w-full py-3 px-4 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending magic link...
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
                        We'll create a secure wallet for you automatically. Just click the link in your email to get started.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
