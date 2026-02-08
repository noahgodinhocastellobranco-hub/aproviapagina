import { FileText } from "lucide-react";

const AppSimulados = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center">
        <FileText className="w-8 h-8 text-orange-500" />
      </div>
      <h1 className="text-2xl font-bold">Simulados</h1>
      <p className="text-muted-foreground max-w-md">
        Pratique com simulados completos do ENEM. Em breve o conteúdo completo estará disponível aqui.
      </p>
    </div>
  );
};

export default AppSimulados;
