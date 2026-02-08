import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, User, Settings, LayoutDashboard, Rocket, Sparkles, Moon, Sun } from "lucide-react";
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
  const isCheckingRef = useRef(false);

  const checkSubscription = useCallback(async (accessToken: string) => {
    // Prevent duplicate concurrent calls
    if (isCheckingRef.current) return;
    isCheckingRef.current = true;

    try {
      console.log("🔍 Verificando status de assinatura...");

      const { data, error } = await supabase.functions.invoke("check-subscription", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (error) {
        console.error("❌ Erro ao verificar assinatura:", error);
        setHasSubscription(false);
        return;
      }

      console.log("📊 Resposta da verificação de assinatura:", data);
      console.log("✅ hasSubscription:", data?.hasSubscription);
      setHasSubscription(data?.hasSubscription || false);
    } catch (error) {
      console.error("❌ Erro ao verificar assinatura:", error);
      setHasSubscription(false);
    } finally {
      isCheckingRef.current = false;
    }
  }, []);

  const checkAdminRole = useCallback(async (userId: string) => {
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
  }, []);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (!session) {
          setUser(null);
          setHasSubscription(false);
          setIsAdmin(false);
          setIsChecking(false);
          return;
        }

        setUser(session.user);
        // Run checks in parallel, using existing access_token
        await Promise.all([
          checkSubscription(session.access_token),
          checkAdminRole(session.user.id),
        ]);
      } catch (error) {
        console.error("Erro ao verificar sessão:", error);
        if (isMounted) {
          setUser(null);
          setHasSubscription(false);
          setIsAdmin(false);
        }
      } finally {
        if (isMounted) setIsChecking(false);
      }
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;

      if (session?.user) {
        setUser(session.user);
        // Defer to avoid deadlock, use token from session directly
        setTimeout(() => {
          if (isMounted) {
            checkSubscription(session.access_token);
            checkAdminRole(session.user.id);
          }
        }, 0);
      } else {
        setUser(null);
        setHasSubscription(false);
        setIsAdmin(false);
        setIsChecking(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [checkSubscription, checkAdminRole]);

  const handleLogout = async () => {
    try {
      setUser(null);
      setHasSubscription(false);
      setIsAdmin(false);

      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Erro ao fazer logout:", error);
      }

      toast.success("Logout realizado com sucesso");
      navigate("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      setUser(null);
      setHasSubscription(false);
      setIsAdmin(false);
      navigate("/");
      toast.error("Sessão encerrada");
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
            <Link to="/app">
              <span className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm animate-pulse">
                PRO
              </span>
              <Rocket className="w-4 h-4" />
              <span className="hidden sm:inline">Comece a Estudar</span>
            </Link>
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
