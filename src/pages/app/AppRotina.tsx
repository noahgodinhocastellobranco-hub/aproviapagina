import { Calendar } from "lucide-react";

const AppRotina = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-pink-500/10 flex items-center justify-center">
        <Calendar className="w-8 h-8 text-pink-500" />
      </div>
      <h1 className="text-2xl font-bold">Rotina de Estudos</h1>
      <p className="text-muted-foreground max-w-md">
        Monte seu cronograma personalizado. Em breve o conteúdo completo estará disponível aqui.
      </p>
    </div>
  );
};

export default AppRotina;
