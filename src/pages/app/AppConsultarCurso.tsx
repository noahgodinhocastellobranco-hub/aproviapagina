import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
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
    <div className="flex flex-col items-center min-h-[calc(100vh-3rem)] p-6">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <Search className="w-8 h-8 text-primary" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Consultar Curso</h1>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        Descubra notas de corte, universidades e informações sobre qualquer curso.
      </p>

      <div className="flex gap-2 max-w-md w-full mb-6">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ex: Medicina, Engenharia Civil..."
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={!query.trim() || isLoading} size="icon">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </Button>
      </div>

      {result && (
        <div className="rounded-xl border p-6 max-w-lg w-full">
          <h3 className="font-bold text-lg mb-3">{query}</h3>
          <div className="text-sm text-muted-foreground whitespace-pre-wrap">{result}</div>
        </div>
      )}

      {!result && !isLoading && (
        <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 max-w-md w-full">
          {["Medicina", "Direito", "Engenharia Civil", "Psicologia", "Administração", "Ciência da Computação"].map((curso) => (
            <button
              key={curso}
              onClick={() => setQuery(curso)}
              className="p-3 rounded-xl border hover:bg-muted transition-colors text-sm font-medium text-left"
            >
              {curso}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppConsultarCurso;
