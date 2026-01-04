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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Shield, 
  Users, 
  CreditCard, 
  TrendingUp, 
  MessageCircle,
  Search,
  RefreshCw,
  BarChart3,
  Settings,
  Mail,
  Calendar,
  DollarSign,
  UserCheck,
  UserX,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";
import AdminSupport from "@/components/AdminSupport";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
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
  const [refreshing, setRefreshing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userFilter, setUserFilter] = useState<"all" | "subscribed" | "free">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  const subscriptionData = [
    { name: "Assinantes", value: dashboardData.total_subscriptions, color: "hsl(var(--primary))" },
    { name: "Gratuitos", value: dashboardData.total_users - dashboardData.total_subscriptions, color: "hsl(var(--muted-foreground))" },
  ];

  const growthData = [
    { day: "Seg", usuarios: Math.max(0, dashboardData.total_users - 6), assinantes: Math.max(0, dashboardData.total_subscriptions - 4) },
    { day: "Ter", usuarios: Math.max(0, dashboardData.total_users - 5), assinantes: Math.max(0, dashboardData.total_subscriptions - 3) },
    { day: "Qua", usuarios: Math.max(0, dashboardData.total_users - 4), assinantes: Math.max(0, dashboardData.total_subscriptions - 3) },
    { day: "Qui", usuarios: Math.max(0, dashboardData.total_users - 3), assinantes: Math.max(0, dashboardData.total_subscriptions - 2) },
    { day: "Sex", usuarios: Math.max(0, dashboardData.total_users - 2), assinantes: Math.max(0, dashboardData.total_subscriptions - 1) },
    { day: "Sáb", usuarios: Math.max(0, dashboardData.total_users - 1), assinantes: dashboardData.total_subscriptions },
    { day: "Dom", usuarios: dashboardData.total_users, assinantes: dashboardData.total_subscriptions },
  ];

  const conversionRate = dashboardData.total_users > 0
    ? Math.round((dashboardData.total_subscriptions / dashboardData.total_users) * 100)
    : 0;

  const recentUsers = dashboardData.users.slice(0, 5);
  const subscribedCount = dashboardData.total_subscriptions;
  const freeCount = dashboardData.total_users - subscribedCount;

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

      <main className="container px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-lg grid-cols-4">
            <TabsTrigger value="overview" className="gap-2">
              <BarChart3 className="w-4 h-4 hidden sm:block" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4 hidden sm:block" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="support" className="gap-2">
              <MessageCircle className="w-4 h-4 hidden sm:block" />
              Suporte
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="w-4 h-4 hidden sm:block" />
              Ajustes
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.total_users}</div>
                  <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>+12% esta semana</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Assinantes</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{subscribedCount}</div>
                  <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    <span>+8% esta semana</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Usuários Free</CardTitle>
                  <UserX className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{freeCount}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Potenciais conversões
                  </p>
                </CardContent>
              </Card>

              <Card>
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
                  <p className="text-xs text-muted-foreground mt-1">Meta: 25%</p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Crescimento Semanal</CardTitle>
                  <CardDescription>Evolução de usuários e assinantes</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={280}>
                    <AreaChart data={growthData}>
                      <defs>
                        <linearGradient id="colorUsuarios" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorAssinantes" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="day" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="usuarios" 
                        stroke="hsl(var(--muted-foreground))" 
                        fill="url(#colorUsuarios)" 
                        name="Usuários"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="assinantes" 
                        stroke="hsl(var(--primary))" 
                        fill="url(#colorAssinantes)" 
                        name="Assinantes"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Distribuição</CardTitle>
                  <CardDescription>Assinantes vs Gratuitos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center">
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={subscriptionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {subscriptionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-6 mt-4">
                    {subscriptionData.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm text-muted-foreground">
                          {item.name}: {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Users */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Usuários Recentes</CardTitle>
                    <CardDescription>Últimos cadastros na plataforma</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab("users")}>
                    Ver Todos
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary">
                            {user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{user.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Cadastrado em {formatShortDate(user.created_at)}
                          </p>
                        </div>
                      </div>
                      {user.subscription ? (
                        <Badge className="bg-primary/10 text-primary border-0">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Free</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  <div>
                    <CardTitle>Gerenciamento de Usuários</CardTitle>
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
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support">
            <AdminSupport />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Configurações de Email
                  </CardTitle>
                  <CardDescription>Gerencie notificações por email</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium text-sm">Notificações de novos usuários</p>
                      <p className="text-xs text-muted-foreground">Receba um email a cada novo cadastro</p>
                    </div>
                    <Badge variant="outline">Em breve</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium text-sm">Alertas de suporte</p>
                      <p className="text-xs text-muted-foreground">Notificações de novas mensagens</p>
                    </div>
                    <Badge variant="outline">Em breve</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Configurações de Pagamento
                  </CardTitle>
                  <CardDescription>Gerencie integrações de pagamento</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium text-sm">Stripe</p>
                      <p className="text-xs text-muted-foreground">Processamento de pagamentos</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Conectado
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium text-sm">Webhooks</p>
                      <p className="text-xs text-muted-foreground">Eventos automáticos do Stripe</p>
                    </div>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Ativo
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Segurança
                  </CardTitle>
                  <CardDescription>Configurações de segurança do sistema</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium text-sm">Autenticação 2FA</p>
                      <p className="text-xs text-muted-foreground">Camada extra de segurança</p>
                    </div>
                    <Badge variant="outline">Em breve</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium text-sm">Logs de acesso</p>
                      <p className="text-xs text-muted-foreground">Histórico de acessos admin</p>
                    </div>
                    <Badge variant="outline">Em breve</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Relatórios
                  </CardTitle>
                  <CardDescription>Exporte dados e relatórios</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium text-sm">Exportar usuários</p>
                      <p className="text-xs text-muted-foreground">Download em CSV</p>
                    </div>
                    <Badge variant="outline">Em breve</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium text-sm">Relatório financeiro</p>
                      <p className="text-xs text-muted-foreground">Resumo de receitas</p>
                    </div>
                    <Badge variant="outline">Em breve</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
