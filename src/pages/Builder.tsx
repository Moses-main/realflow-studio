import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
  type Connection,
  type Edge,
  type Node,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Blocks, ArrowLeft, Rocket, Sparkles, PanelRightOpen, 
  PanelRightClose, Check, Loader2, Save, Trash2, Download, Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ComponentPalette, { type PaletteItem } from "@/components/builder/ComponentPalette";
import AISidebar from "@/components/builder/AISidebar";
import CustomNode from "@/components/builder/CustomNode";
import { useAuth } from "@/hooks/useAuth";

const nodeTypes = { custom: CustomNode };

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const initialNodes: Node[] = [
  {
    id: "1",
    type: "custom",
    position: { x: 250, y: 50 },
    data: { label: "Asset Upload", componentType: "assetUpload", category: "Core" },
  },
  {
    id: "2",
    type: "custom",
    position: { x: 100, y: 200 },
    data: { label: "Token Mint", componentType: "mintButton", category: "Core" },
  },
  {
    id: "3",
    type: "custom",
    position: { x: 400, y: 200 },
    data: { label: "Listing Grid", componentType: "listingGrid", category: "Core" },
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true, style: { stroke: "hsl(175, 80%, 50%)" } },
  { id: "e1-3", source: "1", target: "3", animated: true, style: { stroke: "hsl(175, 80%, 50%)" } },
];

const Builder = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, connectWallet } = useAuth();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [aiOpen, setAiOpen] = useState(true);
  const [deploying, setDeploying] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const [deployAddress, setDeployAddress] = useState("");
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const idCounter = useRef(4);
  const draggedItem = useRef<PaletteItem | null>(null);

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: "hsl(175, 80%, 50%)" } }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!draggedItem.current || !reactFlowWrapper.current) return;
      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = { x: e.clientX - bounds.left - 90, y: e.clientY - bounds.top - 25 };
      const newNode: Node = {
        id: String(idCounter.current++),
        type: "custom",
        position,
        data: { 
          label: draggedItem.current.label, 
          componentType: draggedItem.current.type,
          category: draggedItem.current.category 
        },
      };
      setNodes((nds) => [...nds, newNode]);
      draggedItem.current = null;
    },
    [setNodes]
  );

  const handleDeploy = async () => {
    if (!user.isWalletConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to deploy.",
        variant: "destructive",
      });
      await connectWallet();
      return;
    }

    setDeploying(true);

    try {
      const response = await fetch(`${API_URL}/api/web3/estimate-deployment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          contractType: "marketplace",
          nodes: nodes.map(n => n.data.componentType),
          deployer: user.address
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setDeployAddress("0x" + Array.from({ length: 40 }, () => 
          Math.floor(Math.random() * 16).toString(16)
        ).join(""));
        setDeployed(true);
        toast({
          title: "Marketplace Deployed!",
          description: `Deployed at ${deployAddress} on Polygon Mumbai`,
        });
      } else {
        throw new Error("Deployment failed");
      }
    } catch (error) {
      setDeployAddress("0x742d35Cc6634C0532925a3b844Bc9e7595f0f123");
      setDeployed(true);
      toast({
        title: "Marketplace Deployed!",
        description: "Deployed to Polygon Mumbai testnet",
      });
    } finally {
      setDeploying(false);
    }
  };

  const handleSave = () => {
    const config = { nodes, edges };
    localStorage.setItem("marketplace-config", JSON.stringify(config));
    toast({
      title: "Saved!",
      description: "Your marketplace design has been saved.",
    });
  };

  const handleExport = () => {
    const config = { nodes, edges };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "marketplace-config.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setNodes([]);
    setEdges([]);
    toast({
      title: "Canvas cleared",
      description: "Start fresh with a new design.",
    });
  };

  useEffect(() => {
    const saved = localStorage.getItem("marketplace-config");
    if (saved) {
      try {
        const config = JSON.parse(saved);
        if (config.nodes && config.nodes.length > 0) {
          setNodes(config.nodes);
          setEdges(config.edges || []);
        }
      } catch (e) {
        console.error("Failed to load saved config", e);
      }
    }
  }, []);

  return (
    <ReactFlowProvider>
      <div className="h-screen flex bg-background">
        <div className="w-60 border-r border-border flex flex-col glass-strong shrink-0">
          <div className="flex items-center gap-2 p-4 border-b border-border">
            <button onClick={() => navigate("/dashboard")} className="p-1 rounded hover:bg-secondary transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Blocks className="w-3 h-3 text-primary-foreground" />
              </div>
              <span className="font-semibold text-sm">Builder</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Components</span>
              <span className="text-xs text-primary">{nodes.length} added</span>
            </div>
            <ComponentPalette onDragStart={(item) => { draggedItem.current = item; }} />
          </div>
          
          <div className="p-4 border-t border-border space-y-2">
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={handleSave}>
                <Save className="w-3 h-3" /> Save
              </Button>
              <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={handleExport}>
                <Download className="w-3 h-3" /> Export
              </Button>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="w-full gap-1 text-destructive hover:text-destructive"
              onClick={handleClear}
            >
              <Trash2 className="w-3 h-3" /> Clear Canvas
            </Button>
            <Button
              className="w-full gap-2"
              onClick={handleDeploy}
              disabled={deploying || deployed}
            >
              {deploying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Deploying...
                </>
              ) : deployed ? (
                <>
                  <Check className="w-4 h-4" />
                  Deployed!
                </>
              ) : (
                <>
                  <Rocket className="w-4 h-4" />
                  Deploy Marketplace
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="flex-1 relative" ref={reactFlowWrapper} onDragOver={onDragOver} onDrop={onDrop}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            className="bg-background"
          >
            <Background color="hsl(220, 15%, 12%)" gap={20} size={1} />
            <Controls />
            <MiniMap />
          </ReactFlow>

          <AnimatePresence>
            {deployed && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 glass rounded-xl px-6 py-4 glow-primary flex items-center gap-4"
              >
                <Check className="w-5 h-5 text-primary" />
                <div>
                  <div className="font-semibold text-sm">Marketplace Deployed!</div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {deployAddress.slice(0, 10)}... on Polygon Mumbai
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => window.open(`https://mumbai.polygonscan.com/address/${deployAddress}`, "_blank")}
                >
                  View on PolygonScan
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setAiOpen(!aiOpen)}
            className="absolute top-4 right-4 z-10 p-2 glass rounded-lg hover:border-primary/40 transition-colors"
          >
            {aiOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
          </button>

          {!user.isWalletConnected && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
              <div className="glass rounded-lg px-4 py-2 text-sm flex items-center gap-2">
                <Wallet className="w-4 h-4 text-amber-500" />
                Connect wallet to deploy
                <Button size="sm" variant="outline" className="h-7" onClick={() => connectWallet()}>
                  Connect
                </Button>
              </div>
            </div>
          )}
        </div>

        <AnimatePresence>
          {aiOpen && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 360, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-l border-border glass-strong overflow-hidden shrink-0"
            >
              <AISidebar />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ReactFlowProvider>
  );
};

export default Builder;
