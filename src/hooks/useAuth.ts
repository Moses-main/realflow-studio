import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useCallback, useEffect, useState } from "react";

export interface WalletAccount {
  address: string;
  walletClientType: string;
  chainId?: number;
}

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
  const [allAccounts, setAllAccounts] = useState<WalletAccount[]>([]);

  // Get all wallet accounts
  useEffect(() => {
    if (wallets && wallets.length > 0) {
      const accounts: WalletAccount[] = wallets.map((w: any) => ({
        address: w.address,
        walletClientType: w.walletClientType || 'unknown',
        chainId: w.chainId,
      }));
      setAllAccounts(accounts);
      
      // Find the best wallet to use (prefer embedded, fallback to first)
      const embedded = wallets.find((w: any) => w.walletClientType === "privy");
      setEmbeddedWallet(embedded || wallets[0]);
    } else {
      setAllAccounts([]);
      setEmbeddedWallet(null);
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

  // Get balance for an address on Polygon Amoy
  const getBalance = useCallback(async (addr: string): Promise<string> => {
    try {
      const provider = await embeddedWallet?.getEthereumProvider();
      if (!provider) return "0.0000";
      
      const balance = await provider.request({
        method: "eth_getBalance",
        params: [addr, "latest"],
      });
      
      // Convert hex to MATIC
      const balanceInWei = parseInt(balance as string, 16);
      const balanceInMatic = balanceInWei / 1e18;
      return balanceInMatic.toFixed(4);
    } catch (error) {
      console.error("Failed to get balance:", error);
      return "0.0000";
    }
  }, [embeddedWallet]);

  // Switch active account (for external wallets with multiple accounts)
  const switchAccount = useCallback(async (newAddress: string) => {
    // For embedded wallets, we can't switch accounts
    // For external wallets, the user switches in their wallet app
    console.log("Switch to account:", newAddress);
  }, []);

  // Copy address to clipboard
  const copyAddress = useCallback(async (addr: string) => {
    try {
      await navigator.clipboard.writeText(addr);
      return true;
    } catch (error) {
      console.error("Failed to copy:", error);
      return false;
    }
  }, []);

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
    getBalance,
    switchAccount,
    copyAddress,
    address,
    email,
    hasWallet: !!embeddedWallet,
    allAccounts,
    wallets: wallets || [],
  };
}

export function shortenAddress(address: string | null): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
