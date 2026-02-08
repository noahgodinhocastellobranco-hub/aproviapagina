import { PenTool } from "lucide-react";

const AppRedacao = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center">
        <PenTool className="w-8 h-8 text-green-500" />
      </div>
      <h1 className="text-2xl font-bold">Redação</h1>
      <p className="text-muted-foreground max-w-md">
        Correção e prática de redação com feedback de IA. Em breve o conteúdo completo estará disponível aqui.
      </p>
    </div>
  );
};

export default AppRedacao;
