import { PrivyProvider } from "@privy-io/react-auth";

interface PrivyConfigProps {
  children: React.ReactNode;
}

const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID || "YOUR_PRIVY_APP_ID";

export function PrivyConfig({ children }: PrivyConfigProps) {
  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        appearance: {
          theme: "dark",
          accentColor: "#6366f1",
          logo: "/logo.svg",
        },
        embeddedWallets: {
          requireUserPasswordOnCreate: true,
          showWalletUIs: true,
        },
        loginMethods: [
          {
            method: "email",
            config: {
              name: "email",
              displayName: "Email",
              icon: "/email-icon.svg",
            },
          },
          {
            method: "wallet",
            config: {
              name: "wallet",
              displayName: "Wallet",
              icon: "/wallet-icon.svg",
            },
          },
        ],
        supportedChains: [
          {
            name: "Polygon Amoy",
            id: 80002,
            currency: "MATIC",
            rpcUrl: "https://rpc-amoy.polygon.technology/",
            icon: "/polygon-icon.svg",
          },
          {
            name: "Polygon",
            id: 137,
            currency: "MATIC",
            rpcUrl: "https://polygon-rpc.com/",
            icon: "/polygon-icon.svg",
          },
          {
            name: "Ethereum",
            id: 1,
            currency: "ETH",
            rpcUrl: "https://eth.llamarpc.com",
            icon: "/ethereum-icon.svg",
          },
        ],
        defaultChain: 80002,
      }}
    >
      {children}
    </PrivyProvider>
  );
}

export default PrivyConfig;
