import { Button } from "@/components/ui/button";
import { Wallet, LogOut, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

export function WalletButton() {
  const { user, connectWallet, disconnectWallet } = useAuth();
  const { toast } = useToast();

  const handleClick = async () => {
    try {
      if (user.isWalletConnected) {
        await disconnectWallet();
        toast({
          title: "Wallet disconnected",
          description: "Your wallet has been disconnected.",
        });
      } else {
        await connectWallet();
        toast({
          title: "Wallet connected",
          description: `Connected: ${user.address?.slice(0, 6)}...${user.address?.slice(-4)}`,
        });
      }
    } catch (error) {
      toast({
        title: "Connection failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  const displayAddress = user.address
    ? `${user.address.slice(0, 6)}...${user.address.slice(-4)}`
    : null;

  return (
    <Button
      variant={user.isWalletConnected ? "outline" : "default"}
      size="sm"
      className="gap-2"
      onClick={handleClick}
    >
      {user.isWalletConnected ? (
        <>
          <LogOut className="w-4 h-4" />
          {displayAddress}
        </>
      ) : (
        <>
          <Wallet className="w-4 h-4" />
          Connect Wallet
        </>
      )}
    </Button>
  );
}

export function PrivyLoginButton() {
  const { authenticated, loginWithEmail, logout } = useAuth();
  const { toast } = useToast();

  const handleClick = async () => {
    try {
      if (authenticated) {
        await logout();
        toast({
          title: "Signed out",
          description: "You have been signed out successfully.",
        });
      } else {
        await loginWithEmail();
        toast({
          title: "Signed in",
          description: "Welcome to RealFlow Studio!",
        });
      }
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: error instanceof Error ? error.message : "Authentication error",
        variant: "destructive",
      });
    }
  };

  return (
    <Button variant="outline" size="sm" className="gap-2" onClick={handleClick}>
      {authenticated ? "Sign Out" : "Sign Up with Email"}
    </Button>
  );
}

export function AuthStatus() {
  const { user, isInitialized } = useAuth();

  if (!isInitialized) {
    return <Loader2 className="w-4 h-4 animate-spin" />;
  }

  if (user.isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {user.walletType === "injected" && "Wallet"}
          {user.walletType === "walletconnect" && "WalletConnect"}
          {user.walletType === "privy" && "Email"}
        </span>
        {user.ensName && (
          <span className="text-sm font-medium">{user.ensName}</span>
        )}
        {user.address && (
          <span className="text-xs font-mono text-muted-foreground">
            {user.address.slice(0, 6)}...{user.address.slice(-4)}
          </span>
        )}
      </div>
    );
  }

  return <span className="text-sm text-muted-foreground">Not connected</span>;
}
