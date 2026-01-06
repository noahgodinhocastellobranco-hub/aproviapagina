import { Button } from "@/components/ui/button";
import { Brain, ArrowRight, Shield, Clock, Zap, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80 -z-10" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10 -z-10" />
      
      {/* Animated blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -z-5" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl -z-5" />
      
      <div className="container px-4 relative">
        <div className="max-w-4xl mx-auto text-center text-white space-y-6">
          
          {/* Urgency */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm animate-pulse">
            <Clock className="w-5 h-5" />
            <span className="text-sm font-semibold">Vagas limitadas — ENEM 2025 está chegando!</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Você tem <span className="underline decoration-accent decoration-4">duas escolhas</span> agora
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 text-left max-w-3xl mx-auto py-6">
            {/* Option 1 */}
            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">1</span>
                Fechar essa página
              </h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Continuar estudando sozinho, sem direção, esperando que "dê certo" no dia da prova...
              </p>
            </div>
            
            {/* Option 2 */}
            <div className="p-6 rounded-2xl bg-accent/20 backdrop-blur-sm border-2 border-accent">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-sm text-accent-foreground">2</span>
                Começar AGORA
              </h3>
              <p className="text-white text-sm leading-relaxed">
                Ter a melhor IA do Brasil te guiando até a aprovação com plano personalizado e correções instantâneas.
              </p>
            </div>
          </div>

          <div className="pt-4">
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg px-12 py-8 shadow-2xl hover:shadow-3xl hover:scale-105 transition-all group font-bold"
              asChild
            >
              <Link to="/pricing">
                <Zap className="mr-2 h-6 w-6 group-hover:animate-pulse" />
                QUERO GARANTIR MINHA VAGA
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          {/* Trust badges */}
          <div className="pt-8 space-y-4">
            <div className="flex flex-wrap justify-center gap-6 text-sm text-white/90">
              <span className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-accent" />
                Garantia de 7 dias
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-accent" />
                Cancele quando quiser
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-accent" />
                Suporte humanizado
              </span>
            </div>
            
            <p className="text-white/70 text-xs max-w-lg mx-auto">
              Se em 7 dias você não amar a AprovI.A, devolvemos 100% do seu dinheiro. Sem perguntas, sem burocracia.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
