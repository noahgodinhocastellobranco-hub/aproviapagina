import { Search } from "lucide-react";

const AppConsultarCurso = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
        <Search className="w-8 h-8 text-indigo-500" />
      </div>
      <h1 className="text-2xl font-bold">Consultar Curso</h1>
      <p className="text-muted-foreground max-w-md">
        Encontre cursos e notas de corte do SISU. Em breve o conteúdo completo estará disponível aqui.
      </p>
    </div>
  );
};

export default AppConsultarCurso;
