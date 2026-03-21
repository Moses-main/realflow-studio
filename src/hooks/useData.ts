import { useState, useEffect, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export interface Marketplace {
  id: string;
  name: string;
  status: "live" | "draft" | "paused";
  category: string;
  assets: number;
  volume: string;
  volumeFormatted: string;
  address: string;
  createdAt: string;
  description?: string;
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

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (params?.status) queryParams.set("status", params.status);
      if (params?.category) queryParams.set("category", params.category);
      if (params?.search) queryParams.set("search", params.search);

      const query = queryParams.toString();
      const endpoint = `/api/marketplaces${query ? `?${query}` : ""}`;
      
      const result = await apiRequest<Marketplace[]>(endpoint);
      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      console.error("Failed to fetch marketplaces:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch marketplaces");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [params?.status, params?.category, params?.search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
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
  { id: "1", name: "NFT Marketplace", desc: "Basic trading", components: 5, category: "Standard" },
  { id: "2", name: "Creator Portfolio", desc: "Showcase works", components: 4, category: "Gallery" },
  { id: "3", name: "Digital Gallery", desc: "Browse collections", components: 4, category: "Gallery" },
  { id: "4", name: "Full Platform", desc: "All features", components: 6, category: "Enterprise" },
  { id: "5", name: "Auction House", desc: "Timed auctions", components: 5, category: "Trading" },
  { id: "6", name: "Fractional Ownership", desc: "Shared assets", components: 5, category: "Finance" },
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

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const stats: Stat[] = [
        { label: "Total Value Locked", value: "$124,500", change: "+12.5%", icon: "TrendingUp", positive: true },
        { label: "Transactions", value: "1,284", change: "+8.2%", icon: "TrendingUp", positive: true },
        { label: "NFTs Minted", value: "892", change: "+15.3%", icon: "TrendingUp", positive: true },
        { label: "Platform Fee", value: "0.5%", change: null, icon: "Wallet", positive: true },
      ];
      setData(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch stats");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useTransactions(): UseDataResult<Transaction[]> {
  const [data, setData] = useState<Transaction[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const transactions: Transaction[] = [
        { hash: "0x8f2e9...4a7b1", type: "deploy", amount: "0.023 MATIC", timestamp: "2 mins ago", status: "success", description: "MarketplaceFactory deployed" },
        { hash: "0x3c4d5...9e2f0", type: "mint", amount: "100 ERC-1155", timestamp: "15 mins ago", status: "success", description: "Tokenized Lagos Property" },
        { hash: "0x7b8c9...1d3e4", type: "transfer", amount: "0.005 MATIC", timestamp: "1 hour ago", status: "success", description: "Storage deposit" },
        { hash: "0x2a3b4...5c6d7", type: "swap", amount: "50 ERC-1155", timestamp: "3 hours ago", status: "success", description: "Fraction purchased" },
        { hash: "0x1x2y3...8z9w0", type: "deploy", amount: "0.021 MATIC", timestamp: "1 day ago", status: "success", description: "RWATokenizer deployed" },
      ];
      setData(transactions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch transactions");
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
      const baseValue = 50000;
      const volumeData: VolumeData[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        volumeData.push({
          date: date.toLocaleDateString("en-US", { weekday: "short" }),
          value: baseValue + Math.floor(Math.random() * 20000) - 10000,
        });
      }

      const assetBreakdown: AssetBreakdown[] = [
        { name: "Real Estate", value: 45, color: "#5e6ad2" },
        { name: "Art", value: 25, color: "#10b981" },
        { name: "Commodities", value: 15, color: "#f59e0b" },
        { name: "Music Rights", value: 10, color: "#ef4444" },
        { name: "Other", value: 5, color: "#6b7280" },
      ];

      setData({ volumeData, assetBreakdown });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch analytics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}