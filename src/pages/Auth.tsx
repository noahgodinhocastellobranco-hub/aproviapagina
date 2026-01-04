import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { Brain, Sparkles, ArrowLeft, Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [isResetOpen, setIsResetOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const checkUser = async (session: any) => {
      if (!session) {
        if (isMounted) setIsCheckingAuth(false);
        return;
      }

      // Evita travar indefinidamente no "Verificando..." se algo falhar
      if (isMounted) setIsCheckingAuth(false);

      const checkAdminWithTimeout = async () => {
        try {
          const result = await Promise.race([
            supabase.rpc("has_role", {
              _user_id: session.user.id,
              _role: "admin",
            }),
            new Promise<{ data: boolean; error: null }>((resolve) =>
              setTimeout(() => resolve({ data: false, error: null }), 2500),
            ),
          ]);

          return !result?.error && !!result?.data;
        } catch {
          return false;
        }
      };

      const isAdmin = await checkAdminWithTimeout();
      if (!isMounted) return;

      // Check if user has completed quiz
      const { data: quizData } = await supabase
        .from("quiz_responses")
        .select("id")
        .eq("user_id", session.user.id)
        .maybeSingle();

      // Admin vai para /admin, usuários sem quiz vão para /quiz, outros para /
      if (isAdmin) {
        navigate("/admin", { replace: true });
      } else if (!quizData) {
        navigate("/quiz", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    };

    // Configurar listener PRIMEIRO
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        setTimeout(() => checkUser(session), 0);
      } else if (event === "SIGNED_OUT") {
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

    setFormError(null);

    if (!email || !password || (!isLogin && !fullName)) {
      const msg = "Preencha todos os campos";
      setFormError(msg);
      toast.error(msg);
      return;
    }

    try {
      emailSchema.parse(email);
      passwordSchema.parse(password);
      if (!isLogin) nameSchema.parse(fullName);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const msg = error.errors[0].message;
        setFormError(msg);
        toast.error(msg);
      }
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Login realizado!");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/settings`,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        toast.success("Conta criada!");
        
        // Redirecionar imediatamente para o quiz após criar conta
        if (data.session) {
          navigate("/quiz", { replace: true });
          return;
        }
      }
    } catch (error: any) {
      const raw = String(error?.message || "");
      let msg = error?.message || "Erro na autenticação";

      if (raw.includes("User already registered")) {
        msg = "Email já cadastrado. Faça login.";
        setIsLogin(true);
      } else if (raw.includes("Invalid login credentials")) {
        msg = "Email ou senha incorretos";
      } else if (raw.toLowerCase().includes("email not confirmed")) {
        msg = "Confirme seu email antes de entrar";
      }

      setFormError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSendingReset) return;

    try {
      emailSchema.parse(resetEmail);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Email inválido");
      }
      return;
    }

    setIsSendingReset(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/settings`,
      });
      if (error) throw error;

      toast.success("Enviamos um link de recuperação para seu email");
      setIsResetOpen(false);
    } catch (error: any) {
      const msg = error?.message || "Não foi possível enviar o link";
      toast.error(msg);
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (isGoogleLoading) return;
    setIsGoogleLoading(true);
    setFormError(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      setFormError(error?.message || "Erro ao entrar com Google");
      toast.error("Erro ao entrar com Google");
      setIsGoogleLoading(false);
    }
  };
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
            <Brain className="w-16 h-16 text-primary mx-auto relative animate-pulse" />
          </div>
          <p className="text-muted-foreground font-medium">Verificando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="container px-4 py-6 relative z-10">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all duration-300 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Voltar ao início</span>
        </Link>
      </div>

      <div className="flex items-center justify-center px-4 pb-12 relative z-10">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and welcome */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center gap-3 mb-2">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/30 blur-lg rounded-full" />
                <Brain className="w-14 h-14 text-primary relative" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                AprovI.A
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              {isLogin 
                ? "Bem-vindo de volta! Entre para continuar." 
                : "Crie sua conta e comece a estudar com IA."}
            </p>
          </div>

          <Card className="shadow-2xl border-0 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-bold">
                {isLogin ? "Entrar" : "Criar Conta"}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {isLogin 
                  ? "Use suas credenciais para acessar" 
                  : "Preencha os dados para se cadastrar"}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-4">
              {formError && (
                <div className="rounded-md border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {formError}
                </div>
              )}

              <form onSubmit={handleAuth} className="space-y-5">
                {!isLogin && (
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="text-sm font-medium flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
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
                      className="h-12 bg-background/50 border-border/50 focus:border-primary transition-colors"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="h-12 bg-background/50 border-border/50 focus:border-primary transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                    Senha
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      minLength={6}
                      className="h-12 bg-background/50 border-border/50 focus:border-primary transition-colors pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {isLogin && (
                  <div className="flex justify-end">
                    <Dialog
                      open={isResetOpen}
                      onOpenChange={(open) => {
                        setIsResetOpen(open);
                        if (open) setResetEmail(email);
                      }}
                    >
                      <DialogTrigger asChild>
                        <button
                          type="button"
                          className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                          disabled={isLoading}
                        >
                          Esqueci minha senha
                        </button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Recuperar senha</DialogTitle>
                          <DialogDescription>
                            Enviaremos um link para redefinir sua senha.
                          </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleForgotPassword} className="space-y-4">
                          <div className="space-y-2">
                            <label htmlFor="resetEmail" className="text-sm font-medium">
                              Email
                            </label>
                            <Input
                              id="resetEmail"
                              type="email"
                              placeholder="seu@email.com"
                              value={resetEmail}
                              onChange={(e) => setResetEmail(e.target.value)}
                              disabled={isSendingReset}
                              required
                            />
                          </div>

                          <Button type="submit" className="w-full" disabled={isSendingReset}>
                            {isSendingReset ? (
                              <span className="inline-flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Enviando...
                              </span>
                            ) : (
                              "Enviar link"
                            )}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Processando...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {isLogin ? "Entrar na conta" : "Criar minha conta"}
                      <Sparkles className="w-5 h-5" />
                    </div>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">ou continue com</span>
                </div>
              </div>

              {/* Google Login */}
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 gap-3 font-medium"
                onClick={handleGoogleLogin}
                disabled={isLoading || isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                {isGoogleLoading ? "Conectando..." : "Continuar com Google"}
              </Button>

              <div className="mt-6 pt-6 border-t border-border/50 text-center">
                <p className="text-sm text-muted-foreground">
                  {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setFormError(null);
                    setIsLogin(!isLogin);
                  }}
                  className="mt-1 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                  disabled={isLoading}
                >
                  {isLogin ? "Criar conta gratuitamente" : "Fazer login"}
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Footer info */}
          <p className="text-center text-xs text-muted-foreground">
            Ao continuar, você concorda com nossos termos de uso e política de privacidade.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
