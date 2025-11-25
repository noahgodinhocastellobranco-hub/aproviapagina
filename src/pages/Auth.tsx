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
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          console.log("Verificando role do usuário:", session.user.id);
          // Verificar se é admin - usar maybeSingle() ao invés de single()
          const { data: roleData, error } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id)
            .eq("role", "admin")
            .maybeSingle();
          
          if (error) {
            console.error("Erro ao verificar role:", error);
          }
          
          console.log("Role data:", roleData);
          
          if (roleData) {
            console.log("Redirecionando para /admin");
            navigate("/admin");
          } else {
            console.log("Redirecionando para /pricing");
            navigate("/pricing");
          }
        }
      } catch (error) {
        console.error("Erro no checkUserAndRedirect:", error);
      }
    };

    checkUserAndRedirect();

    // Escuta mudanças no estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && event === 'SIGNED_IN') {
        try {
          console.log("Auth state changed - Verificando role:", session.user.id);
          // Verificar se é admin - usar maybeSingle() ao invés de single()
          const { data: roleData, error } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id)
            .eq("role", "admin")
            .maybeSingle();
          
          if (error) {
            console.error("Erro ao verificar role no auth change:", error);
          }
          
          console.log("Role data no auth change:", roleData);
          
          if (roleData) {
            console.log("Redirecionando para /admin");
            navigate("/admin");
          } else {
            console.log("Redirecionando para /pricing");
            navigate("/pricing");
          }
        } catch (error) {
          console.error("Erro no onAuthStateChange:", error);
        }
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

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        toast.success("Login realizado com sucesso!");
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
        toast.success("Conta criada! Redirecionando para os planos...");
      }
    } catch (error: any) {
      if (error.message.includes("User already registered")) {
        toast.error("Este email já está cadastrado. Faça login.");
        setIsLogin(true);
      } else if (error.message.includes("Invalid login credentials")) {
        toast.error("Email ou senha incorretos");
      } else {
        toast.error(error.message || "Erro ao processar autenticação");
      }
    } finally {
      setIsLoading(false);
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
