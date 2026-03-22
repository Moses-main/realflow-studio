import { useState, useCallback } from "react";
import { type Node } from "@xyflow/react";
import { 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  Loader2,
  Plus,
  Wand2,
  Shield,
  Zap,
  Code2,
  MessageSquare,
  X,
  ChevronDown,
  Loader
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAIChat, type AIMessage, type AIComponent } from "@/hooks/useAIChat";
import { paletteItems } from "@/components/builder/paletteData";

interface AISidebarProps {
  onNodesChange?: (nodes: Node[]) => void;
  onCodeGenerated?: (code: string) => void;
}

const QUICK_ACTIONS = [
  { label: "Generate Contract", icon: Code2, prompt: "Generate a smart contract for" },
  { label: "Add Components", icon: Plus, prompt: "What components do I need for a" },
  { label: "Optimize Code", icon: Zap, prompt: "Optimize this code for gas" },
  { label: "Security Audit", icon: Shield, prompt: "Analyze this code for security" },
];

const SUGGESTIONS = [
  "Create a real estate marketplace",
  "Build an NFT auction platform",
  "Add fractional ownership",
  "Generate royalty contract",
];

const ComponentBadge = ({ 
  component, 
  onAdd 
}: { 
  component: AIComponent; 
  onAdd: () => void;
}) => {
  const paletteItem = paletteItems.find(item => item.type === component.type);
  if (!paletteItem) return null;

  const Icon = paletteItem.icon;

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
      <Icon className="w-4 h-4 text-primary" />
      <span className="text-sm flex-1">{paletteItem.label}</span>
      <button
        onClick={onAdd}
        className="p-1 rounded hover:bg-primary/10 transition-colors"
        title="Add to canvas"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
};

