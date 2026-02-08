import { FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const simulados = [
  { year: "2024", title: "ENEM 2024" },
  { year: "2023", title: "ENEM 2023" },
  { year: "2022", title: "ENEM 2022" },
  { year: "2021", title: "ENEM 2021" },
  { year: "2020", title: "ENEM 2020" },
  { year: "2019", title: "ENEM 2019" },
];

const AppSimulados = () => {
  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-3rem)] p-6">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <FileText className="w-8 h-8 text-primary" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Simulados</h1>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        Pratique com provas anteriores do ENEM.
      </p>

      <div className="space-y-3 max-w-md w-full">
        {simulados.map((s) => (
          <div key={s.year} className="flex items-center justify-between rounded-xl border p-4">
            <span className="font-semibold">{s.title}</span>
            <Button size="sm" variant="outline" className="gap-1.5" asChild>
              <a
                href="https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-3 h-3" />
                Ver Prova
              </a>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppSimulados;
