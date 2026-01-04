import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Brain, ArrowRight, SkipForward, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const questions = [
  {
    id: "how_found_us",
    question: "Como nos conheceu?",
    options: [
      { value: "instagram", label: "Instagram" },
      { value: "tiktok", label: "TikTok" },
      { value: "amigos", label: "Indicação de amigos" },
      { value: "google", label: "Pesquisa no Google" },
      { value: "youtube", label: "YouTube" },
      { value: "outro", label: "Outro" },
    ],
  },
  {
    id: "objective",
    question: "Qual seu objetivo?",
    options: [
      { value: "medicina", label: "Passar em Medicina" },
      { value: "direito", label: "Passar em Direito" },
      { value: "engenharia", label: "Passar em Engenharia" },
      { value: "federal", label: "Entrar em universidade federal" },
      { value: "bolsa", label: "Conseguir bolsa (ProUni/FIES)" },
      { value: "melhorar_nota", label: "Melhorar minha nota" },
    ],
  },
  {
    id: "done_enem_before",
    question: "Já fez o ENEM antes?",
    options: [
      { value: "nunca", label: "Nunca fiz" },
      { value: "uma_vez", label: "Sim, uma vez" },
      { value: "duas_vezes", label: "Sim, duas vezes" },
      { value: "tres_ou_mais", label: "Sim, três vezes ou mais" },
    ],
  },
];

const Quiz = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser({ id: session.user.id, email: session.user.email || "" });

      // Check if user already completed quiz
      const { data: existingQuiz } = await supabase
        .from("quiz_responses")
        .select("id")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (existingQuiz) {
        navigate("/");
      }
    };

    checkUser();
  }, [navigate]);

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questions[currentStep].id]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      submitQuiz();
    }
  };

  const handleSkip = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      submitQuiz(true);
    }
  };

  const submitQuiz = async (skipped = false) => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("quiz_responses").insert({
        user_id: user.id,
        user_email: user.email,
        how_found_us: answers.how_found_us || null,
        objective: answers.objective || null,
        done_enem_before: answers.done_enem_before || null,
        skipped: skipped && Object.keys(answers).length === 0,
      });

      if (error) throw error;

      toast.success("Obrigado pelas respostas!");
      navigate("/");
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast.error("Erro ao salvar respostas");
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentStep];
  const currentAnswer = answers[currentQuestion?.id];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Brain className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Bem-vindo ao AprovI.A!</CardTitle>
          <CardDescription>
            Responda algumas perguntas rápidas para personalizarmos sua experiência
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Progress */}
          <div className="flex gap-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-2 rounded-full transition-colors ${
                  index <= currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Question */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {currentStep + 1}. {currentQuestion.question}
            </h3>

            <RadioGroup
              value={currentAnswer || ""}
              onValueChange={handleAnswer}
              className="space-y-3"
            >
              {currentQuestion.options.map((option) => (
                <div
                  key={option.value}
                  className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                    currentAnswer === option.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => handleAnswer(option.value)}
                >
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                    {option.label}
                  </Label>
                  {currentAnswer === option.value && (
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  )}
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="ghost"
              onClick={handleSkip}
              disabled={loading}
              className="flex-1"
            >
              <SkipForward className="w-4 h-4 mr-2" />
              Pular
            </Button>
            <Button
              onClick={handleNext}
              disabled={loading}
              className="flex-1"
            >
              {currentStep === questions.length - 1 ? "Finalizar" : "Próxima"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Quiz;
