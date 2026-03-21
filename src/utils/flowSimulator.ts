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

export interface SimulationState {
  isMetadataUploaded: boolean;
  isMinted: boolean;
  isListed: boolean;
  isBought: boolean;
}

export class FlowSimulator {
  private nodes: Node[];
  private edges: Edge[];
  private options: FlowSimulationOptions;
  private state: SimulationState;
  
  constructor(nodes: Node[], edges: Edge[], options: FlowSimulationOptions) {
    this.nodes = nodes;
    this.edges = edges;
    this.options = options;
    this.state = {
      isMetadataUploaded: false,
      isMinted: false,
      isListed: false,
      isBought: false,
    };
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

    const flowSteps: SimulationStep[] = [];
    const visited = new Set<string>();

    const incomingEdges = new Map<string, number>();
    this.edges.forEach(e => {
      incomingEdges.set(e.target, (incomingEdges.get(e.target) || 0) + 1);
    });

    const startNodes = this.nodes.filter(n => 
      !incomingEdges.has(n.id) || connectedNodes.size === 0
    );
    
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

      this.edges.filter(e => e.source === nodeId).forEach(e => {
        if (!visited.has(e.target)) {
          queue.push(e.target);
        }
      });
    }

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

  private calculateGasUsage(componentType: string): string {
    const baseGas = {
      assetUpload: "0.0005",
      mintButton: "0.0023",
      listingGrid: "0.0012",
      buyButton: "0.0045",
      walletConnect: "0.0000",
      networkStatus: "0.0000"
    }[componentType] || "0.0001";
    
    const variation = (this.hashString(componentType) % 10) / 10000;
    const base = parseFloat(baseGas);
    const total = base + variation;
    return total.toFixed(4);
  }

  private generateTxHash(): string {
    const timestamp = Date.now().toString();
    const hash = this.hashString(timestamp);
    const hexHash = hash.toString(16).padStart(64, '0');
    return `0x${hexHash}`;
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }

  private simulateAssetUpload(): { success: boolean; txHash?: string; error?: string; gasUsed: string } {
    this.state.isMetadataUploaded = true;
    return {
      success: true,
      txHash: this.generateTxHash(),
      gasUsed: this.calculateGasUsage("assetUpload")
    };
  }

  private simulateMintToken(): { success: boolean; txHash?: string; error?: string; gasUsed: string } {
    if (!this.state.isMetadataUploaded) {
      return { 
        success: false, 
        error: "Cannot mint: Asset metadata must be uploaded first.",
        gasUsed: "0.0000" 
      };
    }
    this.state.isMinted = true;
    return {
      success: true,
      txHash: this.generateTxHash(),
      gasUsed: this.calculateGasUsage("mintButton")
    };
  }

  private simulateCreateListing(): { success: boolean; txHash?: string; error?: string; gasUsed: string } {
    if (!this.state.isMinted) {
      return { 
        success: false, 
        error: "Cannot list: Asset must be minted before it can be listed. Hint: Connect an 'Asset Upload' and 'Mint Token' component before this 'Create Listing' step.",
        gasUsed: "0.0000" 
      };
    }
    this.state.isListed = true;
    return {
      success: true,
      txHash: this.generateTxHash(),
      gasUsed: this.calculateGasUsage("listingGrid")
    };
  }

  private simulateExecuteTrade(): { success: boolean; txHash?: string; error?: string; gasUsed: string } {
    if (!this.state.isListed) {
      return { 
        success: false, 
        error: "Cannot execute trade: Asset is not listed on the marketplace. Hint: Connect a 'Create Listing' component in the flow before this 'Execute Trade' button.",
        gasUsed: "0.0000" 
      };
    }
    this.state.isBought = true;
    return {
      success: true,
      txHash: this.generateTxHash(),
      gasUsed: this.calculateGasUsage("buyButton")
    };
  }

  private simulateWalletConnect(): { success: boolean; txHash?: string; error?: string; gasUsed: string } {
    return { success: true, gasUsed: "0.0000" };
  }

  private simulateNetworkCheck(): { success: boolean; txHash?: string; error?: string; gasUsed: string } {
    return { success: true, gasUsed: "0.0000" };
  }

  private simulateGenericStep(label: string): { success: boolean; txHash?: string; error?: string; gasUsed: string } {
    return { success: true, gasUsed: this.calculateGasUsage(label) };
  }

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