import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { mainnet, polygon, polygonMumbai } from "wagmi/chains";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "@wagmi/connectors/walletConnect";
import { PrivyProvider } from "@privy-io/react-auth";

interface ImportMetaEnv {
  readonly VITE_PRIVY_APP_ID?: string;
  readonly VITE_WALLET_CONNECT_PROJECT_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

const WALLET_CONNECT_PROJECT_ID = (
  import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID ||
  ""
).toString();

const PRIVY_APP_ID = (
  import.meta.env.VITE_PRIVY_APP_ID ||
  ""
).toString();

const { chains, publicClient } = configureChains(
  [polygonMumbai, polygon, mainnet],
  [publicProvider()]
);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new InjectedConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: WALLET_CONNECT_PROJECT_ID,
        showQrModal: true,
        metadata: {
          name: "RealFlow Studio",
          description: "AI-driven RWA marketplace builder",
          url: typeof window !== "undefined" ? window.location.origin : "https://example.com",
          icons: [],
        },
      },
    }),
  ],
  publicClient,
  chains,
});

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <PrivyProvider appId={PRIVY_APP_ID}>
        <App />
      </PrivyProvider>
    </WagmiConfig>
  </React.StrictMode>,
);
