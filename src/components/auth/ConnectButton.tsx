import { WalletAccountPanel } from "./WalletAccountPanel";

interface ConnectButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  showBalance?: boolean;
  showDropdown?: boolean;
}

// Wrapper that uses WalletAccountPanel for full functionality
export function ConnectButton({ 
  variant = "default", 
  size = "md", 
  showBalance = false,
  showDropdown = true 
}: ConnectButtonProps) {
  return <WalletAccountPanel />;
}
