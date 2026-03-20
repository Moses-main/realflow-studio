import { useState, useCallback, useRef } from "react";
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
import { Blocks, ArrowLeft, Rocket, Sparkles, PanelRightOpen, PanelRightClose, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ComponentPalette, { type PaletteItem } from "@/components/builder/ComponentPalette";
import AISidebar from "@/components/builder/AISidebar";
import CustomNode from "@/components/builder/CustomNode";

const nodeTypes = { custom: CustomNode };

const initialNodes: Node[] = [
  {
    id: "1",
    type: "custom",
    position: { x: 250, y: 50 },
    data: { label: "Asset Upload", componentType: "assetUpload" },
  },
  {
    id: "2",
    type: "custom",
    position: { x: 100, y: 200 },
    data: { label: "Token Mint", componentType: "mintButton" },
  },
  {
    id: "3",
    type: "custom",
    position: { x: 400, y: 200 },
    data: { label: "Listing Grid", componentType: "listingGrid" },
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true, style: { stroke: "hsl(175, 80%, 50%)" } },
  { id: "e1-3", source: "1", target: "3", animated: true, style: { stroke: "hsl(175, 80%, 50%)" } },
];

const Builder = () => {
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [aiOpen, setAiOpen] = useState(true);
  const [deploying, setDeploying] = useState(false);
  const [deployed, setDeployed] = useState(false);
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
        data: { label: draggedItem.current.label, componentType: draggedItem.current.type },
      };
      setNodes((nds) => [...nds, newNode]);
      draggedItem.current = null;
    },
    [setNodes]
  );

  const handleDeploy = async () => {
    setDeploying(true);
    await new Promise((r) => setTimeout(r, 3000));
    setDeploying(false);
    setDeployed(true);
  };

  return (
    <ReactFlowProvider>
      <div className="h-screen flex bg-background">
        {/* Left Sidebar - Component Palette */}
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
            <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Components</div>
            <ComponentPalette onDragStart={(item) => { draggedItem.current = item; }} />
          </div>
          <div className="p-4 border-t border-border">
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
                  Deployed to Mumbai!
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

        {/* Canvas */}
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

          {/* Floating deploy success */}
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
                  <div className="text-xs text-muted-foreground font-mono">0x7a3b...f9e2 on Polygon Mumbai</div>
                </div>
                <Button size="sm" variant="outline">View on PolygonScan</Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Toggle */}
          <button
            onClick={() => setAiOpen(!aiOpen)}
            className="absolute top-4 right-4 z-10 p-2 glass rounded-lg hover:border-primary/40 transition-colors"
          >
            {aiOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
          </button>
        </div>

        {/* AI Sidebar */}
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
