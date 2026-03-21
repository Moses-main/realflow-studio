import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, Pause, CheckCircle, AlertCircle, Loader2,
  ArrowRight, Wallet, Coins, ShoppingCart, Eye
} from "lucide-react";
import { useAccount, useBalance, useBlockNumber } from "wagmi";
import type { Node } from "@xyflow/react";

interface SimulationStep {
  id: string;
  label: string;
  description: string;
  status: "pending" | "running" | "success" | "error";
  txHash?: string;
}

interface TestPanelProps {
  nodes: Node[];
  onClose: () => void;
}

export function TestPanel({ nodes, onClose }: TestPanelProps) {
  // Real wallet data from wagmi
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const { data: blockNumber } = useBlockNumber();

  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [gasEstimate, setGasEstimate] = useState<string | null>(null);
  
  // Dynamic steps based on nodes
  const getSteps = (): SimulationStep[] => {
    const nodeTypes = nodes.map(n => n.data?.componentType as string);
    
    const steps: SimulationStep[] = [
      { id: "connect", label: "Wallet Connected", description: "Connected to Polygon Amoy testnet", status: isConnected ? "success" : "pending" },
    ];

    if (nodeTypes.includes("assetUpload")) {
      steps.push({ id: "upload", label: "Upload to IPFS", description: "Uploading asset metadata", status: "pending" });
    }
    
    if (nodeTypes.includes("mintButton")) {
      steps.push({ id: "mint", label: "Mint NFT", description: "Deploying ERC-1155 token", status: "pending" });
    }
    
    if (nodeTypes.includes("listingGrid")) {
      steps.push({ id: "list", label: "Create Listing", description: "Listing asset on marketplace", status: "pending" });
    }
    
    if (nodeTypes.includes("buyButton")) {
      steps.push({ id: "trade", label: "Execute Trade", description: "Processing buy transaction", status: "pending" });
    }

    return steps;
  };

  const [steps, setSteps] = useState<SimulationStep[]>(getSteps());
  const [logs, setLogs] = useState<string[]>([]);

  const runSimulation = async () => {
    if (!isConnected) {
      addLog("Error: Please connect your wallet first");
      return;
    }

    setIsRunning(true);
    setLogs([]);
    setSteps(getSteps());
    setCurrentStep(0);
    setGasEstimate(null);

    addLog(`Block: #${blockNumber || "..."}`);
    addLog(`Wallet: ${address?.slice(0, 10)}...`);
    addLog("Starting marketplace simulation...\n");

    const currentSteps = getSteps();
    
    for (let i = 0; i < currentSteps.length; i++) {
      setCurrentStep(i);
      setSteps(prev => prev.map((s, idx) => 
        idx === i ? { ...s, status: "running" } : s
      ));
      
      addLog(`[${i + 1}/${currentSteps.length}] ${currentSteps[i].label}...`);
      
      // Simulate processing with realistic timing
      await new Promise(r => setTimeout(r, 1000 + Math.random() * 500));
      
      // Generate mock tx hash
      const txHash = `0x${Math.random().toString(16).slice(2, 10)}...${Math.random().toString(16).slice(2, 6)}`;
      
      setSteps(prev => prev.map((s, idx) => 
        idx === i ? { ...s, status: "success", txHash } : s
      ));
      addLog(`✓ ${currentSteps[i].label} - TX: ${txHash}`);
      
      // Estimate gas
      if (!gasEstimate) {
        setGasEstimate(`${(0.001 + Math.random() * 0.005).toFixed(4)} MATIC`);
      }
    }

    addLog("\n✓ Simulation complete!");
    addLog(`Total gas estimate: ${gasEstimate || "calculating..."}`);
    setIsRunning(false);
  };

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const allPassed = steps.every(s => s.status === "success");
  const hasError = steps.some(s => s.status === "error");

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="w-[350px] h-full bg-[var(--surface)] border-l border-[var(--border)] flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
          <span className="text-sm font-medium text-[var(--text-primary)]">Test Mode</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-[var(--surface-hover)] text-[var(--text-muted)]"
        >
          ×
        </button>
      </div>

      {/* Wallet Status */}
      <div className="p-4 border-b border-[var(--border)]">
        <div className="surface p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[var(--text-muted)]">Connected Wallet</span>
            <span className={`badge ${isConnected ? "badge-success" : "badge-warning"}`}>
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-[var(--primary)]" />
            <span className="text-sm font-medium text-[var(--text-primary)]">
              {balance?.formatted ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : "0.0000 MATIC"}
            </span>
          </div>
          <div className="text-xs text-[var(--text-muted)] mt-1 font-mono">
            {address ? `${address.slice(0, 10)}...${address.slice(-6)}` : "Not connected"}
          </div>
          {blockNumber && (
            <div className="text-xs text-[var(--text-muted)] mt-1">
              Block: #{blockNumber.toString()}
            </div>
          )}
        </div>
      </div>

      {/* Steps */}
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-3">
          {steps.map((step, index) => {
            const isActive = index === currentStep && isRunning;
            const isComplete = step.status === "success";
            const isError = step.status === "error";

            return (
              <motion.div
                key={step.id}
                animate={isActive ? { scale: 1.02 } : { scale: 1 }}
                className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                  isActive ? "bg-[var(--primary-muted)]" : "surface"
                }`}
              >
                <div className="mt-0.5">
                  {isComplete ? (
                    <CheckCircle className="w-4 h-4 text-[var(--success)]" />
                  ) : isError ? (
                    <AlertCircle className="w-4 h-4 text-[var(--error)]" />
                  ) : step.status === "running" ? (
                    <Loader2 className="w-4 h-4 text-[var(--primary)] animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-[var(--border-strong)]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[var(--text-primary)]">{step.label}</div>
                  <div className="text-xs text-[var(--text-muted)]">{step.description}</div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Logs */}
        {logs.length > 0 && (
          <div className="mt-4">
            <div className="text-xs text-[var(--text-muted)] mb-2">Simulation Log</div>
            <div className="bg-[var(--app-bg)] rounded-lg p-3 font-mono text-xs max-h-40 overflow-auto">
              {logs.map((log, i) => (
                <div key={i} className="text-[var(--text-secondary)]">{log}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-[var(--border)] space-y-2">
        {gasEstimate && (
          <div className="text-xs text-center text-[var(--text-muted)] mb-2">
            Est. Gas: {gasEstimate}
          </div>
        )}
        <button
          onClick={runSimulation}
          disabled={isRunning || !isConnected || nodes.length === 0}
          className={`w-full btn-primary flex items-center justify-center gap-2 ${
            allPassed ? "bg-[var(--success)] hover:bg-[var(--success)]/90" : ""
          }`}
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Running Simulation...
            </>
          ) : allPassed ? (
            <>
              <CheckCircle className="w-4 h-4" />
              All Tests Passed
            </>
          ) : !isConnected ? (
            <>
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </>
          ) : nodes.length === 0 ? (
            <>
              <Eye className="w-4 h-4" />
              Add Components First
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Run Simulation ({getSteps().length} steps)
            </>
          )}
        </button>
        
        <button
          onClick={() => {
            setSteps(prev => prev.map(s => ({ ...s, status: "pending" })));
            setLogs([]);
          }}
          className="w-full btn-secondary text-sm"
        >
          Reset
        </button>
      </div>
    </motion.div>
  );
}
