import React, { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ReactFlow,
  ReactFlowProvider,
  type Connection,
  type Edge,
  type Node,
  useNodesState,
  useEdgesState,
  useReactFlow,
  useViewport,
  Background,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
  ConnectionLineType,
  type NodeChange,
  type EdgeChange,
  type OnConnect,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { 
  Blocks, 
  ArrowLeft, 
  Sparkles, 
  Save, 
  Trash2, 
  Wallet, 
  Menu, 
  X, 
  Undo2, 
  Redo2, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  FlaskConical, 
  Copy, 
  Clipboard, 
  ChevronDown,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ComponentPalette, { type PaletteItem } from "@/components/builder/ComponentPalette";
import AISidebar from "@/components/builder/AISidebar";
import CustomNode from "@/components/builder/CustomNode";
import { TestPanel } from "@/components/builder/TestPanel";
import { AnimatedDottedEdge } from "@/components/builder/BezierEdge";
import { useUndoRedo } from "@/hooks/useUndoRedo";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useMobileOptimization, useResponsiveMinimap } from "@/hooks/useMobileOptimization";
import { useAuth } from "@/hooks/useAuth";
import { useWallets } from "@privy-io/react-auth";
import { createWalletClient, custom, http, createPublicClient } from "viem";

const polygonAmoy = {
  id: 80002,
  name: 'Polygon Amoy',
  nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc-amoy.polygon.technology/'] },
    public: { http: ['https://rpc-amoy.polygon.technology/'] },
  },
  blockExplorers: {
    default: { name: 'PolygonScan', url: 'https://amoy.polygonscan.com' },
  },
  testnet: true,
};

import { ConnectButton } from "@/components/auth/ConnectButton";

// Node types - maps component types to React Flow node components
const nodeTypes = { custom: CustomNode };

// Edge types - uses AnimatedDottedEdge for animated flow visualization
const edgeTypes = {
  animatedDotted: AnimatedDottedEdge,
  default: AnimatedDottedEdge,
};

/**
 * Inner Builder component - uses React Flow hooks
 * Must be wrapped with ReactFlowProvider
 */
