import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, Pause, CheckCircle, AlertCircle, Loader2,
  ArrowRight, Wallet, Coins, ShoppingCart, Eye
} from "lucide-react";

interface SimulationStep {
  id: string;
  label: string;
  description: string;
  status: "pending" | "running" | "success" | "error";
}

interface TestPanelProps {
  nodes: Node[];
  onClose: () => void;
}

export function TestPanel({ nodes, onClose }: TestPanelProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<SimulationStep[]>([
    { id: "connect", label: "Connect Wallet", description: "Simulated wallet connection", status: "pending" },
    { id: "upload", label: "Upload Asset", description: "Test asset metadata upload to IPFS", status: "pending" },
    { id: "mint", label: "Mint NFT", description: "Test mint transaction on Amoy", status: "pending" },
    { id: "list", label: "List for Sale", description: "Test marketplace listing", status: "pending" },
    { id: "trade", label: "Execute Trade", description: "Test buy/sell transaction", status: "pending" },
  ]);

  const [mockBalance] = useState("1.5 MATIC");
  const [logs, setLogs] = useState<string[]>([]);

  const runSimulation = async () => {
    setIsRunning(true);
    setLogs([]);
    setSteps(prev => prev.map(s => ({ ...s, status: "pending" })));
    setCurrentStep(0);

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      setSteps(prev => prev.map((s, idx) => 
        idx === i ? { ...s, status: "running" } : s
      ));
      
      addLog(`[Step ${i + 1}] Starting: ${steps[i].label}...`);
      await new Promise(r => setTimeout(r, 1200));
      
      setSteps(prev => prev.map((s, idx) => 
        idx === i ? { ...s, status: "success" } : s
      ));
      addLog(`[Step ${i + 1}] ✓ Completed: ${steps[i].label}`);
    }

    addLog(`[Complete] All tests passed! Marketplace ready.`);
    setIsRunning(false);
  };

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()} - ${message}`]);
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

      {/* Wallet Simulation */}
      <div className="p-4 border-b border-[var(--border)]">
        <div className="surface p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[var(--text-muted)]">Simulated Wallet</span>
            <span className="badge-success">Connected</span>
          </div>
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4 text-[var(--primary)]" />
            <span className="text-sm font-medium text-[var(--text-primary)]">{mockBalance}</span>
          </div>
          <div className="text-xs text-[var(--text-muted)] mt-1 font-mono">
            0x742d35Cc6634C0532925a3b844Bc9e7595f...
          </div>
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
        <button
          onClick={runSimulation}
          disabled={isRunning}
          className={`w-full btn-primary flex items-center justify-center gap-2 ${
            allPassed ? "bg-[var(--success)] hover:bg-[var(--success)]/90" : ""
          }`}
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Running...
            </>
          ) : allPassed ? (
            <>
              <CheckCircle className="w-4 h-4" />
              All Tests Passed
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Run Simulation
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
