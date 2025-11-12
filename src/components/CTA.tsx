import { Button } from "@/components/ui/button";
import { Brain, ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80 -z-10" />
      <div className="absolute inset-0 bg-grid-pattern opacity-10 -z-10" />
      
      <div className="container px-4 relative">
        <div className="max-w-4xl mx-auto text-center text-white space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-4">
            <Brain className="w-5 h-5" />
            <span className="text-sm font-medium">Comece gratuitamente</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold leading-tight">
            Pronto para transformar seus estudos?
          </h2>
          
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
            Junte-se a milhares de estudantes que já estão usando IA para conquistar a aprovação no ENEM
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg px-8 py-6 shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
            >
              Criar Conta Grátis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-lg px-8 py-6 bg-white/10 backdrop-blur border-white/20 text-white hover:bg-white/20"
            >
              Agendar Demonstração
            </Button>
          </div>

          <div className="pt-8 text-white/80 text-sm">
            <p>✓ Sem cartão de crédito  ✓ Acesso imediato  ✓ Cancele quando quiser</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
