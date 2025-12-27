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
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const checkUser = async (session: any) => {
      if (!session) {
        if (isMounted) setIsCheckingAuth(false);
        return;
      }

      try {
        console.log("Sessão encontrada:", session.user.email);
        
        // Verificar admin
        const { data: isAdmin, error: adminError } = await supabase.rpc('has_role', {
          _user_id: session.user.id,
          _role: 'admin'
        });

        if (adminError) {
          console.error("Erro ao verificar admin:", adminError);
        }

        if (isAdmin) {
          console.log("Usuário é admin, redirecionando...");
          navigate("/admin", { replace: true });
          return;
        }

        // Verificar assinatura
        console.log("Verificando assinatura...");
        const { data: subData, error: subError } = await supabase.functions.invoke('check-subscription', {
          headers: { Authorization: `Bearer ${session.access_token}` }
        });

        if (subError) {
          console.error("Erro ao verificar assinatura:", subError);
          navigate("/pricing", { replace: true });
          return;
        }

        console.log("Resposta da assinatura:", subData);

        if (subData?.hasSubscription) {
          console.log("Tem assinatura, redirecionando para app...");
          window.location.href = "https://aprovia.lovable.app";
        } else {
          console.log("Sem assinatura, redirecionando para pricing...");
          navigate("/pricing", { replace: true });
        }
      } catch (error) {
        console.error("Erro no checkUser:", error);
        if (isMounted) {
          navigate("/pricing", { replace: true });
        }
      }
    };

    // Configurar listener PRIMEIRO
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event);
      if (event === 'SIGNED_IN' && session) {
        setTimeout(() => checkUser(session), 0);
      } else if (event === 'SIGNED_OUT') {
        if (isMounted) setIsCheckingAuth(false);
      }
    });

    // DEPOIS verificar sessão existente
    supabase.auth.getSession().then(({ data: { session } }) => {
      checkUser(session);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    if (!email || !password || (!isLogin && !fullName)) {
      toast.error("Preencha todos os campos");
      return;
    }

    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
      if (!isLogin) nameSchema.parse(fullName);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      }
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Login realizado!");
        // O redirecionamento será feito pelo useEffect
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/pricing`,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        toast.success("Conta criada!");
        // O redirecionamento será feito pelo useEffect
      }
    } catch (error: any) {
      setIsLoading(false);
      if (error.message.includes("User already registered")) {
        toast.error("Email já cadastrado. Faça login.");
        setIsLogin(true);
      } else if (error.message.includes("Invalid login credentials")) {
        toast.error("Email ou senha incorretos");
      } else {
        toast.error(error.message || "Erro na autenticação");
      }
    }
  };

  // Mostrar loading enquanto verifica autenticação
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Brain className="w-12 h-12 text-primary mx-auto animate-pulse" />
          <p className="text-muted-foreground">Verificando...</p>
        </div>
      </div>
    );
  }

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
