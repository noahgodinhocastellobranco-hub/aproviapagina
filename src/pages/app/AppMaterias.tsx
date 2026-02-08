import { BookOpen } from "lucide-react";

const AppMaterias = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
        <BookOpen className="w-8 h-8 text-cyan-500" />
      </div>
      <h1 className="text-2xl font-bold">Matérias</h1>
      <p className="text-muted-foreground max-w-md">
        Conteúdos organizados por matéria. Em breve o conteúdo completo estará disponível aqui.
      </p>
    </div>
  );
};

export default AppMaterias;
