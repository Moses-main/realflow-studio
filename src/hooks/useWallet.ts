import { useState, useEffect, useCallback } from "react";

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
  balance: string | null;
  isConnecting: boolean;
  error: string | null;
}

const POLYGON_AMOY_CHAIN_ID = 80002;
const POLYGON_CHAIN_ID = 137;

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    address: null,
    isConnected: false,
    chainId: null,
    balance: null,
    isConnecting: false,
    error: null,
  });

  const checkConnection = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      }) as string[];

      if (accounts && accounts.length > 0) {
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        }) as string;

        const balance = await window.ethereum.request({
          method: "eth_getBalance",
          params: [accounts[0], "latest"],
        }) as string;

        setState({
          address: accounts[0],
          isConnected: true,
          chainId: parseInt(chainId, 16),
          balance: (parseInt(balance, 16) / 1e18).toFixed(4),
          isConnecting: false,
          error: null,
        });
      }
    } catch (error) {
      console.error("Failed to check connection:", error);
    }
  }, []);

  useEffect(() => {
    checkConnection();

    if (window.ethereum) {
      const handleAccountsChanged = (accounts: unknown) => {
        const accountsArray = accounts as string[];
        if (accountsArray.length === 0) {
          setState({
            address: null,
            isConnected: false,
            chainId: null,
            balance: null,
            isConnecting: false,
            error: null,
          });
        } else {
          checkConnection();
        }
      };

      const handleChainChanged = () => {
        checkConnection();
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum?.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, [checkConnection]);

  const connect = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      setState(prev => ({
        ...prev,
        error: "No wallet detected. Please install MetaMask or another Web3 wallet.",
      }));
      return;
    }

    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      }) as string[];

      if (accounts && accounts.length > 0) {
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        }) as string;

        const balance = await window.ethereum.request({
          method: "eth_getBalance",
          params: [accounts[0], "latest"],
        }) as string;

        setState({
          address: accounts[0],
          isConnected: true,
          chainId: parseInt(chainId, 16),
          balance: (parseInt(balance, 16) / 1e18).toFixed(4),
          isConnecting: false,
          error: null,
        });
      }
    } catch (error: unknown) {
      const err = error as { code?: number; message?: string };
      let errorMessage = "Failed to connect wallet";
      
      if (err.code === 4001) {
        errorMessage = "Connection request rejected. Please approve the connection in your wallet.";
      } else if (err.code === -32002) {
        errorMessage = "Connection request pending. Please check your wallet.";
      } else if (err.message) {
        errorMessage = err.message;
      }

      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: errorMessage,
      }));
    }
  }, []);

  const disconnect = useCallback(() => {
    setState({
      address: null,
      isConnected: false,
      chainId: null,
      balance: null,
      isConnecting: false,
      error: null,
    });
  }, []);

  const switchChain = useCallback(async (chainId: number) => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error: unknown) {
      const err = error as { code?: number };
      if (err.code === 4902) {
        // Chain not added, try to add it
        if (chainId === POLYGON_AMOY_CHAIN_ID) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: `0x${chainId.toString(16)}`,
              chainName: "Polygon Amoy Testnet",
              nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
              rpcUrls: ["https://rpc-amoy.polygon.technology/"],
              blockExplorerUrls: ["https://www.oklink.com/amoy"],
            }],
          });
        }
      }
    }
  }, []);

  const isCorrectChain = state.chainId === POLYGON_AMOY_CHAIN_ID || state.chainId === POLYGON_CHAIN_ID;
  const isTestnet = state.chainId === POLYGON_AMOY_CHAIN_ID;

  return {
    ...state,
    connect,
    disconnect,
    switchChain,
    isCorrectChain,
    isTestnet,
    isMetaMask: window.ethereum?.isMetaMask ?? false,
    hasWallet: typeof window !== "undefined" && !!window.ethereum,
  };
}

export function shortenAddress(address: string | null): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
