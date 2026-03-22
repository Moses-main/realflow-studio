import { useState, useCallback, useRef } from "react";
import { type Node } from "@xyflow/react";
import { 
  generateCode, 
  optimizeCode, 
  analyzeCode, 
  chat, 
  type AICodeResponse,
  type AIOptimizeResponse,
  type AIAnalysisResponse,
  type AIChatResponse,
  type AIComponent 
} from "@/services/ai";
import { paletteItems } from "@/components/builder/paletteData";

export interface AIMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  code?: string;
  components?: AIComponent[];
  analysis?: {
    issues: string[];
    suggestions: string[];
    securityScore: number;
  };
  vibeMode?: boolean;
  timestamp: Date;
}

export interface UseAIOptions {
  vibeMode?: boolean;
  onCodeGenerated?: (code: string, components?: AIComponent[]) => void;
  onComponentsDetected?: (components: AIComponent[]) => void;
}

export function useAI(options: UseAIOptions = {}) {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: "welcome",
      role: "ai",
      content: "Hey! I'm your AI co-builder 🤖 I can generate smart contract code, suggest optimizations, help analyze security, and even recommend components for your canvas. What would you like to build today?",
      timestamp: new Date(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [vibeMode, setVibeMode] = useState(options.vibeMode ?? true);
  const [detectedComponents, setDetectedComponents] = useState<AIComponent[]>([]);
  const conversationHistoryRef = useRef<{ role: "user" | "assistant"; content: string }[]>([]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    conversationHistoryRef.current.push({ role: "user", content: text });
    setLoading(true);

    try {
      if (text.toLowerCase().includes("generate") || 
          text.toLowerCase().includes("create") || 
          text.toLowerCase().includes("build") ||
          text.toLowerCase().includes("contract") ||
          text.toLowerCase().includes("token") ||
          text.toLowerCase().includes("marketplace")) {
        
        const response = await generateCode({
          description: text,
          contractType: "custom",
          vibeMode,
        });

        setDetectedComponents(response.components || []);
        options.onComponentsDetected?.(response.components || []);

        const aiMessage: AIMessage = {
          id: `ai-${Date.now()}`,
          role: "ai",
          content: vibeMode
            ? "Here's some fresh code with maximum vibes! 🔥✨ Check out the suggested components below!"
            : "Here's the generated smart contract code:",
          code: response.code,
          components: response.components,
          vibeMode,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);
        conversationHistoryRef.current.push({ role: "assistant", content: "Generated contract code" });
        options.onCodeGenerated?.(response.code, response.components);
      } else if (text.toLowerCase().includes("optimize") || 
                 text.toLowerCase().includes("gas") ||
                 text.toLowerCase().includes("reduce cost")) {
        
        const lastCodeMessage = [...messages].reverse().find(m => m.code);
        
        if (lastCodeMessage?.code) {
          const response = await optimizeCode({
            code: lastCodeMessage.code,
            optimizationType: text.toLowerCase().includes("security") ? "security" : 
                            text.toLowerCase().includes("readability") ? "readability" : "all",
          });

          const aiMessage: AIMessage = {
            id: `ai-${Date.now()}`,
            role: "ai",
            content: response.aiPowered
              ? (vibeMode ? "Yo, optimized that code! 🚀💨 Less gas, same vibes!" : "Code optimized successfully!")
              : (vibeMode ? "Applied some basic optimizations! 🔧" : "Applied optimization suggestions"),
            code: response.code,
            vibeMode,
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, aiMessage]);
          options.onCodeGenerated?.(response.code);
        } else {
          const aiMessage: AIMessage = {
            id: `ai-${Date.now()}`,
            role: "ai",
            content: vibeMode
              ? "I need some code to optimize first! 🤔 Drop me a contract and I'll make it lean and mean! 💪"
              : "Please provide code first that you'd like me to optimize.",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, aiMessage]);
        }
      } else if (text.toLowerCase().includes("analyze") || 
                 text.toLowerCase().includes("security") ||
                 text.toLowerCase().includes("audit") ||
                 text.toLowerCase().includes("check")) {
        
        const lastCodeMessage = [...messages].reverse().find(m => m.code);
        
        if (lastCodeMessage?.code) {
          const response = await analyzeCode(lastCodeMessage.code);

          const aiMessage: AIMessage = {
            id: `ai-${Date.now()}`,
            role: "ai",
            content: vibeMode
              ? `Here's the tea on your contract ☕ Security score: ${response.securityScore || 0}/100!`
              : `Code analysis complete. Security score: ${response.securityScore || 0}/100`,
            analysis: {
              issues: response.issues || [],
              suggestions: response.suggestions || [],
              securityScore: response.securityScore || 0,
            },
            vibeMode,
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, aiMessage]);
        } else {
          const aiMessage: AIMessage = {
            id: `ai-${Date.now()}`,
            role: "ai",
            content: vibeMode
              ? "Send me some code first and I'll give it the security treatment! 🔒"
              : "Please provide code for me to analyze.",
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, aiMessage]);
        }
      } else if (text.toLowerCase().includes("component") || 
                 text.toLowerCase().includes("add") ||
                 text.toLowerCase().includes("canvas") ||
                 text.toLowerCase().includes("ui")) {
        
        const response = await chat(
          conversationHistoryRef.current,
          vibeMode
        );

        setDetectedComponents(response.components || []);
        options.onComponentsDetected?.(response.components || []);

        const aiMessage: AIMessage = {
          id: `ai-${Date.now()}`,
          role: "ai",
          content: response.content,
          components: response.components,
          vibeMode,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);
        conversationHistoryRef.current.push({ role: "assistant", content: response.content });
      } else {
        const response = await chat(
          conversationHistoryRef.current,
          vibeMode
        );

        setDetectedComponents(response.components || []);
        options.onComponentsDetected?.(response.components || []);

        const aiMessage: AIMessage = {
          id: `ai-${Date.now()}`,
          role: "ai",
          content: response.content,
          components: response.components,
          vibeMode,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);
        conversationHistoryRef.current.push({ role: "assistant", content: response.content });
      }
    } catch (error) {
      const errorMessage: AIMessage = {
        id: `error-${Date.now()}`,
        role: "ai",
        content: vibeMode
          ? "Whoops! Something glitched out! 😅 Let me try again with a simpler approach..."
          : "An error occurred. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  }, [messages, vibeMode, options]);

  const optimize = useCallback(async (code: string, type: "gas" | "security" | "readability" | "all" = "all") => {
    setLoading(true);
    try {
      const response = await optimizeCode({ code, optimizationType: type });
      return response.code;
    } finally {
      setLoading(false);
    }
  }, []);

  const analyze = useCallback(async (code: string) => {
    setLoading(true);
    try {
      const response = await analyzeCode(code);
      return response;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([{
      id: "welcome",
      role: "ai",
      content: vibeMode
        ? "Hey! I'm your AI co-builder 🤖 Ready to build something amazing?"
        : "Hello! I'm your AI co-builder. How can I help you today?",
      timestamp: new Date(),
    }]);
    conversationHistoryRef.current = [];
    setDetectedComponents([]);
  }, [vibeMode]);

  const addComponentToCanvas = useCallback((component: AIComponent): Node | null => {
    const paletteItem = paletteItems.find(item => item.type === component.type);
    if (!paletteItem) return null;

    const baseX = 100;
    const baseY = 100;
    const spacing = 250;

    return {
      id: `${paletteItem.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: "custom",
      position: { 
        x: baseX + Math.random() * 100, 
        y: baseY + Math.random() * 100 
      },
      data: {
        label: paletteItem.label,
        componentType: paletteItem.type,
        category: paletteItem.category,
      },
    };
  }, []);

  const addAllComponentsToCanvas = useCallback((): Node[] => {
    return detectedComponents
      .map((comp, index) => {
        const paletteItem = paletteItems.find(item => item.type === comp.type);
        if (!paletteItem) return null;

        return {
          id: `${paletteItem.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: "custom",
          position: { 
            x: 100 + (index % 3) * 250 + Math.random() * 50, 
            y: 100 + Math.floor(index / 3) * 200 + Math.random() * 50 
          },
          data: {
            label: paletteItem.label,
            componentType: paletteItem.type,
            category: paletteItem.category,
          },
        };
      })
      .filter((node): node is NonNullable<typeof node> => node !== null) as Node[];
  }, [detectedComponents]);

  return {
    messages,
    loading,
    vibeMode,
    setVibeMode,
    detectedComponents,
    sendMessage,
    optimize,
    analyze,
    clearMessages,
    addComponentToCanvas,
    addAllComponentsToCanvas,
  };
}
