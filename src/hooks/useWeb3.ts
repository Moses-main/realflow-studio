import { useState, useEffect, useCallback } from 'react';
import { useWallets } from '@privy-io/react-auth';
import ContractService, { publicClient } from '@/services/contracts';

export interface Web3State {
  isConnected: boolean;
  isConnecting: boolean;
  address: string | null;
  error: string | null;
}

export interface UseWeb3Result extends Web3State {
  connect: () => Promise<void>;
  disconnect: () => void;
  refetch: () => void;
}

export function useWeb3(): UseWeb3Result {
  const { wallets, ready } = useWallets();
  const [state, setState] = useState<Web3State>({
    isConnected: false,
    isConnecting: false,
    address: null,
    error: null,
  });

  const connect = useCallback(async () => {
    setState(prev => ({ ...prev, isConnecting: true, error: null }));
    
    try {
      if (!ready) {
        throw new Error('Wallet not ready');
      }

      if (wallets.length === 0) {
        throw new Error('No wallet found');
      }

      const wallet = wallets[0];
      setState({
        isConnected: true,
        isConnecting: false,
        address: wallet.address,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Failed to connect wallet',
      }));
    }
  }, [wallets, ready]);

  const disconnect = useCallback(() => {
    setState({
      isConnected: false,
      isConnecting: false,
      address: null,
      error: null,
    });
  }, []);

  const refetch = useCallback(() => {
    if (wallets.length > 0 && ready) {
      const wallet = wallets[0];
      setState(prev => ({
        ...prev,
        isConnected: true,
        address: wallet.address,
        error: null,
      }));
    }
  }, [wallets, ready]);

  useEffect(() => {
    if (ready && wallets.length > 0) {
      const wallet = wallets[0];
      setState({
        isConnected: true,
        isConnecting: false,
        address: wallet.address,
        error: null,
      });
    }
  }, [ready, wallets]);

  return {
    ...state,
    connect,
    disconnect,
    refetch,
  };
}

export function useContractStats() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const stats = await ContractService.getPlatformStats();
      setData(stats);
    } catch (err) {
      console.error('Failed to fetch contract stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { data, loading, error, refetch: fetchStats };
}

export function useContractMarketplaces() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMarketplaces = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const marketplaces = await ContractService.getMarketplaces();
      
      // Transform data to match Marketplace interface
      const transformedMarketplaces = marketplaces.map((mp) => ({
        id: mp.address,
        name: mp.name || `Marketplace ${mp.address.slice(0, 8)}`,
        status: mp.active ? 'live' : 'paused',
        category: mp.category || 'real-estate',
        network: mp.network,
        assets: 0,
        volume: '0',
        volumeFormatted: '$0',
        address: mp.address,
        createdAt: mp.createdAt,
        description: `Real blockchain marketplace on ${mp.network === 'avalanche' ? 'Avalanche' : 'Polygon'}`,
        explorerUrl: mp.network === 'avalanche' 
          ? `https://testnet.snowtrace.io/address/${mp.address}`
          : `https://amoy.polygonscan.com/address/${mp.address}`,
      }));

      setData(transformedMarketplaces);
    } catch (err) {
      console.error('Failed to fetch contract marketplaces:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch marketplaces');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarketplaces();
  }, [fetchMarketplaces]);

  return { data, loading, error, refetch: fetchMarketplaces };
}

export function useContractBalance(address?: string) {
  const [balance, setBalance] = useState<string>('0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!address) return;

    setLoading(true);
    setError(null);
    
    try {
      const balanceWei = await publicClient.getBalance({ address: address as `0x${string}` });
      setBalance(balanceWei.toString());
    } catch (err) {
      console.error('Failed to fetch balance:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch balance');
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return { balance, loading, error, refetch: fetchBalance };
}

export default useWeb3;
