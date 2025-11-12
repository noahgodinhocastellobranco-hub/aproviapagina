import { Check } from "lucide-react";

const benefits = [
  "Correção automática baseada nos critérios oficiais do ENEM",
  "Respostas instantâneas para suas dúvidas",
  "Feedback personalizado e detalhado",
  "Plano de estudos adaptado ao seu ritmo",
  "Acesso a milhares de questões e simulados",
  "Acompanhamento do seu progresso em tempo real",
  "Dicas exclusivas de quem já passou",
  "Suporte completo para todas as áreas do conhecimento"
];

const Benefits = () => {
  return (
    <section className="py-20 md:py-32 bg-secondary/30">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Por que estudar com a <span className="text-primary">AprovI.A</span>?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Mais do que uma plataforma de estudos, somos seu parceiro na jornada até a aprovação. 
                Combine tecnologia de ponta com metodologias comprovadas.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-foreground">{benefit}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="bg-card rounded-xl p-6 shadow-lg border-l-4 border-primary">
                      <div className="text-sm text-muted-foreground mb-1">Nota em Redação</div>
                      <div className="text-3xl font-bold text-primary">920</div>
                      <div className="text-xs text-muted-foreground mt-2">↑ +180 pontos</div>
                    </div>
                    <div className="bg-card rounded-xl p-6 shadow-lg border-l-4 border-accent">
                      <div className="text-sm text-muted-foreground mb-1">Questões Resolvidas</div>
                      <div className="text-3xl font-bold text-accent">1.247</div>
                      <div className="text-xs text-muted-foreground mt-2">Este mês</div>
                    </div>
                  </div>
                  <div className="text-center p-4 bg-card/80 backdrop-blur rounded-xl">
                    <p className="text-sm font-medium">Seus resultados melhoram a cada dia</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
