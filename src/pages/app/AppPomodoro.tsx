import { Timer } from "lucide-react";

const AppPomodoro = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center">
        <Timer className="w-8 h-8 text-red-500" />
      </div>
      <h1 className="text-2xl font-bold">Pomodoro</h1>
      <p className="text-muted-foreground max-w-md">
        Timer de estudos com técnica Pomodoro. Em breve o conteúdo completo estará disponível aqui.
      </p>
    </div>
  );
};

export default AppPomodoro;
