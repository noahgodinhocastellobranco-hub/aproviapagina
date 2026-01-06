import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PenTool, MessageSquare, FileText, BookOpen, Brain, Target, Clock, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const features = [
  {
    icon: PenTool,
    title: "Correção de Redação em 30s",
    description: "Envie sua redação e receba nota + feedback detalhado nos 5 critérios do ENEM. Como ter um professor particular 24/7.",
    highlight: "Mais de 73.000 redações corrigidas",
    gradient: "from-primary/20 to-primary/5",
    iconColor: "text-primary"
  },
  {
    icon: MessageSquare,
    title: "Tire Dúvidas Instantaneamente",
    description: "Não entendeu a questão? Pergunte à IA. Ela explica passo a passo de um jeito que você realmente entende.",
    highlight: "Respostas em menos de 5 segundos",
    gradient: "from-accent/20 to-accent/5",
    iconColor: "text-accent"
  },
  {
    icon: Target,
    title: "Plano de Estudos Personalizado",
    description: "A IA analisa seus pontos fracos e cria um cronograma sob medida. Estude o que realmente importa.",
    highlight: "Adaptado ao SEU nível",
    gradient: "from-primary/20 to-primary/5",
    iconColor: "text-primary"
  },
  {
    icon: FileText,
    title: "Simulados com Análise Completa",
    description: "Faça provas anteriores do ENEM e simulados. Veja exatamente onde você está errando e como melhorar.",
    highlight: "Todas as provas de 2009 a 2024",
    gradient: "from-accent/20 to-accent/5",
    iconColor: "text-accent"
  },
  {
    icon: Brain,
    title: "IA Treinada para o ENEM",
    description: "Diferente do ChatGPT, nossa IA foi treinada especificamente para o ENEM brasileiro. Ela conhece os truques da prova.",
    highlight: "Tecnologia exclusiva",
    gradient: "from-primary/20 to-primary/5",
    iconColor: "text-primary"
  },
  {
    icon: TrendingUp,
    title: "Acompanhe Sua Evolução",
    description: "Veja seus pontos subindo semana a semana. Gráficos e métricas que mostram seu progresso real.",
    highlight: "+200 pontos em média",
    gradient: "from-accent/20 to-accent/5",
    iconColor: "text-accent"
  }
];

const Features = () => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-muted/30 to-background relative">
      <div className="container px-4">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            FUNCIONALIDADES
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Tudo que você precisa para
            <span className="text-primary block mt-1">GARANTIR sua aprovação</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Pare de perder tempo com métodos que não funcionam. A AprovI.A tem tudo integrado.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="border-2 hover:border-primary/50 transition-all hover:shadow-xl group relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                <CardHeader className="relative">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <Icon className={`h-7 w-7 ${feature.iconColor}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <div className="flex items-center gap-2 text-sm font-medium text-accent">
                    <Clock className="w-4 h-4" />
                    {feature.highlight}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" className="text-lg px-10 py-7 shadow-xl hover:shadow-2xl transition-all" asChild>
            <Link to="/pricing">
              Quero Todas Essas Funcionalidades →
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Features;
