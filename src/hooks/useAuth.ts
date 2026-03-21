import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useCallback, useEffect, useState } from "react";

export interface User {
  id: string;
  address: string | null;
  email: string | null;
  isAuthenticated: boolean;
  hasWallet: boolean;
}

export function useAuth() {
  const { 
    login, 
    logout, 
    authenticated, 
    user: privyUser, 
    ready,
    connectWallet 
  } = usePrivy();
  
  const { wallets } = useWallets();
  const [embeddedWallet, setEmbeddedWallet] = useState<any>(null);

  // Find the embedded wallet (created by Privy)
  useEffect(() => {
    if (wallets && wallets.length > 0) {
      const embedded = wallets.find(w => w.walletClientType === "privy");
      setEmbeddedWallet(embedded || wallets[0]);
    }
  }, [wallets]);

  const address = embeddedWallet?.address || null;
  const email = privyUser?.email?.address || null;

  const user: User = {
    id: privyUser?.id || "",
    address,
    email,
    isAuthenticated: authenticated,
    hasWallet: !!embeddedWallet,
  };

  // Login with email (sends magic link)
  const loginWithEmail = useCallback(async (emailAddress?: string) => {
    try {
      await login({
        loginMechanism: "email",
        ...(emailAddress && { email: emailAddress }),
      });
    } catch (error) {
      console.error("Email login failed:", error);
      throw error;
    }
  }, [login]);

  // Login with Google
  const loginWithGoogle = useCallback(async () => {
    try {
      await login({ loginMechanism: "google" });
    } catch (error) {
      console.error("Google login failed:", error);
      throw error;
    }
  }, [login]);

  // Login with wallet
  const loginWithWallet = useCallback(async () => {
    try {
      await login({ loginMechanism: "wallet" });
    } catch (error) {
      console.error("Wallet login failed:", error);
      throw error;
    }
  }, [login]);

  // Logout
  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [logout]);

  // Get wallet provider for transactions
  const getWalletProvider = useCallback(async () => {
    if (!embeddedWallet) return null;
    
    try {
      const provider = await embeddedWallet.getEthereumProvider();
      return provider;
    } catch (error) {
      console.error("Failed to get wallet provider:", error);
      return null;
    }
  }, [embeddedWallet]);

  // Send transaction
  const sendTransaction = useCallback(async (tx: {
    to: string;
    value?: string;
    data?: string;
  }) => {
    const provider = await getWalletProvider();
    if (!provider) throw new Error("No wallet connected");

    const txHash = await provider.request({
      method: "eth_sendTransaction",
      params: [{
        from: address,
        to: tx.to,
        value: tx.value || "0x0",
        data: tx.data || "0x",
      }],
    });

    return txHash;
  }, [address, getWalletProvider]);

  return {
    user,
    authenticated,
    ready,
    login: loginWithEmail,
    loginWithEmail,
    loginWithGoogle,
    loginWithWallet,
    logout: handleLogout,
    connectWallet,
    getWalletProvider,
    sendTransaction,
    address,
    email,
    hasWallet: !!embeddedWallet,
  };
}

export function shortenAddress(address: string | null): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
