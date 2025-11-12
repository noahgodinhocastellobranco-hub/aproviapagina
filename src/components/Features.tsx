import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PenTool, MessageSquare, FileText, BookOpen, Lightbulb, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: PenTool,
    title: "Correção de Redação",
    description: "Receba nota e feedback detalhado baseado nos 5 critérios do ENEM",
    cta: "Praticar Agora",
    gradient: "from-blue-500/10 to-blue-600/10",
    iconColor: "text-blue-600"
  },
  {
    icon: MessageSquare,
    title: "Chat Inteligente",
    description: "Tire dúvidas sobre qualquer matéria com nossa IA especializada em ENEM",
    cta: "Conversar Agora",
    gradient: "from-purple-500/10 to-purple-600/10",
    iconColor: "text-purple-600"
  },
  {
    icon: FileText,
    title: "Simulados Oficiais",
    description: "Acesse provas anteriores do ENEM e simulados de cursos renomados",
    cta: "Ver Simulados",
    gradient: "from-cyan-500/10 to-cyan-600/10",
    iconColor: "text-cyan-600"
  },
  {
    icon: BookOpen,
    title: "Matérias do ENEM",
    description: "Estude os conteúdos que mais caem organizados por área de conhecimento",
    cta: "Explorar Matérias",
    gradient: "from-green-500/10 to-green-600/10",
    iconColor: "text-green-600"
  },
  {
    icon: Lightbulb,
    title: "Dicas Estratégicas",
    description: "Aprenda técnicas e estratégias para maximizar sua nota no ENEM",
    cta: "Ver Dicas",
    gradient: "from-yellow-500/10 to-yellow-600/10",
    iconColor: "text-yellow-600"
  },
  {
    icon: Sparkles,
    title: "Powered by IA",
    description: "Tecnologia de ponta para acelerar seus estudos e melhorar resultados",
    cta: "Saiba Mais",
    gradient: "from-pink-500/10 to-pink-600/10",
    iconColor: "text-pink-600"
  }
];

const Features = () => {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-background to-muted/30">
      <div className="container px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Tudo que você precisa para <span className="text-primary">conquistar sua aprovação</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Uma plataforma completa de estudos com inteligência artificial
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="border-2 hover:border-primary/50 transition-all hover:shadow-lg group"
              >
                <CardHeader>
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`h-7 w-7 ${feature.iconColor}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full group-hover:bg-primary/5">
                    {feature.cta} →
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
