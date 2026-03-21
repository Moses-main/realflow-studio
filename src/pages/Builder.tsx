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
  Background,
  MiniMap,
  applyNodeChanges,
  applyEdgeChanges,
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
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ComponentPalette, { type PaletteItem } from "@/components/builder/ComponentPalette";
import AISidebar from "@/components/builder/AISidebar";
import CustomNode from "@/components/builder/CustomNode";
import { BezierEdge } from "@/components/builder/BezierEdge";
import { useUndoRedo } from "@/hooks/useUndoRedo";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

// Node types - maps component types to React Flow node components
const nodeTypes = { custom: CustomNode };

// Edge types - uses custom BezierEdge for smooth curves
const edgeTypes = {
  bezier: BezierEdge,
  default: BezierEdge,
};

/**
 * Inner Builder component - uses React Flow hooks
 * Must be wrapped with ReactFlowProvider
 */
function BuilderCanvas() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlow = useReactFlow();
  
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

  // Push to history when nodes or edges change
  useEffect(() => {
    if (nodes.length > 0 || edges.length > 0) {
      pushToHistory();
    }
  }, [nodes, edges]);

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
        type: "bezier", // Use bezier for smooth curves
        animated: false,
        style: { stroke: "#6366f1", strokeWidth: 2 },
      };
      
      setEdges((eds) => [...eds, newEdge]);
      
      toast({
        title: "Connected",
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

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      
      const data = e.dataTransfer.getData("application/json") || e.dataTransfer.getData("text");
      
      if (data) {
        try {
          const paletteItem: PaletteItem = JSON.parse(data);
          const bounds = reactFlowWrapper.current?.getBoundingClientRect();
          
          if (!bounds) return;
          
          // Calculate position relative to viewport
          const viewport = reactFlow.getViewport();
          
          const newNode: Node = {
            id: `${paletteItem.type}-${Date.now()}`,
            type: "custom",
            position: {
              x: (e.clientX - bounds.left - viewport.x) / viewport.zoom,
              y: (e.clientY - bounds.top - viewport.y) / viewport.zoom,
            },
            data: {
              label: paletteItem.label,
              componentType: paletteItem.type,
              category: paletteItem.category,
            },
          };
          
          setNodes((nds) => [...nds, newNode]);
          
          toast({
            title: "Component added",
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
    const flowData = {
      nodes,
      edges,
      viewport: reactFlow.getViewport(),
    };
    localStorage.setItem("realflow-canvas", JSON.stringify(flowData));
    toast({
      title: "Canvas saved",
      description: `${nodes.length} components saved`,
    });
  }, [nodes, edges, reactFlow, toast]);

  const handleClear = useCallback(() => {
    if (nodes.length > 0) {
      setNodes([]);
      setEdges([]);
      clearHistory();
      toast({
        title: "Canvas cleared",
        description: "All components removed",
      });
    }
  }, [nodes.length, setNodes, setEdges, clearHistory, toast]);

  const handleUndo = useCallback(() => {
    const state = undo();
    if (state) {
      toast({ title: "Undo", description: "Previous state restored" });
    }
  }, [undo, toast]);

  const handleRedo = useCallback(() => {
    const state = redo();
    if (state) {
      toast({ title: "Redo", description: "Next state restored" });
    }
  }, [redo, toast]);

  const handleDelete = useCallback(() => {
    if (selectedNodeIds.length > 0) {
      // Delete selected nodes
      setNodes((nds) => nds.filter((n) => !selectedNodeIds.includes(n.id)));
      // Delete edges connected to selected nodes
      setEdges((eds) => eds.filter(
        (e) => !selectedNodeIds.includes(e.source) && !selectedNodeIds.includes(e.target)
      ));
      toast({
        title: "Deleted",
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
    toast({
      title: "Copied",
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
    toast({
      title: "Pasted",
      description: `${newNodes.length} component(s) pasted`,
    });
  }, [reactFlow, setNodes, toast]);

  const handleSelectAll = useCallback(() => {
    setNodes((nds) => nds.map((n) => ({ ...n, selected: true })));
    setSelectedNodeIds(nodes.map((n) => n.id));
  }, [nodes, setNodes]);

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
        flex-shrink-0 flex flex-col border-r border-[var(--border)] 
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
          <ComponentPalette onDragStart={() => {}} />
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
              onClick={() => setIsTestModeEnabled(!isTestModeEnabled)}
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
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--surface-hover)]">
              <Wallet className="w-4 h-4" />
              <span className="text-xs font-mono">0x1234...5678</span>
              <ChevronDown className="w-3 h-3" />
            </button>

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
              type: "bezier",
              style: { stroke: "#6366f1", strokeWidth: 2 },
            }}
            connectionLineStyle={{ stroke: "#6366f1", strokeWidth: 2 }}
            connectionLineType="bezier"
            style={{ backgroundColor: "#0e1012" }}
            minZoom={0.1}
            maxZoom={4}
            defaultViewport={{ x: 50, y: 50, zoom: 1 }}
            fitView={nodes.length === 0}
            fitViewOptions={{ padding: 0.2 }}
            zoomOnScroll
            zoomOnPinch
            panOnScroll={false}
            panOnDrag={[1, 2]}
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
              style={{ backgroundColor: "#0e1012" }}
            />

            {/* Mini Map */}
            <MiniMap
              className="!bg-[#141517] !border-gray-700/50 !rounded-lg !m-2"
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
              zoomable
            />
          </ReactFlow>

          {/* Empty State */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
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
          <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 text-xs text-gray-500 bg-[#0e1012]/90 px-3 py-1.5 rounded-lg border border-gray-800">
            <span>{nodes.length} node{nodes.length !== 1 ? "s" : ""}</span>
            <span className="text-gray-700">|</span>
            <span>{edges.length} edge{edges.length !== 1 ? "s" : ""}</span>
            <span className="text-gray-700">|</span>
            <span>Scroll to zoom</span>
            <span className="text-gray-700">|</span>
            <span>Drag to pan</span>
          </div>

          {/* Zoom Level */}
          <div className="absolute bottom-4 right-20 z-10 text-xs text-gray-500 bg-[#0e1012]/90 px-2 py-1 rounded border border-gray-800">
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
          </div>
          <Button
            variant="default"
            size="sm"
            disabled={nodes.length === 0}
            className="bg-gradient-to-r from-[var(--primary)] to-indigo-500"
          >
            Deploy Marketplace
          </Button>
        </div>
      </div>

      {/* ===================== */}
      {/* RIGHT PANEL - AI/Test */}
      {/* ===================== */}
      <div className={`
        ${isRightPanelOpen ? "w-80" : "w-0"} 
        flex-shrink-0 flex flex-col border-l border-[var(--border)] 
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
            <div className="p-4">
              <p className="text-sm text-gray-500">Test mode coming soon...</p>
            </div>
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
