import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, X, Smartphone } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';

export const PWAInstallBanner = () => {
  const { isInstallable, isInstalled, promptInstall } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('pwa_banner_dismissed');
    const dismissedTime = dismissed ? parseInt(dismissed) : 0;
    const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
    
    if (dismissedTime === 0 || daysSinceDismissed > 7) {
      setIsDismissed(false);
      setTimeout(() => setShowBanner(true), 5000);
    } else {
      setIsDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    setShowBanner(false);
    localStorage.setItem('pwa_banner_dismissed', Date.now().toString());
  };

  const handleInstall = async () => {
    const success = await promptInstall();
    if (success) {
      setShowBanner(false);
    }
  };

  if (isInstalled || isDismissed || !isInstallable || !showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-500 md:left-auto md:right-4 md:max-w-sm">
      <Card className="relative overflow-hidden border-primary/20 bg-background/95 backdrop-blur-md shadow-xl">
        <div className="p-4">
          <div className="flex gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Smartphone className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm">Instale o AprovI.A</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Tenha acesso instantâneo e estude mesmo offline!
              </p>
              <div className="mt-2">
                <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <span className="text-green-500">✓</span>
                    Acesso rápido
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-green-500">✓</span>
                    Funciona offline
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-green-500">✓</span>
                    Sem ocupar espaço
                  </span>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" onClick={handleInstall} className="h-8 text-xs gap-1.5">
                  <Download className="h-3.5 w-3.5" />
                  Instalar
                </Button>
                <Button size="sm" variant="ghost" onClick={handleDismiss} className="h-8 text-xs">
                  Não, obrigado
                </Button>
              </div>
            </div>
            <button onClick={handleDismiss} className="absolute top-2 right-2 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};
