import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

import { WagmiConfig } from "wagmi";
import { ThemeProvider } from "next-themes";
import { PrivyConfig } from "./providers/PrivyProvider";
import { config as wagmiConfig } from "./lib/wagmi";

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <PrivyConfig>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <App />
        </ThemeProvider>
      </PrivyConfig>
    </WagmiConfig>
  </React.StrictMode>,
);