import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, GraduationCap, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AppConsultarCurso = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsLoading(true);
    setResult("");

    try {
      const { data, error } = await supabase.functions.invoke("ai-study", {
        body: {
          messages: [
            {
              role: "user",
              content: `Me dê informações detalhadas sobre o curso de "${query}" no SISU/ENEM. Inclua:
1. Nota de corte média (ampla concorrência e cotas)
2. Principais universidades públicas que oferecem
3. O que se estuda no curso
4. Áreas de atuação profissional
5. Salário médio inicial
6. Dicas de como se preparar para esse curso no ENEM

Se não tiver dados exatos, dê estimativas baseadas em anos anteriores.`,
            },
          ],
          mode: "chat",
        },
      });

      if (error) throw error;
      setResult(data.reply);
    } catch {
      setResult("Erro ao consultar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
            <Search className="w-5 h-5 text-indigo-500" />
          </div>
          Consultar Curso
        </h1>
        <p className="text-muted-foreground">
          Descubra notas de corte, universidades e informações sobre qualquer curso.
        </p>
      </div>

      <div className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ex: Medicina, Engenharia Civil, Direito..."
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={!query.trim() || isLoading} className="gap-2">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          Buscar
        </Button>
      </div>

      {result && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg">{query}</h3>
            </div>
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
              {result}
            </div>
          </CardContent>
        </Card>
      )}

      {!result && !isLoading && (
        <div className="grid gap-3 sm:grid-cols-2">
          {["Medicina", "Direito", "Engenharia Civil", "Psicologia", "Administração", "Ciência da Computação"].map((curso) => (
            <button
              key={curso}
              onClick={() => { setQuery(curso); }}
              className="p-4 rounded-xl border bg-card hover:bg-muted transition-colors text-left"
            >
              <span className="font-medium text-sm">{curso}</span>
              <p className="text-xs text-muted-foreground mt-1">Clique para consultar</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppConsultarCurso;
