import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RefreshCw, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PWAUpdatePromptProps {
  onUpdate?: () => void;
}

export const PWAUpdatePrompt = ({ onUpdate }: PWAUpdatePromptProps) => {
  const [showUpdate, setShowUpdate] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setWaitingWorker(newWorker);
                setTimeout(() => {
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                  toast({
                    title: "Atualizando...",
                    description: "O app será atualizado automaticamente.",
                  });
                }, 3000);
              }
            });
          }
        });

        if (registration.waiting) {
          setWaitingWorker(registration.waiting);
          setTimeout(() => {
            registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
            toast({
              title: "Atualizando...",
              description: "O app será atualizado automaticamente.",
            });
          }, 3000);
        }
      });

      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  }, [toast]);

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      setShowUpdate(false);
      onUpdate?.();
    }
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="mx-4 max-w-sm w-full p-6 relative">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <RefreshCw className="h-6 w-6 text-primary" />
            <h3 className="font-bold text-lg">Nova versão disponível</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Atualize agora para ter acesso às últimas melhorias e correções.
          </p>
          <div className="flex gap-2">
            <Button onClick={handleUpdate} className="flex-1">
              Atualizar Agora
            </Button>
            <Button variant="outline" onClick={() => setShowUpdate(false)}>
              Depois
            </Button>
          </div>
        </div>
        <button
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
          onClick={() => setShowUpdate(false)}
        >
          <X className="h-4 w-4" />
        </button>
      </Card>
    </div>
  );
};
