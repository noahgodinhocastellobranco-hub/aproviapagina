import { FolderDown } from "lucide-react";

const AppMateriaisEstudo = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-teal-500/10 flex items-center justify-center">
        <FolderDown className="w-8 h-8 text-teal-500" />
      </div>
      <h1 className="text-2xl font-bold">Materiais de Estudo</h1>
      <p className="text-muted-foreground max-w-md">
        Materiais e apostilas para download. Em breve o conteúdo completo estará disponível aqui.
      </p>
    </div>
  );
};

export default AppMateriaisEstudo;
