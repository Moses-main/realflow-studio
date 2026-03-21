import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import { Wallet, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function EntryScreen() {
  const navigate = useNavigate();
  const { login, ready } = usePrivy();
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      await login();
      navigate('/canvas');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setConnecting(false);
    }
  };

  if (!ready) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="space-y-8">
        <div className="w-40 h-40 bg-[repeating-linear-gradient(#1e293b_0px,#1e293b_1px,transparent_1px,transparent_24px),repeating-linear-gradient(90deg,#1e293b_0px,#1e293b_1px,transparent_1px,transparent_24px)] bg-[size:24px_24px] opacity-5 rounded-xl p-4 flex items-center justify-center">
          <Wallet className="w-10 h-10 text-primary" />
        </div>
        
        <h1 className="text-3xl font-bold text-primary">
          Build RWA Marketplaces
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl">
          Connect your wallet to start creating your custom marketplace instantly.
        </p>
        
        <Button 
          variant="default" 
          className="w-full md:w-auto px-6 py-3 text-lg"
          onClick={handleConnect}
          disabled={!login}
        >
          {connecting ? (
            <>
              <Wallet className="w-4 h-4 mr-2" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="w-4 h-4 mr-2" />
              Connect Wallet & Start Building
            </>
          )}
        </Button>
        
        <div className="space-y-2 text-xs text-muted-foreground">
          <a href="https://app.excalidraw.com" target="_blank" rel="noopener noreferrer" className="underline">
            View Demo
          </a>
          <span> | </span>
          <a href="https://aleph.im" target="_blank" rel="noopener noreferrer" className="underline">
            Aleph 2026
          </a>
        </div>
      </div>
    </div>
  );
}