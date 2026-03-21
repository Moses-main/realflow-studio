import React, { useCallback, useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useAccount, useConnect, useDisconnect, useEnsName, useEnsAvatar } from "wagmi";
import type { Address } from "viem";

export interface AuthUser {
  address: Address | null;
  ensName: string | null;
  ensAvatar: string | null;
  isAuthenticated: boolean;
  isWalletConnected: boolean;
  walletType: "injected" | "walletconnect" | "privy" | null;
}

export function useAuth() {
  const { login, logout, authenticated, user: privyUser, ready } = usePrivy();
  const { connect, connectors, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected, connector } = useAccount();
  const { data: ensName } = useEnsName({ address: address });
  
  // useEnsAvatar requires name parameter, not address directly
  const { data: ensAvatar } = useEnsAvatar({ 
    name: ensName || undefined,
    query: {
      enabled: !!ensName,
    }
  });

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (ready) {
      setIsInitialized(true);
    }
  }, [ready]);

  const walletType: "injected" | "walletconnect" | "privy" | null = isConnected
    ? connector?.id === "injected" || connector?.id === "metaMask"
      ? "injected"
      : connector?.id === "walletConnect" || connector?.id === "walletConnectConnector"
        ? "walletconnect"
        : "privy"
    : null;

  const authUser: AuthUser = {
    address: address ?? null,
    ensName: ensName ?? null,
    ensAvatar: ensAvatar ?? null,
    isAuthenticated: authenticated || isConnected,
    isWalletConnected: isConnected,
    walletType,
  };

  const loginWithEmail = useCallback(async () => {
    try {
      await login();
    } catch (error) {
      console.error("Email login failed:", error);
      throw error;
    }
  }, [login]);

  const connectWallet = useCallback(async () => {
    try {
      const injectedConnector = connectors.find(c => c.id === "injected" || c.id === "metaMask");
      if (injectedConnector) {
        await connect({ connector: injectedConnector });
        return;
      }
      
      for (const c of connectors) {
        try {
          await connect({ connector: c });
          return;
        } catch (err) {
          console.warn("Connector failed:", c.id, err);
        }
      }
      
      throw new Error("No wallet connectors available");
    } catch (error) {
      console.error("Wallet connection failed:", error);
      throw error;
    }
  }, [connect, connectors]);

  const disconnectWallet = useCallback(async () => {
    try {
      if (authenticated) {
        await logout();
      }
      if (isConnected) {
        disconnect();
      }
    } catch (error) {
      console.error("Disconnect failed:", error);
      throw error;
    }
  }, [authenticated, logout, isConnected, disconnect]);

  const getProfile = useCallback(() => {
    return privyUser;
  }, [privyUser]);

  return {
    user: authUser,
    authenticated,
    login: loginWithEmail,
    logout: logout,
    loginWithEmail,
    connectWallet,
    disconnectWallet,
    getProfile,
    isInitialized,
    connectError,
  };
}
