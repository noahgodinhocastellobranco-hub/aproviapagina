import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PenTool, Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AppRedacao = () => {
  const [text, setText] = useState("");
  const [theme, setTheme] = useState("");
  const [correction, setCorrection] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setIsLoading(true);
    setCorrection("");

    try {
      const prompt = theme
        ? `Tema da redação: "${theme}"\n\nRedação do aluno:\n${text}`
        : `Redação do aluno (tema não informado):\n${text}`;

      const { data, error } = await supabase.functions.invoke("ai-study", {
        body: {
          messages: [{ role: "user", content: prompt }],
          mode: "redacao",
        },
      });

      if (error) throw error;
      setCorrection(data.reply);
    } catch {
      setCorrection("Erro ao corrigir a redação. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (correction) {
    return (
      <div className="flex flex-col items-center min-h-[calc(100vh-3rem)] p-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <PenTool className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Correção</h1>
        <div className="rounded-xl border p-6 max-w-2xl w-full mb-4">
          <div className="text-sm text-muted-foreground whitespace-pre-wrap">{correction}</div>
        </div>
        <Button variant="outline" onClick={() => { setCorrection(""); setText(""); setTheme(""); }}>
          Nova Redação
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-3rem)] p-6">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <PenTool className="w-8 h-8 text-primary" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Correção de Redação</h1>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        Cole sua redação e receba correção baseada nas 5 competências do ENEM.
      </p>

      <div className="space-y-4 max-w-lg w-full">
        <input
          type="text"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder="Tema (opcional)"
          className="w-full px-3 py-2 rounded-xl border bg-background text-sm"
        />
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Cole ou escreva sua redação aqui..."
          className="min-h-[250px] resize-none rounded-xl"
        />
        <p className="text-xs text-muted-foreground text-center">
          {text.length} caracteres • ~{Math.round(text.split(/\s+/).filter(Boolean).length)} palavras
        </p>
        <Button
          onClick={handleSubmit}
          disabled={!text.trim() || isLoading}
          className="w-full gap-2"
          size="lg"
        >
          {isLoading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Corrigindo...</>
          ) : (
            <><Send className="w-4 h-4" /> Corrigir Redação</>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AppRedacao;
