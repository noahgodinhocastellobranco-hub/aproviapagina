import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, User, Settings, ExternalLink, X, LayoutDashboard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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
  const navigate = useNavigate();

  useEffect(() => {
    checkUserAndSubscription();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        await checkSubscription();
        await checkAdminRole(session.user.id);
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
      const { data, error } = await supabase.functions.invoke("check-subscription");
      
      if (error) {
        console.error("❌ Erro ao verificar assinatura:", error);
        return;
      }

      console.log("📊 Resposta da verificação de assinatura:", data);
      console.log("✅ hasSubscription:", data?.hasSubscription);
      
      setHasSubscription(data?.hasSubscription || false);
    } catch (error) {
      console.error("❌ Erro ao verificar assinatura:", error);
    } finally {
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

  if (!user) {
    return (
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container px-4 py-4 flex justify-end">
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
        
        {hasSubscription && (
          <>
            <Button 
              variant="default" 
              size="sm" 
              className="gap-2 bg-green-600 hover:bg-green-700"
              asChild
            >
              <a href="https://aprovia.lovable.app" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">Acessar Aplicativo</span>
                <span className="sm:hidden">App</span>
              </a>
            </Button>

            <Button 
              variant="destructive" 
              size="sm" 
              className="gap-2"
              onClick={handleCancelSubscription}
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Cancelar Assinatura</span>
              <span className="sm:hidden">Cancelar</span>
            </Button>
          </>
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
