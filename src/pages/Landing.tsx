import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Blocks, Sparkles, Rocket, Shield, Zap, Globe } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LanguageSwitcher } from "@/components/theme/LanguageSwitcher";
import { useLanguage } from "@/components/theme/LanguageSwitcher";

const features = [
  {
    icon: Blocks,
    title: "Visual Builder",
    description: "Drag-and-drop interface for building marketplace components without code.",
  },
  {
    icon: Sparkles,
    title: "AI Co-Builder",
    description: "AI-powered code generation, optimization suggestions, and smart contracts.",
  },
  {
    icon: Rocket,
    title: "One-Click Deploy",
    description: "Deploy to Polygon Amoy testnet with automatic contract verification.",
  },
  {
    icon: Shield,
    title: "ERC Standards",
    description: "Full ERC-1155, ERC-2981 royalties, and EIP-2612 permit support.",
  },
  {
    icon: Zap,
    title: "Gas Optimized",
    description: "Minimal proxy pattern (EIP-1167) for cheap deployment and low gas costs.",
  },
  {
    icon: Globe,
    title: "IPFS Storage",
    description: "Decentralized metadata storage with automatic pinning via Pinata.",
  },
];

const templates = [
  { name: "NFT Marketplace", description: "Basic trading with minting and listings", components: 5 },
  { name: "Creator Portfolio", description: "Showcase and sell creator works", components: 4 },
  { name: "Digital Gallery", description: "Browse and explore art collections", components: 4 },
  { name: "Full Platform", description: "Complete marketplace with all features", components: 6 },
];

export default function Landing() {
  const navigate = useNavigate();
  const { t } = useLanguage();

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
            <button onClick={() => navigate("/dashboard")} className="btn-primary text-sm">
              Open App
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--primary-muted)] text-[var(--primary)] text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
              Built for Aleph Hackathon 2026
            </div>
            <h1 className="text-display text-3xl md:text-4xl lg:text-5xl mb-6 leading-tight">
              {t("hero.title")}
            </h1>
            <p className="text-body text-lg mb-8 max-w-2xl mx-auto">
              {t("hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate("/builder")}
                className="btn-primary flex items-center gap-2 px-6 py-3 text-base"
              >
                {t("hero.cta")}
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate("/marketplaces")}
                className="btn-secondary flex items-center gap-2 px-6 py-3 text-base"
              >
                {t("hero.secondary")}
              </button>
            </div>
          </motion.div>

          {/* Preview Image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16"
          >
            <div className="surface p-2 rounded-xl">
              <div className="bg-[var(--surface-elevated)] rounded-lg aspect-video flex items-center justify-center">
                <div className="text-center p-8">
                  <Blocks className="w-16 h-16 text-[var(--primary)] mx-auto mb-4 opacity-50" />
                  <p className="text-[var(--text-muted)]">Builder Preview</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-[var(--surface)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-heading text-2xl md:text-3xl mb-4">Everything you need to build RWA marketplaces</h2>
            <p className="text-body max-w-2xl mx-auto">
              From design to deployment, RealFlow provides all the tools for tokenizing real-world assets.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="card-hover"
              >
                <div className="w-10 h-10 rounded-lg bg-[var(--primary-muted)] flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-[var(--primary)]" />
                </div>
                <h3 className="text-subheading mb-2">{feature.title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-heading text-2xl md:text-3xl mb-4">Start from a template</h2>
            <p className="text-body max-w-2xl mx-auto">
              Pre-built templates to get you started in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {templates.map((template, index) => (
              <motion.div
                key={template.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => navigate("/builder")}
                className="card-hover cursor-pointer"
              >
                <div className="w-full aspect-video bg-[var(--surface-elevated)] rounded-lg mb-4 flex items-center justify-center">
                  <Blocks className="w-8 h-8 text-[var(--primary)] opacity-50" />
                </div>
                <h3 className="text-subheading text-sm mb-1">{template.name}</h3>
                <p className="text-xs text-[var(--text-muted)] mb-2">{template.description}</p>
                <span className="badge-primary">{template.components} components</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
