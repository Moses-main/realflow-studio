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

  const handleSocialLogin = async (provider: "google" | "discord" | "twitter") => {
    setIsLoading(true);
    try {
      await login({ loginMechanism: provider });
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
                  {/* Email Login */}
                  <button
                    onClick={() => setStep("email")}
                    disabled={isLoading}
                    className="w-full flex items-center gap-3 p-4 rounded-xl border border-[var(--border)] hover:bg-[var(--surface-hover)] hover:border-[var(--primary)]/50 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium">Continue with Email</p>
                      <p className="text-xs text-[var(--text-muted)]">Get a magic link - no password needed</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--primary)]" />
                  </button>

                  {/* Google Login */}
                  <button
                    onClick={() => handleSocialLogin("google")}
                    disabled={isLoading}
                    className="w-full flex items-center gap-3 p-4 rounded-xl border border-[var(--border)] hover:bg-[var(--surface-hover)] hover:border-[var(--primary)]/50 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium">Continue with Google</p>
                      <p className="text-xs text-[var(--text-muted)]">Quick signup with your Google account</p>
                    </div>
                  </button>

                  {/* Wallet Login */}
                  <button
                    onClick={handleWalletLogin}
                    disabled={isLoading}
                    className="w-full flex items-center gap-3 p-4 rounded-xl border border-[var(--border)] hover:bg-[var(--surface-hover)] hover:border-[var(--primary)]/50 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                      <span className="text-xl">🦊</span>
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium">Connect Wallet</p>
                      <p className="text-xs text-[var(--text-muted)]">MetaMask or other Web3 wallet</p>
                    </div>
                  </button>

                  <p className="text-xs text-[var(--text-muted)] text-center pt-4">
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
