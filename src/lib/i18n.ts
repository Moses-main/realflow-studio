type TranslationKey = string;
type TranslationValues = Record<string, string | number>;

interface TranslationConfig {
  defaultLocale: string;
  fallbackLocale: string;
}

const translations: Record<string, Record<string, string>> = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.dashboard": "Dashboard",
    "nav.builder": "Builder",
    "nav.marketplaces": "Marketplaces",
    "nav.analytics": "Analytics",
    "nav.settings": "Settings",
    "nav.explore": "Explore",

    // Common
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.copy": "Copy",
    "common.paste": "Paste",
    "common.undo": "Undo",
    "common.redo": "Redo",
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.connect": "Connect",
    "common.disconnect": "Disconnect",
    "common.deploy": "Deploy",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.sort": "Sort",
    "common.refresh": "Refresh",

    // Builder
    "builder.title": "Builder",
    "builder.components": "Components",
    "builder.testMode": "Test Mode",
    "builder.deployMarketplace": "Deploy Marketplace",
    "builder.canvasEmpty": "Start Building",
    "builder.canvasEmptyHint": "Drag components from the left panel",
    "builder.nodesCount": "{count} node(s)",
    "builder.edgesCount": "{count} edge(s)",

    // Test Panel
    "test.title": "Test & Preview",
    "test.runSimulation": "Run Simulation",
    "test.running": "Running...",
    "test.allTestsPassed": "All Tests Passed",
    "test.connectWallet": "Connect Wallet",
    "test.addComponents": "Add Components First",
    "test.reset": "Reset",

    // Marketplace
    "marketplace.list": "Marketplaces",
    "marketplace.create": "Create Marketplace",
    "marketplace.search": "Search marketplaces...",
    "marketplace.all": "All",
    "marketplace.live": "Live",
    "marketplace.draft": "Draft",
    "marketplace.totalAssets": "Total Assets",
    "marketplace.totalVolume": "Total Volume",
    "marketplace.status": "Status",

    // Settings
    "settings.title": "Settings",
    "settings.profile": "Profile",
    "settings.preferences": "Preferences",
    "settings.language": "Language",
    "settings.theme": "Theme",
    "settings.notifications": "Notifications",

    // Errors
    "error.network": "Network error. Please check your connection.",
    "error.timeout": "Request timed out. Please try again.",
    "error.unauthorized": "Please connect your wallet to continue.",
    "error.notFound": "Resource not found.",
    "error.generic": "Something went wrong. Please try again.",

    // Wallet
    "wallet.connect": "Connect Wallet",
    "wallet.disconnect": "Disconnect",
    "wallet.connected": "Connected",
    "wallet.disconnected": "Disconnected",
    "wallet.copyAddress": "Copy Address",
  },
  es: {
    // Navigation
    "nav.home": "Inicio",
    "nav.dashboard": "Panel",
    "nav.builder": "Constructor",
    "nav.marketplaces": "Mercados",
    "nav.analytics": "Analítica",
    "nav.settings": "Configuración",
    "nav.explore": "Explorar",

    // Common
    "common.save": "Guardar",
    "common.cancel": "Cancelar",
    "common.delete": "Eliminar",
    "common.edit": "Editar",
    "common.copy": "Copiar",
    "common.paste": "Pegar",
    "common.undo": "Deshacer",
    "common.redo": "Rehacer",
    "common.loading": "Cargando...",
    "common.error": "Error",
    "common.success": "Éxito",
    "common.connect": "Conectar",
    "common.disconnect": "Desconectar",
    "common.deploy": "Desplegar",
    "common.search": "Buscar",
    "common.filter": "Filtrar",
    "common.sort": "Ordenar",
    "common.refresh": "Actualizar",

    // Builder
    "builder.title": "Constructor",
    "builder.components": "Componentes",
    "builder.testMode": "Modo de Prueba",
    "builder.deployMarketplace": "Desplegar Mercado",
    "builder.canvasEmpty": "Comenzar a Construir",
    "builder.canvasEmptyHint": "Arrastra componentes desde el panel izquierdo",

    // Wallet
    "wallet.connect": "Conectar Billetera",
    "wallet.disconnect": "Desconectar",
    "wallet.connected": "Conectado",
  },
  pt: {
    // Navigation
    "nav.home": "Início",
    "nav.dashboard": "Painel",
    "nav.builder": "Construtor",
    "nav.marketplaces": "Mercados",

    // Common
    "common.save": "Salvar",
    "common.cancel": "Cancelar",
    "common.delete": "Excluir",
    "common.connect": "Conectar",
    "common.deploy": "Deploy",

    // Wallet
    "wallet.connect": "Conectar Carteira",
  },
};

let currentLocale = "en";

export function setLocale(locale: string): void {
  if (translations[locale]) {
    currentLocale = locale;
    localStorage.setItem("realflow-locale", locale);
  }
}

export function getLocale(): string {
  return currentLocale;
}

export function t(key: TranslationKey, values?: TranslationValues): string {
  let translation = translations[currentLocale]?.[key] || translations["en"]?.[key] || key;

  if (values) {
    Object.entries(values).forEach(([k, v]) => {
      translation = translation.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
    });
  }

  return translation;
}

export function getAvailableLocales(): { code: string; name: string }[] {
  return [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "pt", name: "Português" },
  ];
}

export function initI18n(): void {
  const savedLocale = localStorage.getItem("realflow-locale");
  const browserLocale = navigator.language.split("-")[0];
  
  if (savedLocale && translations[savedLocale]) {
    currentLocale = savedLocale;
  } else if (translations[browserLocale]) {
    currentLocale = browserLocale;
  }
}

export function hasTranslation(key: string): boolean {
  return !!translations[currentLocale]?.[key] || !!translations["en"]?.[key];
}
