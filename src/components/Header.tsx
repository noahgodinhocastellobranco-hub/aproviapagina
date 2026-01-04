import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, User, Settings, ExternalLink, LayoutDashboard, Rocket, Sparkles, Moon, Sun } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTheme } from "@/hooks/use-theme";
import SupportChat from "@/components/SupportChat";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [user, setUser] = useState<any>(null);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    checkUserAndSubscription();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setTimeout(() => {
          checkSubscription();
          checkAdminRole(session.user.id);
        }, 0);
      } else {
        // Limpar tudo quando não há sessão
        setUser(null);
        setHasSubscription(false);
        setIsAdmin(false);
        setIsChecking(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserAndSubscription = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      // Se há erro ao obter sessão ou sessão inválida, fazer logout
      if (sessionError || !session) {
        console.log("Sessão inválida ou expirada, fazendo logout");
        await supabase.auth.signOut();
        setUser(null);
        setHasSubscription(false);
        setIsAdmin(false);
        setIsChecking(false);
        return;
      }

      if (session?.user) {
        setUser(session.user);
        await checkSubscription();
        await checkAdminRole(session.user.id);
      }
    } catch (error) {
      console.error("Erro ao verificar sessão:", error);
      // Em caso de erro, fazer logout
      await supabase.auth.signOut();
      setUser(null);
      setHasSubscription(false);
      setIsAdmin(false);
    } finally {
      setIsChecking(false);
    }
  };

  const checkAdminRole = async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: userId,
        _role: 'admin'
      });
      
      if (!error) {
        setIsAdmin(data || false);
      }
    } catch (error) {
      console.error("Erro ao verificar role de admin:", error);
    }
  };

  const checkSubscription = async () => {
    try {
      console.log("🔍 Verificando status de assinatura...");
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log("❌ Sem sessão ativa");
        setHasSubscription(false);
        setIsChecking(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke("check-subscription", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      
      if (error) {
        console.error("❌ Erro ao verificar assinatura:", error);
        setHasSubscription(false);
        setIsChecking(false);
        return;
      }

      console.log("📊 Resposta da verificação de assinatura:", data);
      console.log("✅ hasSubscription:", data?.hasSubscription);
      
      setHasSubscription(data?.hasSubscription || false);
      setIsChecking(false);
    } catch (error) {
      console.error("❌ Erro ao verificar assinatura:", error);
      setHasSubscription(false);
      setIsChecking(false);
    }
  };

  const handleLogout = async () => {
    try {
      // Limpar estados primeiro
      setUser(null);
      setHasSubscription(false);
      setIsAdmin(false);
      
      // Fazer signout
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Erro ao fazer logout:", error);
        // Mesmo com erro, limpar localStorage manualmente
        localStorage.removeItem('supabase.auth.token');
      }
      
      toast.success("Logout realizado com sucesso");
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      // Em caso de erro, limpar localStorage e redirecionar
      localStorage.removeItem('supabase.auth.token');
      setUser(null);
      setHasSubscription(false);
      setIsAdmin(false);
      navigate("/");
      toast.error("Sessão encerrada");
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm("⚠️ TEM CERTEZA?\n\nVocê deseja realmente cancelar sua assinatura?\n\nVocê perderá o acesso imediato ao aplicativo AprovI.A.")) {
      return;
    }

    try {
      console.log("🔄 Iniciando cancelamento de assinatura...");
      
      const { data, error } = await supabase.functions.invoke("cancel-subscription");
      
      if (error) {
        console.error("❌ Erro ao cancelar:", error);
        toast.error("Erro ao cancelar assinatura");
        return;
      }

      console.log("✅ Resposta do cancelamento:", data);

      if (data?.success) {
        toast.success("✅ Assinatura cancelada com sucesso!");
        console.log("🔄 Atualizando status de assinatura...");
        
        // Atualizar o estado imediatamente
        setHasSubscription(false);
        
        // Redirecionar para a página de planos após 2 segundos
        setTimeout(() => {
          console.log("➡️ Redirecionando para /pricing");
          navigate("/pricing");
        }, 2000);
      } else {
        toast.error("Erro ao processar cancelamento");
      }
    } catch (error) {
      console.error("❌ Erro ao cancelar assinatura:", error);
      toast.error("Erro ao cancelar assinatura");
    }
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  if (!user) {
    return (
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container px-4 py-4 flex justify-end items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>
          <Button variant="outline" asChild>
            <Link to="/auth">Login / Criar Conta</Link>
          </Button>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container px-4 py-4 flex justify-end items-center gap-3">
        <span className="text-sm text-muted-foreground hidden sm:inline">
          {user.email}
        </span>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full"
        >
          {resolvedTheme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </Button>

        <Button variant="outline" size="sm" className="gap-2" asChild>
          <Link to="/settings">
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Configurações</span>
          </Link>
        </Button>

        <SupportChat />

        {hasSubscription ? (
          <Button size="sm" className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all relative" asChild>
            <a href="https://aprovia.lovable.app" target="_blank" rel="noopener noreferrer">
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm animate-pulse">
                PRO
              </span>
              <Rocket className="w-4 h-4" />
              <span className="hidden sm:inline">Entrar no App</span>
            </a>
          </Button>
        ) : (
          <Button size="sm" variant="outline" className="gap-2 border-primary/50 text-primary hover:bg-primary/10 relative group" asChild>
            <Link to="/pricing">
              <Sparkles className="w-4 h-4 group-hover:animate-pulse" />
              <span className="hidden sm:inline">Assinar PRO</span>
              <span className="sm:hidden">PRO</span>
            </Link>
          </Button>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Minha Conta</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/settings" className="cursor-pointer">
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {isAdmin && (
              <>
                <DropdownMenuItem asChild>
                  <Link to="/admin" className="cursor-pointer">
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Acessar Painel
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            {!hasSubscription && (
              <>
                <DropdownMenuItem asChild>
                  <Link to="/pricing" className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    Assinar Plano
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
