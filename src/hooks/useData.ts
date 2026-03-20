import { useState, useEffect, useCallback } from "react";

// Types
export interface Marketplace {
  id: string;
  name: string;
  status: "active" | "pending" | "paused";
  txs: number;
  value: string;
  date: string;
  description?: string;
  creator?: string;
  network?: string;
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

// Simulated API delay
const simulateDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock data generators
const generateMarketplaces = (): Marketplace[] => [
  { id: "1", name: "Real Estate Fund #1", status: "active", txs: 234, value: "$45,200", date: "2h ago", description: "Tokenized real estate fund", creator: "0x1234...5678", network: "Polygon Amoy" },
  { id: "2", name: "Art Collection", status: "active", txs: 89, value: "$12,500", date: "5h ago", description: "Digital art marketplace", creator: "0x2345...6789", network: "Polygon Amoy" },
  { id: "3", name: "Commodity Tokens", status: "pending", txs: 0, value: "$0", date: "1d ago", description: "Gold & silver backed tokens", creator: "0x3456...7890", network: "Polygon Amoy" },
  { id: "4", name: "Music Rights NFTs", status: "active", txs: 156, value: "$28,300", date: "2d ago", description: "Music royalty fractions", creator: "0x4567...8901", network: "Polygon Amoy" },
];

const generateTemplates = (): Template[] => [
  { id: "1", name: "NFT Marketplace", desc: "Basic trading", components: 5, category: "Standard" },
  { id: "2", name: "Creator Portfolio", desc: "Showcase works", components: 4, category: "Gallery" },
  { id: "3", name: "Digital Gallery", desc: "Browse collections", components: 4, category: "Gallery" },
  { id: "4", name: "Full Platform", desc: "All features", components: 6, category: "Enterprise" },
  { id: "5", name: "Auction House", desc: "Timed auctions", components: 5, category: "Trading" },
  { id: "6", name: "Fractional Ownership", desc: "Shared assets", components: 5, category: "Finance" },
];

const generateStats = (): Stat[] => [
  { label: "Total Value Locked", value: "$124,500", change: "+12.5%", icon: "TrendingUp", positive: true },
  { label: "Transactions", value: "1,284", change: "+8.2%", icon: "TrendingUp", positive: true },
  { label: "NFTs Minted", value: "892", change: "+15.3%", icon: "TrendingUp", positive: true },
  { label: "Platform Fee", value: "0.5%", change: null, icon: "Wallet", positive: true },
];

const generateTransactions = (): Transaction[] => [
  { hash: "0x8f2e9...4a7b1", type: "deploy", amount: "0.023 MATIC", timestamp: "2 mins ago", status: "success", description: "MarketplaceFactory deployed" },
  { hash: "0x3c4d5...9e2f0", type: "mint", amount: "100 ERC-1155", timestamp: "15 mins ago", status: "success", description: "Tokenized Lagos Property" },
  { hash: "0x7b8c9...1d3e4", type: "transfer", amount: "0.005 MATIC", timestamp: "1 hour ago", status: "success", description: "Storage deposit" },
  { hash: "0x2a3b4...5c6d7", type: "swap", amount: "50 ERC-1155", timestamp: "3 hours ago", status: "success", description: "Fraction purchased" },
  { hash: "0x1x2y3...8z9w0", type: "deploy", amount: "0.021 MATIC", timestamp: "1 day ago", status: "success", description: "RWATokenizer deployed" },
];

const generateVolumeData = (): VolumeData[] => {
  const data: VolumeData[] = [];
  const baseValue = 50000;
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString("en-US", { weekday: "short" }),
      value: baseValue + Math.floor(Math.random() * 20000) - 10000,
    });
  }
  return data;
};

const generateAssetBreakdown = (): AssetBreakdown[] => [
  { name: "Real Estate", value: 45, color: "#5e6ad2" },
  { name: "Art", value: 25, color: "#10b981" },
  { name: "Commodities", value: 15, color: "#f59e0b" },
  { name: "Music Rights", value: 10, color: "#ef4444" },
  { name: "Other", value: 5, color: "#6b7280" },
];

// Data hooks
export function useMarketplaces(): UseDataResult<Marketplace[]> {
  const [data, setData] = useState<Marketplace[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await simulateDelay(300);
      // In production, replace with API call
      // const response = await fetch('/api/marketplaces');
      // const data = await response.json();
      setData(generateMarketplaces());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch marketplaces");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export function useTemplates(): UseDataResult<Template[]> {
  const [data, setData] = useState<Template[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await simulateDelay(200);
      setData(generateTemplates());
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
      await simulateDelay(400);
      setData(generateStats());
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
      await simulateDelay(350);
      setData(generateTransactions());
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
      await simulateDelay(400);
      setData({
        volumeData: generateVolumeData(),
        assetBreakdown: generateAssetBreakdown(),
      });
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