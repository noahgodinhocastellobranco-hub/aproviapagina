import { Check, X, ArrowRight, Shield, Clock, Zap, TrendingDown, TrendingUp, AlertTriangle, CheckCircle2, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const withoutAprovIA = [
  { text: "Estudar sem direção, sem saber por onde começar", icon: TrendingDown },
  { text: "Esperar dias pela correção de redação do professor", icon: Clock },
  { text: "Dúvidas que ficam sem resposta até a próxima aula", icon: AlertTriangle },
  { text: "Não ter feedback sobre sua evolução real", icon: TrendingDown },
  { text: "Perder tempo com conteúdo que não cai na prova", icon: AlertTriangle }
];

const withAprovIA = [
  { text: "Plano de estudos personalizado para suas dificuldades", icon: CheckCircle2 },
  { text: "Correção de redação instantânea com feedback detalhado", icon: Zap },
  { text: "Tire dúvidas 24/7 com resposta em segundos", icon: CheckCircle2 },
  { text: "IA treinada especificamente para o ENEM", icon: Brain },
  { text: "Estude de qualquer lugar, no seu ritmo", icon: Shield }
];

const Benefits = () => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-background via-secondary/30 to-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-destructive/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container px-4 relative">
        <div className="max-w-6xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-primary">COMPARE</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              Por que <span className="text-primary">AprovI.A</span>?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Veja a diferença entre estudar do jeito tradicional e usar tecnologia a seu favor
            </p>
          </div>

          {/* Comparison Grid - Enhanced */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-20">
            {/* Without AprovIA */}
            <div className="p-6 md:p-8 rounded-3xl border-2 border-muted bg-gradient-to-br from-muted/50 to-muted/20 relative">
              <div className="absolute -top-3 left-6 bg-muted-foreground text-background text-xs font-bold px-4 py-1.5 rounded-full">
                MÉTODO TRADICIONAL
              </div>
              <h3 className="text-xl md:text-2xl font-black text-muted-foreground mb-6 flex items-center gap-3 mt-2">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <X className="w-6 h-6" />
                </div>
                Estudando Sozinho
              </h3>
              <div className="space-y-4">
                {withoutAprovIA.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 border border-muted">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* With AprovIA */}
            <div className="p-6 md:p-8 rounded-3xl border-2 border-accent/40 bg-gradient-to-br from-accent/15 to-accent/5 relative shadow-xl">
              <div className="absolute -top-3 left-6 bg-accent text-accent-foreground text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1">
                ✨ COM TECNOLOGIA
              </div>
              <h3 className="text-xl md:text-2xl font-black text-accent mb-6 flex items-center gap-3 mt-2">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                Com AprovI.A
              </h3>
              <div className="space-y-4">
                {withAprovIA.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-accent/10 border border-accent/20">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-accent" />
                      </div>
                      <p className="text-foreground font-medium leading-relaxed">{item.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center p-8 md:p-12 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 border-2 border-primary/20">
            <h3 className="text-2xl md:text-3xl font-black mb-4">
              Pronto para estudar de forma <span className="text-primary">mais inteligente</span>?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Comece agora e veja como a IA pode transformar sua preparação para o ENEM
            </p>
            <Button size="lg" className="text-lg px-12 py-8 shadow-xl hover:shadow-2xl transition-all group font-bold" asChild>
              <Link to="/pricing">
                Começar Agora
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </Button>
            <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1">
                <Shield className="w-4 h-4 text-accent" />
                7 dias de garantia
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                Cancele quando quiser
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;