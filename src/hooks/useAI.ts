import { useState, useCallback } from "react";
import { generateCode, optimizeCode, getVibeSuggestion, VIBE_THEMES } from "@/services/ai";

export interface AIMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  code?: string;
  vibeMode?: boolean;
  timestamp: Date;
}

export interface UseAIOptions {
  vibeMode?: boolean;
  onCodeGenerated?: (code: string) => void;
}

export function useAI(options: UseAIOptions = {}) {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: "welcome",
      role: "ai",
      content: "Hey! I'm your AI co-builder 🤖 I can generate smart contract code, suggest optimizations, and help you design your marketplace. Try asking me anything!",
      timestamp: new Date(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [vibeMode, setVibeMode] = useState(options.vibeMode ?? true);
  const [currentTheme, setCurrentTheme] = useState<keyof typeof VIBE_THEMES>("modern");

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await generateCode({
        description: text,
        contractType: "custom",
        vibeMode,
      });

      const aiMessage: AIMessage = {
        id: `ai-${Date.now()}`,
        role: "ai",
        content: vibeMode
          ? "Here's some fresh code with maximum vibes! 🔥✨"
          : "Here's the generated smart contract code:",
        code: response.code,
        vibeMode,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      options.onCodeGenerated?.(response.code);
    } catch (error) {
      const errorMessage: AIMessage = {
        id: `error-${Date.now()}`,
        role: "ai",
        content: "Oops! Something went wrong. Let me try again with a simpler approach.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  }, [vibeMode, options]);

  const optimize = useCallback(async (code: string, type: "gas" | "security" | "readability" | "all" = "all") => {
    setLoading(true);
    try {
      const response = await optimizeCode({ code, optimizationType: type });
      return response.code;
    } finally {
      setLoading(false);
    }
  }, []);

  const getThemeSuggestion = useCallback(async (theme: string) => {
    try {
      const response = await getVibeSuggestion(theme);
      if (response.success) {
        const matchedTheme = Object.keys(VIBE_THEMES).find(
          key => theme.toLowerCase().includes(key) || key.includes(theme.toLowerCase())
        ) as keyof typeof VIBE_THEMES | undefined;
        
        if (matchedTheme) {
          setCurrentTheme(matchedTheme);
        }
      }
      return response.suggestion;
    } catch {
      return VIBE_THEMES.modern.description;
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([{
      id: "welcome",
      role: "ai",
      content: "Hey! I'm your AI co-builder 🤖 What would you like to create today?",
      timestamp: new Date(),
    }]);
  }, []);

  return {
    messages,
    loading,
    vibeMode,
    setVibeMode,
    currentTheme,
    sendMessage,
    optimize,
    getThemeSuggestion,
    clearMessages,
  };
}
