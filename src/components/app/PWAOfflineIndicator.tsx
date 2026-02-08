import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { WifiOff, Wifi } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const PWAOfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showIndicator, setShowIndicator] = useState(!navigator.onLine);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowIndicator(true);
      toast({
        title: "Conexão restaurada",
        description: "Você está online novamente!",
        variant: "default",
      });
      
      setTimeout(() => setShowIndicator(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowIndicator(true);
      toast({
        title: "Você está offline",
        description: "Alguns recursos podem estar limitados.",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  if (!showIndicator) return null;

  return (
    <div className="fixed top-2 right-2 z-50 animate-in fade-in slide-in-from-top-2">
      <Badge variant={isOnline ? "default" : "destructive"} className="gap-1.5 px-3 py-1.5">
        {isOnline ? (
          <>
            <Wifi className="h-3 w-3" />
            Online
          </>
        ) : (
          <>
            <WifiOff className="h-3 w-3" />
            Offline
          </>
        )}
      </Badge>
    </div>
  );
};
