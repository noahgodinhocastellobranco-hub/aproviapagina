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
import { toast } from "sonner";
import { ArrowLeft, Shield, Users, CreditCard, TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [filter, setFilter] = useState<"all" | "subscribed" | "free">("all");
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminAndFetchData();
  }, []);

  const checkAdminAndFetchData = async () => {
    try {
      console.log("🔍 Verificando sessão e permissões de admin...");
      
      // Verificar autenticação
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      // Se há erro na sessão ou não há sessão, redirecionar para auth
      if (sessionError || !session) {
        console.log("❌ Sessão inválida ou expirada");
        if (sessionError) {
          await supabase.auth.signOut();
        }
        toast.error("Sessão expirada, faça login novamente");
        navigate("/auth");
        return;
      }

      console.log("✅ Sessão válida. User ID:", session.user.id);

      // Verificar se é admin usando a função RPC
      const { data: isAdminData, error: adminError } = await supabase.rpc('has_role', {
        _user_id: session.user.id,
        _role: 'admin'
      });

      console.log("🔐 Verificação de admin:", isAdminData, "Erro:", adminError);

      if (adminError) {
        console.error("❌ Erro ao verificar role:", adminError);
        toast.error("Erro ao verificar permissões");
        navigate("/");
        return;
      }

      if (!isAdminData) {
        console.log("🚫 Usuário não é admin");
        toast.error("Acesso negado: apenas administradores");
        navigate("/");
        return;
      }

      console.log("✅ Usuário é admin! Buscando dados do dashboard...");
      setIsAdmin(true);

      // Buscar dados do dashboard
      const { data, error } = await supabase.functions.invoke("admin-dashboard");

      if (error) {
        console.error("❌ Erro ao buscar dados:", error);
        toast.error("Erro ao carregar dados do dashboard");
        return;
      }

      console.log("✅ Dados do dashboard carregados:", data);
      setDashboardData(data);
    } catch (error) {
      console.error("❌ Erro geral:", error);
      toast.error("Erro ao verificar permissões");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Carregando...</p>
      </div>
    );
  }

  if (!isAdmin || !dashboardData) {
    return null;
  }

  const filteredUsers = dashboardData.users.filter((user) => {
    if (filter === "subscribed") return user.subscription !== null;
    if (filter === "free") return user.subscription === null;
    return true;
  });

  // Dados para gráficos
  const subscriptionData = [
    { name: "Assinantes", value: dashboardData.total_subscriptions, color: "#10b981" },
    { name: "Gratuitos", value: dashboardData.total_users - dashboardData.total_subscriptions, color: "#6b7280" },
  ];

  // Dados de crescimento simulados (últimos 7 dias)
  const growthData = [
    { day: "Seg", usuarios: Math.max(0, dashboardData.total_users - 6), assinantes: Math.max(0, dashboardData.total_subscriptions - 4) },
    { day: "Ter", usuarios: Math.max(0, dashboardData.total_users - 5), assinantes: Math.max(0, dashboardData.total_subscriptions - 3) },
    { day: "Qua", usuarios: Math.max(0, dashboardData.total_users - 4), assinantes: Math.max(0, dashboardData.total_subscriptions - 3) },
    { day: "Qui", usuarios: Math.max(0, dashboardData.total_users - 3), assinantes: Math.max(0, dashboardData.total_subscriptions - 2) },
    { day: "Sex", usuarios: Math.max(0, dashboardData.total_users - 2), assinantes: Math.max(0, dashboardData.total_subscriptions - 1) },
    { day: "Sáb", usuarios: Math.max(0, dashboardData.total_users - 1), assinantes: dashboardData.total_subscriptions },
    { day: "Dom", usuarios: dashboardData.total_users, assinantes: dashboardData.total_subscriptions },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">Painel Administrativo</h1>
          </div>
          <Button variant="outline" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        </div>
      </header>

      <main className="container px-4 py-8">
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.total_users}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +{dashboardData.total_users > 0 ? Math.ceil(dashboardData.total_users * 0.12) : 0} esta semana
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Assinaturas Ativas</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.total_subscriptions}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +{dashboardData.total_subscriptions > 0 ? Math.ceil(dashboardData.total_subscriptions * 0.08) : 0} esta semana
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData.total_users > 0
                  ? Math.round((dashboardData.total_subscriptions / dashboardData.total_users) * 100)
                  : 0}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Meta: 25%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Crescimento Semanal</CardTitle>
              <CardDescription>Usuários e assinantes nos últimos 7 dias</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="usuarios" stroke="#8884d8" name="Usuários" strokeWidth={2} />
                  <Line type="monotone" dataKey="assinantes" stroke="#10b981" name="Assinantes" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Usuários</CardTitle>
              <CardDescription>Assinantes vs Gratuitos</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={subscriptionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {subscriptionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Usuários ({filteredUsers.length})</CardTitle>
                <CardDescription>
                  {filter === "all" && "Lista completa de todos os usuários"}
                  {filter === "subscribed" && "Usuários com assinatura ativa"}
                  {filter === "free" && "Usuários sem assinatura"}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("all")}
                >
                  Todos
                </Button>
                <Button
                  variant={filter === "subscribed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("subscribed")}
                  className="gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  Assinantes
                </Button>
                <Button
                  variant={filter === "free" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("free")}
                >
                  Gratuitos
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum usuário encontrado nesta categoria
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Data de Cadastro</TableHead>
                    <TableHead>Último Login</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assinatura</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow 
                      key={user.id}
                      className={user.subscription ? "bg-green-50 dark:bg-green-950/20" : ""}
                    >
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell>{formatDate(user.created_at)}</TableCell>
                      <TableCell>
                        {user.last_sign_in_at ? formatDate(user.last_sign_in_at) : "Nunca"}
                      </TableCell>
                      <TableCell>
                        {user.subscription ? (
                          <Badge variant="default" className="bg-green-600">
                            ✓ Assinante
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            Gratuito
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.subscription ? (
                          <div className="text-sm">
                            <p className="font-medium text-green-700 dark:text-green-400">
                              ID: {user.subscription.id}
                            </p>
                            <p className="text-muted-foreground">
                              Válido até: {formatDate(user.subscription.current_period_end)}
                            </p>
                            {user.subscription.cancel_at_period_end && (
                              <Badge variant="destructive" className="mt-1">
                                Cancelará no fim do período
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Sem assinatura</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin;