import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brain, Settings, ArrowLeft, Loader2, Sparkles } from "lucide-react";

const Application = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!isMounted) return;

      if (!session?.user) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      setIsLoading(false);
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-primary mx-auto animate-spin" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container px-4 py-4 flex justify-between items-center">
          <Link to="/settings" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Configurações
          </Link>

          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <span className="font-semibold">AprovI.A</span>
          </div>

          <Button variant="ghost" size="icon" asChild>
            <Link to="/settings">
              <Settings className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="container px-4 py-12 max-w-4xl mx-auto">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-lg rounded-full" />
              <Brain className="w-16 h-16 text-primary relative" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold">
              Bem-vindo, {user?.user_metadata?.full_name?.split(" ")[0] || "Estudante"}!
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Aqui você pode acessar todas as ferramentas de estudo com inteligência artificial.
            </p>
          </div>

          <div className="pt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Placeholder cards para funcionalidades futuras */}
            <div className="rounded-xl border bg-card p-6 text-left space-y-3 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold">Gerador de Questões</h3>
              <p className="text-sm text-muted-foreground">
                Crie questões personalizadas com IA para seus estudos.
              </p>
              <Button variant="outline" size="sm" disabled>
                Em breve
              </Button>
            </div>

            <div className="rounded-xl border bg-card p-6 text-left space-y-3 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold">Resumos Inteligentes</h3>
              <p className="text-sm text-muted-foreground">
                Gere resumos automáticos de qualquer conteúdo.
              </p>
              <Button variant="outline" size="sm" disabled>
                Em breve
              </Button>
            </div>

            <div className="rounded-xl border bg-card p-6 text-left space-y-3 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold">Plano de Estudos</h3>
              <p className="text-sm text-muted-foreground">
                Monte seu cronograma de estudos personalizado.
              </p>
              <Button variant="outline" size="sm" disabled>
                Em breve
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Application;
