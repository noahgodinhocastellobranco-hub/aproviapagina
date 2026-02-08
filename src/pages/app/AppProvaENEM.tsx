import { Trophy, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const provas = [
  { year: 2024, areas: ["Linguagens", "Ciências Humanas", "Ciências da Natureza", "Matemática", "Redação"] },
  { year: 2023, areas: ["Linguagens", "Ciências Humanas", "Ciências da Natureza", "Matemática", "Redação"] },
  { year: 2022, areas: ["Linguagens", "Ciências Humanas", "Ciências da Natureza", "Matemática", "Redação"] },
  { year: 2021, areas: ["Linguagens", "Ciências Humanas", "Ciências da Natureza", "Matemática", "Redação"] },
  { year: 2020, areas: ["Linguagens", "Ciências Humanas", "Ciências da Natureza", "Matemática", "Redação"] },
];

const AppProvaENEM = () => {
  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-amber-500" />
          </div>
          Provas ENEM
        </h1>
        <p className="text-muted-foreground">
          Acesse provas anteriores do ENEM organizadas por ano e área.
        </p>
      </div>

      <div className="space-y-4">
        {provas.map((prova) => (
          <Card key={prova.year} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-black text-foreground">ENEM {prova.year}</h3>
                <Button size="sm" variant="outline" className="gap-1" asChild>
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
              <div className="flex flex-wrap gap-2">
                {prova.areas.map((area) => (
                  <span key={area} className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-medium">
                    {area}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AppProvaENEM;
