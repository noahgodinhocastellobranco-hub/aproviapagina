import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, mode } = await req.json();
    const apiKey = Deno.env.get("LOVABLE_API_KEY");

    if (!apiKey) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    const systemPrompts: Record<string, string> = {
      chat: `Você é a AprovI.A, uma assistente de estudos especializada no ENEM brasileiro. 
Responda sempre em português do Brasil de forma clara, didática e motivadora.
Use exemplos práticos, analogias e linguagem acessível para estudantes do ensino médio.
Quando relevante, mencione como o tema se relaciona com o ENEM.
Formate suas respostas com markdown quando apropriado (listas, negrito, etc).
Seja concisa mas completa.`,

      redacao: `Você é uma especialista em redação do ENEM. Sua função é:
1. Corrigir redações seguindo as 5 competências do ENEM
2. Dar nota de 0 a 200 para cada competência
3. Apontar pontos fortes e fracos
4. Sugerir melhorias específicas
5. Dar uma nota total estimada (0-1000)

As 5 competências são:
- C1: Domínio da modalidade escrita formal da língua portuguesa
- C2: Compreender a proposta de redação e aplicar conceitos de áreas de conhecimento
- C3: Selecionar, relacionar e organizar informações
- C4: Conhecimento dos mecanismos linguísticos necessários para a argumentação
- C5: Elaborar proposta de intervenção para o problema abordado

Formate a correção de forma organizada com markdown.`,

      professora: `Você é a Professora Virtual AprovI.A, especializada em preparação para o ENEM.
Você ensina de forma didática, paciente e motivadora.
Explique conceitos complexos de forma simples, use exemplos do dia a dia.
Quando o aluno perguntar sobre um tema, dê uma aula completa sobre ele.
Inclua exercícios práticos e dicas para o ENEM.
Organize suas aulas com tópicos, subtópicos e exemplos.
Use emojis moderadamente para tornar a aula mais dinâmica.`,

      questao: `Você é uma especialista em resolver questões do ENEM.
Quando o aluno enviar uma questão:
1. Leia e interprete a questão cuidadosamente
2. Identifique a área de conhecimento e habilidade cobrada
3. Explique o raciocínio passo a passo
4. Aponte a alternativa correta com justificativa
5. Dê dicas de como identificar questões similares
6. Se possível, mencione armadilhas comuns

Formate sua resolução de forma clara com markdown.`,
    };

    const systemMessage = systemPrompts[mode] || systemPrompts.chat;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: systemMessage },
            ...messages,
          ],
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("AI Gateway error:", error);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Desculpe, não consegui gerar uma resposta.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
