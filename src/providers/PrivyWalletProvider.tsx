import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiConfig, createConfig, configureChains, mainnet } from "wagmi";
import { publicProvider } from "wagmi/providers/public";

// Define Polygon Amoy testnet
const polygonAmoy = {
  id: 80002,
  name: "Polygon Amoy",
  network: "polygon-amoy",
  nativeCurrency: { decimals: 18, name: "MATIC", symbol: "MATIC" },
  rpcUrls: {
    default: { http: ["https://rpc-amoy.polygon.technology/"] },
    public: { http: ["https://rpc-amoy.polygon.technology/"] },
  },
  blockExplorers: {
    default: { name: "PolygonScan", url: "https://www.oklink.com/amoy" },
  },
  testnet: true,
};

const polygon = {
  id: 137,
  name: "Polygon",
  network: "polygon",
  nativeCurrency: { decimals: 18, name: "MATIC", symbol: "MATIC" },
  rpcUrls: {
    default: { http: ["https://polygon-rpc.com"] },
    public: { http: ["https://polygon-rpc.com"] },
  },
  blockExplorers: {
    default: { name: "PolygonScan", url: "https://polygonscan.com" },
  },
};

const { chains, publicClient } = configureChains(
  [polygonAmoy, polygon, mainnet],
  [publicProvider()]
);

const wagmiConfig = createConfig({
  autoConnect: true,
  publicClient,
});

interface PrivyConfigProps {
  children: React.ReactNode;
}

export function PrivyWalletProvider({ children }: PrivyConfigProps) {
  const appId = import.meta.env.VITE_PRIVY_APP_ID || "cmmyr423a005a0bkvwyvx2750";

  return (
    <WagmiConfig config={wagmiConfig}>
      <PrivyProvider
        appId={appId}
        config={{
          appearance: {
            theme: "dark",
            accentColor: "#5e6ad2",
          },
          // Email and wallet only - no social logins
          loginMethods: ["email", "wallet"],
          embeddedWallets: {
            createOnLogin: "all-users",
            requireUserPasswordOnCreate: false,
          },
          defaultChain: polygonAmoy,
          supportedChains: [polygonAmoy, polygon, mainnet],
        }}
      >
        {children}
      </PrivyProvider>
    </WagmiConfig>
  );
}
