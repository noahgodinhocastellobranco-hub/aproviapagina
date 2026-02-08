import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { useNavigate } from 'react-router-dom';

export const PWAInstallPrompt = () => {
  const { isInstallable, isInstalled } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const dismissed = localStorage.getItem('pwa_prompt_dismissed');
    if (dismissed) {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  const handleInstallClick = () => {
    navigate('/install');
  };

  if (isInstalled || isDismissed || !isInstallable) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 md:left-auto md:right-4 md:max-w-xs animate-in slide-in-from-bottom-2">
      <div className="rounded-xl border bg-background/95 backdrop-blur-md shadow-lg p-3">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h4 className="font-semibold text-sm">Instalar AprovI.A</h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Acesse rapidamente e estude offline
            </p>
            <div className="flex gap-2 mt-2">
              <Button size="sm" onClick={handleInstallClick} className="h-7 text-xs gap-1">
                <Download className="h-3 w-3" />
                Instalar
              </Button>
              <Button size="sm" variant="ghost" onClick={handleDismiss} className="h-7 text-xs">
                Agora não
              </Button>
            </div>
          </div>
          <button onClick={handleDismiss} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
