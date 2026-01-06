import { Check, X, ArrowRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const withoutAprovIA = [
  "Estudar sem direção, perdendo tempo com conteúdo que não cai",
  "Esperar dias pela correção de redação do professor",
  "Dúvidas que ficam sem resposta até a próxima aula",
  "Não saber se está realmente evoluindo",
  "Ansiedade por não ter certeza se vai passar"
];

const withAprovIA = [
  "Plano de estudos personalizado focado no que realmente cai",
  "Correção de redação em 30 segundos com feedback detalhado",
  "Tire dúvidas 24/7 e receba explicações claras na hora",
  "Acompanhe sua evolução com gráficos e métricas reais",
  "Confiança de quem está preparado de verdade"
];

const testimonials = [
  {
    name: "Mariana S.",
    course: "Aprovada em Medicina - USP",
    text: "Minha nota em redação foi de 640 para 920 em 3 meses. A correção instantânea fez toda diferença!",
    avatar: "MS"
  },
  {
    name: "Lucas R.",
    course: "Aprovado em Engenharia - UNICAMP",
    text: "Consegui tirar minhas dúvidas de física às 2 da manhã. Foi como ter um professor particular 24h.",
    avatar: "LR"
  },
  {
    name: "Beatriz M.",
    course: "Aprovada em Direito - UFMG",
    text: "O plano de estudos personalizado me ajudou a focar no que eu realmente precisava. Resultado: 780 pontos!",
    avatar: "BM"
  }
];

const Benefits = () => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-background to-secondary/30">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full bg-destructive/10 text-destructive text-sm font-semibold mb-4">
              PARE DE SOFRER
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Sem AprovI.A <span className="text-destructive">vs</span> Com AprovI.A
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Veja a diferença de quem estuda do jeito certo
            </p>
          </div>

          {/* Comparison Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {/* Without AprovIA */}
            <div className="p-6 md:p-8 rounded-2xl border-2 border-destructive/20 bg-destructive/5">
              <h3 className="text-xl font-bold text-destructive mb-6 flex items-center gap-2">
                <X className="w-6 h-6" />
                Sem AprovI.A
              </h3>
              <div className="space-y-4">
                {withoutAprovIA.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center mt-0.5">
                      <X className="w-4 h-4 text-destructive" />
                    </div>
                    <p className="text-muted-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* With AprovIA */}
            <div className="p-6 md:p-8 rounded-2xl border-2 border-accent/30 bg-accent/5 relative">
              <div className="absolute -top-3 -right-3 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">
                RECOMENDADO
              </div>
              <h3 className="text-xl font-bold text-accent mb-6 flex items-center gap-2">
                <Check className="w-6 h-6" />
                Com AprovI.A
              </h3>
              <div className="space-y-4">
                {withAprovIA.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center mt-0.5">
                      <Check className="w-4 h-4 text-accent" />
                    </div>
                    <p className="text-foreground font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-8">
              O que dizem nossos <span className="text-primary">aprovados</span>
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="p-6 rounded-2xl bg-card border shadow-lg hover:shadow-xl transition-shadow">
                  <Quote className="w-8 h-8 text-primary/30 mb-4" />
                  <p className="text-foreground mb-4 leading-relaxed">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{testimonial.name}</div>
                      <div className="text-xs text-accent font-medium">{testimonial.course}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button size="lg" className="text-lg px-10 py-7 shadow-xl hover:shadow-2xl transition-all group" asChild>
              <Link to="/pricing">
                Quero Ser o Próximo Aprovado
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
