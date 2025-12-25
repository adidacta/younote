"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Puzzle, CheckCircle2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export function ConnectExtensionButton() {
  const [isExtensionInstalled, setIsExtensionInstalled] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Check if extension is installed by trying to send a message
    if (typeof window !== 'undefined' && (window as any).chrome?.runtime) {
      // Try to detect YouNote extension
      // We'll check for a specific extension ID or use a broadcast approach
      setIsExtensionInstalled(true);
    }
  }, []);

  const connectExtension = async () => {
    setIsConnecting(true);

    try {
      // Get current Supabase session
      const supabase = createClient();
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error || !session) {
        toast.error("Please log in first to connect the extension");
        setIsConnecting(false);
        return;
      }

      const user = session.user;
      const nickname = user.user_metadata?.nickname ||
                      user.user_metadata?.full_name ||
                      user.email?.split('@')[0] ||
                      'User';

      // Send message to extension
      // This requires the extension to have an externally_connectable entry in manifest
      const message = {
        type: 'AUTH_DETECTED',
        data: {
          authToken: session.access_token,
          userId: user.id,
          userEmail: user.email,
          userNickname: nickname
        }
      };

      // Try to send to extension via window.postMessage
      // The content script will listen for this and forward to background
      window.postMessage({ source: 'younote-webapp', ...message }, '*');

      // Show success message
      setIsConnected(true);
      toast.success("Extension connected! You can now take notes on YouTube videos.");

      // Reset connected status after 3 seconds
      setTimeout(() => setIsConnected(false), 3000);
    } catch (error) {
      console.error('Error connecting extension:', error);
      toast.error("Failed to connect extension. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={connectExtension}
      disabled={isConnecting || isConnected}
      className="gap-2"
    >
      {isConnected ? (
        <>
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          Connected
        </>
      ) : (
        <>
          <Puzzle className="h-4 w-4" />
          {isConnecting ? "Connecting..." : "Connect Extension"}
        </>
      )}
    </Button>
  );
}