function BuilderCanvas() {
  const navigate = useNavigate();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlow = useReactFlow();
  const { user, authenticated, hasWallet, loginWithWallet } = useAuth();
  const { wallets } = useWallets();
  
  // =====================
  // STATE MANAGEMENT
  // =====================
  
  // Canvas state - nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  
  // UI state
  const [isTestModeEnabled, setIsTestModeEnabled] = useState(false);
  const [isLeftToolbarOpen, setIsLeftToolbarOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>([]);
  
  // Clipboard for copy/paste
  const clipboardRef = useRef<{ nodes: Node[]; edges: Edge[] } | null>(null);

  // =====================
  // UNDO/REDO SYSTEM
  // =====================
  
  const { 
    pushToHistory, 
    undo, 
    redo, 
    canUndo, 
    canRedo, 
    clear: clearHistory 
  } = useUndoRedo(nodes, edges, setNodes, setEdges);

  // Push to history when nodes or edges change (debounced via hook)
  const prevNodesRef = useRef<Node[]>([]);
  const prevEdgesRef = useRef<Edge[]>([]);
  
  useEffect(() => {
    const nodesChanged = JSON.stringify(nodes) !== JSON.stringify(prevNodesRef.current);
    const edgesChanged = JSON.stringify(edges) !== JSON.stringify(prevEdgesRef.current);
    
    if (nodesChanged || edgesChanged) {
      if (nodes.length > 0 || edges.length > 0) {
        pushToHistory();
      }
      prevNodesRef.current = nodes;
      prevEdgesRef.current = edges;
    }
  }, [nodes, edges, pushToHistory]);

  // =====================
  // MOBILE OPTIMIZATION
  // =====================
  
  const {
    isMobile,
    isTablet,
    isTouchDevice,
    enableMinimap,
    panOnScroll,
    zoomToFit,
    setZoomLevel,
    getZoomLevel,
  } = useMobileOptimization();

  const minimapConfig = useResponsiveMinimap();

  // Auto-collapse panels on mobile
  useEffect(() => {
    if (isMobile && (isLeftToolbarOpen || isRightPanelOpen)) {
      setIsLeftToolbarOpen(false);
      setIsRightPanelOpen(false);
    }
  }, [isMobile]);

  // =====================
  // NODE HANDLERS
  // =====================

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
      
      // Track selection changes
      changes.forEach((change) => {
        if (change.type === "select") {
          setSelectedNodeIds((prev) => {
            if (change.selected) {
              return [...prev, change.id];
            }
            return prev.filter((id) => id !== change.id);
          });
        }
      });
    },
    [setNodes]
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds));
    },
    [setEdges]
  );

  // =====================
  // CONNECTION HANDLER
  // =====================

  const handleConnect: OnConnect = useCallback(
    (connection: Connection) => {
      // Validate connection
      if (!connection.source || !connection.target) return;
      
      const newEdge: Edge = {
        ...connection,
        id: `e-${connection.source}-${connection.target}-${Date.now()}`,
        type: "animatedDotted",
        animated: false,
        style: { stroke: "#6366f1", strokeWidth: 2 },
      };
      
      setEdges((eds) => [...eds, newEdge]);
      
      toast.success("Connected", {
        description: "Components connected successfully",
      });
    },
    [setEdges, toast]
  );

  // =====================
  // DRAG & DROP
  // =====================

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  // Add component to canvas at center or given position
  const addComponent = useCallback((item: PaletteItem, position?: { x: number; y: number }) => {
    const bounds = reactFlowWrapper.current?.getBoundingClientRect();
    
    let x = 200 + Math.random() * 100;
    let y = 150 + Math.random() * 100;
    
    if (position) {
      x = position.x;
      y = position.y;
    } else if (bounds) {
      const center = reactFlow.screenToFlowPosition({
        x: bounds.left + bounds.width / 2,
        y: bounds.top + bounds.height / 2,
      });
      x = center.x;
      y = center.y;
    }

    const newNode: Node = {
      id: `${item.type}-${Date.now()}`,
      type: "custom",
      position: { x, y },
      data: {
        label: item.label,
        componentType: item.type,
        category: item.category,
      },
    };

    setNodes((nds) => [...nds, newNode]);
    
    toast.success("Component added", {
      description: `${item.label} added to canvas`,
    });
  }, [reactFlow, setNodes, toast]);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      
      const data = e.dataTransfer.getData("application/json") || e.dataTransfer.getData("text");
      
      if (data) {
        try {
          const paletteItem: PaletteItem = JSON.parse(data);
          const bounds = reactFlowWrapper.current?.getBoundingClientRect();
          
          if (!bounds) return;
          
          const position = reactFlow.screenToFlowPosition({
            x: e.clientX,
            y: e.clientY,
          });
          
          const newNode: Node = {
            id: `${paletteItem.type}-${Date.now()}`,
            type: "custom",
            position,
            data: {
              label: paletteItem.label,
              componentType: paletteItem.type,
              category: paletteItem.category,
            },
          };
          
          setNodes((nds) => [...nds, newNode]);
          
          toast.success("Component added", {
            description: `${paletteItem.label} added to canvas`,
          });
        } catch (err) {
          console.error("Failed to parse drop data:", err);
        }
      }
    },
    [reactFlow, setNodes, toast]
  );

  // =====================
  // ACTIONS
  // =====================

  const handleSave = useCallback(() => {
    // Show prompt if not connected
    if (!authenticated || !hasWallet) {
      toast("Wallet Required", {
        description: "Your work is saved locally. Connect your wallet to back up your progress to the cloud.",
        action: {
          label: "Connect Wallet",
          onClick: () => loginWithWallet()
        },
      });
    }

    // Still save to local storage as a guest
    const flowData = {
      nodes,
      edges,
      viewport: reactFlow.getViewport(),
    };
    
    localStorage.setItem("realflow-canvas", JSON.stringify(flowData));
    
    if (authenticated && hasWallet) {
      toast.success("Canvas saved", {
        description: `${nodes.length} components saved to your account`,
      });
    }
  }, [nodes, edges, reactFlow, toast, authenticated, hasWallet, loginWithWallet]);

  const handleClear = useCallback(() => {
    if (nodes.length > 0) {
      setNodes([]);
      setEdges([]);
      clearHistory();
      toast.success("Canvas cleared", {
        description: "All components removed",
      });
    }
  }, [nodes.length, setNodes, setEdges, clearHistory, toast]);

  const handleUndo = useCallback(() => {
    const state = undo();
    if (state) {
      toast("Undo", { description: "Previous state restored" });
    }
  }, [undo, toast]);

  const handleRedo = useCallback(() => {
    const state = redo();
    if (state) {
      toast("Redo", { description: "Next state restored" });
    }
  }, [redo, toast]);

  const handleDelete = useCallback(() => {
    if (selectedNodeIds.length > 0) {
      setNodes((nds) => nds.filter((n) => !selectedNodeIds.includes(n.id)));
      setEdges((eds) => eds.filter(
        (e) => !selectedNodeIds.includes(e.source) && !selectedNodeIds.includes(e.target)
      ));
      toast.success("Deleted", {
        description: `${selectedNodeIds.length} component(s) removed`,
      });
      setSelectedNodeIds([]);
    }
  }, [selectedNodeIds, setNodes, setEdges, toast]);

  const handleCopy = useCallback(() => {
    const selectedNodes = nodes.filter((n) => selectedNodeIds.includes(n.id));
    const selectedEdges = edges.filter(
      (e) => selectedNodeIds.includes(e.source) && selectedNodeIds.includes(e.target)
    );
    clipboardRef.current = { nodes: selectedNodes, edges: selectedEdges };
    toast.success("Copied", {
      description: `${selectedNodes.length} component(s) copied`,
    });
  }, [nodes, edges, selectedNodeIds, toast]);

  const handlePaste = useCallback(() => {
    if (!clipboardRef.current || clipboardRef.current.nodes.length === 0) return;
    
    const viewport = reactFlow.getViewport();
    const offset = 50;
    
    const newNodes = clipboardRef.current.nodes.map((node) => ({
      ...node,
      id: `${node.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      position: {
        x: node.position.x + offset,
        y: node.position.y + offset,
      },
      selected: false,
    }));
    
    setNodes((nds) => [...nds, ...newNodes]);
    toast.success("Pasted", {
      description: `${newNodes.length} component(s) pasted`,
    });
  }, [reactFlow, setNodes, toast]);

  const handleSelectAll = useCallback(() => {
    setNodes((nds) => nds.map((n) => ({ ...n, selected: true })));
    setSelectedNodeIds(nodes.map((n) => n.id));
  }, [nodes, setNodes]);

  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<string | null>(null);

  const handleDeploy = useCallback(async () => {
    console.log("handleDeploy triggered", { authenticated, hasWallet, nodesCount: nodes.length });
    
    if (!authenticated || !hasWallet) {
      console.log("Showing wallet connection toast");
      toast("Wallet Required", {
        description: "You must connect a blockchain wallet before deploying your marketplace.",
        action: {
          label: "Connect Wallet",
          onClick: () => loginWithWallet()
        },
      });
      return;
    }

    if (nodes.length === 0) {
      toast.error("Cannot deploy", {
        description: "Add components to the canvas first",
      });
      return;
    }

    const nodeTypes = [...new Set(nodes.map((n) => n.data?.componentType))];
    const hasRequiredComponents = nodeTypes.some(
      (type) => ["mintButton", "listingGrid", "buyButton"].includes(type)
    );

    if (!hasRequiredComponents) {
      toast.error("Missing components", {
        description: "Add mint, listing, or buy components to deploy",
      });
      return;
    }

    setIsDeploying(true);
    setDeploymentStatus("Initializing backend deployment...");

    try {
      const flowData = {
        nodes,
        edges,
        components: nodeTypes,
        owner: wallets[0]?.address
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/deploy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(flowData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `Deployment failed (Status ${response.status})`);
      }

      const result = await response.json();

      setDeploymentStatus("Finalizing...");

      toast.success("Marketplace live on Polygon Amoy!", {
        description: `Tx Hash: ${result.transactionHash}\nFactory: ${result.address}`,
        action: {
          label: "View Transaction",
          onClick: () => window.open(result.explorerUrl || `https://amoy.polygonscan.com/tx/${result.transactionHash}`, "_blank"),
        },
      });

      localStorage.setItem("deployed-contract", JSON.stringify(result));
    } catch (error) {
      console.error("Deployment error:", error);
      toast.error("Deployment failed", {
        description: error instanceof Error ? error.message : "An unexpected error occurred",
      });
    } finally {
      setIsDeploying(false);
      setDeploymentStatus(null);
    }
  }, [nodes, edges, toast, authenticated, hasWallet, loginWithWallet, wallets]);

  // =====================
  // ZOOM CONTROLS
  // =====================

  const handleZoomIn = useCallback(() => {
    reactFlow.zoomIn({ duration: 200 });
  }, [reactFlow]);

  const handleZoomOut = useCallback(() => {
    reactFlow.zoomOut({ duration: 200 });
  }, [reactFlow]);

  const handleFitView = useCallback(() => {
    reactFlow.fitView({ padding: 0.2, duration: 500 });
  }, [reactFlow]);

  // =====================
  // KEYBOARD SHORTCUTS
  // =====================

  useKeyboardShortcuts({
    onUndo: handleUndo,
    onRedo: handleRedo,
    onDelete: handleDelete,
    onCopy: handleCopy,
    onPaste: handlePaste,
    onSelectAll: handleSelectAll,
    onSave: handleSave,
  });

  // =====================
  // RENDER
  // =====================

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* ===================== */}
      {/* LEFT PANEL - Components */}
      {/* ===================== */}
      <div className={`
        ${isLeftToolbarOpen ? "w-64" : "w-0"} 
        ${isMobile ? "absolute left-0 z-50 h-full shadow-2xl" : "flex-shrink-0"}
        flex flex-col border-r border-[var(--border)] 
        bg-[var(--surface)] transition-all duration-200 overflow-hidden
      `}>
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[var(--primary)] to-indigo-500 flex items-center justify-center">
              <Blocks className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-sm">Components</span>
          </div>
          <button
            onClick={() => setIsLeftToolbarOpen(!isLeftToolbarOpen)}
            className="p-2 rounded-lg hover:bg-[var(--surface-hover)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="text-xs text-gray-500 mb-3 px-2">
            Drag components to canvas
          </div>
          <ComponentPalette onDragStart={() => {}} onAdd={addComponent} />
        </div>
      </div>

      {/* ===================== */}
      {/* MAIN CANVAS AREA */}
      {/* ===================== */}
      <div className="flex-1 flex flex-col relative">
        {/* Top Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-[var(--surface)]">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            {/* Toggle Left Panel */}
            {!isLeftToolbarOpen && (
              <button
                onClick={() => setIsLeftToolbarOpen(true)}
                className="p-2 rounded-lg hover:bg-[var(--surface-hover)]"
              >
                <Menu className="w-4 h-4" />
              </button>
            )}
            
            {/* Back */}
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 rounded-lg hover:bg-[var(--surface-hover)]"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-[var(--primary)] to-indigo-500 flex items-center justify-center">
                <Blocks className="w-3 h-3 text-white" />
              </div>
              <span className="font-semibold text-sm">Builder</span>
            </div>

            <div className="h-5 w-px bg-[var(--border)]" />

            {/* Undo/Redo */}
            <button
              onClick={handleUndo}
              disabled={!canUndo}
              className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] disabled:opacity-30 disabled:cursor-not-allowed"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={!canRedo}
              className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] disabled:opacity-30 disabled:cursor-not-allowed"
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo2 className="w-4 h-4" />
            </button>

            <div className="h-5 w-px bg-[var(--border)]" />

            {/* Zoom */}
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)]"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleFitView}
              className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)]"
              title="Fit View"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)]"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            <div className="h-5 w-px bg-[var(--border)]" />

            {/* Copy/Paste */}
            <button
              onClick={handleCopy}
              disabled={selectedNodeIds.length === 0}
              className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)] disabled:opacity-30"
              title="Copy (Ctrl+C)"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={handlePaste}
              className="p-1.5 rounded-lg hover:bg-[var(--surface-hover)]"
              title="Paste (Ctrl+V)"
            >
              <Clipboard className="w-4 h-4" />
            </button>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Test Mode */}
            <button
              onClick={() => {
                setIsTestModeEnabled(!isTestModeEnabled);
                if (!isTestModeEnabled) setIsRightPanelOpen(true);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${
                isTestModeEnabled 
                  ? "bg-[var(--primary)]/20 text-[var(--primary)]" 
                  : "bg-[var(--surface-hover)] text-gray-400"
              }`}
            >
              <FlaskConical className="w-4 h-4" />
              <span className="text-xs font-medium">Test</span>
            </button>

            {/* Wallet */}
            <ConnectButton variant="outline" size="sm" />

            {/* Toggle Right Panel */}
            <button
              onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
              className="p-2 rounded-lg hover:bg-[var(--surface-hover)]"
            >
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ===================== */}
        {/* REACT FLOW CANVAS */}
        {/* ===================== */}
        <div
          ref={reactFlowWrapper}
          className="flex-1 relative"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={handleNodesChange}
            onEdgesChange={handleEdgesChange}
            onConnect={handleConnect}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            snapToGrid
            snapGrid={[16, 16]}
            defaultEdgeOptions={{
              type: "animatedDotted",
              style: { stroke: "#6366f1", strokeWidth: 2, strokeDasharray: "8 4" },
            }}
            connectionLineStyle={{ stroke: "#6366f1", strokeWidth: 2 }}
            connectionLineType={ConnectionLineType.Bezier}
            minZoom={0.1}
            maxZoom={2}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            fitView
            fitViewOptions={{ padding: 0.2, maxZoom: 1 }}
            zoomOnScroll
            zoomOnPinch
            panOnScroll
            panOnDrag
            selectNodesOnDrag={false}
            nodesDraggable
            nodesConnectable
            elementsSelectable
            multiSelectionKeyCode="Shift"
            deleteKeyCode="Delete"
            proOptions={{ hideAttribution: true }}
          >
            {/* Background Grid */}
            <Background
              color="#2a2c2e"
              gap={20}
              size={1}
            />

            {/* Mini Map */}
            {enableMinimap && (
              <MiniMap
                className="!bg-[#141517] !border-gray-700/50 !rounded-lg"
                style={{
                  left: minimapConfig.position === "bottom-left" ? 10 : undefined,
                  right: minimapConfig.position === "bottom-right" ? 10 : undefined,
                  bottom: 10,
                }}
                nodeColor={(node) => {
                  const colors: Record<string, string> = {
                    Core: "#3b82f6",
                    Display: "#a855f7",
                    Trading: "#f59e0b",
                    Ownership: "#10b981",
                    Web3: "#6366f1",
                    UI: "#f43f5e",
                  };
                  return colors[(node.data?.category as string) || "Core"] || "#6366f1";
                }}
                maskColor="rgba(0,0,0,0.6)"
                pannable
                zoomable={!isMobile}
              />
            )}
          </ReactFlow>

          {/* Empty State */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
              <div className="text-center p-10 border-2 border-dashed border-gray-700/50 rounded-2xl bg-gray-900/30">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-800 flex items-center justify-center">
                  <Blocks className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-400 mb-2">Start Building</h3>
                <p className="text-sm text-gray-500">Drag components from the left panel</p>
              </div>
            </div>
          )}

          {/* Status Bar */}
          <div className="absolute bottom-4 left-4 z-[5] flex items-center gap-2 text-xs text-gray-500 bg-[#0e1012]/90 px-3 py-1.5 rounded-lg border border-gray-800">
            <span>{nodes.length} node{nodes.length !== 1 ? "s" : ""}</span>
            <span className="text-gray-700">|</span>
            <span>{edges.length} edge{edges.length !== 1 ? "s" : ""}</span>
            <span className="text-gray-700">|</span>
            <span>Scroll to zoom</span>
            <span className="text-gray-700">|</span>
            <span>Drag to pan</span>
          </div>

          {/* Zoom Level */}
          <div className="absolute bottom-4 right-20 z-[5] text-xs text-gray-500 bg-[#0e1012]/90 px-2 py-1 rounded border border-gray-800">
            {Math.round((reactFlow.getViewport().zoom || 1) * 100)}%
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-[var(--border)] bg-[var(--surface)]">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-1" /> Save
            </Button>
            <Button variant="outline" size="sm" onClick={handleClear}>
              <Trash2 className="w-4 h-4 mr-1" /> Clear
            </Button>
            <ConnectButton variant="outline" size="sm" />
          </div>
          <Button
            variant="default"
            size="sm"
            disabled={nodes.length === 0 || isDeploying}
            onClick={handleDeploy}
            className="bg-gradient-to-r from-[var(--primary)] to-indigo-500"
          >
            {isDeploying ? (
              <>
                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                {deploymentStatus || "Deploying..."}
              </>
            ) : (
              "Deploy Marketplace"
            )}
          </Button>
        </div>
      </div>

      {/* ===================== */}
      {/* RIGHT PANEL - AI/Test */}
      {/* ===================== */}
      <div className={`
        ${isRightPanelOpen ? "w-80" : "w-0"} 
        ${isMobile ? "absolute right-0 z-50 h-[calc(100vh-50px)] top-[50px] shadow-2xl" : "flex-shrink-0"}
        flex flex-col border-l border-[var(--border)] 
        bg-[var(--surface)] transition-all duration-200 overflow-hidden
      `}>
        <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[var(--primary)] to-indigo-500 flex items-center justify-center">
              {isTestModeEnabled ? (
                <FlaskConical className="w-3 h-3 text-white" />
              ) : (
                <Sparkles className="w-3 h-3 text-white" />
              )}
            </div>
            <span className="font-semibold text-sm">
              {isTestModeEnabled ? "Test & Preview" : "AI Co-Builder"}
            </span>
          </div>
          <button
            onClick={() => setIsRightPanelOpen(false)}
            className="p-2 rounded-lg hover:bg-[var(--surface-hover)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {isTestModeEnabled ? (
            <TestPanel 
              nodes={nodes}
              edges={edges}
              onClose={() => setIsTestModeEnabled(false)} 
            />
          ) : (
            <AISidebar />
          )}
        </div>
      </div>
    </div>
  );
}

// =====================
// MAIN EXPORT
// =====================

/**
 * Builder component with ReactFlowProvider wrapper
 * Required for React Flow hooks to work
 */
export default function Builder() {
  return (
    <ReactFlowProvider>
      <BuilderCanvas />
    </ReactFlowProvider>
  );
}
