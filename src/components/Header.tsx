import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, User, Settings } from "lucide-react";
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
    } else {
      setIsChecking(false);
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
      <div className="container px-4 py-4 flex justify-end items-center gap-4">
        <span className="text-sm text-muted-foreground hidden sm:inline">
          {user.email}
        </span>
        
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
            <DropdownMenuItem asChild>
              <Link to="/pricing" className="cursor-pointer">
                <Settings className="w-4 h-4 mr-2" />
                {hasSubscription ? "Gerenciar Plano" : "Assinar Plano"}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
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
