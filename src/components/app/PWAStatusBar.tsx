import { Badge } from '@/components/ui/badge';
import { usePWALifecycle } from '@/hooks/usePWALifecycle';
import { Smartphone, Wifi, WifiOff, Download } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const PWAStatusBar = () => {
  const { isInstalled, isOnline, hasUpdate, appVersion } = usePWALifecycle();

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2 flex-wrap">
        {isInstalled && (
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="secondary" className="gap-1 text-[10px]">
                <Smartphone className="h-3 w-3" />
                Instalado
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>App instalado no dispositivo</p>
            </TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger>
            <Badge variant={isOnline ? "default" : "destructive"} className="gap-1 text-[10px]">
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
          </TooltipTrigger>
          <TooltipContent>
            <p>{isOnline ? 'Conectado à internet' : 'Modo offline ativo'}</p>
          </TooltipContent>
        </Tooltip>

        {hasUpdate && (
          <Tooltip>
            <TooltipTrigger>
              <Badge variant="outline" className="gap-1 text-[10px] border-orange-500 text-orange-500">
                <Download className="h-3 w-3" />
                Atualização
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Nova versão disponível</p>
            </TooltipContent>
          </Tooltip>
        )}

        <Tooltip>
          <TooltipTrigger>
            <Badge variant="outline" className="text-[10px]">
              v{appVersion}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Versão do aplicativo</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
