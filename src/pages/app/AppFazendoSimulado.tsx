import { useState } from "react";
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
      <div className="flex flex-col items-center min-h-[calc(100vh-3rem)] p-6">
        <div className="text-5xl font-black text-primary mb-2">{score}/{sampleQuestions.length}</div>
        <h2 className="text-xl font-bold mb-1">Resultado</h2>
        <p className="text-muted-foreground mb-6">
          Você acertou {Math.round((score / sampleQuestions.length) * 100)}%
        </p>
        <Button onClick={restart} className="mb-8">Refazer Simulado</Button>

        <div className="space-y-2 max-w-md w-full">
          {sampleQuestions.map((q, i) => (
            <div key={q.id} className={`flex items-start gap-3 rounded-xl border p-3 ${answers[i] === q.correct ? "border-green-500/30" : "border-red-500/30"}`}>
              {answers[i] === q.correct ? (
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              )}
              <div>
                <p className="text-sm">{q.question}</p>
                <p className="text-xs text-muted-foreground mt-1">Resposta: {q.options[q.correct]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-3rem)] p-6">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
        <ClipboardList className="w-8 h-8 text-primary" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Simulado Rápido</h1>
      <p className="text-muted-foreground mb-6">
        Questão {currentQ + 1} de {sampleQuestions.length}
      </p>

      {/* Progress */}
      <div className="w-full max-w-md bg-muted rounded-full h-1.5 mb-6">
        <div
          className="bg-primary h-1.5 rounded-full transition-all"
          style={{ width: `${((currentQ + 1) / sampleQuestions.length) * 100}%` }}
        />
      </div>

      <div className="max-w-md w-full space-y-4">
        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
          {question.area}
        </span>
        <p className="text-base font-medium">{question.question}</p>
        <div className="space-y-2">
          {question.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => selectAnswer(i)}
              className={`w-full text-left p-3 rounded-xl border text-sm transition-all ${
                selectedAnswer === i
                  ? "border-primary bg-primary/10 font-medium"
                  : "hover:bg-muted"
              }`}
            >
              <span className="font-mono text-xs mr-2 text-muted-foreground">{String.fromCharCode(65 + i)}</span>
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 mt-6">
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
          <Button onClick={finish} disabled={answers.some((a) => a === null)}>
            Finalizar
          </Button>
        )}
      </div>
    </div>
  );
};

export default AppFazendoSimulado;
