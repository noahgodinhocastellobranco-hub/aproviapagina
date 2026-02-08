import { Lightbulb, Brain, PenTool, Clock, CheckCircle2, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const dicas = [
  {
    title: "Redação nota 1000",
    icon: PenTool,
    color: "text-green-500",
    tips: [
      "Sempre apresente uma proposta de intervenção detalhada com agente, ação, modo/meio, detalhamento e finalidade",
      "Use conectivos variados para garantir coesão entre parágrafos",
      "Cite pelo menos 2 referências externas (filósofos, dados, leis)",
      "Mantenha entre 25-30 linhas para uma redação completa",
    ],
  },
  {
    title: "Gestão do Tempo na Prova",
    icon: Clock,
    color: "text-blue-500",
    tips: [
      "Comece pelas questões que você domina — ganhe confiança",
      "Reserve 1 hora para a redação — não deixe para o final",
      "Se travar em uma questão, pule e volte depois",
      "Use os últimos 15 minutos para preencher o gabarito com calma",
    ],
  },
  {
    title: "Interpretação de Texto",
    icon: Brain,
    color: "text-purple-500",
    tips: [
      "Leia primeiro o enunciado e alternativas antes do texto",
      "Grife palavras-chave no texto e no enunciado",
      "Elimine alternativas absurdas antes de escolher",
      "A resposta está sempre no texto — evite opiniões pessoais",
    ],
  },
  {
    title: "Matemática sem Medo",
    icon: Target,
    color: "text-orange-500",
    tips: [
      "Domine regra de três, porcentagem e razão/proporção — caem sempre",
      "Faça muitas questões de geometria plana e espacial",
      "Aprenda a interpretar gráficos e tabelas — são questões fáceis",
      "Revise funções do 1º e 2º grau — aparecem muito",
    ],
  },
  {
    title: "Ciências da Natureza",
    icon: Lightbulb,
    color: "text-yellow-500",
    tips: [
      "Foque em ecologia, genética e fisiologia em Biologia",
      "Em Física, priorize mecânica, energia e eletricidade",
      "Em Química, domine estequiometria e química orgânica",
      "Relacione os conteúdos com questões do cotidiano",
    ],
  },
  {
    title: "Véspera da Prova",
    icon: CheckCircle2,
    color: "text-red-500",
    tips: [
      "Não estude conteúdo novo — apenas revise resumos",
      "Durma pelo menos 8 horas na noite anterior",
      "Prepare documentos, caneta preta e lanche com antecedência",
      "Chegue ao local da prova com 1 hora de antecedência",
    ],
  },
];

const AppDicas = () => {
  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
          </div>
          Dicas Estratégicas
        </h1>
        <p className="text-muted-foreground">
          Estratégias comprovadas para maximizar sua nota no ENEM.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {dicas.map((dica) => (
          <Card key={dica.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-lg">
                <dica.icon className={`w-5 h-5 ${dica.color}`} />
                {dica.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {dica.tips.map((tip, i) => (
                  <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AppDicas;
