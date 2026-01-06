import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PenTool, MessageSquare, FileText, Brain, Target, TrendingUp, Zap, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const features = [
  {
    icon: PenTool,
    title: "Correção de Redação em 30s",
    description: "Envie sua redação e receba nota + feedback detalhado nos 5 critérios do ENEM. É como ter um professor corrigindo 24/7.",
    highlight: "+73.000 redações corrigidas",
    benefit: "Melhore sua nota em até 280 pontos",
    gradient: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
    popular: true
  },
  {
    icon: MessageSquare,
    title: "Tire Dúvidas Instantaneamente",
    description: "Perguntou, respondeu. A IA explica qualquer questão de qualquer matéria de um jeito que você realmente entende.",
    highlight: "Respostas em 5 segundos",
    benefit: "Nunca mais fique travado em uma questão",
    gradient: "from-accent/20 to-accent/5",
    iconColor: "text-accent"
  },
  {
    icon: Target,
    title: "Plano de Estudos Personalizado",
    description: "A IA analisa seus pontos fracos e cria um cronograma feito especialmente para você. Estude o que realmente importa.",
    highlight: "100% adaptado ao SEU nível",
    benefit: "Economize 3h de estudo por dia",
    gradient: "from-primary/20 to-primary/5",
    iconColor: "text-primary"
  },
  {
    icon: FileText,
    title: "Simulados com Análise Completa",
    description: "Faça provas anteriores do ENEM e simulados. Veja exatamente onde você erra e receba dicas de como melhorar.",
    highlight: "Todas as provas 2009-2024",
    benefit: "Conheça o estilo da prova na ponta da língua",
    gradient: "from-accent/20 to-accent/5",
    iconColor: "text-accent"
  },
  {
    icon: Brain,
    title: "IA Treinada para o ENEM",
    description: "Não é ChatGPT. Nossa IA foi especificamente treinada no ENEM brasileiro. Ela conhece os truques e padrões da prova.",
    highlight: "Tecnologia exclusiva AprovI.A",
    benefit: "Aprenda as pegadinhas antes da prova",
    gradient: "from-primary/20 to-primary/5",
    iconColor: "text-primary"
  },
  {
    icon: TrendingUp,
    title: "Acompanhe Sua Evolução",
    description: "Veja seus pontos subindo semana a semana com gráficos e métricas que mostram seu progresso real e motivam você.",
    highlight: "+200 pontos em média",
    benefit: "Saiba exatamente onde você está",
    gradient: "from-accent/20 to-accent/5",
    iconColor: "text-accent"
  }
];

const Features = () => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-background via-muted/20 to-background relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-y-1/2" />
      
      <div className="container px-4 relative">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-primary">TUDO QUE VOCÊ PRECISA</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-4">
            6 ferramentas poderosas para
            <span className="text-primary block mt-1">GARANTIR sua aprovação</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Enquanto outros estudam no escuro, você terá a <strong className="text-foreground">melhor tecnologia do Brasil</strong> ao seu lado.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className={`border-2 hover:border-primary/50 transition-all hover:shadow-2xl group relative overflow-hidden ${feature.popular ? 'ring-2 ring-accent ring-offset-2' : ''}`}
              >
                {feature.popular && (
                  <div className="absolute top-4 right-4 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-full">
                    MAIS USADO
                  </div>
                )}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <CardHeader className="relative pb-2">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg border border-white/50`}>
                    <Icon className={`h-8 w-8 ${feature.iconColor}`} />
                  </div>
                  <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-accent">
                    <Zap className="w-4 h-4" />
                    {feature.highlight}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-primary bg-primary/5 px-3 py-2 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                    {feature.benefit}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-14">
          <p className="text-muted-foreground mb-6">
            Tudo isso por menos de <span className="line-through">R$5</span> <strong className="text-foreground">R$2,50 por dia</strong>
          </p>
          <Button size="lg" className="text-lg px-12 py-8 shadow-xl hover:shadow-2xl transition-all group font-bold" asChild>
            <Link to="/pricing">
              <Sparkles className="mr-2 w-5 h-5 group-hover:animate-spin" />
              Quero Todas Essas Ferramentas
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Features;