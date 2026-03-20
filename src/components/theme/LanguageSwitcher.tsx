import { useState, createContext, useContext, ReactNode } from "react";
import { Globe } from "lucide-react";

type Language = "en" | "es";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    "nav.home": "Home",
    "nav.dashboard": "Dashboard",
    "nav.builder": "Builder",
    "nav.marketplaces": "Marketplaces",
    "nav.explore": "Explore",
    "nav.settings": "Settings",
    "nav.analytics": "Analytics",
    "hero.title": "Build RWA Marketplaces in Minutes",
    "hero.subtitle": "AI-powered tools to tokenize real-world assets and deploy to Polygon",
    "hero.cta": "Start Building",
    "hero.secondary": "Explore Templates",
    "dashboard.title": "Dashboard",
    "dashboard.stats.totalValue": "Total Value Locked",
    "dashboard.stats.transactions": "Transactions",
    "dashboard.stats.nfts": "NFTs Minted",
    "dashboard.stats.fee": "Platform Fee",
    "builder.deploy": "Deploy Marketplace",
    "builder.export": "Export",
    "builder.save": "Save",
    "builder.preview": "Preview",
    "builder.test": "Test Mode",
    "builder.ai.title": "AI Co-Builder",
    "common.loading": "Loading...",
    "common.error": "An error occurred",
    "common.success": "Success",
  },
  es: {
    "nav.home": "Inicio",
    "nav.dashboard": "Panel",
    "nav.builder": "Constructor",
    "nav.marketplaces": "Mercados",
    "nav.explore": "Explorar",
    "nav.settings": "Configuración",
    "nav.analytics": "Analítica",
    "hero.title": "Crea Mercados RWA en Minutos",
    "hero.subtitle": "Herramientas impulsadas por IA para tokenizar activos del mundo real y desplegar en Polygon",
    "hero.cta": "Empezar a Construir",
    "hero.secondary": "Explorar Plantillas",
    "dashboard.title": "Panel de Control",
    "dashboard.stats.totalValue": "Valor Total Bloqueado",
    "dashboard.stats.transactions": "Transacciones",
    "dashboard.stats.nfts": "NFTs Acuñados",
    "dashboard.stats.fee": "Comisión de Plataforma",
    "builder.deploy": "Desplegar Mercado",
    "builder.export": "Exportar",
    "builder.save": "Guardar",
    "builder.preview": "Vista Previa",
    "builder.test": "Modo Prueba",
    "builder.ai.title": "IA Co-Constructor",
    "common.loading": "Cargando...",
    "common.error": "Ocurrió un error",
    "common.success": "Éxito",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("language") as Language) || "en";
    }
    return "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] surface-hover transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span className="uppercase text-xs font-medium">{language}</span>
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-50 surface-elevated py-1 min-w-[120px] animate-in">
            {[
              { value: "en" as const, label: "English" },
              { value: "es" as const, label: "Español" },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => {
                  setLanguage(value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                  language === value
                    ? "text-[var(--primary)] bg-[var(--primary-muted)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
