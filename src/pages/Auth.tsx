import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { Brain, Sparkles, ArrowLeft } from "lucide-react";
import { z } from "zod";

const emailSchema = z.string().trim().email({ message: "Email inválido" });
const passwordSchema = z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" });
const nameSchema = z.string().trim().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }).max(100, { message: "Nome muito longo" });

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        // Se há erro na sessão ou não há sessão, não fazer nada (ficar na página de auth)
        if (sessionError || !session) {
          console.log("Sem sessão válida");
          // Se houver erro de sessão, limpar
          if (sessionError) {
            await supabase.auth.signOut();
          }
          return;
        }

        if (session) {
          console.log("Sessão existente encontrada:", session.user.id);
          
          // Verificar se é admin usando a função RPC
          const { data: isAdminData, error: adminError } = await supabase.rpc('has_role', {
            _user_id: session.user.id,
            _role: 'admin'
          });
          
          console.log("Check inicial - Admin?", isAdminData, "Erro:", adminError);
          
          if (adminError) {
            console.error("Erro ao verificar role:", adminError);
          }
          
          if (isAdminData === true) {
            console.log("✅ Admin confirmado no check inicial! Redirecionando...");
            navigate("/admin");
            return;
          }

          // Se não é admin, verificar assinatura
          console.log("Não é admin, verificando assinatura");
          const { data: subData, error: subError } = await supabase.functions.invoke('check-subscription');
          
          if (subError) {
            console.error("Erro ao verificar assinatura:", subError);
            navigate("/pricing");
            return;
          }

          console.log("Status da assinatura:", subData);
          
          if (subData?.hasSubscription) {
            console.log("Assinatura ativa, redirecionando para app");
            window.location.href = "https://aprovia.lovable.app";
          } else {
            console.log("Sem assinatura, redirecionando para /pricing");
            navigate("/pricing");
          }
        }
      } catch (error) {
        console.error("Erro no checkUserAndRedirect:", error);
        navigate("/pricing");
      }
    };

    checkUserAndRedirect();

    // Escuta mudanças no estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event, "Session:", session?.user?.id);
      
      // Apenas atualizar estados básicos, não fazer chamadas ao Supabase aqui
      if (session && event === 'SIGNED_IN') {
        console.log("Login detectado, recarregando verificação");
        // Forçar recarregar a verificação
        checkUserAndRedirect();
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação de campos vazios
    if (!email || !password || (!isLogin && !fullName)) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }

    // Validação com zod
    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
      if (!isLogin) {
        nameSchema.parse(fullName);
      }
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
        return;
      }
    }

    setIsLoading(true);

    // Timeout de segurança: se demorar mais de 10 segundos, mostrar erro
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
      toast.error("Login está demorando muito. Tente novamente.");
    }, 10000);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        clearTimeout(timeoutId);
        toast.success("Login realizado! Redirecionando...");
        
        // Aguardar um pouco para o onAuthStateChange processar
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/pricing`,
            data: {
              full_name: fullName,
            },
          },
        });

        if (error) throw error;
        
        clearTimeout(timeoutId);
        toast.success("Conta criada! Redirecionando...");
        
        // Aguardar um pouco para o onAuthStateChange processar
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error: any) {
      clearTimeout(timeoutId);
      setIsLoading(false);
      
      if (error.message.includes("User already registered")) {
        toast.error("Este email já está cadastrado. Faça login.");
        setIsLogin(true);
      } else if (error.message.includes("Invalid login credentials")) {
        toast.error("Email ou senha incorretos");
      } else {
        toast.error(error.message || "Erro ao processar autenticação");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header com botão voltar */}
      <div className="container px-4 py-4">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>
      </div>

      <div className="flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Brain className="w-10 h-10 text-primary" />
            <h1 className="text-3xl font-bold text-primary">AprovI.A</h1>
          </div>
          <div>
            <CardTitle className="text-2xl">
              {isLogin ? "Bem-vindo de volta!" : "Crie sua conta"}
            </CardTitle>
            <CardDescription className="mt-2">
              {isLogin 
                ? "Entre para continuar seus estudos" 
                : "Comece a estudar com inteligência artificial"}
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium">
                  Nome Completo
                </label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Seu nome completo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isLoading}
                  required={!isLogin}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Senha
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                minLength={6}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                "Processando..."
              ) : (
                <>
                  {isLogin ? "Entrar" : "Criar Conta"}
                  <Sparkles className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-primary hover:underline"
              disabled={isLoading}
            >
              {isLogin 
                ? "Não tem conta? Criar agora" 
                : "Já tem conta? Fazer login"}
            </button>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};

export default Auth;
