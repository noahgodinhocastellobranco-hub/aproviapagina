import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PenTool, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
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
    } catch (error) {
      console.error("Erro:", error);
      setCorrection("Erro ao corrigir a redação. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
            <PenTool className="w-5 h-5 text-green-500" />
          </div>
          Correção de Redação
        </h1>
        <p className="text-muted-foreground">
          Cole sua redação abaixo e receba uma correção completa baseada nas 5 competências do ENEM.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Tema (opcional)</label>
            <input
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="Ex: O impacto das redes sociais na saúde mental"
              className="w-full px-3 py-2 rounded-md border bg-background text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Sua Redação</label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Cole ou escreva sua redação aqui..."
              className="min-h-[300px] resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {text.length} caracteres • ~{Math.round(text.split(/\s+/).filter(Boolean).length)} palavras
            </p>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!text.trim() || isLoading}
            className="w-full gap-2"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Corrigindo...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Corrigir Redação
              </>
            )}
          </Button>
        </div>

        {/* Result */}
        <div>
          {correction ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  Correção
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                  {correction}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center min-h-[300px] text-center space-y-3">
                <AlertCircle className="w-10 h-10 text-muted-foreground/30" />
                <p className="text-muted-foreground text-sm">
                  Sua correção aparecerá aqui após enviar a redação
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppRedacao;
