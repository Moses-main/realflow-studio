import { useCallback, useEffect, useState } from "react";
import { useAccount, useChainId, useSwitchChain, usePublicClient } from "wagmi";
import { polygonAmoy, polygon, mainnet } from "wagmi/chains";
import type { Chain } from "viem";

export interface ConnectionStatus {
  isConnected: boolean;
  isCorrectChain: boolean;
  chainId: number | null;
  chainName: string | null;
  isReconnecting: boolean;
  error: string | null;
  supportsChain: boolean;
}

export interface UseConnectionValidationResult extends ConnectionStatus {
  switchToSupportedChain: (chainId?: number) => Promise<void>;
  reconnect: () => Promise<void>;
  supportedChains: Chain[];
  isValidating: boolean;
}

const SUPPORTED_CHAINS = [polygonAmoy, polygon, mainnet] as const;
const PREFERRED_CHAIN_ID = polygonAmoy.id;

function getChainById(chainId: number): Chain | undefined {
  return SUPPORTED_CHAINS.find(c => c.id === chainId);
}

function getChainName(chainId: number): string {
  const chain = getChainById(chainId);
  return chain?.name || `Chain ${chainId}`;
}

export function useConnectionValidation(): UseConnectionValidationResult {
  const { address, isConnected, isReconnecting } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();
  const publicClient = usePublicClient();

  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const isCorrectChain = isConnected && chainId === PREFERRED_CHAIN_ID;
  const supportsChain = isConnected && SUPPORTED_CHAINS.some(c => c.id === chainId);

  useEffect(() => {
    if (!isConnected) {
      setError(null);
      return;
    }

    const validateConnection = async () => {
      setIsValidating(true);
      try {
        if (!publicClient) {
          setError("Unable to connect to blockchain network");
          return;
        }

        const blockNumber = await publicClient.getBlockNumber();
        if (!blockNumber) {
          setError("Network not responding");
        } else {
          setError(null);
        }
      } catch (err) {
        console.error("Connection validation error:", err);
        setError(err instanceof Error ? err.message : "Connection validation failed");
      } finally {
        setIsValidating(false);
      }
    };

    validateConnection();
  }, [isConnected, publicClient, chainId]);

  const switchToSupportedChain = useCallback(async (targetChainId?: number) => {
    const chainIdToSwitch = targetChainId || PREFERRED_CHAIN_ID;
    
    if (!SUPPORTED_CHAINS.some(c => c.id === chainIdToSwitch)) {
      setError(`Chain ${chainIdToSwitch} is not supported`);
      return;
    }

    try {
      setError(null);
      await switchChainAsync({ chainId: chainIdToSwitch });
    } catch (err) {
      console.error("Chain switch failed:", err);
      setError(err instanceof Error ? err.message : "Failed to switch chain");
      throw err;
    }
  }, [switchChainAsync]);

  const reconnect = useCallback(async () => {
    if (!address) {
      setError("No wallet connected");
      return;
    }

    setIsValidating(true);
    setError(null);

    try {
      if (chainId && !SUPPORTED_CHAINS.some(c => c.id === chainId)) {
        await switchToSupportedChain(PREFERRED_CHAIN_ID);
      }

      if (publicClient) {
        const blockNumber = await publicClient.getBlockNumber();
        if (!blockNumber) {
          throw new Error("Network not responding");
        }
      }
    } catch (err) {
      console.error("Reconnection failed:", err);
      setError(err instanceof Error ? err.message : "Reconnection failed");
    } finally {
      setIsValidating(false);
    }
  }, [address, chainId, switchToSupportedChain, publicClient]);

  return {
    isConnected,
    isCorrectChain,
    chainId: chainId ?? null,
    chainName: chainId ? getChainName(chainId) : null,
    isReconnecting: isReconnecting || isSwitching,
    error,
    supportsChain,
    switchToSupportedChain,
    reconnect,
    supportedChains: [...SUPPORTED_CHAINS],
    isValidating,
  };
}

export function useChainGuard(requiredChainId?: number) {
  const validation = useConnectionValidation();
  const targetChainId = requiredChainId || PREFERRED_CHAIN_ID;

  const guardError = validation.isConnected && !validation.supportsChain
    ? `Please switch to a supported network (Polygon Amoy, Polygon, or Ethereum)`
    : validation.isCorrectChain === false
      ? `Please switch to ${getChainName(targetChainId)} to continue`
      : validation.error;

  return {
    ...validation,
    guardError,
    canProceed: validation.isConnected && (validation.isCorrectChain || !requiredChainId) && !validation.error,
  };
}
