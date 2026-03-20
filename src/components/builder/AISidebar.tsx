import { useState } from "react";
import { Sparkles, Send, Copy, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const suggestions = [
  "Add 5% royalty on resales",
  "Suggest optimal pricing model",
  "Add fractional ownership (ERC-1155)",
  "Generate auction logic",
  "Integrate Chainlink price feed",
];

interface Message {
  role: "user" | "ai";
  content: string;
  code?: string;
}

const AISidebar = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content: "Hey! I'm your AI co-builder 🤖 I can generate smart contract code, suggest optimizations, and help you design your marketplace. Try asking me anything!",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Simulated AI response
    await new Promise((r) => setTimeout(r, 1500));

    const responses: Record<string, Message> = {
      royalty: {
        role: "ai",
        content: "Here's a royalty implementation using ERC-2981! 🔥 This adds 5% royalties on every resale:",
        code: `// 🎵 Vibing with yields! Every resale = more coffee ☕
function royaltyInfo(
    uint256 tokenId,
    uint256 salePrice
) external view returns (
    address receiver,
    uint256 royaltyAmount
) {
    // 5% royalty — straight fire! 🔥
    return (owner(), salePrice * 500 / 10000);
}`,
      },
      pricing: {
        role: "ai",
        content: "Based on market analysis, I suggest a dynamic pricing model with floor price + demand multiplier:",
        code: `// 📊 Smart pricing goes brrr
function calculatePrice(
    uint256 basePrice,
    uint256 demandScore
) public pure returns (uint256) {
    // Floor + 0.5% per demand unit
    return basePrice + (basePrice * demandScore / 200);
}`,
      },
      default: {
        role: "ai",
        content: "Great idea! Here's a contract snippet to get you started:",
        code: `// ✨ AI-generated with love
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RWAToken is ERC1155, Ownable {
    constructor() ERC1155("") Ownable(msg.sender) {}

    function mint(
        address to, uint256 id,
        uint256 amount, string memory uri
    ) public onlyOwner {
        _mint(to, id, amount, "");
        // 🌟 Fresh tokens, who dis?
    }
}`,
      },
    };

    const lowerText = text.toLowerCase();
    const key = lowerText.includes("royalt") ? "royalty" : lowerText.includes("pric") ? "pricing" : "default";
    setMessages((prev) => [...prev, responses[key]]);
    setLoading(false);
  };

  const copyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="font-semibold text-sm">AI Co-Builder</span>
        <span className="ml-auto text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">Creative Mode</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`${m.role === "user" ? "ml-8" : "mr-4"}`}>
            <div className={`rounded-xl p-3 text-sm ${
              m.role === "user" ? "bg-primary/10 text-foreground" : "glass"
            }`}>
              {m.content}
            </div>
            {m.code && (
              <div className="mt-2 relative group">
                <pre className="bg-background rounded-lg p-3 text-xs font-mono overflow-x-auto border border-border">
                  <code>{m.code}</code>
                </pre>
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2 h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => copyCode(m.code!, i)}
                >
                  {copied === i ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
                </Button>
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating code...
          </div>
        )}
      </div>

      {/* Quick suggestions */}
      <div className="px-4 pb-2">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => handleSend(s)}
              className="shrink-0 text-xs px-3 py-1.5 rounded-full glass hover:border-primary/40 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 pt-0">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
            placeholder="Ask AI to generate code..."
            className="flex-1 bg-secondary rounded-lg px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <Button size="sm" className="h-9 w-9 p-0" onClick={() => handleSend(input)}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AISidebar;
