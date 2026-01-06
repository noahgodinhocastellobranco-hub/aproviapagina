import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Brain, Sparkles, CheckCircle2, Star, Zap, TrendingUp, Clock, Shield } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Hero = () => {
  const [user, setUser] = useState<any>(null);
  const [hasSubscription, setHasSubscription] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        checkSubscription(session.access_token);
      }
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setTimeout(() => checkSubscription(session.access_token), 0);
      } else {
        setHasSubscription(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkSubscription = async (token: string) => {
    try {
      const { data } = await supabase.functions.invoke("check-subscription", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHasSubscription(data?.hasSubscription || false);
    } catch (error) {
      console.error("Erro ao verificar assinatura:", error);
    }
  };

  const handleStartStudying = () => {
    if (!user) {
      navigate("/auth");
    } else if (hasSubscription) {
      window.open("https://aproviaapp.lovable.app", "_blank");
    } else {
      navigate("/pricing");
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-primary/5">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container px-4 py-12 md:py-20">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          
          {/* Urgency Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border border-destructive/20 text-destructive animate-pulse">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-semibold">ENEM 2025 em poucos meses — Comece AGORA!</span>
          </div>

          {/* Logo */}
          <div className="flex items-center justify-center gap-3">
            <div className="relative">
              <Brain className="w-14 h-14 md:w-16 md:h-16 text-primary" strokeWidth={1.5} />
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-accent absolute -top-1 -right-1 animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary">AprovI.A</h1>
          </div>

          {/* Main Headline - Pain Point */}
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-foreground">
            Chega de estudar <span className="text-destructive">errado</span> e 
            <span className="block mt-2">
              <span className="text-primary"> perder tempo</span> no ENEM
            </span>
          </h2>

          {/* Subheadline - Solution */}
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A <strong className="text-foreground">única IA treinada especificamente para o ENEM</strong> que corrige suas redações, 
            tira dúvidas em segundos e cria um plano de estudos personalizado para você.
          </p>

          {/* Key Benefits Pills */}
          <div className="flex flex-wrap justify-center gap-3 py-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">Correção em 30 segundos</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">+200 pontos em média</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
              <Shield className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium">Garantia de 7 dias</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
            <Button 
              size="lg" 
              className="text-lg px-10 py-7 shadow-2xl hover:shadow-primary/25 hover:scale-105 transition-all bg-gradient-to-r from-primary to-primary/80 relative group" 
              onClick={handleStartStudying}
            >
              <span className="absolute -top-3 -right-3 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                🔥 POPULAR
              </span>
              <Sparkles className="mr-2 h-5 w-5 group-hover:animate-spin" />
              {!user ? "QUERO PASSAR NO ENEM" : hasSubscription ? "Entrar no App" : "COMEÇAR AGORA"}
            </Button>
            {!user && (
              <Button size="lg" variant="outline" className="text-lg px-8 py-7 border-2" asChild>
                <Link to="/auth">
                  Já tenho conta
                </Link>
              </Button>
            )}
          </div>

          {/* Trust Signals */}
          <div className="pt-6 space-y-4">
            <div className="flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-2 text-sm font-medium">4.9/5 (2.847 avaliações)</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                Garantia de 7 dias
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                Cancele quando quiser
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                Suporte 24/7
              </span>
            </div>
          </div>

          {/* Social Proof Stats */}
          <div className="pt-8 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="text-center p-4 rounded-2xl bg-card border shadow-sm">
              <div className="text-2xl md:text-3xl font-bold text-primary">12.547</div>
              <div className="text-xs md:text-sm text-muted-foreground">estudantes ativos</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-card border shadow-sm">
              <div className="text-2xl md:text-3xl font-bold text-accent">94%</div>
              <div className="text-xs md:text-sm text-muted-foreground">taxa de aprovação</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-card border shadow-sm">
              <div className="text-2xl md:text-3xl font-bold text-primary">73.000+</div>
              <div className="text-xs md:text-sm text-muted-foreground">redações corrigidas</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
