import { type Node } from "@xyflow/react";
import { type PaletteItem } from "@/components/builder/paletteData";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const AI_REQUEST_TIMEOUT = 60000;

export interface AICodeRequest {
  description: string;
  contractType?: "token" | "marketplace" | "auction" | "custom";
  vibeMode?: boolean;
}

export interface AICodeResponse {
  success: boolean;
  code: string;
  contractType?: string;
  components?: AIComponent[];
  aiPowered?: boolean;
  error?: string;
}

export interface AIComponent {
  type: string;
  name: string;
  confidence: number;
}

export interface AIOptimizeRequest {
  code: string;
  optimizationType?: "gas" | "security" | "readability" | "all";
}

export interface AIOptimizeResponse {
  success: boolean;
  code: string;
  optimizationType?: string;
  improvements?: string[];
  aiPowered?: boolean;
  error?: string;
}

export interface AIAnalysisResponse {
  success: boolean;
  issues?: string[];
  suggestions?: string[];
  securityScore?: number;
  gasEstimate?: string;
  lineCount?: number;
  aiPowered?: boolean;
  error?: string;
}

export interface AIChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AIChatResponse {
  success: boolean;
  content: string;
  suggestions?: string[];
  components?: AIComponent[];
  aiPowered?: boolean;
  error?: string;
}

export interface VibeSuggestion {
  success: boolean;
  suggestion: string;
}

export interface AICapabilities {
  codeGeneration: boolean;
  codeOptimization: boolean;
  codeAnalysis: boolean;
  aiChat: boolean;
  vibeThemes: boolean;
  components: string[];
}

function createTimeoutController(timeoutMs: number = AI_REQUEST_TIMEOUT) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  return { controller, timeoutId };
}

