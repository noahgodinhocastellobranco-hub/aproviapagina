import { Button } from "@/components/ui/button";
import { Brain, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background to-secondary/30">
      {/* Decorative elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-700" />
      </div>

      <div className="container px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="relative">
              <Brain className="w-16 h-16 text-primary" strokeWidth={1.5} />
              <Sparkles className="w-6 h-6 text-accent absolute -top-1 -right-1 animate-pulse" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-primary">AprovI.A</h1>
          </div>

          {/* Headline */}
          <h2 className="text-4xl md:text-6xl font-bold leading-tight text-foreground">
            Seu assistente inteligente para
            <span className="text-primary"> mandar bem no ENEM</span>
          </h2>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Estude com inteligência artificial, pratique redações com correção automática e tire suas dúvidas em tempo real
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all" asChild>
              <Link to="/pricing">
                <Sparkles className="mr-2 h-5 w-5" />
                Começar a Estudar
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
              <Link to="/auth">
                Login / Criar Conta
              </Link>
            </Button>
          </div>

          {/* Social proof */}
          <div className="pt-12 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span>+ 10.000 estudantes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span>+ 50.000 redações corrigidas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span>Respostas em tempo real</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
