import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw, Bug, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKey?: string | number;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  copied: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  private retryCount = 0;
  private readonly maxRetries = 3;

  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    copied: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    if (import.meta.env.DEV) {
      console.group("Error Details");
      console.error("Error:", error);
      console.error("Component Stack:", errorInfo.componentStack);
      console.groupEnd();
    }
  }

  public componentDidUpdate(prevProps: Readonly<Props>) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.handleRetry();
    }
  }

  private handleRetry = () => {
    if (this.retryCount >= this.maxRetries) {
      console.warn("Max retry attempts reached");
      return;
    }

    this.retryCount++;
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  private handleForceRetry = () => {
    this.retryCount = 0;
    this.handleRetry();
  };

  private copyErrorDetails = () => {
    const { error, errorInfo } = this.state;
    const details = `
Error: ${error?.message || "Unknown error"}
Stack: ${error?.stack || "No stack trace"}
Component Stack: ${errorInfo?.componentStack || "No component stack"}
Timestamp: ${new Date().toISOString()}
User Agent: ${navigator.userAgent}
    `.trim();

    navigator.clipboard.writeText(details).then(() => {
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    });
  };

  private formatErrorMessage(error: Error | null): string {
    if (!error) return "An unexpected error occurred";
    
    if (error.message.includes("wallet")) {
      return "Wallet connection error. Please check your wallet extension.";
    }
    if (error.message.includes("network")) {
      return "Network error. Please check your internet connection.";
    }
    if (error.message.includes("contract")) {
      return "Smart contract error. The blockchain interaction failed.";
    }
    
    return error.message;
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, errorInfo, copied } = this.state;
      const formattedMessage = this.formatErrorMessage(error);

      return (
        <div className="min-h-[400px] flex items-center justify-center p-8 bg-background">
          <div className="text-center max-w-lg">
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-destructive" />
            </div>
            
            <h2 className="text-2xl font-bold mb-3">Something went wrong</h2>
            
            <p className="text-muted-foreground mb-4 leading-relaxed">
              {formattedMessage}
            </p>

            {import.meta.env.DEV && error && (
              <div className="mb-4 text-left bg-muted/50 rounded-lg p-4 text-left">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <Bug className="w-3 h-3" /> Error Details (Dev Only)
                  </span>
                  <button
                    onClick={this.copyErrorDetails}
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="text-xs font-mono text-destructive overflow-auto max-h-32 whitespace-pre-wrap break-all">
                  {error.stack || error.message}
                </pre>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={this.handleForceRetry} 
                variant="default"
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again {this.retryCount > 0 && `(${this.retryCount}/${this.maxRetries})`}
              </Button>
              
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline"
                className="gap-2"
              >
                Refresh Page
              </Button>
            </div>

            {errorInfo?.componentStack && import.meta.env.DEV && (
              <details className="mt-4 text-left">
                <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                  Component Stack Trace
                </summary>
                <pre className="mt-2 p-2 bg-muted/50 rounded text-xs font-mono overflow-auto max-h-40">
                  {errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
