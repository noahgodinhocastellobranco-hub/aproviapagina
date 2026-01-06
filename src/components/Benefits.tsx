import { Check, X, ArrowRight, Quote, Star, Shield, Clock, Zap, TrendingDown, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const withoutAprovIA = [
  { text: "Estudar sem direção, perdendo tempo com conteúdo que não cai", icon: TrendingDown },
  { text: "Esperar DIAS pela correção de redação do professor", icon: Clock },
  { text: "Dúvidas que ficam sem resposta até a próxima aula", icon: AlertTriangle },
  { text: "Não saber se está realmente evoluindo ou só enganando a si mesmo", icon: TrendingDown },
  { text: "Ansiedade paralisante por não ter certeza se vai passar", icon: AlertTriangle }
];

const withAprovIA = [
  { text: "Plano de estudos personalizado focado NO QUE CAI", icon: CheckCircle2 },
  { text: "Correção de redação em 30 SEGUNDOS com feedback detalhado", icon: Zap },
  { text: "Tire dúvidas 24/7 — resposta em menos de 5 segundos", icon: CheckCircle2 },
  { text: "Acompanhe sua evolução com gráficos e métricas REAIS", icon: TrendingUp },
  { text: "Confiança inabalável de quem está PREPARADO de verdade", icon: Shield }
];

const testimonials = [
  {
    name: "Mariana Silva",
    course: "Aprovada em Medicina",
    university: "USP",
    text: "Minha nota em redação foi de 640 para 920 em apenas 3 meses. A correção instantânea mudou tudo! Finalmente entendi onde eu estava errando.",
    avatar: "MS",
    score: "+280 pontos",
    photo: true
  },
  {
    name: "Lucas Rodrigues",
    course: "Aprovado em Engenharia",
    university: "UNICAMP",
    text: "Consegui tirar minhas dúvidas de física às 2 da manhã na véspera do ENEM. Foi literalmente como ter um professor particular 24 horas.",
    avatar: "LR",
    score: "+195 pontos",
    photo: true
  },
  {
    name: "Beatriz Mendes",
    course: "Aprovada em Direito",
    university: "UFMG",
    text: "O plano de estudos personalizado me ajudou a focar no que eu realmente precisava. Parei de perder tempo. Resultado: 780 pontos gerais!",
    avatar: "BM",
    score: "+210 pontos",
    photo: true
  }
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/20 mb-4">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <span className="text-sm font-bold text-destructive">A VERDADE DURA</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              Você tem <span className="text-destructive">duas opções</span> agora
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Continue lutando sozinho... ou use a tecnologia a seu favor
            </p>
          </div>

          {/* Comparison Grid - Enhanced */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-20">
            {/* Without AprovIA */}
            <div className="p-6 md:p-8 rounded-3xl border-2 border-destructive/30 bg-gradient-to-br from-destructive/10 to-destructive/5 relative">
              <div className="absolute -top-3 left-6 bg-destructive text-destructive-foreground text-xs font-bold px-4 py-1.5 rounded-full">
                😰 CENÁRIO ATUAL
              </div>
              <h3 className="text-xl md:text-2xl font-black text-destructive mb-6 flex items-center gap-3 mt-2">
                <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                  <X className="w-6 h-6" />
                </div>
                Sem AprovI.A
              </h3>
              <div className="space-y-4">
                {withoutAprovIA.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-destructive" />
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
                ✨ RECOMENDADO
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

          {/* Testimonials - Enhanced */}
          <div className="mb-14">
            <div className="text-center mb-10">
              <h3 className="text-2xl md:text-4xl font-black mb-3">
                Eles escolheram o <span className="text-accent">caminho certo</span>
              </h3>
              <p className="text-muted-foreground">
                E foram <span className="font-bold text-foreground">aprovados</span>. Veja o que eles dizem:
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className="p-6 rounded-2xl bg-card border-2 shadow-lg hover:shadow-xl hover:border-primary/30 transition-all group"
                >
                  {/* Score badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-1 rounded-full">
                      {testimonial.score}
                    </span>
                  </div>
                  
                  <Quote className="w-8 h-8 text-primary/20 mb-3" />
                  <p className="text-foreground mb-5 leading-relaxed">"{testimonial.text}"</p>
                  
                  <div className="flex items-center gap-3 pt-4 border-t">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-primary font-bold shadow-inner">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-bold">{testimonial.name}</div>
                      <div className="text-sm text-accent font-semibold">{testimonial.course}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.university}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center p-8 md:p-12 rounded-3xl bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10 border-2 border-primary/20">
            <h3 className="text-2xl md:text-3xl font-black mb-4">
              Pronto para ser o <span className="text-primary">próximo aprovado</span>?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Junte-se aos 12.547 estudantes que já estão usando a AprovI.A para garantir sua vaga
            </p>
            <Button size="lg" className="text-lg px-12 py-8 shadow-xl hover:shadow-2xl transition-all group font-bold" asChild>
              <Link to="/pricing">
                Quero Ser Aprovado Também
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