import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, Rocket, CheckCircle2, Sparkles, PartyPopper } from "lucide-react";
import confetti from "canvas-confetti";

const Success = () => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Disparar evento de conversão do Google Ads
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'conversion', {
        'send_to': 'AW-17852831911/PURCHASE',
        'value': 1.0,
        'currency': 'BRL'
      });
      console.log('✅ Conversão do Google Ads disparada');
    }

    // Disparar confetes
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    // Mostrar conteúdo com delay
    const timer = setTimeout(() => setShowContent(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
      </div>

      <div
        className={`w-full max-w-lg z-10 transition-all duration-700 ${
          showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <Card className="shadow-2xl border-0 bg-card/90 backdrop-blur-sm overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Parabéns! 🎉
            </h1>
            <p className="text-white/90 text-lg">
              Sua assinatura foi ativada com sucesso!
            </p>
          </div>

          <CardContent className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 text-primary">
                <Brain className="w-8 h-8" />
                <span className="text-2xl font-bold">AprovI.A</span>
                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded-full">
                  PRO
                </span>
              </div>
              <p className="text-muted-foreground">
                Agora você tem acesso completo a todas as ferramentas de estudo com IA!
              </p>
            </div>

            <div className="bg-muted/50 rounded-xl p-4 space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                O que você pode fazer agora:
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Gerar questões personalizadas com IA
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Criar resumos inteligentes de qualquer conteúdo
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Praticar redações com correção automática
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Tirar dúvidas em tempo real
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <Button size="lg" className="w-full gap-2 shadow-lg" asChild>
                <Link to="/app">
                  <Rocket className="w-5 h-5" />
                  Entrar no Aplicativo
                </Link>
              </Button>

              <Button variant="outline" size="lg" className="w-full gap-2" asChild>
                <Link to="/">
                  <PartyPopper className="w-5 h-5" />
                  Voltar para a Home
                </Link>
              </Button>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              Obrigado por escolher o AprovI.A. Bons estudos! 📚
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Success;
