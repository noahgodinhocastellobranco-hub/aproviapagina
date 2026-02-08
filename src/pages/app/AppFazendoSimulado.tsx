import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, CheckCircle2, XCircle, ArrowRight } from "lucide-react";

const sampleQuestions = [
  {
    id: 1,
    area: "Matemática",
    question: "Uma loja oferece 20% de desconto em um produto que custa R$ 150,00. Qual o valor final?",
    options: ["R$ 100,00", "R$ 110,00", "R$ 120,00", "R$ 130,00", "R$ 140,00"],
    correct: 2,
  },
  {
    id: 2,
    area: "Português",
    question: "Identifique a figura de linguagem: 'Seus olhos eram duas estrelas brilhantes.'",
    options: ["Metonímia", "Metáfora", "Hipérbole", "Ironia", "Eufemismo"],
    correct: 1,
  },
  {
    id: 3,
    area: "Biologia",
    question: "Qual organela celular é responsável pela produção de energia (ATP)?",
    options: ["Ribossomo", "Lisossomo", "Mitocôndria", "Complexo de Golgi", "Retículo Endoplasmático"],
    correct: 2,
  },
  {
    id: 4,
    area: "História",
    question: "A abolição da escravatura no Brasil ocorreu em que ano?",
    options: ["1822", "1850", "1871", "1888", "1891"],
    correct: 3,
  },
  {
    id: 5,
    area: "Geografia",
    question: "Qual bioma brasileiro é considerado o mais biodiverso do mundo?",
    options: ["Cerrado", "Caatinga", "Amazônia", "Mata Atlântica", "Pantanal"],
    correct: 2,
  },
];

const AppFazendoSimulado = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(sampleQuestions.length).fill(null));
  const [showResult, setShowResult] = useState(false);

  const question = sampleQuestions[currentQ];
  const selectedAnswer = answers[currentQ];

  const selectAnswer = (idx: number) => {
    if (showResult) return;
    const newAnswers = [...answers];
    newAnswers[currentQ] = idx;
    setAnswers(newAnswers);
  };

  const finish = () => setShowResult(true);
  const restart = () => {
    setCurrentQ(0);
    setAnswers(new Array(sampleQuestions.length).fill(null));
    setShowResult(false);
  };

  const score = answers.filter((a, i) => a === sampleQuestions[i].correct).length;

  if (showResult) {
    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6 text-center">
        <div className="space-y-4 py-8">
          <div className="text-6xl font-black text-primary">{score}/{sampleQuestions.length}</div>
          <h2 className="text-2xl font-bold">Resultado do Simulado</h2>
          <p className="text-muted-foreground">
            Você acertou {score} de {sampleQuestions.length} questões ({Math.round((score / sampleQuestions.length) * 100)}%)
          </p>
          <Button onClick={restart} size="lg" className="gap-2">
            Refazer Simulado
          </Button>
        </div>

        <div className="space-y-3 text-left">
          {sampleQuestions.map((q, i) => (
            <Card key={q.id} className={answers[i] === q.correct ? "border-green-500/30" : "border-red-500/30"}>
              <CardContent className="p-4 flex items-start gap-3">
                {answers[i] === q.correct ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="text-sm font-medium">{q.question}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Resposta correta: {q.options[q.correct]}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-primary" />
          Simulado Rápido
        </h1>
        <span className="text-sm text-muted-foreground font-medium">
          {currentQ + 1} / {sampleQuestions.length}
        </span>
      </div>

      {/* Progress */}
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-primary h-2 rounded-full transition-all"
          style={{ width: `${((currentQ + 1) / sampleQuestions.length) * 100}%` }}
        />
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
            {question.area}
          </span>
          <p className="text-lg font-medium">{question.question}</p>
          <div className="space-y-2">
            {question.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => selectAnswer(i)}
                className={`w-full text-left p-3 rounded-lg border text-sm transition-all ${
                  selectedAnswer === i
                    ? "border-primary bg-primary/10 font-medium"
                    : "border-border hover:bg-muted"
                }`}
              >
                <span className="font-mono text-xs mr-2 text-muted-foreground">{String.fromCharCode(65 + i)}</span>
                {opt}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
          disabled={currentQ === 0}
        >
          Anterior
        </Button>
        {currentQ < sampleQuestions.length - 1 ? (
          <Button onClick={() => setCurrentQ(currentQ + 1)} className="gap-1">
            Próxima <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button onClick={finish} className="gap-1" disabled={answers.some((a) => a === null)}>
            Finalizar
          </Button>
        )}
      </div>
    </div>
  );
};

export default AppFazendoSimulado;
