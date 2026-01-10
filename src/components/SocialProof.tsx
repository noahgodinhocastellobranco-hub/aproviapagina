import { Zap, Brain, FileText, MessageCircle, Target, BookOpen } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Correção de Redação",
    description: "Envie sua redação e receba feedback detalhado em segundos, com nota estimada e sugestões de melhoria para cada competência do ENEM.",
    color: "text-primary"
  },
  {
    icon: Brain,
    title: "Chat Inteligente",
    description: "Tire suas dúvidas de qualquer matéria, 24 horas por dia. Nossa IA foi treinada especificamente para questões do ENEM.",
    color: "text-accent"
  },
  {
    icon: Target,
    title: "Plano de Estudos",
    description: "Receba um cronograma personalizado baseado nas suas dificuldades e no tempo disponível até a prova.",
    color: "text-primary"
  },
  {
    icon: MessageCircle,
    title: "Explicações Detalhadas",
    description: "Não entendeu algo? Peça para a IA explicar de outra forma, com exemplos e analogias até você compreender.",
    color: "text-accent"
  },
  {
    icon: Zap,
    title: "Respostas Instantâneas",
    description: "Sem esperar pelo professor ou pelo próximo dia de aula. Tire suas dúvidas no momento em que elas surgem.",
    color: "text-primary"
  },
  {
    icon: BookOpen,
    title: "Foco no que Importa",
    description: "Estude de forma inteligente, focando nos conteúdos que mais caem no ENEM e nas suas maiores dificuldades.",
    color: "text-accent"
  }
];

const SocialProof = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-muted/30 via-muted/50 to-muted/30 border-y relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container px-4 relative">
        <div className="max-w-6xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Brain className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold text-primary">O QUE VOCÊ VAI TER</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Tudo que você <span className="text-primary">precisa</span> em um só lugar
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ferramentas de inteligência artificial desenvolvidas especificamente para quem quer passar no ENEM
            </p>
          </div>
          
          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index} 
                  className="p-6 rounded-2xl bg-card border-2 border-transparent hover:border-primary/20 shadow-lg hover:shadow-xl transition-all group"
                >
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 shadow-sm mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;