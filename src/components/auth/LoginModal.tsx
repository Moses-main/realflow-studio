import { usePrivy } from "@privy-io/react-auth";
import { useEffect } from "react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// This component now just triggers Privy's native login modal
export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login, authenticated, ready } = usePrivy();

  // Close when authenticated
  useEffect(() => {
    if (authenticated && isOpen) {
      onClose();
    }
  }, [authenticated, isOpen, onClose]);

  // Open Privy modal when isOpen changes to true
  useEffect(() => {
    if (isOpen && ready && !authenticated) {
      login();
      onClose();
    }
  }, [isOpen, ready, authenticated, login, onClose]);

  return null; // Privy handles the modal UI
}
