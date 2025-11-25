import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sparkles, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const Pricing = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [email, setEmail] = useState("");
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthAndSubscription();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setEmail(session.user.email || "");
        checkSubscription();
      } else {
        setUser(null);
        setHasSubscription(false);
        setIsCheckingSubscription(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAuthAndSubscription = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      setEmail(session.user.email || "");
      await checkSubscription();
    } else {
      setIsCheckingSubscription(false);
    }
  };

  const checkSubscription = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsCheckingSubscription(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke("check-subscription");
      
      if (error) throw error;

      if (data?.hasSubscription) {
        setHasSubscription(true);
        toast.success("Você já tem um plano ativo!");
      }
    } catch (error) {
      console.error("Erro ao verificar assinatura:", error);
    } finally {
      setIsCheckingSubscription(false);
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para assinar");
      navigate("/auth");
      return;
    }

    if (hasSubscription) {
      toast.info("Você já possui um plano ativo!");
      return;
    }

    if (!email || !email.includes("@")) {
      toast.error("Por favor, insira um email válido");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { email },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Erro ao criar checkout:", error);
      toast.error("Erro ao processar pagamento. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    "Correção ilimitada de redações com IA",
    "Chat inteligente para tirar dúvidas",
    "Acesso a todos os simulados oficiais",
    "Estudo de todas as matérias do ENEM",
    "Dicas e estratégias exclusivas",
    "Acompanhamento de desempenho",
    "Suporte prioritário",
    "Atualizações constantes de conteúdo"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container px-4 py-4">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
        </div>
      </header>

      <div className="container px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Oferta Especial</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Conquiste sua aprovação no ENEM
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tenha acesso completo à plataforma de estudos com inteligência artificial
            </p>
          </div>

          {/* Pricing Card */}
          <Card className="border-2 border-primary/20 shadow-2xl max-w-2xl mx-auto">
            <CardHeader className="text-center pb-8 pt-8">
              <div className="inline-flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
                <CardTitle className="text-2xl">Plano Completo AprovI.A</CardTitle>
              </div>
              <CardDescription className="text-lg">
                Acesso ilimitado a todas as funcionalidades
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-8">
              {/* Price */}
              <div className="text-center py-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl md:text-7xl font-bold text-primary">R$ 19,99</span>
                  <span className="text-2xl text-muted-foreground">/mês</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Cancele quando quiser
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">O que está incluído:</h3>
                <div className="grid gap-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <div className="space-y-4 pt-4">
                {isCheckingSubscription ? (
                  <div className="text-center py-6">
                    <p className="text-muted-foreground">Verificando seu plano...</p>
                  </div>
                ) : hasSubscription ? (
                  <div className="space-y-3">
                    <div className="bg-accent/10 border border-accent rounded-lg p-6 text-center">
                      <Check className="w-12 h-12 text-accent mx-auto mb-3" />
                      <h3 className="text-xl font-semibold text-accent mb-2">
                        Plano Ativo!
                      </h3>
                      <p className="text-muted-foreground">
                        Você já possui acesso completo à plataforma
                      </p>
                    </div>
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="w-full text-lg py-6"
                      asChild
                    >
                      <Link to="/">
                        Voltar para Home
                      </Link>
                    </Button>
                  </div>
                ) : !user ? (
                  <div className="space-y-3">
                    <p className="text-center text-muted-foreground mb-4">
                      Faça login ou crie uma conta para continuar
                    </p>
                    <Button 
                      size="lg" 
                      className="w-full text-lg py-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                      asChild
                    >
                      <Link to="/auth">
                        Login / Criar Conta
                        <Sparkles className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <input
                      type="email"
                      placeholder="Seu melhor email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button 
                      size="lg" 
                      className="w-full text-lg py-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                      onClick={handleCheckout}
                      disabled={isLoading}
                    >
                      {isLoading ? "Processando..." : "Começar Agora"}
                      {!isLoading && <Sparkles className="ml-2 h-5 w-5" />}
                    </Button>
                  </div>
                )}
                
                {!hasSubscription && (
                  <p className="text-center text-sm text-muted-foreground">
                    ✓ Sem cartão de crédito para testar  ✓ Acesso imediato  ✓ Garantia de 7 dias
                  </p>
                )}
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">+5000</div>
                    <div className="text-xs text-muted-foreground">Estudantes</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">4.9★</div>
                    <div className="text-xs text-muted-foreground">Avaliação</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">85%</div>
                    <div className="text-xs text-muted-foreground">Aprovação</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Section */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Tem alguma dúvida? Entre em contato conosco
            </p>
            <Link to="/" className="text-primary hover:underline">
              Voltar para a página inicial
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
