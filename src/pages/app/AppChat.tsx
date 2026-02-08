import { MessageCircle } from "lucide-react";

const AppChat = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center">
        <MessageCircle className="w-8 h-8 text-blue-500" />
      </div>
      <h1 className="text-2xl font-bold">Chat AprovI.A</h1>
      <p className="text-muted-foreground max-w-md">
        Tire suas dúvidas com a IA especializada no ENEM. Em breve o conteúdo completo estará disponível aqui.
      </p>
    </div>
  );
};

export default AppChat;
