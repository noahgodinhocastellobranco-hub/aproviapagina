import { FileText, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const simulados = [
  { year: "2024", title: "ENEM 2024", desc: "Prova mais recente", color: "border-blue-500/30 bg-blue-500/5" },
  { year: "2023", title: "ENEM 2023", desc: "Segundo ano digital", color: "border-green-500/30 bg-green-500/5" },
  { year: "2022", title: "ENEM 2022", desc: "Novo ENEM", color: "border-purple-500/30 bg-purple-500/5" },
  { year: "2021", title: "ENEM 2021", desc: "Modelo atualizado", color: "border-orange-500/30 bg-orange-500/5" },
  { year: "2020", title: "ENEM 2020", desc: "Edição pandemia", color: "border-red-500/30 bg-red-500/5" },
  { year: "2019", title: "ENEM 2019", desc: "Última pré-pandemia", color: "border-cyan-500/30 bg-cyan-500/5" },
];

const AppSimulados = () => {
  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-orange-500" />
          </div>
          Simulados
        </h1>
        <p className="text-muted-foreground">
          Pratique com provas anteriores do ENEM e treine para o dia da prova.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {simulados.map((s) => (
          <Card key={s.year} className={`border-2 ${s.color} hover:shadow-lg transition-all`}>
            <CardContent className="p-6 space-y-4 text-center">
              <div className="text-4xl font-black text-foreground">{s.year}</div>
              <div>
                <h3 className="font-bold text-foreground">{s.title}</h3>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
              <div className="flex flex-col gap-2">
                <Button size="sm" className="w-full gap-2" asChild>
                  <a href={`https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3 h-3" />
                    Ver Prova
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AppSimulados;
