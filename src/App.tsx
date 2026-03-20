import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { motion, AnimatePresence } from "framer-motion";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Builder from "./pages/Builder";
import MarketplaceList from "./pages/MarketplaceList";
import MarketplaceDetail from "./pages/MarketplaceDetail";
import Analytics from "./pages/Analytics";
import Explore from "./pages/Explore";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { Search } from "lucide-react";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { LanguageProvider } from "@/components/theme/LanguageSwitcher";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

const CommandPalette = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const commands = [
    { label: "Dashboard", action: () => { navigate("/dashboard"); onClose(); } },
    { label: "Builder", action: () => { navigate("/builder"); onClose(); } },
    { label: "Marketplaces", action: () => { navigate("/marketplaces"); onClose(); } },
    { label: "Analytics", action: () => { navigate("/analytics"); onClose(); } },
    { label: "Explore", action: () => { navigate("/explore"); onClose(); } },
    { label: "Settings", action: () => { navigate("/settings"); onClose(); } },
  ];

  const filtered = commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-start justify-center pt-[20vh]"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="surface-elevated rounded-xl w-full max-w-lg overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
              <Search className="w-5 h-5 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Type a command or search..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                autoFocus
              />
              <kbd className="px-2 py-0.5 text-xs bg-[var(--surface)] text-[var(--text-muted)] rounded border border-[var(--border)]">ESC</kbd>
            </div>
            <div className="max-h-64 overflow-y-auto p-2">
              {filtered.map(cmd => (
                <button
                  key={cmd.label}
                  onClick={cmd.action}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors"
                >
                  {cmd.label}
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="text-sm text-[var(--text-muted)] text-center py-4">No results found</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const KeyboardShortcutsHandler = () => {
  const [commandOpen, setCommandOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen(true);
      }
      if (e.key === "Escape") {
        setCommandOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <Toaster position="bottom-right" theme="dark" />
        <BrowserRouter>
          <KeyboardShortcutsHandler />
          <OnboardingModal />
          <Routes>
            <Route path="/" element={<ErrorBoundary><Landing /></ErrorBoundary>} />
            <Route path="/dashboard" element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
            <Route path="/builder" element={<ErrorBoundary><Builder /></ErrorBoundary>} />
            <Route path="/marketplaces" element={<ErrorBoundary><MarketplaceList /></ErrorBoundary>} />
            <Route path="/marketplaces/:id" element={<ErrorBoundary><MarketplaceDetail /></ErrorBoundary>} />
            <Route path="/analytics" element={<ErrorBoundary><Analytics /></ErrorBoundary>} />
            <Route path="/explore" element={<ErrorBoundary><Explore /></ErrorBoundary>} />
            <Route path="/settings" element={<ErrorBoundary><Settings /></ErrorBoundary>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
