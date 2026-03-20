import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAuth } from "@/hooks/useAuth";

vi.mock("@privy-io/react-auth", () => ({
  usePrivy: () => ({
    login: vi.fn(),
    logout: vi.fn(),
    authenticated: false,
    user: null,
    ready: true,
  }),
}));

vi.mock("wagmi", () => ({
  useAccount: () => ({
    address: undefined,
    isConnected: false,
    connector: null,
  }),
  useConnect: () => ({
    connect: vi.fn(),
    connectors: [],
    error: null,
  }),
  useDisconnect: () => ({
    disconnect: vi.fn(),
  }),
  useEnsName: () => ({
    data: null,
  }),
  useEnsAvatar: () => ({
    data: null,
  }),
}));

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with correct default state", async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(result.current.isInitialized).toBe(true);

    expect(result.current.user).toEqual({
      address: null,
      ensName: null,
      ensAvatar: null,
      isAuthenticated: false,
      isWalletConnected: false,
      walletType: null,
    });
  });

  it("should have correct initial auth state", async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(result.current.authenticated).toBe(false);
    expect(result.current.user.isWalletConnected).toBe(false);
  });

  it("should provide login functions", async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(result.current.loginWithEmail).toBeDefined();
    expect(typeof result.current.loginWithEmail).toBe("function");
    expect(result.current.connectWallet).toBeDefined();
    expect(typeof result.current.connectWallet).toBe("function");
  });

  it("should provide disconnect functions", async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(result.current.disconnectWallet).toBeDefined();
    expect(typeof result.current.disconnectWallet).toBe("function");
  });

  it("should return getProfile function", async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(result.current.getProfile).toBeDefined();
    expect(typeof result.current.getProfile).toBe("function");
  });
});