const AnalysisPanel = ({ analysis }: { analysis: AIMessage["analysis"] }) => {
  if (!analysis) return null;

  const scoreColor = analysis.securityScore >= 80 ? "text-green-500" :
                     analysis.securityScore >= 60 ? "text-yellow-500" : "text-red-500";

  return (
    <div className="mt-3 p-3 rounded-lg bg-secondary/30 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">Security Score</span>
        <span className={`text-lg font-bold ${scoreColor}`}>{analysis.securityScore}/100</span>
      </div>
      
      {analysis.issues.length > 0 && (
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Issues Found</span>
          {analysis.issues.slice(0, 3).map((issue, i) => (
            <p key={i} className="text-xs text-red-400 flex items-start gap-1">
              <span className="shrink-0">•</span>
              {issue}
            </p>
          ))}
        </div>
      )}
      
      {analysis.suggestions.length > 0 && (
        <div className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">Suggestions</span>
          {analysis.suggestions.slice(0, 3).map((suggestion, i) => (
            <p key={i} className="text-xs text-green-400 flex items-start gap-1">
              <span className="shrink-0">✓</span>
              {suggestion}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

const AISidebar = ({ onNodesChange, onCodeGenerated }: AISidebarProps) => {
  const [input, setInput] = useState("");
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [showComponents, setShowComponents] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [isAddingComponent, setIsAddingComponent] = useState(false);

  const {
    messages,
    loading,
    vibeMode,
    setVibeMode,
    detectedComponents,
    sendMessage,
    clearMessages,
    addAllComponentsToCanvas,
  } = useAIChat({
    vibeMode: true,
    onCodeGenerated,
  });

  const handleSend = useCallback(async (text: string) => {
    if (!text.trim()) return;
    setInput("");
    setShowComponents(false);
    await sendMessage(text);
  }, [sendMessage]);

  const handleQuickAction = useCallback((action: string) => {
    setInput(action);
  }, []);

  const handleAddComponent = useCallback((component: AIComponent) => {
    setIsAddingComponent(true);
    const nodes = addAllComponentsToCanvas().filter(n => n.data.componentType === component.type);
    if (nodes.length > 0) {
      onNodesChange?.(nodes);
    }
    setTimeout(() => setIsAddingComponent(false), 500);
  }, [addAllComponentsToCanvas, onNodesChange]);

  const handleAddAllComponents = useCallback(() => {
    if (detectedComponents.length === 0) return;
    
    setIsAddingComponent(true);
    const nodes = addAllComponentsToCanvas();
    onNodesChange?.(nodes);
    setShowComponents(false);
    
    setTimeout(() => setIsAddingComponent(false), 500);
  }, [detectedComponents, addAllComponentsToCanvas, onNodesChange]);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border shrink-0">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="font-semibold text-sm">AI Co-Builder</span>
        <button
          onClick={() => setVibeMode(!vibeMode)}
          className={`ml-auto text-xs px-2 py-0.5 rounded-full transition-colors ${
            vibeMode 
              ? "bg-primary/10 text-primary" 
              : "bg-secondary text-muted-foreground"
          }`}
        >
          {vibeMode ? "🔥 Creative" : "📝 Normal"}
        </button>
      </div>

      <div className="flex items-center gap-1 px-4 py-2 border-b border-border shrink-0 overflow-x-auto">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.label}
            onClick={() => handleQuickAction(action.prompt)}
            className="shrink-0 flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
          >
            <action.icon className="w-3 h-3" />
            {action.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.map((m, i) => (
          <div key={m.id} className={`${m.role === "user" ? "ml-8" : "mr-4"}`}>
            <div className={`rounded-xl p-3 text-sm ${
              m.role === "user" 
                ? "bg-primary/10 text-foreground" 
                : "glass"
            }`}>
              <div className="flex items-start gap-2">
                {m.role === "ai" && <MessageSquare className="w-4 h-4 mt-0.5 text-primary shrink-0" />}
                <div className="flex-1">{m.content}</div>
              </div>
            </div>

            {m.components && m.components.length > 0 && (
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Suggested Components ({m.components.length})
                  </span>
                  <button
                    onClick={handleAddAllComponents}
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add All
                  </button>
                </div>
                <div className="space-y-1">
                  {m.components.slice(0, 5).map((comp) => (
                    <ComponentBadge
                      key={comp.type}
                      component={comp}
                      onAdd={() => handleAddComponent(comp)}
                    />
                  ))}
                </div>
              </div>
            )}

            {m.analysis && <AnalysisPanel analysis={m.analysis} />}

            {m.code && (
              <div className="mt-2 relative group">
                <div className="flex items-center justify-between px-2 py-1 bg-muted/50 rounded-t-lg border border-b-0 border-border">
                  <span className="text-xs text-muted-foreground">Solidity Code</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onCodeGenerated?.(m.code!)}
                      className="p-1 rounded hover:bg-primary/10 transition-colors"
                      title="Use code"
                    >
                      <Wand2 className="w-3 h-3 text-primary" />
                    </button>
                    <button
                      onClick={() => copyCode(m.code!, m.id)}
                      className="p-1 rounded hover:bg-primary/10 transition-colors"
                      title="Copy code"
                    >
                      {copied === m.id ? (
                        <Check className="w-3 h-3 text-green-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
                <pre className="bg-background rounded-b-lg rounded-t-none p-3 text-xs font-mono overflow-x-auto border border-border max-h-48 overflow-y-auto">
                  <code>{m.code}</code>
                </pre>
              </div>
            )}
          </div>
        ))}
        
        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            {vibeMode ? "Vibing with code..." : "Generating..."}
          </div>
        )}
        
        {isAddingComponent && (
          <div className="flex items-center gap-2 text-sm text-primary">
            <Loader className="w-4 h-4 animate-spin" />
            Adding components to canvas...
          </div>
        )}
      </div>

      <div className="px-4 pb-2 shrink-0">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => handleSend(s)}
              disabled={loading}
              className="shrink-0 text-xs px-3 py-1.5 rounded-full glass hover:border-primary/40 transition-colors disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 pt-0 shrink-0 bg-background/80 backdrop-blur-sm">
        <div className="flex gap-2 items-center">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(input);
              }
            }}
            placeholder="Ask AI to generate code, add components..."
            rows={1}
            className="flex-1 bg-secondary rounded-lg px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px] max-h-32 resize-none"
          />
          <Button 
            size="sm" 
            className="h-11 w-11 p-0 shrink-0" 
            onClick={() => handleSend(input)} 
            disabled={loading || !input.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AISidebar;
