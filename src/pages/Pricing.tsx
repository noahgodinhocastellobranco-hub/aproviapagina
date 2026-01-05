import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sparkles, ArrowLeft, LogOut, Loader2, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { toast } from "sonner";

// ID da oferta da Cakto
const CAKTO_OFFER_ID = "3c7yw4k_710255";

const Pricing = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [email, setEmail] = useState("");
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Logout realizado com sucesso");
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro ao fazer logout");
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setEmail(session.user.email || "");
        await checkSubscription();
      } else {
        setIsCheckingSubscription(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth changed:", event);
      if (session?.user) {
        setUser(session.user);
        setEmail(session.user.email || "");
        setTimeout(() => checkSubscription(), 0);
      } else {
        setUser(null);
        setHasSubscription(false);
        setIsCheckingSubscription(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkSubscription = async () => {
    console.log("=== Iniciando checkSubscription ===");
    setIsCheckingSubscription(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log("Nenhuma sessão encontrada");
        setHasSubscription(false);
        setIsCheckingSubscription(false);
        return;
      }

      const accessToken = session?.access_token;
      if (!accessToken) {
        console.log("Token de acesso não encontrado");
        setHasSubscription(false);
        setIsCheckingSubscription(false);
        return;
      }

      console.log("Verificando assinatura para usuário:", session.user.email);

      const { data, error } = await supabase.functions.invoke("check-subscription", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      if (error) {
        console.error("Erro ao chamar check-subscription:", error);
        setHasSubscription(false);
        setIsCheckingSubscription(false);
        return;
      }

      console.log("Resposta do check-subscription:", data);

      if (data?.hasSubscription) {
        setHasSubscription(true);
        console.log("✅ Usuário tem assinatura ativa");
      } else {
        setHasSubscription(false);
        console.log("❌ Usuário não tem assinatura ativa");
      }
    } catch (error) {
      console.error("Erro ao verificar assinatura:", error);
      setHasSubscription(false);
    } finally {
      setIsCheckingSubscription(false);
      console.log("=== Finalizando checkSubscription ===");
    }
  };

  const handleCheckout = async (offerId: string) => {
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
        body: { email, offerId },
      });

      if (error) throw error;

      if (data?.url) {
        // Redireciona na mesma aba para o checkout da Cakto
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Erro ao criar checkout:", error);
      toast.error("Erro ao processar pagamento. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const plan = {
    name: "Mensal",
    originalPrice: "26,21",
    price: "24,90",
    period: "mês",
    offerId: CAKTO_OFFER_ID,
    description: "Acesso completo à plataforma",
    badge: "5% OFF"
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
        <div className="container px-4 py-4 flex justify-between items-center">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          
          {user && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user.email}
              </span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleLogout}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </div>
          )}
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

          {/* Features List */}
          <div className="mb-12">
            <h3 className="font-semibold text-xl text-center mb-6">O que está incluído em todos os planos:</h3>
            <div className="grid md:grid-cols-2 gap-3 max-w-3xl mx-auto">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-foreground text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Card */}
          <div className="max-w-md mx-auto">
            <Card className="border-2 border-primary shadow-2xl relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                  {plan.badge}
                </div>
              </div>
              
              <CardHeader className="text-center pb-6 pt-8">
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Price */}
                <div className="text-center py-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-lg text-muted-foreground line-through">R$ {plan.originalPrice}</span>
                    <span className="text-4xl md:text-5xl font-bold text-primary">R$ {plan.price}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    por {plan.period}
                  </p>
                </div>

                {/* CTA Button */}
                <div className="space-y-4">
                  {isCheckingSubscription ? (
                    <div className="text-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
                      <p className="text-muted-foreground text-sm font-medium">Verificando seu plano...</p>
                    </div>
                  ) : hasSubscription ? (
                    <div className="space-y-3">
                      <div className="bg-accent/10 border border-accent rounded-lg p-4 text-center">
                        <Check className="w-8 h-8 text-accent mx-auto mb-2" />
                        <p className="text-sm font-semibold text-accent">Plano Ativo!</p>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      size="lg" 
                      className="w-full"
                      onClick={() => {
                        if (!user) {
                          navigate("/auth");
                        } else {
                          handleCheckout(plan.offerId);
                        }
                      }}
                      disabled={isLoading}
                    >
                      {isLoading ? "Processando..." : !user ? "Fazer Login para Comprar" : "Comprar Agora"}
                      <Sparkles className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Subscription Management */}
          {hasSubscription && user && (
            <div className="mt-8 max-w-2xl mx-auto">
              <Card className="border-2 border-accent/20">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="flex-1"
                      asChild
                    >
                      <Link to="/">
                        Voltar para Home
                      </Link>
                    </Button>
                    
                    <Button 
                      size="lg" 
                      variant="secondary"
                      className="flex-1"
                      asChild
                    >
                      <Link to="/settings">
                        <Settings className="w-4 h-4 mr-2" />
                        Configurações
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Trust Badges */}
          <div className="mt-12 max-w-2xl mx-auto">
            <Card className="border-primary/20">
              <CardContent className="pt-6">
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
              </CardContent>
            </Card>
          </div>

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
