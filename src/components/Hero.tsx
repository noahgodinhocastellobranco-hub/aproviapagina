import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Brain, Sparkles, CheckCircle2, Star, Zap, TrendingUp, Clock, Shield, ArrowRight, Play, AlertTriangle } from "lucide-react";
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
      {/* Enhanced animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-2xl animate-pulse delay-500" />
      </div>

      <div className="container px-4 py-8 md:py-16">
        <div className="max-w-5xl mx-auto text-center space-y-5">
          
          {/* URGENCY BANNER - High impact */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-destructive/20 to-destructive/10 border-2 border-destructive/30 text-destructive shadow-lg">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
            <span className="text-sm md:text-base font-bold">⚡ ENEM 2025: Restam poucos meses! Últimas vagas com desconto</span>
          </div>

          {/* Logo with enhanced styling */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-150" />
              <Brain className="w-14 h-14 md:w-18 md:h-18 text-primary relative" strokeWidth={1.5} />
              <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-accent absolute -top-1 -right-1 animate-bounce" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              AprovI.A
            </h1>
          </div>

          {/* Main Headline - Stronger emotional trigger */}
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight text-foreground tracking-tight">
            <span className="inline-block">Você está</span>{" "}
            <span className="relative inline-block">
              <span className="text-destructive">perdendo tempo</span>
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-destructive/30" viewBox="0 0 200 12">
                <path d="M0,8 Q50,0 100,8 T200,8" fill="none" stroke="currentColor" strokeWidth="4"/>
              </svg>
            </span>
            <span className="block mt-2 text-primary">
              estudando do jeito errado
            </span>
          </h2>

          {/* Subheadline - Clear value prop */}
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A <strong className="text-foreground font-bold">única IA do Brasil treinada para o ENEM</strong> que corrige redações em 30 segundos, 
            cria seu plano de estudos personalizado e te leva à <span className="text-accent font-semibold">aprovação garantida</span>.
          </p>

          {/* Video teaser / demo preview */}
          <div className="relative max-w-md mx-auto py-4">
            <div className="relative rounded-2xl overflow-hidden border-2 border-primary/20 shadow-2xl bg-gradient-to-br from-card to-primary/5 p-1">
              <div className="bg-card rounded-xl p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
                  <span className="text-xs font-semibold text-accent uppercase tracking-wide">AO VIVO</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">+2.847 estudantes online agora</p>
                <div className="inline-flex items-center gap-2 text-primary font-semibold">
                  <Play className="w-5 h-5" />
                  <span>Veja como funciona</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Benefits Pills - More impactful */}
          <div className="flex flex-wrap justify-center gap-3 py-2">
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-accent/20 to-accent/10 border border-accent/30 shadow-sm hover:shadow-md transition-shadow">
              <Zap className="w-5 h-5 text-accent" />
              <span className="text-sm font-bold">Correção em 30 segundos</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 shadow-sm hover:shadow-md transition-shadow">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold">+200 pontos em média</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-accent/20 to-accent/10 border border-accent/30 shadow-sm hover:shadow-md transition-shadow">
              <Shield className="w-5 h-5 text-accent" />
              <span className="text-sm font-bold">7 dias de garantia</span>
            </div>
          </div>

          {/* CTA Buttons - Stronger visual hierarchy */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              size="lg" 
              className="text-lg md:text-xl px-10 md:px-14 py-7 md:py-8 shadow-2xl hover:shadow-primary/30 hover:scale-105 transition-all bg-gradient-to-r from-primary via-primary to-primary/90 relative group font-bold" 
              asChild
            >
              <Link to="/pricing">
                <span className="absolute -top-4 -right-2 bg-accent text-accent-foreground text-xs font-black px-3 py-1.5 rounded-full animate-bounce shadow-lg">
                  🔥 -40% HOJE
                </span>
                <Sparkles className="mr-2 h-6 w-6 group-hover:animate-spin" />
                QUERO PASSAR NO ENEM
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-7 border-2 hover:bg-primary/5" asChild>
              <Link to="/auth">
                Já tenho conta
              </Link>
            </Button>
          </div>

          {/* Trust Signals - Enhanced */}
          <div className="pt-6 space-y-4">
            <div className="flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
              ))}
              <span className="ml-3 text-base font-bold">4.9/5</span>
              <span className="text-sm text-muted-foreground">(2.847 avaliações verificadas)</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm">
              <span className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-5 h-5 text-accent" />
                Garantia de 7 dias
              </span>
              <span className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-5 h-5 text-accent" />
                Cancele quando quiser
              </span>
              <span className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-5 h-5 text-accent" />
                Suporte humanizado 24/7
              </span>
            </div>
          </div>

          {/* Social Proof Stats - More prominent */}
          <div className="pt-8 grid grid-cols-3 gap-4 md:gap-6 max-w-2xl mx-auto">
            <div className="text-center p-4 md:p-6 rounded-2xl bg-gradient-to-br from-card to-primary/5 border-2 border-primary/10 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-3xl md:text-4xl font-black text-primary">12.547</div>
              <div className="text-xs md:text-sm text-muted-foreground font-medium">estudantes ativos</div>
            </div>
            <div className="text-center p-4 md:p-6 rounded-2xl bg-gradient-to-br from-card to-accent/5 border-2 border-accent/10 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-3xl md:text-4xl font-black text-accent">94%</div>
              <div className="text-xs md:text-sm text-muted-foreground font-medium">taxa de aprovação</div>
            </div>
            <div className="text-center p-4 md:p-6 rounded-2xl bg-gradient-to-br from-card to-primary/5 border-2 border-primary/10 shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-3xl md:text-4xl font-black text-primary">73k+</div>
              <div className="text-xs md:text-sm text-muted-foreground font-medium">redações corrigidas</div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;