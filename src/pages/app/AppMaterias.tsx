import { BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const materias = [
  { name: "Matemática", emoji: "📐", topics: ["Álgebra", "Geometria", "Probabilidade", "Estatística"], color: "bg-blue-500/10 border-blue-500/20" },
  { name: "Português", emoji: "📝", topics: ["Interpretação de Texto", "Gramática", "Literatura", "Figuras de Linguagem"], color: "bg-green-500/10 border-green-500/20" },
  { name: "Biologia", emoji: "🧬", topics: ["Ecologia", "Genética", "Citologia", "Fisiologia"], color: "bg-emerald-500/10 border-emerald-500/20" },
  { name: "Física", emoji: "⚡", topics: ["Mecânica", "Termodinâmica", "Óptica", "Eletricidade"], color: "bg-yellow-500/10 border-yellow-500/20" },
  { name: "Química", emoji: "🧪", topics: ["Química Orgânica", "Estequiometria", "Termoquímica", "Eletroquímica"], color: "bg-purple-500/10 border-purple-500/20" },
  { name: "História", emoji: "📜", topics: ["Brasil Colônia", "Era Vargas", "Guerra Fria", "Ditadura Militar"], color: "bg-orange-500/10 border-orange-500/20" },
  { name: "Geografia", emoji: "🌍", topics: ["Urbanização", "Clima", "Geopolítica", "Meio Ambiente"], color: "bg-cyan-500/10 border-cyan-500/20" },
  { name: "Filosofia", emoji: "💭", topics: ["Ética", "Política", "Existencialismo", "Iluminismo"], color: "bg-pink-500/10 border-pink-500/20" },
  { name: "Sociologia", emoji: "👥", topics: ["Desigualdade Social", "Cultura", "Movimentos Sociais", "Trabalho"], color: "bg-red-500/10 border-red-500/20" },
];

const AppMaterias = () => {
  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-cyan-500" />
          </div>
          Matérias
        </h1>
        <p className="text-muted-foreground">
          Explore os principais conteúdos cobrados no ENEM por matéria.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {materias.map((m) => (
          <Link key={m.name} to="/app/chat" state={{ initialMessage: `Me dê uma aula sobre ${m.name} para o ENEM` }}>
            <Card className={`h-full hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer border-2 ${m.color}`}>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{m.emoji}</span>
                  <h3 className="font-bold text-foreground text-lg">{m.name}</h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {m.topics.map((t) => (
                    <span key={t} className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                      {t}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AppMaterias;
