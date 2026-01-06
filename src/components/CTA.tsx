import { Button } from "@/components/ui/button";
import { Brain, ArrowRight, Shield, Clock, Zap, CheckCircle2, Sparkles, AlertTriangle, Users, Star } from "lucide-react";
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
            <span className="text-sm md:text-base font-bold">⏰ ENEM 2025 está chegando — Não deixe para depois!</span>
          </div>
          
          {/* Main Headline */}
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight">
            Você vai <span className="underline decoration-accent decoration-4 underline-offset-4">escolher</span> qual futuro?
          </h2>
          
          {/* Two Options Comparison */}
          <div className="grid md:grid-cols-2 gap-6 text-left max-w-3xl mx-auto py-6">
            {/* Option 1 - Bad choice */}
            <div className="p-6 md:p-8 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">1</span>
                <h3 className="font-bold text-lg">Fechar essa página</h3>
              </div>
              <p className="text-white/80 text-sm leading-relaxed mb-4">
                Continuar estudando sozinho, sem direção, rezando para "dar certo" no dia da prova...
              </p>
              <div className="text-xs text-white/60 italic">
                (A maioria faz isso e se arrepende)
              </div>
            </div>
            
            {/* Option 2 - Good choice */}
            <div className="p-6 md:p-8 rounded-2xl bg-accent/30 backdrop-blur-sm border-2 border-accent shadow-xl relative">
              <div className="absolute -top-3 right-4 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">
                ESCOLHA CERTA ✓
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-lg font-bold text-accent-foreground">2</span>
                <h3 className="font-bold text-lg">Começar AGORA</h3>
              </div>
              <p className="text-white text-sm leading-relaxed mb-4">
                Ter a <strong>melhor IA do Brasil</strong> te guiando até a aprovação com plano personalizado e correções instantâneas.
              </p>
              <div className="flex items-center gap-2 text-xs text-accent font-semibold">
                <Sparkles className="w-4 h-4" />
                12.547 já escolheram esse caminho
              </div>
            </div>
          </div>

          {/* Social Proof Mini */}
          <div className="flex items-center justify-center gap-2 py-2">
            <div className="flex -space-x-2">
              {['MS', 'LR', 'BM', 'JC', 'AP'].map((initials, i) => (
                <div 
                  key={i}
                  className="w-8 h-8 rounded-full bg-white/20 border-2 border-white flex items-center justify-center text-xs font-bold"
                >
                  {initials}
                </div>
              ))}
            </div>
            <span className="text-sm text-white/90 ml-2">
              <strong>+47 pessoas</strong> se inscreveram hoje
            </span>
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
                <Zap className="mr-2 h-6 w-6 group-hover:animate-pulse" />
                QUERO GARANTIR MINHA APROVAÇÃO
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <p className="text-white/70 text-sm mt-4">
              Clique e veja os planos. Sem compromisso.
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
              <span className="flex items-center gap-2">
                <Users className="w-5 h-5 text-accent" />
                Suporte humanizado
              </span>
            </div>
            
            {/* Rating */}
            <div className="flex items-center justify-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-white/80 text-sm">4.9/5 (2.847 avaliações)</span>
            </div>
            
            <p className="text-white/60 text-xs max-w-lg mx-auto">
              Se em 7 dias você não amar a AprovI.A, devolvemos 100% do seu dinheiro. 
              Sem perguntas, sem burocracia, sem enrolação.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;