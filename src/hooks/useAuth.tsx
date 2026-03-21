import { useCallback } from "react";
import { useWallet, shortenAddress } from "./useWallet";

export interface AuthUser {
  address: string | null;
  ensName: string | null;
  ensAvatar: string | null;
  isAuthenticated: boolean;
  isWalletConnected: boolean;
  walletType: "injected" | "walletconnect" | "privy" | null;
}

export function useAuth() {
  const {
    address,
    isConnected,
    connect,
    disconnect,
    isConnecting,
    error,
  } = useWallet();

  const authUser: AuthUser = {
    address: address ?? null,
    ensName: null,
    ensAvatar: null,
    isAuthenticated: isConnected,
    isWalletConnected: isConnected,
    walletType: isConnected ? "injected" : null,
  };

  const loginWithEmail = useCallback(async () => {
    // Direct wallet connection since we're not using Privy
    await connect();
  }, [connect]);

  const connectWallet = useCallback(async () => {
    await connect();
  }, [connect]);

  const disconnectWallet = useCallback(async () => {
    disconnect();
  }, [disconnect]);

  const getProfile = useCallback(() => {
    return {
      address,
      shortAddress: shortenAddress(address),
    };
  }, [address]);

  return {
    user: authUser,
    authenticated: isConnected,
    login: loginWithEmail,
    logout: disconnect,
    loginWithEmail,
    connectWallet,
    disconnectWallet,
    getProfile,
    isInitialized: true,
    connectError: error,
    isConnecting,
  };
}
