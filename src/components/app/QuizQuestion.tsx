import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Questao } from "@/data/materiaisEstudo";
import FormattedText from "@/components/app/FormattedText";

interface QuizQuestionProps {
  questao: Questao;
  numero: number;
}

export default function QuizQuestion({ questao, numero }: QuizQuestionProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
  };

  const isCorrect = selected === questao.correta;
  const answered = selected !== null;

  return (
    <div className="space-y-4">
      <p className="text-sm leading-relaxed">
        <span className="font-semibold">Questão {numero}.</span>{" "}
        {questao.enunciado}
      </p>

      <div className="space-y-2">
        {questao.opcoes.map((opcao, i) => {
          const letter = String.fromCharCode(65 + i);
          const isThis = selected === i;
          const isRight = i === questao.correta;

          let optionClass =
            "flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all text-sm";

          if (!answered) {
            optionClass += " border-border hover:border-primary/50 hover:bg-primary/5";
          } else if (isRight) {
            optionClass += " border-green-500 bg-green-500/10 text-green-700 dark:text-green-400";
          } else if (isThis && !isRight) {
            optionClass += " border-red-500 bg-red-500/10 text-red-700 dark:text-red-400";
          } else {
            optionClass += " border-border opacity-50";
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={answered}
              className={cn(optionClass, "w-full text-left")}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-medium text-xs">
                {answered && isRight ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : answered && isThis && !isRight ? (
                  <XCircle className="h-4 w-4 text-red-500" />
                ) : (
                  letter
                )}
              </span>
              {opcao}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="rounded-lg border p-3 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-sm">
            {isCorrect ? (
              <>
                <CheckCircle className="h-4 w-4 text-green-500" /> Correto!
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4 text-red-500" /> Incorreto
              </>
            )}
          </div>
          <FormattedText text={questao.explicacao} className="text-sm text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
