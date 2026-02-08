import { GraduationCap } from "lucide-react";

const AppProfessoraVirtual = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center">
        <GraduationCap className="w-8 h-8 text-purple-500" />
      </div>
      <h1 className="text-2xl font-bold">Professora Virtual</h1>
      <p className="text-muted-foreground max-w-md">
        Aulas personalizadas com inteligência artificial. Em breve o conteúdo completo estará disponível aqui.
      </p>
    </div>
  );
};

export default AppProfessoraVirtual;
