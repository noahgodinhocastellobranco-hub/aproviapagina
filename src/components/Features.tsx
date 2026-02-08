import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PenTool, MessageSquare, FileText, Brain, Target, TrendingUp, Zap, ArrowRight, CheckCircle2, Sparkles, BookOpen, GraduationCap, Timer, ClipboardList, Lightbulb, Video, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const features = [
  {
    icon: PenTool,
    title: "Redação",
    description: "Envie sua redação e receba nota + feedback detalhado nos 5 critérios do ENEM em segundos.",
    highlight: "+73.000 redações corrigidas",
    benefit: "Melhore sua nota em até 280 pontos",
    gradient: "from-primary/20 to-primary/5",
    iconColor: "text-primary",
    popular: true
  },
  {
    icon: MessageSquare,
    title: "Chat AprovI.A",
    description: "Tire dúvidas instantaneamente com nossa IA especializada no ENEM. Perguntou, respondeu.",
    highlight: "Respostas em 5 segundos",
    benefit: "Nunca mais fique travado em uma questão",
    gradient: "from-accent/20 to-accent/5",
    iconColor: "text-accent"
  },
  {
    icon: ClipboardList,
    title: "Simulados",
    description: "Faça provas anteriores do ENEM e simulados completos. Veja onde você erra e como melhorar.",
    highlight: "Todas as provas 2009-2025",
    benefit: "Conheça o estilo da prova na ponta da língua",
    gradient: "from-primary/20 to-primary/5",
    iconColor: "text-primary"
  },
  {
    icon: BookOpen,
    title: "Matérias",
    description: "Conteúdo organizado por matéria para você estudar de forma direcionada e eficiente.",
    highlight: "Todas as disciplinas do ENEM",
    benefit: "Estude de forma organizada",
    gradient: "from-accent/20 to-accent/5",
    iconColor: "text-accent"
  },
  {
    icon: FileText,
    title: "Materiais de Estudo",
    description: "Acesse resumos, mapas mentais e materiais exclusivos criados para o ENEM 2026.",
    highlight: "Conteúdo atualizado",
    benefit: "Tudo que você precisa em um só lugar",
    gradient: "from-primary/20 to-primary/5",
    iconColor: "text-primary"
  },
  {
    icon: GraduationCap,
    title: "Professora Virtual",
    description: "Uma professora com IA que te guia nos estudos, explica conceitos e tira suas dúvidas como um tutor.",
    highlight: "Disponível 24/7",
    benefit: "Como ter um professor particular",
    gradient: "from-accent/20 to-accent/5",
    iconColor: "text-accent"
  },
  {
    icon: Lightbulb,
    title: "Dicas",
    description: "Dicas estratégicas para o ENEM: como gerenciar tempo, técnicas de prova e macetes das questões.",
    highlight: "Estratégias comprovadas",
    benefit: "Ganhe pontos com inteligência",
    gradient: "from-primary/20 to-primary/5",
    iconColor: "text-primary"
  },
  {
    icon: Search,
    title: "Como Resolver Questão",
    description: "Aprenda passo a passo como resolver qualquer tipo de questão do ENEM com a ajuda da IA.",
    highlight: "Método passo a passo",
    benefit: "Domine qualquer tipo de questão",
    gradient: "from-accent/20 to-accent/5",
    iconColor: "text-accent"
  },
  {
    icon: Video,
    title: "Fazendo um Simulado",
    description: "Simulados guiados com cronômetro e análise completa do seu desempenho ao final.",
    highlight: "Experiência real de prova",
    benefit: "Prepare-se para o dia do ENEM",
    gradient: "from-primary/20 to-primary/5",
    iconColor: "text-primary"
  },
  {
    icon: Target,
    title: "Prova ENEM Exclusiva",
    description: "Provas exclusivas criadas por IA no estilo ENEM para você treinar com questões inéditas.",
    highlight: "Questões inéditas toda semana",
    benefit: "Treine com questões novas sempre",
    gradient: "from-accent/20 to-accent/5",
    iconColor: "text-accent"
  },
  {
    icon: Brain,
    title: "Consultar Curso",
    description: "Descubra quais cursos e faculdades você pode conquistar com sua nota do ENEM.",
    highlight: "Milhares de cursos disponíveis",
    benefit: "Encontre o curso dos seus sonhos",
    gradient: "from-primary/20 to-primary/5",
    iconColor: "text-primary"
  },
  {
    icon: Timer,
    title: "Pomodoro",
    description: "Técnica Pomodoro integrada para você estudar com foco e pausas estratégicas.",
    highlight: "Aumente sua produtividade",
    benefit: "Estude mais em menos tempo",
    gradient: "from-accent/20 to-accent/5",
    iconColor: "text-accent"
  },
  {
    icon: Target,
    title: "Plano de Estudos Personalizado",
    description: "A IA analisa seus pontos fracos e cria um cronograma feito especialmente para você.",
    highlight: "100% adaptado ao SEU nível",
    benefit: "Economize 3h de estudo por dia",
    gradient: "from-primary/20 to-primary/5",
    iconColor: "text-primary"
  },
  {
    icon: TrendingUp,
    title: "Acompanhe Sua Evolução",
    description: "Veja seus pontos subindo semana a semana com gráficos e métricas que mostram seu progresso real.",
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
            14 ferramentas poderosas para
            <span className="text-primary block mt-1">GARANTIR sua aprovação no ENEM 2026</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Enquanto outros estudam no escuro, você terá a <strong className="text-foreground">melhor tecnologia do Brasil</strong> ao seu lado.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-7xl mx-auto">
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
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg border border-white/50`}>
                    <Icon className={`h-7 w-7 ${feature.iconColor}`} />
                  </div>
                  <CardTitle className="text-lg font-bold">{feature.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-accent">
                    <Zap className="w-3.5 h-3.5" />
                    {feature.highlight}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-primary bg-primary/5 px-3 py-1.5 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
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