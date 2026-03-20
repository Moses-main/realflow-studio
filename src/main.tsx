import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { mainnet, polygon } from "wagmi/chains";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "@wagmi/connectors/walletConnect";
import { PrivyProvider } from "@privy-io/react-auth";
import { Chain } from "wagmi";
import { ThemeProvider } from "next-themes";

const polygonAmoy: Chain = {
  id: 80002,
  name: "Polygon Amoy",
  network: "polygon-amoy",
  nativeCurrency: {
    decimals: 18,
    name: "MATIC",
    symbol: "MATIC",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-amoy.polygon.technology/"],
    },
    public: {
      http: ["https://rpc-amoy.polygon.technology/"],
    },
  },
  blockExplorers: {
    default: {
      name: "PolygonScan",
      url: "https://amoy.polygonscan.com",
    },
  },
  testnet: true,
};

const WALLET_CONNECT_PROJECT_ID = (
  import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID ||
  ""
).toString();

const PRIVY_APP_ID = (
  import.meta.env.VITE_PRIVY_APP_ID ||
  ""
).toString();

const requiredEnvVars = [
  { name: "VITE_WALLET_CONNECT_PROJECT_ID", value: WALLET_CONNECT_PROJECT_ID, required: false },
  { name: "VITE_PRIVY_APP_ID", value: PRIVY_APP_ID, required: false },
];

const missingRequired = requiredEnvVars
  .filter(v => v.required && !v.value)
  .map(v => v.name);

if (missingRequired.length > 0) {
  console.warn(
    `%c[RealFlow Studio] Missing required environment variables: ${missingRequired.join(", ")}`,
    "color: orange; font-weight: bold;"
  );
}

const { chains, publicClient } = configureChains(
  [polygonAmoy, polygon, mainnet],
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
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <WagmiConfig config={wagmiConfig}>
        <PrivyProvider appId={PRIVY_APP_ID}>
          <App />
        </PrivyProvider>
      </WagmiConfig>
    </ThemeProvider>
  </React.StrictMode>,
);
