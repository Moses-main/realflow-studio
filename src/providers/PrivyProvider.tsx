import { PrivyProvider } from "@privy-io/react-auth";

interface PrivyConfigProps {
  children: React.ReactNode;
}

const PRIVY_APP_ID = import.meta.env.VITE_PRIVY_APP_ID || "cm1234567890abcdef";

export function PrivyConfig({ children }: PrivyConfigProps) {
  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        appearance: {
          theme: "dark",
          accentColor: "#6366f1",
        },
        loginMethods: ["email", "wallet"],
        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}

export default PrivyConfig;
