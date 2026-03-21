import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, CheckCircle, AlertCircle, Loader2,
  Wallet, Eye, ExternalLink, Globe, ArrowRight, Zap, ChevronDown
} from "lucide-react";
import { useAuth, shortenAddress } from "@/hooks/useAuth";
import { useLoginModal } from "@/providers/LoginModalProvider";
import type { Node, Edge } from "@xyflow/react";
import { FlowSimulator, SimulationStep, FlowSimulationOptions } from "@/utils/flowSimulator";

interface TestPanelProps {
  nodes: Node[];
  edges: Edge[];
  onClose: () => void;
}

const NETWORKS = [
  { id: 80002, name: "Polygon Amoy", symbol: "MATIC", explorer: "https://www.oklink.com/amoy", rpc: "https://rpc-amoy.polygon.technology" },
  { id: 11155111, name: "Sepolia", symbol: "ETH", explorer: "https://sepolia.etherscan.io", rpc: "https://rpc.sepolia.org" },
];

export function TestPanel({ nodes, edges, onClose }: TestPanelProps) {
  const { user, ready } = useAuth();
  const { openLoginModal } = useLoginModal();
  
  const address = user.address;
  const isConnected = user.isAuthenticated;

  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [selectedNetwork, setSelectedNetwork] = useState(NETWORKS[0]);
  const [showNetworkSelect, setShowNetworkSelect] = useState(false);
  const [totalGas, setTotalGas] = useState("0.0000");
  const [logs, setLogs] = useState<string[]>([]);
  const [steps, setSteps] = useState<SimulationStep[]>([]);
  const [testBalance, setTestBalance] = useState("0.00");

   // Initialize flow simulator
   const [flowSimulator, setFlowSimulator] = useState<FlowSimulator | null>(null);
   
   useEffect(() => {
     if (nodes.length > 0 || edges.length > 0) {
       const options: FlowSimulationOptions = {
         startBalance: "100.00",
         networkSymbol: selectedNetwork.symbol,
         networkName: selectedNetwork.name
       };
       setFlowSimulator(new FlowSimulator(nodes, edges, options));
     }
   }, [nodes, edges, selectedNetwork]);

   // Generate steps based on canvas flow (following edges)
   const generateFlowSteps = useCallback((): SimulationStep[] => {
     if (!flowSimulator) return [];
     return flowSimulator.generateFlowSteps();
   }, [flowSimulator]);

   useEffect(() => {
     setSteps(generateFlowSteps());
   }, [generateFlowSteps]);

  const getStepLabel = (type: string, label: string): string => {
    const labels: Record<string, string> = {
      assetUpload: "Upload to IPFS",
      mintButton: "Mint Token",
      listingGrid: "Create Listing",
      buyButton: "Execute Trade",
      nftPreview: "Preview Asset",
      walletConnect: "Connect Wallet",
      networkStatus: "Check Network",
      pricingOracle: "Fetch Price",
      analytics: "Generate Report",
    };
    return labels[type] || label;
  };

  const getStepDescription = (type: string): string => {
    const descs: Record<string, string> = {
      assetUpload: "Upload RWA metadata to IPFS",
      mintButton: "Mint ERC-1155 token on " + NETWORKS[0].name,
      listingGrid: "List asset on marketplace",
      buyButton: "Process purchase with test MATIC",
      nftPreview: "Display token metadata",
      walletConnect: "Verify wallet connection",
      networkStatus: "Check " + NETWORKS[0].name + " status",
      pricingOracle: "Fetch real-time price data",
      analytics: "Calculate marketplace metrics",
    };
    return descs[type] || "Execute component action";
  };

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

   const runStep = async (step: SimulationStep): Promise<{ success: boolean; txHash?: string; error?: string; gasUsed: string }> => {
     if (!flowSimulator) {
       // Fallback to original implementation if simulator not ready
       try {
         const delay = 1500 + Math.random() * 1000;
         
         switch (step.componentType) {
           case "assetUpload":
             addLog(`Uploading metadata to IPFS...`);
             await new Promise(r => setTimeout(r, delay));
             const cid = `Qm${Math.random().toString(36).slice(2, 15)}`;
             addLog(`✓ Uploaded to IPFS: ${cid}`);
             return { success: true, txHash: `0x${Math.random().toString(16).slice(2, 66)}`, gasUsed: "0.0000" };

           case "mintButton":
             addLog(`Minting ERC-1155 token on ${selectedNetwork.name}...`);
             await new Promise(r => setTimeout(r, delay));
             addLog(`✓ Token minted: #${Math.floor(Math.random() * 10000)}`);
             return { success: true, txHash: `0x${Math.random().toString(16).slice(2, 66)}`, gasUsed: "0.0023" };

           case "listingGrid":
             addLog(`Creating marketplace listing...`);
             await new Promise(r => setTimeout(r, delay));
             const listingId = Math.floor(Math.random() * 1000);
             addLog(`✓ Listed for sale: ID #${listingId}`);
             return { success: true, txHash: `0x${Math.random().toString(16).slice(2, 66)}`, gasUsed: "0.0012" };

           case "buyButton":
             addLog(`Processing purchase with ${selectedNetwork.symbol}...`);
             await new Promise(r => setTimeout(r, delay));
             addLog(`✓ Transfer completed`);
             return { success: true, txHash: `0x${Math.random().toString(16).slice(2, 66)}`, gasUsed: "0.0045" };

           case "walletConnect":
             addLog(`Verifying wallet connection...`);
             await new Promise(r => setTimeout(r, 500));
             addLog(`✓ Wallet: ${shortenAddress(address)}`);
             return { success: true, gasUsed: "0.0000" };

           case "networkStatus":
             addLog(`Checking ${selectedNetwork.name} network...`);
             await new Promise(r => setTimeout(r, 500));
             addLog(`✓ Network: ${selectedNetwork.name} | Block: #${Math.floor(Math.random() * 1000000) + 10000000}`);
             return { success: true, gasUsed: "0.0000" };

           default:
             addLog(`Executing ${step.label}...`);
             await new Promise(r => setTimeout(r, delay));
             addLog(`✓ ${step.label} completed`);
             return { success: true, gasUsed: "0.0001" };
         }
       } catch (err) {
         // Fix: Return proper error object with gasUsed field
         return { 
           success: false, 
           error: err instanceof Error ? err.message : "Unknown error",
           gasUsed: "0.0000"
         };
       }
     }
     
     // Use the flow simulator for deterministic, testable results
     const result = await flowSimulator.runStep(step);
     
     // Add logs for each step type
     switch (step.componentType) {
       case "assetUpload":
         addLog(`Uploading metadata to IPFS...`);
         if (result.success) {
           addLog(`✓ Uploaded to IPFS: ${result.txHash?.slice(0, 10)}...`);
         }
         break;
         
       case "mintButton":
         addLog(`Minting ERC-1155 token on ${selectedNetwork.name}...`);
         if (result.success) {
           addLog(`✓ Token minted: #${Math.floor(Math.random() * 10000)}`);
         }
         break;
         
       case "listingGrid":
         addLog(`Creating marketplace listing...`);
         if (result.success) {
           const listingId = Math.floor(Math.random() * 1000);
           addLog(`✓ Listed for sale: ID #${listingId}`);
         }
         break;
         
       case "buyButton":
         addLog(`Processing purchase with ${selectedNetwork.symbol}...`);
         if (result.success) {
           addLog(`✓ Transfer completed`);
         }
         break;
         
       case "walletConnect":
         addLog(`Verifying wallet connection...`);
         if (result.success) {
           addLog(`✓ Wallet: ${shortenAddress(address)}`);
         }
         break;
         
       case "networkStatus":
         addLog(`Checking ${selectedNetwork.name} network...`);
         if (result.success) {
           addLog(`✓ Network: ${selectedNetwork.name} | Block: #${Math.floor(Math.random() * 1000000) + 10000000}`);
         }
         break;
         
       default:
         addLog(`Executing ${step.label}...`);
         if (result.success) {
           addLog(`✓ ${step.label} completed`);
         }
         break;
     }
     
     if (!result.success) {
       addLog(`✗ Error: ${result.error}`);
     }
     
     return result;
   };

  const runSimulation = async () => {
    if (!isConnected || steps.length === 0) return;

    setIsRunning(true);
    setLogs([]);
    setCurrentStep(0);
    setTestBalance("100.00"); // Start with 100 test tokens

    addLog(`=== RealFlow Studio Test Simulation ===`);
    addLog(`Network: ${selectedNetwork.name} (Testnet)`);
    addLog(`Wallet: ${address}`);
    addLog(`Test Balance: 100.00 ${selectedNetwork.symbol}`);
    addLog(`Components: ${nodes.length} | Connections: ${edges.length}`);
     addLog(``);
 
     let gasSum = 0;
 
     for (let i = 0; i < steps.length; i++) {
    setCurrentStep(i);
    
    setSteps(prev => prev.map((s, idx) => 
      idx === i ? { ...s, status: "running" } : s
    ));

    const result = await runStep(steps[i]);

    if (result.success) {
      const gas = parseFloat(result.gasUsed || "0.0001");
      gasSum += gas;
      setTestBalance(prev => (parseFloat(prev) - gas).toFixed(2));
      setTotalGas(gasSum.toFixed(4));
      
      setSteps(prev => prev.map((s, idx) => 
        idx === i ? { 
          ...s, 
          status: "success", 
          txHash: result.txHash,
          gasUsed: result.gasUsed 
        } : s
      ));
    } else {
      setSteps(prev => prev.map((s, idx) => 
        idx === i ? { ...s, status: "error" } : s
      ));
      addLog(`✗ Error: ${result.error}`);
      break;
    }
  }

  addLog(``);
  addLog(`=== Simulation Complete ===`);
  addLog(`Total Gas Used: ${gasSum.toFixed(4)} ${selectedNetwork.symbol}`);
  addLog(`Remaining Balance: ${testBalance} ${selectedNetwork.symbol}`);

  setIsRunning(false);
  setCurrentStep(steps.length);
};

  const resetSimulation = () => {
    setSteps(generateFlowSteps());
    setLogs([]);
    setCurrentStep(-1);
    setTotalGas("0.0000");
    setTestBalance("100.00");
  };

  const allPassed = steps.length > 0 && steps.every(s => s.status === "success");
  const hasError = steps.some(s => s.status === "error");

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
          <span className="text-sm font-medium">Test Simulation</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-[var(--surface-hover)] text-[var(--text-muted)]"
        >
          ×
        </button>
      </div>

      {/* Network Selector */}
      <div className="p-4 border-b border-[var(--border)]">
        <div className="text-xs text-[var(--text-muted)] mb-2">Network</div>
        <div className="relative">
          <button
            onClick={() => setShowNetworkSelect(!showNetworkSelect)}
            className="w-full flex items-center justify-between p-2 rounded-lg bg-[var(--app-bg)] border border-[var(--border)] hover:border-[var(--primary)] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[var(--primary)]" />
              <span className="text-sm">{selectedNetwork.name}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />
          </button>
          
          {showNetworkSelect && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-lg z-10">
              {NETWORKS.map(network => (
                <button
                  key={network.id}
                  onClick={() => {
                    setSelectedNetwork(network);
                    setShowNetworkSelect(false);
                  }}
                  className={`w-full flex items-center gap-2 p-2 hover:bg-[var(--surface-hover)] text-left ${
                    selectedNetwork.id === network.id ? 'bg-[var(--primary-muted)]' : ''
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-sm">{network.name}</span>
                  <span className="text-xs text-[var(--text-muted)]">({network.symbol})</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Wallet Status */}
      <div className="p-4 border-b border-[var(--border)]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[var(--text-muted)]">Wallet</span>
          <span className={`badge ${isConnected ? "badge-success" : "badge-warning"}`}>
            {isConnected ? "Connected" : "Disconnected"}
          </span>
        </div>
        {isConnected ? (
          <div>
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-[var(--primary)]" />
              <span className="text-sm font-mono">{shortenAddress(address)}</span>
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-1">
              Test Balance: <span className="text-[var(--primary)] font-medium">{testBalance} {selectedNetwork.symbol}</span>
            </div>
          </div>
        ) : (
          <button
            onClick={openLoginModal}
            className="w-full btn-primary text-sm"
          >
            Connect Wallet to Test
          </button>
        )}
      </div>

      {/* Flow Visualization */}
      <div className="flex-1 overflow-auto p-4">
        <div className="text-xs text-[var(--text-muted)] mb-3">Component Flow ({nodes.length} nodes, {edges.length} connections)</div>
        
        {steps.length === 0 ? (
          <div className="text-center py-8 text-[var(--text-muted)]">
            <Eye className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Add components to canvas to test</p>
          </div>
        ) : (
          <div className="space-y-2">
            {steps.map((step, index) => {
              const isCurrent = index === currentStep;
              const isComplete = step.status === "success";
              const isError = step.status === "error";
              const isRunning = step.status === "running";

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {/* Flow arrow between steps */}
                  {index > 0 && (
                    <div className="flex items-center justify-center py-1">
                      <ArrowRight className="w-3 h-3 text-[var(--text-muted)]" />
                    </div>
                  )}
                  
                  <div
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                      isCurrent && isRunning
                        ? "bg-[var(--primary-muted)] border-[var(--primary)]/50"
                        : isComplete
                          ? "bg-[var(--success-muted)] border-[var(--success)]/20"
                          : isError
                            ? "bg-[var(--error-muted)] border-[var(--error)]/20"
                            : "bg-[var(--surface)] border-[var(--border)]"
                    }`}
                  >
                    <div className="mt-0.5">
                      {isComplete ? (
                        <CheckCircle className="w-5 h-5 text-[var(--success)]" />
                      ) : isError ? (
                        <AlertCircle className="w-5 h-5 text-[var(--error)]" />
                      ) : isRunning ? (
                        <Loader2 className="w-5 h-5 text-[var(--primary)] animate-spin" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-[var(--border-strong)]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{step.label}</div>
                      <div className="text-xs text-[var(--text-muted)]">{step.description}</div>
                      {step.txHash && step.status === "success" && (
                        <a
                          href={`${selectedNetwork.explorer}/tx/${step.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-[var(--primary)] hover:underline mt-1"
                        >
                          View TX <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {step.gasUsed && step.status === "success" && (
                        <div className="text-xs text-[var(--text-muted)] mt-1">
                          Gas: {step.gasUsed} {selectedNetwork.symbol}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Simulation Logs */}
        {logs.length > 0 && (
          <div className="mt-4">
            <div className="text-xs text-[var(--text-muted)] mb-2">Simulation Log</div>
            <div className="bg-[var(--app-bg)] rounded-lg p-3 font-mono text-xs max-h-40 overflow-auto border border-[var(--border)]">
              {logs.map((log, i) => (
                <div key={i} className={`${
                  log.startsWith('✓') ? 'text-[var(--success)]' : 
                  log.startsWith('✗') ? 'text-[var(--error)]' :
                  log.startsWith('===') ? 'text-[var(--primary)] font-bold' :
                  log.startsWith('↓') ? 'text-[var(--warning)]' :
                  'text-[var(--text-secondary)]'
                }`}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-[var(--border)] space-y-2">
        {totalGas !== "0.0000" && (
          <div className="text-xs text-center text-[var(--text-muted)] mb-2">
            Total Gas: <span className="text-[var(--primary)] font-medium">{totalGas} {selectedNetwork.symbol}</span>
          </div>
        )}
        
        <button
          onClick={runSimulation}
          disabled={isRunning || !isConnected || steps.length === 0}
          className={`w-full btn-primary flex items-center justify-center gap-2 ${
            allPassed ? "!bg-[var(--success)] !hover:bg-[var(--success)]/90" : ""
          } ${hasError ? "!bg-[var(--error)]" : ""}`}
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Simulating...
            </>
          ) : allPassed ? (
            <>
              <CheckCircle className="w-4 h-4" />
              All Tests Passed
            </>
          ) : hasError ? (
            <>
              <AlertCircle className="w-4 h-4" />
              Simulation Failed
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              Run Simulation ({steps.length} steps)
            </>
          )}
        </button>
        
        <button
          onClick={resetSimulation}
          className="w-full btn-secondary text-sm"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
