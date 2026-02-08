import { Trophy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const provas = [
  { year: 2024 },
  { year: 2023 },
  { year: 2022 },
  { year: 2021 },
  { year: 2020 },
];

const AppProvaENEM = () => {
  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-3rem)] p-6">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <Trophy className="w-8 h-8 text-primary" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Provas ENEM</h1>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        Acesse provas anteriores do ENEM organizadas por ano.
      </p>

      <div className="space-y-3 max-w-md w-full">
        {provas.map((prova) => (
          <div key={prova.year} className="flex items-center justify-between rounded-xl border p-4">
            <span className="font-semibold">ENEM {prova.year}</span>
            <Button size="sm" variant="outline" className="gap-1.5" asChild>
              <a
                href="https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/provas-e-gabaritos"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="w-3 h-3" />
                Acessar
              </a>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppProvaENEM;
