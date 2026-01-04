import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Shield, 
  Users, 
  TrendingUp, 
  Search,
  RefreshCw,
  Calendar,
  UserCheck,
  UserX,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";

interface UserData {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string;
  subscription: {
    id: string;
    status: string;
    current_period_end: string;
    cancel_at_period_end: boolean;
  } | null;
}

interface DashboardData {
  users: UserData[];
  total_users: number;
  total_subscriptions: number;
}

const Admin = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userFilter, setUserFilter] = useState<"all" | "subscribed" | "free">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAndFetchData();
  }, []);

  const checkAdminAndFetchData = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        if (sessionError) await supabase.auth.signOut();
        toast.error("Sessão expirada, faça login novamente");
        navigate("/auth");
        return;
      }

      const { data: isAdminData, error: adminError } = await supabase.rpc('has_role', {
        _user_id: session.user.id,
        _role: 'admin'
      });

      if (adminError || !isAdminData) {
        toast.error("Acesso negado: apenas administradores");
        navigate("/");
        return;
      }

      setIsAdmin(true);
      await fetchDashboardData();
    } catch (error) {
      toast.error("Erro ao verificar permissões");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    setRefreshing(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-dashboard");
      if (error) throw error;
      setDashboardData(data);
    } catch (error) {
      toast.error("Erro ao carregar dados");
    } finally {
      setRefreshing(false);
    }
  };

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Carregando painel...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin || !dashboardData) return null;

  const filteredUsers = dashboardData.users.filter((user) => {
    const matchesFilter = 
      userFilter === "all" ? true :
      userFilter === "subscribed" ? user.subscription !== null :
      user.subscription === null;
    
    const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const conversionRate = dashboardData.total_users > 0
    ? Math.round((dashboardData.total_subscriptions / dashboardData.total_users) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container px-4 py-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Painel Administrativo</h1>
                <p className="text-sm text-muted-foreground">AprovI.A Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchDashboardData}
                disabled={refreshing}
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate("/")} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container px-4 py-6 space-y-6">
        {/* Taxa de Conversão */}
        <Card className="max-w-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{conversionRate}%</div>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${Math.min(conversionRate, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {dashboardData.total_subscriptions} de {dashboardData.total_users} usuários
            </p>
          </CardContent>
        </Card>

        {/* Lista de Usuários */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div>
                <CardTitle>Usuários</CardTitle>
                <CardDescription>
                  {filteredUsers.length} usuário(s) encontrado(s)
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-full sm:w-64"
                  />
                </div>
                <div className="flex gap-1">
                  <Button
                    variant={userFilter === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setUserFilter("all")}
                  >
                    Todos
                  </Button>
                  <Button
                    variant={userFilter === "subscribed" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setUserFilter("subscribed")}
                  >
                    <UserCheck className="w-4 h-4 mr-1" />
                    Premium
                  </Button>
                  <Button
                    variant={userFilter === "free" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setUserFilter("free")}
                  >
                    <UserX className="w-4 h-4 mr-1" />
                    Free
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhum usuário encontrado</p>
              </div>
            ) : (
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Usuário</TableHead>
                      <TableHead>Cadastro</TableHead>
                      <TableHead>Último Acesso</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Assinatura</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-medium text-primary">
                                {user.email.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="font-medium">{user.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {formatShortDate(user.created_at)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {user.last_sign_in_at ? formatShortDate(user.last_sign_in_at) : "Nunca"}
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.subscription ? (
                            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Ativo
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <XCircle className="w-3 h-3 mr-1" />
                              Free
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {user.subscription ? (
                            <div className="space-y-1">
                              <p className="text-xs">
                                Válido até: {formatShortDate(user.subscription.current_period_end)}
                              </p>
                              {user.subscription.cancel_at_period_end && (
                                <Badge variant="destructive" className="text-xs">
                                  <AlertCircle className="w-3 h-3 mr-1" />
                                  Cancelará
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin;
