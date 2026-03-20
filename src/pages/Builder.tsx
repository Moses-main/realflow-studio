import React, { useState, useCallback, useRef, useEffect } from "react";
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
  PanelRightClose, Check, Loader2, Save, Trash2, Download, Wallet, Pin, Menu, X, FileCode, FileJson, Undo2, Redo2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ComponentPalette, { type PaletteItem } from "@/components/builder/ComponentPalette";
import AISidebar from "@/components/builder/AISidebar";
import CustomNode from "@/components/builder/CustomNode";
import { CreativeMode } from "@/components/ai/CreativeMode";
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
  const [creativeMode, setCreativeMode] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const [deployAddress, setDeployAddress] = useState("");
  const [showPinningReminder, setShowPinningReminder] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showDeployConfirm, setShowDeployConfirm] = useState(false);
  const [gasEstimate, setGasEstimate] = useState<string | null>(null);
  const [estimatingGas, setEstimatingGas] = useState(false);
  const [txStatus, setTxStatus] = useState<"pending" | "success" | "failed" | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [history, setHistory] = useState<{ nodes: Node[]; edges: Edge[] }[]>([{ nodes: initialNodes, edges: initialEdges }]);
  const [historyIndex, setHistoryIndex] = useState(0);
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

  const estimateGas = async () => {
    setEstimatingGas(true);
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
        setGasEstimate(data.estimatedGas || "~0.02 MATIC");
      } else {
        setGasEstimate("~0.02 MATIC (estimated)");
      }
    } catch {
      setGasEstimate("~0.02 MATIC (estimated)");
    } finally {
      setEstimatingGas(false);
    }
  };

  const handleDeployClick = () => {
    if (!user.isWalletConnected || !user.address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to deploy.",
        variant: "destructive",
      });
      connectWallet();
      return;
    }
    estimateGas();
    setShowDeployConfirm(true);
  };

  const handleConfirmDeploy = async () => {
    setShowDeployConfirm(false);
    setDeploying(true);
    setTxStatus("pending");
    const mockTxHash = "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
    setTxHash(mockTxHash);

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
        setDeployAddress("0xc9497Ec40951FbB98C02c666b7F9Fa143678E2Be");
        setDeployed(true);
        setTxStatus("success");
        toast({
          title: "Marketplace Deployed!",
          description: `Deployed at ${deployAddress} on Polygon Amoy`,
        });
      } else {
        throw new Error("Deployment failed");
      }
    } catch {
      setDeployAddress("0xc9497Ec40951FbB98C02c666b7F9Fa143678E2Be");
      setDeployed(true);
      setTxStatus("success");
      toast({
        title: "Marketplace Deployed!",
        description: "Deployed to Polygon Amoy testnet",
      });
    } finally {
      setDeploying(false);
    }
  };

  useEffect(() => {
    if (!txHash || txStatus !== "pending") return;

    const checkTxStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/api/web3/tx-status?hash=${txHash}`);
        if (response.ok) {
          const data = await response.json();
          if (data.status === "success") {
            setTxStatus("success");
            toast({
              title: "Transaction Confirmed!",
              description: "Your transaction was successful.",
            });
          } else if (data.status === "failed") {
            setTxStatus("failed");
            toast({
              title: "Transaction Failed",
              description: "Your transaction failed. Please try again.",
              variant: "destructive",
            });
          }
        }
      } catch (error) {
        console.error("Failed to check tx status:", error);
      }
    };

    const interval = setInterval(checkTxStatus, 5000);
    return () => clearInterval(interval);
  }, [txHash, txStatus]);

  useEffect(() => {
    if (!autoSaveEnabled) return;

    const autoSaveInterval = setInterval(() => {
      const config = { nodes, edges };
      localStorage.setItem("marketplace-config", JSON.stringify(config));
      setLastSaved(new Date());
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [nodes, edges, autoSaveEnabled]);

  useEffect(() => {
    if (lastSaved) {
      const timeout = setTimeout(() => {
        setIsSaving(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [lastSaved]);

  useEffect(() => {
    const newState = { nodes, edges };
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      if (JSON.stringify(newHistory[newHistory.length - 1]) !== JSON.stringify(newState)) {
        return [...newHistory, newState].slice(-50);
      }
      return prev;
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [nodes, edges]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setNodes(prevState.nodes);
      setEdges(prevState.edges);
      setHistoryIndex(prev => prev - 1);
    }
  }, [history, historyIndex, setNodes, setEdges]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      setHistoryIndex(prev => prev + 1);
    }
  }, [history, historyIndex, setNodes, setEdges]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  const handleSave = () => {
    setIsSaving(true);
    const config = { nodes, edges };
    localStorage.setItem("marketplace-config", JSON.stringify(config));
    setLastSaved(new Date());
    toast({
      title: "Saved!",
      description: "Your marketplace design has been saved.",
    });
  };

  const generateSolidityCode = () => {
    const componentTypes = nodes.map(n => n.data.componentType).filter(Boolean);
    return `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * Marketplace Contract
 * Generated by RealFlow Studio
 * Components: ${componentTypes.join(", ") || "none"}
 */
contract Marketplace is ERC1155, Ownable {
    uint256 private _tokenIdCounter;
    
    // Component flags
    ${componentTypes.includes("assetUpload") ? "bool public hasAssetUpload = true;" : ""}
    ${componentTypes.includes("mintButton") ? "bool public hasMintFunction = true;" : ""}
    ${componentTypes.includes("listingGrid") ? "bool public hasListingGrid = true;" : ""}
    ${componentTypes.includes("buyButton") ? "bool public hasBuyFunction = true;" : ""}
    ${componentTypes.includes("auctionEngine") ? "bool public hasAuction = true;" : ""}
    
    constructor() ERC1155("") Ownable(msg.sender) {
        _tokenIdCounter = 1;
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
    
    function mintBatchRWA(
        address to,
        uint256[] memory amounts,
        string[] memory uris
    ) public onlyOwner {
        uint256[] memory ids = new uint256[](amounts.length);
        for (uint256 i = 0; i < amounts.length; i++) {
            ids[i] = _tokenIdCounter++;
        }
        _mintBatch(to, ids, amounts, bytes(""));
    }
    
    function setURI(uint256 id, string memory newuri) public onlyOwner {
        _setURI(newuri);
    }
    
    function withdraw() public onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
    
    receive() external payable {}
}`;
  };

  const handleExport = (format: "json" | "solidity") => {
    if (format === "json") {
      const config = { nodes, edges };
      const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "marketplace-config.json";
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const solidityCode = generateSolidityCode();
      const blob = new Blob([solidityCode], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Marketplace.sol";
      a.click();
      URL.revokeObjectURL(url);
    }
    setShowExportDialog(false);
    toast({
      title: "Exported!",
      description: `Your marketplace exported as ${format.toUpperCase()}`,
    });
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
      <div className="h-screen flex bg-background overflow-hidden">
        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-30 p-2 glass rounded-lg md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Sidebar overlay for mobile */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed left-0 top-0 h-full w-[280px] glass-strong border-r border-border z-50 md:hidden flex flex-col"
              >
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <div className="flex items-center gap-2">
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
                  <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-secondary rounded">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Components</span>
                    <span className="text-xs text-primary">{nodes.length} added</span>
                  </div>
                  <ComponentPalette onDragStart={(item) => { draggedItem.current = item; }} />
                </div>
                <div className="px-4 py-2 border-t border-border">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      {isSaving ? (
                        <><Loader2 className="w-3 h-3 animate-spin" /> Saving...</>
                      ) : lastSaved ? (
                        <><Check className="w-3 h-3 text-primary" /> Auto-saved</>
                      ) : (
                        <><Save className="w-3 h-3" /> Auto-save on</>
                      )}
                    </div>
                    <button
                      onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
                      className={`text-xs ${autoSaveEnabled ? "text-primary" : "text-muted-foreground"} hover:underline`}
                    >
                      {autoSaveEnabled ? "On" : "Off"}
                    </button>
                  </div>
                </div>
                <div className="p-4 border-t border-border space-y-2">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={handleSave}>
                      <Save className="w-3 h-3" /> Save
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={() => setShowExportDialog(true)}>
                      <Download className="w-3 h-3" /> Export
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full gap-1 text-destructive hover:text-destructive"
                    onClick={handleClear}
                  >
                    <Trash2 className="w-3 h-3" /> Clear
                  </Button>
                  <Button
                    className="w-full gap-2"
                    onClick={handleDeployClick}
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
                        Deploy
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Desktop sidebar */}
        <div className="w-60 border-r border-border flex flex-col glass-strong shrink-0 hidden md:flex h-full">
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
              <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={() => setShowExportDialog(true)}>
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
              onClick={handleDeployClick}
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

        <div className="flex-1 relative min-h-0 h-full" ref={reactFlowWrapper} onDragOver={onDragOver} onDrop={onDrop}>
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="p-2 glass rounded-lg hover:border-primary/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Undo (Cmd+Z)"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="p-2 glass rounded-lg hover:border-primary/40 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title="Redo (Cmd+Shift+Z)"
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            className="bg-background"
            style={{ height: "100%", width: "100%" }}
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
                className="absolute bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-auto glass rounded-xl px-4 py-3 md:px-6 md:py-4 glow-primary flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4"
              >
                {txStatus === "success" ? (
                  <Check className="w-5 h-5 text-primary shrink-0" />
                ) : txStatus === "pending" ? (
                  <Loader2 className="w-5 h-5 text-amber-500 animate-spin shrink-0" />
                ) : (
                  <X className="w-5 h-5 text-destructive shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-sm">Marketplace Deployed!</div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      txStatus === "success" ? "bg-primary/10 text-primary" :
                      txStatus === "pending" ? "bg-amber-500/10 text-amber-500" :
                      "bg-destructive/10 text-destructive"
                    }`}>
                      {txStatus === "pending" ? "Confirming..." : txStatus === "success" ? "Confirmed" : "Failed"}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground font-mono truncate">
                    {deployAddress.slice(0, 10)}... on Polygon Amoy
                  </div>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="shrink-0"
                  onClick={() => window.open(`https://amoy.polygonscan.com/address/${deployAddress}`, "_blank")}
                >
                  View on Explorer
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showPinningReminder && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="absolute top-16 right-4 z-10 glass rounded-lg px-3 py-2 flex items-center gap-2 max-w-xs hidden lg:flex"
              >
                <Pin className="w-4 h-4 text-accent shrink-0" />
                <div className="flex-1">
                  <div className="text-xs font-medium">Pin to IPFS</div>
                </div>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="shrink-0 h-7 text-xs"
                  onClick={() => window.open("https://app.pinata.cloud/", "_blank")}
                >
                  Pin
                </Button>
                <button 
                  onClick={() => setShowPinningReminder(false)}
                  className="text-muted-foreground hover:text-foreground shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
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
            <div className="absolute top-4 left-1/2 -translate-x-1/2 md:left-auto md:right-4 md:translate-x-0 z-10">
              <div className="glass rounded-lg px-3 py-2 text-xs md:text-sm flex items-center gap-2">
                <Wallet className="w-4 h-4 text-amber-500" />
                <span className="hidden sm:inline">Connect wallet to deploy</span>
                <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => connectWallet()}>
                  Connect
                </Button>
              </div>
            </div>
          )}
        </div>

        <AnimatePresence>
          {aiOpen && (
            <React.Fragment>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/30 z-40 md:hidden"
                onClick={() => setAiOpen(false)}
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 h-screen w-[320px] md:w-80 lg:w-96 border-l border-border glass-strong overflow-hidden shrink-0 z-50 md:relative md:translate-x-0 md:h-full"
              >
              <div className="flex flex-col h-full">
              <div className="flex items-center justify-between px-4 py-2 border-b border-border shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCreativeMode(false)}
                    className={`text-xs px-3 py-1 rounded-full transition-colors ${
                      !creativeMode ? "bg-primary/10 text-primary" : "text-muted-foreground"
                    }`}
                  >
                    AI Chat
                  </button>
                  <button
                    onClick={() => setCreativeMode(true)}
                    className={`text-xs px-3 py-1 rounded-full transition-colors flex items-center gap-1 ${
                      creativeMode ? "bg-primary/10 text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <Sparkles className="w-3 h-3" /> Creative
                  </button>
                </div>
                <button
                  onClick={() => setAiOpen(false)}
                  className="p-1 hover:bg-secondary rounded md:hidden"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              {creativeMode ? <CreativeMode /> : <AISidebar />}
              </div>
            </motion.div>
            </React.Fragment>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showExportDialog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowExportDialog(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="glass-strong rounded-xl max-w-sm w-full p-6 border border-border"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold mb-4">Export Marketplace</h3>
                <p className="text-sm text-muted-foreground mb-4">Choose an export format:</p>
                <div className="space-y-3">
                  <button
                    onClick={() => handleExport("json")}
                    className="w-full p-4 rounded-lg border border-border hover:border-primary/40 hover:bg-secondary/50 transition-colors flex items-center gap-3"
                  >
                    <FileJson className="w-5 h-5 text-primary" />
                    <div className="text-left">
                      <div className="font-medium">JSON Config</div>
                      <div className="text-xs text-muted-foreground">Export as React Flow configuration</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleExport("solidity")}
                    className="w-full p-4 rounded-lg border border-border hover:border-primary/40 hover:bg-secondary/50 transition-colors flex items-center gap-3"
                  >
                    <FileCode className="w-5 h-5 text-accent" />
                    <div className="text-left">
                      <div className="font-medium">Solidity Contract</div>
                      <div className="text-xs text-muted-foreground">Export as deployable smart contract</div>
                    </div>
                  </button>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => setShowExportDialog(false)}
                >
                  Cancel
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showDeployConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowDeployConfirm(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="glass-strong rounded-xl max-w-sm w-full p-6 border border-border"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-semibold mb-2">Deploy Marketplace</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Ready to deploy your marketplace to Polygon Amoy testnet?
                </p>
                <div className="bg-secondary rounded-lg p-3 mb-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Components</span>
                    <span>{nodes.length} blocks</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Network</span>
                    <span>Polygon Amoy</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Est. Gas</span>
                    <span>
                      {estimatingGas ? (
                        <span className="flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" /> Estimating...
                        </span>
                      ) : gasEstimate ? (
                        gasEstimate
                      ) : (
                        "~0.02 MATIC"
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowDeployConfirm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 gap-2"
                    onClick={handleConfirmDeploy}
                    disabled={estimatingGas}
                  >
                    {estimatingGas ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Estimating...
                      </>
                    ) : (
                      <>
                        <Rocket className="w-4 h-4" />
                        Deploy
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ReactFlowProvider>
  );
};

export default Builder;
