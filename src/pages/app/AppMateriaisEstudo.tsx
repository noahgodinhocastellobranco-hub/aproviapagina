import { FolderDown, BookOpen } from "lucide-react";

const materiais = [
  { title: "Fórmulas de Matemática", desc: "Todas as fórmulas essenciais", icon: "📐" },
  { title: "Resumo de Biologia", desc: "Ecologia, genética e fisiologia", icon: "🧬" },
  { title: "Mapa Mental - História", desc: "Brasil Colônia até República", icon: "📜" },
  { title: "Lista de Conectivos", desc: "Conectivos para a redação", icon: "📝" },
  { title: "Resumo de Física", desc: "Mecânica, termodinâmica e eletricidade", icon: "⚡" },
  { title: "Tabela Periódica", desc: "Tabela completa e comentada", icon: "🧪" },
  { title: "Vocabulário de Inglês", desc: "Palavras mais cobradas", icon: "🇺🇸" },
  { title: "Repertório Sociocultural", desc: "Referências para a redação", icon: "💡" },
];

const AppMateriaisEstudo = () => {
  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-3rem)] p-6">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <FolderDown className="w-8 h-8 text-primary" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Materiais de Estudo</h1>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        Resumos, fórmulas e materiais de apoio para o ENEM.
      </p>

      <div className="grid gap-3 sm:grid-cols-2 max-w-lg w-full mb-6">
        {materiais.map((m) => (
          <div key={m.title} className="flex items-center gap-3 rounded-xl border p-3">
            <span className="text-2xl">{m.icon}</span>
            <div className="min-w-0">
              <h3 className="font-medium text-sm">{m.title}</h3>
              <p className="text-xs text-muted-foreground">{m.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center text-center text-muted-foreground">
        <BookOpen className="w-6 h-6 mb-2 opacity-30" />
        <p className="text-sm">Mais materiais em breve!</p>
      </div>
    </div>
  );
};

export default AppMateriaisEstudo;
