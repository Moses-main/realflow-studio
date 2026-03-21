import { usePrivy, useLogin } from "@privy-io/react-auth";
import { useEffect, useRef } from "react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Opens Privy's native login modal directly
// Privy handles: email input, wallet selection, account selection
export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { authenticated } = usePrivy();
  const { login } = useLogin();
  const hasOpened = useRef(false);

  // Open Privy modal when isOpen changes to true
  useEffect(() => {
    if (isOpen && !authenticated && !hasOpened.current) {
      hasOpened.current = true;
      login();
    }
  }, [isOpen, authenticated, login]);

  // Reset ref when modal closes
  useEffect(() => {
    if (!isOpen) {
      hasOpened.current = false;
    }
  }, [isOpen]);

  // Close when authenticated
  useEffect(() => {
    if (authenticated) {
      onClose();
    }
  }, [authenticated, onClose]);

  // Privy handles all UI - we just return null
  return null;
}
