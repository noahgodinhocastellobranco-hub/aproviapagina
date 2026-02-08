import { MessageCircle, PenTool, FileText, BookOpen, Lightbulb, GraduationCap, Timer, Calendar, Search, Trophy, HelpCircle, ClipboardList, FolderDown } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  { title: "Chat AprovI.A", icon: MessageCircle, url: "/app/chat" },
  { title: "Redação", icon: PenTool, url: "/app/redacao" },
  { title: "Professora Virtual", icon: GraduationCap, url: "/app/professora-virtual" },
  { title: "Matérias", icon: BookOpen, url: "/app/materias" },
  { title: "Rotina de Estudos", icon: Calendar, url: "/app/rotina" },
  { title: "Dicas", icon: Lightbulb, url: "/app/dicas" },
  { title: "Materiais de Estudo", icon: FolderDown, url: "/app/materiais-estudo" },
  { title: "Pomodoro", icon: Timer, url: "/app/pomodoro" },
  { title: "Simulados", icon: FileText, url: "/app/simulados" },
  { title: "Resolver Questão", icon: HelpCircle, url: "/app/como-resolver-questao" },
  { title: "Fazer Simulado", icon: ClipboardList, url: "/app/fazendo-simulado" },
  { title: "Prova ENEM", icon: Trophy, url: "/app/prova-enem" },
  { title: "Consultar Curso", icon: Search, url: "/app/consultar-curso" },
];

const AppHome = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3rem)] p-6">
      <div className="text-center space-y-4 mb-10">
        <h1 className="text-2xl md:text-3xl font-bold">Olá, Estudante! 👋</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Escolha uma ferramenta para começar seus estudos.
        </p>
      </div>

      <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 max-w-2xl w-full">
        {features.map((feature) => (
          <Link
            key={feature.url}
            to={feature.url}
            className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-muted transition-colors text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
              <feature.icon className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm font-medium text-foreground">{feature.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AppHome;
