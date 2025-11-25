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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        checkSubscription();
      } else {
        setUser(null);
        setHasSubscription(false);
        setIsChecking(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserAndSubscription = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      await checkSubscription();
      await checkAdminRole(session.user.id);
    } else {
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
      const { data, error } = await supabase.functions.invoke("check-subscription");
      
      if (error) {
        console.error("Erro ao verificar assinatura:", error);
        return;
      }

      setHasSubscription(data?.hasSubscription || false);
    } catch (error) {
      console.error("Erro ao verificar assinatura:", error);
    } finally {
      setIsChecking(false);
    }
  };

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

  const handleCancelSubscription = async () => {
    if (!confirm("Tem certeza que deseja cancelar sua assinatura? Você perderá o acesso ao aplicativo.")) {
      return;
    }

    try {
      const { error } = await supabase.functions.invoke("cancel-subscription");
      
      if (error) {
        toast.error("Erro ao cancelar assinatura");
        console.error("Erro:", error);
        return;
      }

      toast.success("Assinatura cancelada com sucesso");
      setHasSubscription(false);
      navigate("/pricing");
    } catch (error) {
      console.error("Erro ao cancelar assinatura:", error);
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
          <Button 
            variant="default" 
            size="sm" 
            className="gap-2"
            asChild
          >
            <a href="https://aprovia.lovable.app" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
              Acessar Aplicativo
            </a>
          </Button>
        )}

        {hasSubscription && (
          <Button 
            variant="destructive" 
            size="sm" 
            className="gap-2"
            onClick={handleCancelSubscription}
          >
            <X className="w-4 h-4" />
            Cancelar Assinatura
          </Button>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <User className="w-4 h-4" />
              Minha Conta
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
