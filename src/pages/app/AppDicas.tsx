import { Lightbulb } from "lucide-react";

const AppDicas = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 flex items-center justify-center">
        <Lightbulb className="w-8 h-8 text-yellow-500" />
      </div>
      <h1 className="text-2xl font-bold">Dicas Estratégicas</h1>
      <p className="text-muted-foreground max-w-md">
        Estratégias para maximizar sua nota no ENEM. Em breve o conteúdo completo estará disponível aqui.
      </p>
    </div>
  );
};

export default AppDicas;
