import type { Node, Edge } from "@xyflow/react";

export interface SimulationStep {
  id: string;
  label: string;
  description: string;
  status: "pending" | "running" | "success" | "error";
  txHash?: string;
  componentType: string;
  gasUsed?: string;
  testToken?: string;
}

export interface FlowSimulationOptions {
  startBalance: string;
  networkSymbol: string;
  networkName: string;
}

export class FlowSimulator {
  private nodes: Node[];
  private edges: Edge[];
  private options: FlowSimulationOptions;
  
  constructor(nodes: Node[], edges: Edge[], options: FlowSimulationOptions) {
    this.nodes = nodes;
    this.edges = edges;
    this.options = options;
  }
  
  /**
   * Generate flow steps based on canvas connections (BFS traversal)
   */
  public generateFlowSteps(): SimulationStep[] {
    if (this.nodes.length === 0) return [];

    // Build flow order from edges
    const nodeMap = new Map(this.nodes.map(n => [n.id, n]));
    const connectedNodes = new Set<string>();
    this.edges.forEach(e => {
      connectedNodes.add(e.source);
      connectedNodes.add(e.target);
    });

    // Start with Asset Upload if exists, or first connected node
    const flowSteps: SimulationStep[] = [];
    const visited = new Set<string>();

    // Find starting nodes (no incoming edges)
    const incomingEdges = new Map<string, number>();
    this.edges.forEach(e => {
      incomingEdges.set(e.target, (incomingEdges.get(e.target) || 0) + 1);
    });

    const startNodes = this.nodes.filter(n => 
      !incomingEdges.has(n.id) || connectedNodes.size === 0
    );
    
    // BFS through connected components
    const queue = startNodes.map(n => n.id);
    
    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      if (visited.has(nodeId)) continue;
      visited.add(nodeId);

      const node = nodeMap.get(nodeId);
      if (!node) continue;

      const componentType = node.data?.componentType as string;
      const label = node.data?.label as string || componentType;

      flowSteps.push({
        id: nodeId,
        label: this.getStepLabel(componentType, label),
        description: this.getStepDescription(componentType),
        status: "pending",
        componentType,
      });

      // Add children to queue
      this.edges.filter(e => e.source === nodeId).forEach(e => {
        if (!visited.has(e.target)) {
          queue.push(e.target);
        }
      });
    }

    // Add unvisited nodes
    this.nodes.forEach(n => {
      if (!visited.has(n.id)) {
        const componentType = n.data?.componentType as string;
        flowSteps.push({
          id: n.id,
          label: this.getStepLabel(componentType, n.data?.label as string || componentType),
          description: this.getStepDescription(componentType),
          status: "pending",
          componentType,
        });
      }
    });

    return flowSteps;
  }

  /**
   * Run a single simulation step with deterministic results
   */
  public async runStep(step: SimulationStep): Promise<{
    success: boolean;
    txHash?: string;
    error?: string;
    gasUsed: string;
  }> {
    // Deterministic delay based on step hash for reproducible tests
    const delay = 1000 + (this.hashString(step.id) % 1000);
    await new Promise(resolve => setTimeout(resolve, delay));

    switch (step.componentType) {
      case "assetUpload":
        return this.simulateAssetUpload();
        
      case "mintButton":
        return this.simulateMintToken();
        
      case "listingGrid":
        return this.simulateCreateListing();
        
      case "buyButton":
        return this.simulateExecuteTrade();
        
      case "walletConnect":
        return this.simulateWalletConnect();
        
      case "networkStatus":
        return this.simulateNetworkCheck();
        
      default:
        return this.simulateGenericStep(step.label);
    }
  }

  /**
   * Calculate gas usage for a step (deterministic)
   */
  private calculateGasUsage(componentType: string): string {
    const baseGas = {
      assetUpload: "0.0005",
      mintButton: "0.0023",
      listingGrid: "0.0012",
      buyButton: "0.0045",
      walletConnect: "0.0000",
      networkStatus: "0.0000"
    }[componentType] || "0.0001";
    
    // Add some deterministic variation based on componentType hash
    const variation = (this.hashString(componentType) % 10) / 10000; // 0-0.0009
    const base = parseFloat(baseGas);
    const total = base + variation;
    return total.toFixed(4);
  }

  /**
   * Generate deterministic transaction hash
   */
  private generateTxHash(): string {
    // Create deterministic hash based on timestamp and a counter
    const timestamp = Date.now().toString();
    const hash = this.hashString(timestamp);
    // Convert number to hex string and take first 64 characters (256 bits)
    const hexHash = hash.toString(16).padStart(64, '0');
    return `0x${hexHash}`;
  }

  /**
   * Simple string hash function for deterministic values
   */
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  // Step simulation methods
  private simulateAssetUpload(): { success: boolean; txHash?: string; error?: string; gasUsed: string } {
    return {
      success: true,
      txHash: this.generateTxHash(),
      gasUsed: this.calculateGasUsage("assetUpload")
    };
  }

  private simulateMintToken(): { success: boolean; txHash?: string; error?: string; gasUsed: string } {
    return {
      success: true,
      txHash: this.generateTxHash(),
      gasUsed: this.calculateGasUsage("mintButton")
    };
  }

  private simulateCreateListing(): { success: boolean; txHash?: string; error?: string; gasUsed: string } {
    return {
      success: true,
      txHash: this.generateTxHash(),
      gasUsed: this.calculateGasUsage("listingGrid")
    };
  }

  private simulateExecuteTrade(): { success: boolean; txHash?: string; error?: string; gasUsed: string } {
    return {
      success: true,
      txHash: this.generateTxHash(),
      gasUsed: this.calculateGasUsage("buyButton")
    };
  }

  private simulateWalletConnect(): { success: boolean; txHash?: string; error?: string; gasUsed: string } {
    return {
      success: true,
      gasUsed: this.calculateGasUsage("walletConnect")
    };
  }

  private simulateNetworkCheck(): { success: boolean; txHash?: string; error?: string; gasUsed: string } {
    return {
      success: true,
      gasUsed: this.calculateGasUsage("networkStatus")
    };
  }

  private simulateGenericStep(label: string): { success: boolean; txHash?: string; error?: string; gasUsed: string } {
    return {
      success: true,
      gasUsed: this.calculateGasUsage(label)
    };
  }

  // Label and description helpers
  private getStepLabel(type: string, label: string): string {
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
  }

  private getStepDescription(type: string): string {
    const descs: Record<string, string> = {
      assetUpload: "Upload RWA metadata to IPFS",
      mintButton: `Mint ERC-1155 token on ${this.options.networkName}`,
      listingGrid: "List asset on marketplace",
      buyButton: `Process purchase with ${this.options.networkSymbol}`,
      nftPreview: "Display token metadata",
      walletConnect: "Verify wallet connection",
      networkStatus: `Check ${this.options.networkName} status`,
      pricingOracle: "Fetch real-time price data",
      analytics: "Calculate marketplace metrics",
    };
    return descs[type] || "Execute component action";
  }
}