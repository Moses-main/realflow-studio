import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Blocks, Sparkles, Rocket, Shield, Zap, Globe, Wallet, LogOut, User } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LanguageSwitcher } from "@/components/theme/LanguageSwitcher";
import { useLanguage } from "@/components/theme/LanguageSwitcher";
import { useAuth } from "@/hooks/useAuth";
import { AnimatedHeroFlow } from "@/components/landing/AnimatedHeroFlow";

import { ConnectButton } from "@/components/auth/ConnectButton";
import { IsometricFeatures } from "@/components/landing/IsometricFeatures";
import { InitiativesRoadmap } from "@/components/landing/InitiativesRoadmap";

export default function Landing() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, login, connectWallet, disconnectWallet } = useAuth();

  return (
    <div className="min-h-screen bg-[var(--app-bg)]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--app-bg)]/80 backdrop-blur-md border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[var(--primary)] flex items-center justify-center">
              <Blocks className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-[var(--text-primary)]">RealFlow Studio</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Features</a>
            <a href="#templates" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Templates</a>
            <a href="#docs" className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Docs</a>
          </nav>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggle />
            {user.isAuthenticated && (
              <button onClick={() => navigate("/dashboard")} className="hidden md:flex btn-ghost text-sm">
                Dashboard
              </button>
            )}
            <ConnectButton />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--primary-muted)]/20 to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--primary-muted)] text-[var(--primary)] text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
              Built for Aleph Hackathon 2026
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-display text-3xl md:text-4xl lg:text-5xl mb-6 leading-tight"
            >
              {t("hero.title")}
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-body text-lg mb-8 max-w-2xl mx-auto"
            >
              {t("hero.subtitle")}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              {user.isAuthenticated ? (
                <>
                  <button
                    onClick={() => navigate("/canvas")}
                    className="btn-primary flex items-center gap-2 px-6 py-3 text-base"
                  >
                    Go to Canvas Builder
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="btn-secondary flex items-center gap-2 px-6 py-3 text-base"
                  >
                    Open Dashboard
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/canvas")}
                    className="btn-primary flex items-center gap-2 px-6 py-3 text-base"
                  >
                    Start Building For Free
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <div className="flex items-center">
                    <ConnectButton size="lg" variant="outline" />
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>

          {/* Preview Animation Container */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <AnimatedHeroFlow />
          </motion.div>
        </div>
      </section>

      <IsometricFeatures />
      
      <InitiativesRoadmap />

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[var(--primary)] flex items-center justify-center">
                <Blocks className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-medium text-[var(--text-primary)]">RealFlow Studio</span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="badge bg-[var(--surface)] text-[var(--text-muted)]">
                Built for Aleph Hackathon 2026
              </span>
              <span className="badge bg-[var(--primary-muted)] text-[var(--primary)]">
                RWA + AI Track
              </span>
              <span className="badge bg-[var(--surface)] text-[var(--text-muted)]">
                Polygon
              </span>
            </div>

            <div className="flex items-center gap-6 text-sm text-[var(--text-muted)]">
              <a href="#" className="hover:text-[var(--text-primary)] transition-colors">GitHub</a>
              <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Docs</a>
              <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Discord</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
