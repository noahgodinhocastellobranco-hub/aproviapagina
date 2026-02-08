import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const materias = [
  { name: "Matemática", emoji: "📐" },
  { name: "Português", emoji: "📝" },
  { name: "Biologia", emoji: "🧬" },
  { name: "Física", emoji: "⚡" },
  { name: "Química", emoji: "🧪" },
  { name: "História", emoji: "📜" },
  { name: "Geografia", emoji: "🌍" },
  { name: "Filosofia", emoji: "💭" },
  { name: "Sociologia", emoji: "👥" },
];

const AppMaterias = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3rem)] p-6">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <BookOpen className="w-8 h-8 text-primary" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Matérias</h1>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        Explore os principais conteúdos cobrados no ENEM por matéria.
      </p>

      <div className="grid gap-3 grid-cols-3 max-w-md w-full">
        {materias.map((m) => (
          <Link
            key={m.name}
            to="/app/chat"
            state={{ initialMessage: `Me dê uma aula sobre ${m.name} para o ENEM` }}
            className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-muted transition-colors"
          >
            <span className="text-3xl">{m.emoji}</span>
            <span className="text-sm font-medium text-foreground">{m.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AppMaterias;
