import { HelpCircle } from "lucide-react";

const AppComoResolverQuestao = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-sky-500/10 flex items-center justify-center">
        <HelpCircle className="w-8 h-8 text-sky-500" />
      </div>
      <h1 className="text-2xl font-bold">Resolver Questão</h1>
      <p className="text-muted-foreground max-w-md">
        Aprenda a resolver questões passo a passo com IA. Em breve o conteúdo completo estará disponível aqui.
      </p>
    </div>
  );
};

export default AppComoResolverQuestao;
