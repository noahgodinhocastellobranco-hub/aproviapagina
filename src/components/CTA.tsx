import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, CheckCircle2, Sparkles, AlertTriangle, Brain } from "lucide-react";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/85 -z-10" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10 -z-10" />
      
      {/* Animated blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -z-5 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/30 rounded-full blur-3xl -z-5 animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl -z-5" />
      
      <div className="container px-4 relative">
        <div className="max-w-4xl mx-auto text-center text-white space-y-6">
          
          {/* Urgency Banner */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
            <span className="text-sm md:text-base font-bold">⏰ ENEM 2025 está chegando — Comece sua preparação!</span>
          </div>
          
          {/* Main Headline */}
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight">
            Sua <span className="underline decoration-accent decoration-4 underline-offset-4">aprovação</span> começa aqui
          </h2>
          
          {/* Value Proposition */}
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Correção de redação instantânea, chat com IA para tirar dúvidas e plano de estudos personalizado. 
            Tudo o que você precisa para se preparar de verdade.
          </p>

          {/* Features Mini */}
          <div className="flex flex-wrap justify-center gap-4 py-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">Correção em segundos</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
              <Brain className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">IA especializada no ENEM</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">Disponível 24/7</span>
            </div>
          </div>

          {/* Main CTA Button */}
          <div className="pt-4">
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg md:text-xl px-12 md:px-16 py-8 md:py-10 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all group font-black"
              asChild
            >
              <Link to="/pricing">
                <Sparkles className="mr-2 h-6 w-6 group-hover:animate-pulse" />
                COMEÇAR AGORA
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <p className="text-white/70 text-sm mt-4">
              Veja os planos e escolha o melhor para você
            </p>
          </div>

          {/* Trust badges */}
          <div className="pt-8 space-y-4">
            <div className="flex flex-wrap justify-center gap-6 text-sm text-white/95 font-medium">
              <span className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-accent" />
                Garantia de 7 dias
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-accent" />
                Cancele a qualquer momento
              </span>
            </div>
            
            <p className="text-white/60 text-xs max-w-lg mx-auto">
              Se em 7 dias você não gostar, devolvemos 100% do seu dinheiro. 
              Sem perguntas, sem burocracia.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;