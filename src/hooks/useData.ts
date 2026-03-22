import { useState, useEffect, useCallback } from "react";
import { useContractStats, useContractMarketplaces } from "./useWeb3";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export interface Marketplace {
  id: string;
  name: string;
  status: "live" | "draft" | "paused";
  category: string;
  network?: "polygon" | "avalanche";
  assets: number;
  volume: string;
  volumeFormatted: string;
  address: string;
  createdAt: string;
  description?: string;
  explorerUrl?: string;
}

export interface Template {
  id: string;
  name: string;
  desc: string;
  components: number;
  category: string;
}

export interface Stat {
  label: string;
  value: string;
  change: string | null;
  icon: string;
  positive: boolean;
}

export interface Transaction {
  hash: string;
  type: "deploy" | "mint" | "transfer" | "swap";
  amount: string;
  timestamp: string;
  status: "success" | "pending" | "failed";
  description: string;
}

export interface VolumeData {
  date: string;
  value: number;
}

export interface AssetBreakdown {
  name: string;
  value: number;
  color: string;
}

export interface UseDataResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

async function fetchWithTimeout(url: string, options?: RequestInit, timeout = 10000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetchWithTimeout(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  return json.data || json;
}

export function useMarketplaces(params?: { status?: string; category?: string; search?: string }): UseDataResult<Marketplace[]> {
  const [data, setData] = useState<Marketplace[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use real blockchain data
  const { data: contractMarketplaces, loading: contractLoading, error: contractError } = useContractMarketplaces();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      let marketplaces = contractMarketplaces || [];
      
      // Apply filters
      if (params?.status && params.status !== 'all') {
        marketplaces = marketplaces.filter(m => m.status === params.status);
      }
      if (params?.category && params.category !== 'all') {
        marketplaces = marketplaces.filter(m => m.category === params.category);
      }
      if (params?.search) {
        const searchLower = params.search.toLowerCase();
        marketplaces = marketplaces.filter(m => 
          m.name.toLowerCase().includes(searchLower) ||
          m.category.toLowerCase().includes(searchLower) ||
          m.description?.toLowerCase().includes(searchLower)
        );
      }

      setData(marketplaces);
    } catch (err) {
      console.error("Failed to fetch marketplaces:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch marketplaces");
      setData([]);
    }
  }, [contractMarketplaces, params?.status, params?.category, params?.search]);

  useEffect(() => {
    if (!contractLoading) {
      fetchData();
    }
  }, [fetchData, contractLoading]);

  return { data, loading: loading || contractLoading, error: error || contractError, refetch: fetchData };
}

export function useMarketplaceById(id: string): UseDataResult<Marketplace | null> {
  const [data, setData] = useState<Marketplace | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const result = await apiRequest<Marketplace>(`/api/marketplaces/${id}`);
      setData(result);
    } catch (err) {
      console.error("Failed to fetch marketplace:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch marketplace");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

const TEMPLATES: Template[] = [
  { id: "real-estate", name: "Real Estate Marketplace", desc: "Tokenize properties", components: 6, category: "RWA" },
  { id: "art-gallery", name: "Art Gallery", desc: "Digital art trading", components: 5, category: "Creative" },
  { id: "music-rights", name: "Music Rights", desc: "Royalty sharing", components: 4, category: "Media" },
  { id: "commodities", name: "Commodities Exchange", desc: "Physical goods", components: 5, category: "Trading" },
  { id: "intellectual-property", name: "IP Marketplace", desc: "Patents & trademarks", components: 4, category: "Legal" },
  { id: "custom", name: "Custom Marketplace", desc: "Build your own", components: 8, category: "Advanced" },
];

export function useTemplates(): UseDataResult<Template[]> {
  const [data, setData] = useState<Template[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(TEMPLATES);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch templates");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useStats(): UseDataResult<Stat[]> {
  const [data, setData] = useState<Stat[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Use real blockchain data
  const { data: contractStats, loading: contractLoading, error: contractError } = useContractStats();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (contractStats) {
        const stats: Stat[] = [
          { 
            label: "Total Marketplaces", 
            value: contractStats.totalMarketplaces.toString(), 
            change: contractStats.activeMarketplaces > 0 ? `+${contractStats.activeMarketplaces}` : null, 
            icon: "TrendingUp", 
            positive: true 
          },
          { 
            label: "Active Marketplaces", 
            value: contractStats.activeMarketplaces.toString(), 
            change: null, 
            icon: "TrendingUp", 
            positive: true 
          },
          { 
            label: "Tokens Minted", 
            value: contractStats.totalTokensMinted.toString(), 
            change: contractStats.totalTokensMinted > 0 ? "+New" : null, 
            icon: "TrendingUp", 
            positive: true 
          },
          { 
            label: "Platform Fee", 
            value: contractStats.platformFee, 
            change: null, 
            icon: "Wallet", 
            positive: true 
          },
        ];
        setData(stats);
      }
    } catch (err) {
      console.error('Error processing stats:', err);
      setError(err instanceof Error ? err.message : "Failed to process stats");
      
      // Fallback to dummy data if blockchain data fails
      const fallbackStats: Stat[] = [
        { label: "Total Marketplaces", value: "0", change: null, icon: "TrendingUp", positive: true },
        { label: "Active Marketplaces", value: "0", change: null, icon: "TrendingUp", positive: true },
        { label: "Tokens Minted", value: "0", change: null, icon: "TrendingUp", positive: true },
        { label: "Platform Fee", value: "0.5%", change: null, icon: "Wallet", positive: true },
      ];
      setData(fallbackStats);
    } finally {
      setLoading(false);
    }
  }, [contractStats]);

  useEffect(() => {
    if (!contractLoading) {
      fetchData();
    }
  }, [fetchData, contractLoading]);

  return { data, loading: loading || contractLoading, error: error || contractError, refetch: fetchData };
}

export function useTransactions(): UseDataResult<Transaction[]> {
  const [data, setData] = useState<Transaction[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // For now, return empty array as we'll implement real blockchain transactions
      // This will be updated to fetch from PolygonScan API
      const transactions: Transaction[] = [];
      setData(transactions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch transactions");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useAnalytics(): UseDataResult<{ volumeData: VolumeData[]; assetBreakdown: AssetBreakdown[] }> {
  const [data, setData] = useState<{ volumeData: VolumeData[]; assetBreakdown: AssetBreakdown[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Generate sample analytics data based on actual marketplaces
      // In a real implementation, this would fetch from blockchain analytics APIs
      const volumeData: VolumeData[] = [
        { date: "Mon", value: 0 },
        { date: "Tue", value: 0 },
        { date: "Wed", value: 0 },
        { date: "Thu", value: 0 },
        { date: "Fri", value: 0 },
        { date: "Sat", value: 0 },
        { date: "Sun", value: 0 },
      ];

      const assetBreakdown: AssetBreakdown[] = [
        { name: "Real Estate", value: 0, color: "#5e6ad2" },
        { name: "Art", value: 0, color: "#10b981" },
        { name: "Commodities", value: 0, color: "#f59e0b" },
        { name: "Music Rights", value: 0, color: "#ef4444" },
        { name: "Intellectual Property", value: 0, color: "#6b7280" },
      ];

      setData({ volumeData, assetBreakdown });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch analytics");
      setData({ volumeData: [], assetBreakdown: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}