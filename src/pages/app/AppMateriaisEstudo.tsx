import { FolderDown, FileText, ExternalLink, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const materiais = [
  {
    title: "Fórmulas de Matemática",
    desc: "Todas as fórmulas essenciais para o ENEM",
    icon: "📐",
    type: "PDF",
  },
  {
    title: "Resumo de Biologia",
    desc: "Ecologia, genética e fisiologia resumidos",
    icon: "🧬",
    type: "PDF",
  },
  {
    title: "Mapa Mental - História",
    desc: "Brasil Colônia até República",
    icon: "📜",
    type: "Imagem",
  },
  {
    title: "Lista de Conectivos",
    desc: "Conectivos para usar na redação do ENEM",
    icon: "📝",
    type: "PDF",
  },
  {
    title: "Resumo de Física",
    desc: "Mecânica, termodinâmica e eletricidade",
    icon: "⚡",
    type: "PDF",
  },
  {
    title: "Tabela Periódica",
    desc: "Tabela periódica completa e comentada",
    icon: "🧪",
    type: "PDF",
  },
  {
    title: "Vocabulário de Inglês",
    desc: "Palavras mais cobradas no ENEM",
    icon: "🇺🇸",
    type: "PDF",
  },
  {
    title: "Repertório Sociocultural",
    desc: "Referências para usar na redação",
    icon: "💡",
    type: "PDF",
  },
];

const AppMateriaisEstudo = () => {
  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center">
            <FolderDown className="w-5 h-5 text-teal-500" />
          </div>
          Materiais de Estudo
        </h1>
        <p className="text-muted-foreground">
          Resumos, fórmulas e materiais de apoio para o ENEM.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {materiais.map((m) => (
          <Card key={m.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <span className="text-3xl">{m.icon}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-foreground">{m.title}</h3>
                <p className="text-xs text-muted-foreground">{m.desc}</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                {m.type}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-dashed">
        <CardContent className="p-6 text-center space-y-3">
          <BookOpen className="w-8 h-8 text-muted-foreground/30 mx-auto" />
          <p className="text-sm text-muted-foreground">
            Mais materiais sendo preparados! Em breve você poderá baixar tudo.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppMateriaisEstudo;
