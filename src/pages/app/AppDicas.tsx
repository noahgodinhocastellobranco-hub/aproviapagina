import { Lightbulb, Brain, PenTool, Clock, CheckCircle2, Target } from "lucide-react";

const dicas = [
  {
    title: "Redação nota 1000",
    icon: PenTool,
    tips: [
      "Sempre apresente uma proposta de intervenção detalhada",
      "Use conectivos variados para garantir coesão",
      "Cite pelo menos 2 referências externas",
      "Mantenha entre 25-30 linhas",
    ],
  },
  {
    title: "Gestão do Tempo",
    icon: Clock,
    tips: [
      "Comece pelas questões que você domina",
      "Reserve 1 hora para a redação",
      "Se travar, pule e volte depois",
      "Use os últimos 15 min para o gabarito",
    ],
  },
  {
    title: "Interpretação de Texto",
    icon: Brain,
    tips: [
      "Leia o enunciado antes do texto",
      "Grife palavras-chave",
      "Elimine alternativas absurdas",
      "A resposta está sempre no texto",
    ],
  },
  {
    title: "Matemática",
    icon: Target,
    tips: [
      "Domine regra de três e porcentagem",
      "Faça muitas questões de geometria",
      "Aprenda a interpretar gráficos",
      "Revise funções do 1º e 2º grau",
    ],
  },
  {
    title: "Ciências da Natureza",
    icon: Lightbulb,
    tips: [
      "Foque em ecologia e genética",
      "Priorize mecânica e eletricidade",
      "Domine estequiometria",
      "Relacione com o cotidiano",
    ],
  },
  {
    title: "Véspera da Prova",
    icon: CheckCircle2,
    tips: [
      "Não estude conteúdo novo",
      "Durma pelo menos 8 horas",
      "Prepare documentos e caneta",
      "Chegue 1 hora antes",
    ],
  },
];

const AppDicas = () => {
  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-3rem)] p-6">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <Lightbulb className="w-8 h-8 text-primary" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Dicas Estratégicas</h1>
      <p className="text-muted-foreground text-center max-w-md mb-8">
        Estratégias comprovadas para maximizar sua nota no ENEM.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 max-w-2xl w-full">
        {dicas.map((dica) => (
          <div key={dica.title} className="rounded-xl border p-4 space-y-3">
            <div className="flex items-center gap-2">
              <dica.icon className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-sm">{dica.title}</h3>
            </div>
            <ul className="space-y-1.5">
              {dica.tips.map((tip, i) => (
                <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                  <span className="text-primary shrink-0">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppDicas;
