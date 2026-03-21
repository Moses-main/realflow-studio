import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { mainnet, polygon } from "viem/chains";
import { ThemeProvider } from "next-themes";
import { PrivyConfig } from "./providers/PrivyProvider";
import { polygonAmoy } from "./lib/wagmi";

const { chains, publicClient } = configureChains(
  [polygonAmoy, polygon, mainnet],
  [publicProvider()]
);

const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient,
});

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