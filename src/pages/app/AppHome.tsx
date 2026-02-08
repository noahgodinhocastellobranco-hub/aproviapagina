import { Brain, MessageCircle, PenTool, FileText, BookOpen, Lightbulb, GraduationCap, Timer, Calendar, Search, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const features = [
  { title: "Chat AprovI.A", description: "Tire dúvidas com IA especializada no ENEM", icon: MessageCircle, url: "/app/chat", color: "bg-blue-500/10 text-blue-500" },
  { title: "Redação", description: "Correção e prática de redação com feedback IA", icon: PenTool, url: "/app/redacao", color: "bg-green-500/10 text-green-500" },
  { title: "Professora Virtual", description: "Aulas personalizadas com inteligência artificial", icon: GraduationCap, url: "/app/professora-virtual", color: "bg-purple-500/10 text-purple-500" },
  { title: "Simulados", description: "Pratique com simulados completos do ENEM", icon: FileText, url: "/app/simulados", color: "bg-orange-500/10 text-orange-500" },
  { title: "Matérias", description: "Conteúdos organizados por matéria", icon: BookOpen, url: "/app/materias", color: "bg-cyan-500/10 text-cyan-500" },
  { title: "Rotina de Estudos", description: "Monte seu cronograma personalizado", icon: Calendar, url: "/app/rotina", color: "bg-pink-500/10 text-pink-500" },
  { title: "Dicas", description: "Estratégias para maximizar sua nota", icon: Lightbulb, url: "/app/dicas", color: "bg-yellow-500/10 text-yellow-500" },
  { title: "Pomodoro", description: "Timer de estudos com técnica Pomodoro", icon: Timer, url: "/app/pomodoro", color: "bg-red-500/10 text-red-500" },
  { title: "Prova ENEM", description: "Provas anteriores do ENEM", icon: Trophy, url: "/app/prova-enem", color: "bg-amber-500/10 text-amber-500" },
  { title: "Consultar Curso", description: "Encontre cursos e notas de corte", icon: Search, url: "/app/consultar-curso", color: "bg-indigo-500/10 text-indigo-500" },
];

const AppHome = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10">
          <Brain className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">Olá, Estudante! 👋</h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Escolha uma ferramenta para começar seus estudos com IA
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Link key={feature.url} to={feature.url}>
            <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer border-border/50">
              <CardContent className="p-6 space-y-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${feature.color}`}>
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AppHome;
