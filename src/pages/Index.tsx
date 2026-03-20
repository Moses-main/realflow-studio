import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Blocks, Sparkles, Zap, Globe, ArrowRight, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: Blocks, title: "Drag & Drop Builder", desc: "Design your marketplace visually. No coding needed." },
  { icon: Sparkles, title: "AI-Powered", desc: "Smart contracts auto-generated with AI optimization." },
  { icon: Zap, title: "Instant Deploy", desc: "Launch on Polygon in minutes, not weeks." },
  { icon: Globe, title: "Global Markets", desc: "Multi-language, multi-currency. Built for LATAM & Africa." },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 glass-strong">
        <div className="container mx-auto flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Blocks className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">RealFlow Studio</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              Dashboard
            </Button>
            <Button size="sm" className="gap-2" onClick={() => navigate("/dashboard")}>
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        {/* Glow orbs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute top-40 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />

        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-8 text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Aleph Hackathon 2026 • AI + RWA Track</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight max-w-4xl mx-auto mb-6">
              Build RWA Marketplaces
              <br />
              <span className="text-gradient">With AI Magic</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Tokenize real estate, art & commodities. Drag-and-drop your marketplace,
              let AI handle the smart contracts. Deploy in minutes.
            </p>

            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Button size="lg" className="gap-2 text-base glow-primary" onClick={() => navigate("/builder")}>
                Start Building
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="lg" className="gap-2 text-base" onClick={() => navigate("/dashboard")}>
                View Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                className="glass rounded-xl p-6 hover:border-primary/30 transition-colors group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:glow-primary transition-shadow">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6">
        <div className="container mx-auto glass rounded-2xl p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { val: "100+", label: "Marketplace Templates" },
              { val: "<10min", label: "Avg Deploy Time" },
              { val: "$2.4M", label: "Assets Tokenized" },
              { val: "15+", label: "Countries Supported" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-bold text-gradient mb-1">{s.val}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-border">
        <div className="container mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <span>© 2026 RealFlow Studio • Aleph Hackathon</span>
          <span>Built on Polygon • Powered by AI</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;