export async function generateCode(request: AICodeRequest): Promise<AICodeResponse> {
  const { controller, timeoutId } = createTimeoutController();
  
  try {
    const response = await fetch(`${API_URL}/api/ai/generate-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        description: request.description,
        contractType: request.contractType || "custom",
        vibeMode: request.vibeMode ?? true,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    console.error("AI generate code error:", error);
    
    if (error instanceof DOMException && error.name === "AbortError") {
      return {
        success: false,
        code: generateFallbackCode(request.description, request.vibeMode),
        error: "Request timed out - AI service is taking too long",
      };
    }
    
    return {
      success: false,
      code: generateFallbackCode(request.description, request.vibeMode),
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function optimizeCode(request: AIOptimizeRequest): Promise<AIOptimizeResponse> {
  const { controller, timeoutId } = createTimeoutController();
  
  try {
    const response = await fetch(`${API_URL}/api/ai/optimize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: request.code,
        optimizationType: request.optimizationType || "all",
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    console.error("AI optimize error:", error);
    
    if (error instanceof DOMException && error.name === "AbortError") {
      return {
        success: false,
        code: request.code,
        error: "Request timed out - AI service is taking too long",
      };
    }
    
    return {
      success: false,
      code: request.code,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function analyzeCode(code: string): Promise<AIAnalysisResponse> {
  const { controller, timeoutId } = createTimeoutController();
  
  try {
    const response = await fetch(`${API_URL}/api/ai/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    console.error("AI analyze error:", error);
    
    if (error instanceof DOMException && error.name === "AbortError") {
      return {
        success: false,
        issues: ["Analysis timed out"],
        suggestions: [],
        securityScore: 0,
        error: "Request timed out",
      };
    }
    
    return {
      success: false,
      issues: ["Analysis failed"],
      suggestions: [],
      securityScore: 0,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function chat(messages: AIChatMessage[], vibeMode: boolean = false): Promise<AIChatResponse> {
  const { controller, timeoutId } = createTimeoutController();
  
  try {
    const response = await fetch(`${API_URL}/api/ai/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, vibeMode }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    console.error("AI chat error:", error);
    
    return {
      success: false,
      content: "I'm having trouble responding right now. Try asking about generating contracts, optimizing code, or adding marketplace components!",
      suggestions: [
        "Generate a real estate token contract",
        "Add auction functionality",
        "Show me marketplace components",
      ],
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getVibeSuggestion(theme: string): Promise<VibeSuggestion> {
  const { controller, timeoutId } = createTimeoutController();
  
  try {
    const response = await fetch(`${API_URL}/api/ai/vibe-suggestion/${encodeURIComponent(theme)}`, {
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    console.error("Vibe suggestion error:", error);
    
    if (error instanceof DOMException && error.name === "AbortError") {
      return {
        success: false,
        suggestion: getDefaultVibeSuggestion(theme),
      };
    }
    
    return {
      success: false,
      suggestion: getDefaultVibeSuggestion(theme),
    };
  }
}

export async function getCapabilities(): Promise<{ success: boolean; capabilities?: AICapabilities; aiPowered?: boolean }> {
  try {
    const response = await fetch(`${API_URL}/api/ai/capabilities`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("AI capabilities error:", error);
    return {
      success: false,
      capabilities: {
        codeGeneration: true,
        codeOptimization: true,
        codeAnalysis: false,
        aiChat: false,
        vibeThemes: true,
        components: []
      }
    };
  }
}

export const VIBE_THEMES = {
  luxury: {
    name: "Luxury Estate",
    colors: ["#D4AF37", "#8B7355", "#F5F5DC", "#1C1C1C"],
    description: "Premium gold accents with elegant serif typography",
  },
  modern: {
    name: "Modern Tech",
    colors: ["#00D4FF", "#7C3AED", "#10B981", "#0F172A"],
    description: "Clean lines, bold colors, futuristic feel",
  },
  playful: {
    name: "Playful Vibes",
    colors: ["#FF6B6B", "#FFE66D", "#4ECDC4", "#FF8E53"],
    description: "Fun colors, bouncy animations, friendly energy",
  },
  nature: {
    name: "Organic Nature",
    colors: ["#2D5016", "#8B4513", "#DEB887", "#F5F5DC"],
    description: "Earth tones, natural textures, calming ambiance",
  },
  dark: {
    name: "Dark Mode",
    colors: ["#6366F1", "#EC4899", "#10B981", "#1F2937"],
    description: "Deep backgrounds, neon accents, tech aesthetic",
  },
} as const;

function getDefaultVibeSuggestion(theme: string): string {
  const normalized = theme.toLowerCase();
  if (normalized.includes("luxury") || normalized.includes("premium")) {
    return VIBE_THEMES.luxury.description;
  }
  if (normalized.includes("modern") || normalized.includes("tech")) {
    return VIBE_THEMES.modern.description;
  }
  if (normalized.includes("playful") || normalized.includes("fun")) {
    return VIBE_THEMES.playful.description;
  }
  if (normalized.includes("nature") || normalized.includes("organic")) {
    return VIBE_THEMES.nature.description;
  }
  if (normalized.includes("dark")) {
    return VIBE_THEMES.dark.description;
  }
  return VIBE_THEMES.modern.description;
}

function generateFallbackCode(description: string, vibeMode?: boolean): string {
  const vibe = vibeMode ? `
  // 🚀 Vibing with code! This is straight fire!
  // Let's build something amazing together!
  // 🔥 Powered by RealFlow Studio AI` : `
  // Generated by RealFlow Studio AI`;

  return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";${vibe}

/**
 * ${description}
 * Generated by RealFlow Studio AI
 */
contract GeneratedContract is ERC1155, Ownable {
    uint256 private _tokenIdCounter;
    
    constructor() ERC1155("") Ownable(msg.sender) {
        _tokenIdCounter = 0;
    }
    
    function mintRWA(
        address to,
        uint256 amount,
        string memory uri
    ) public onlyOwner returns (uint256) {
        uint256 id = _tokenIdCounter++;
        _mint(to, id, amount, bytes(uri));
        return id;
    }
    
    function mintBatch(
        address to,
        uint256[] memory amounts,
        string[] memory uris
    ) public onlyOwner {
        require(amounts.length == uris.length, "Length mismatch");
        uint256 startId = _tokenIdCounter;
        for (uint256 i = 0; i < amounts.length; i++) {
            _mint(to, startId + i, amounts[i], bytes(uris[i]));
        }
        _tokenIdCounter = startId + amounts.length;
    }
    
    function setURI(uint256 id, string memory newuri) public onlyOwner {
        _setURI(id, newuri);
    }
}
`;
}
