import { ClipboardList } from "lucide-react";

const AppFazendoSimulado = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-orange-600/10 flex items-center justify-center">
        <ClipboardList className="w-8 h-8 text-orange-600" />
      </div>
      <h1 className="text-2xl font-bold">Fazendo Simulado</h1>
      <p className="text-muted-foreground max-w-md">
        Simulado em andamento. Em breve o conteúdo completo estará disponível aqui.
      </p>
    </div>
  );
};

export default AppFazendoSimulado;
