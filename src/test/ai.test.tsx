import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAI } from "@/hooks/useAI";

vi.mock("@/services/ai", () => ({
  generateCode: vi.fn().mockResolvedValue({
    success: true,
    code: "// Mock generated code",
  }),
  optimizeCode: vi.fn().mockResolvedValue({
    success: true,
    code: "// Optimized code",
  }),
  getVibeSuggestion: vi.fn().mockResolvedValue({
    success: true,
    suggestion: "Modern vibe suggestion",
  }),
  VIBE_THEMES: {
    luxury: { name: "Luxury", colors: ["#gold"], description: "Premium" },
    modern: { name: "Modern", colors: ["#blue"], description: "Clean" },
    playful: { name: "Playful", colors: ["#pink"], description: "Fun" },
    nature: { name: "Nature", colors: ["#green"], description: "Organic" },
    dark: { name: "Dark", colors: ["#black"], description: "Night" },
  },
}));

describe("useAI Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with welcome message", async () => {
    const { result } = renderHook(() => useAI());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(result.current.messages.length).toBe(1);
    expect(result.current.messages[0].role).toBe("ai");
  });

  it("should toggle vibe mode", async () => {
    const { result } = renderHook(() => useAI());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    expect(result.current.vibeMode).toBe(true);

    await act(async () => {
      result.current.setVibeMode(false);
    });

    expect(result.current.vibeMode).toBe(false);
  });

  it("should send message and add to messages", async () => {
    const { result } = renderHook(() => useAI());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    await act(async () => {
      await result.current.sendMessage("Generate a token contract");
    });

    expect(result.current.messages.length).toBe(3);
    expect(result.current.messages[1].role).toBe("user");
    expect(result.current.messages[1].content).toBe("Generate a token contract");
  });

  it("should clear messages", async () => {
    const { result } = renderHook(() => useAI());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    await act(async () => {
      await result.current.sendMessage("Test message");
    });

    expect(result.current.messages.length).toBe(3);

    await act(async () => {
      result.current.clearMessages();
    });

    expect(result.current.messages.length).toBe(1);
  });
});
