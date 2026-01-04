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
  TrendingUp, 
  Search,
  RefreshCw,
  Calendar,
  UserCheck,
  UserX,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ClipboardList,
  DollarSign,
  MessageSquare,
  BarChart3,
  Target,
  Zap,
  Mail,
  Eye,
  Reply,
  Send,
  TrendingDown,
  Activity,
  PieChart,
  ChevronRight,
  AlertTriangle
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
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

interface QuizResponse {
  id: string;
  user_email: string;
  how_found_us: string | null;
  objective: string | null;
  done_enem_before: string | null;
  skipped: boolean;
  created_at: string;
}

interface SupportMessage {
  id: string;
  user_email: string;
  user_id: string | null;
  subject: string;
  message: string;
  status: string;
  admin_reply: string | null;
  replied_at: string | null;
  created_at: string;
  updated_at: string;
}

const howFoundUsLabels: Record<string, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  amigos: "Indicação de amigos",
  google: "Pesquisa no Google",
  youtube: "YouTube",
  outro: "Outro",
};

const objectiveLabels: Record<string, string> = {
  medicina: "Medicina",
  direito: "Direito",
  engenharia: "Engenharia",
  federal: "Universidade Federal",
  bolsa: "ProUni/FIES",
  melhorar_nota: "Melhorar Nota",
};

const doneEnemLabels: Record<string, string> = {
  nunca: "Nunca fiz",
  uma_vez: "1 vez",
  duas_vezes: "2 vezes",
  tres_ou_mais: "3+ vezes",
};

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))', 'hsl(142, 76%, 36%)'];

const Admin = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [quizResponses, setQuizResponses] = useState<QuizResponse[]>([]);
  const [supportMessages, setSupportMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userFilter, setUserFilter] = useState<"all" | "subscribed" | "free">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [supportFilter, setSupportFilter] = useState<"all" | "pending" | "replied">("all");
  const [selectedMessage, setSelectedMessage] = useState<SupportMessage | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);
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
      await Promise.all([
        fetchDashboardData(),
        fetchQuizResponses(),
        fetchSupportMessages()
      ]);
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
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Sessão expirada");
        navigate("/auth");
        return;
      }
      
      const { data, error } = await supabase.functions.invoke("admin-dashboard", {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      if (error) throw error;
      setDashboardData(data);
    } catch (error) {
      toast.error("Erro ao carregar dados");
    } finally {
      setRefreshing(false);
    }
  };

  const fetchQuizResponses = async () => {
    try {
      const { data, error } = await supabase
        .from("quiz_responses")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      setQuizResponses(data || []);
    } catch (error) {
      console.error("Erro ao carregar respostas do quiz:", error);
    }
  };

  const fetchSupportMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("support_messages")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      setSupportMessages(data || []);
    } catch (error) {
      console.error("Erro ao carregar mensagens de suporte:", error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchDashboardData(),
      fetchQuizResponses(),
      fetchSupportMessages()
    ]);
    setRefreshing(false);
    toast.success("Dados atualizados!");
  };

  const handleReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;
    
    setReplying(true);
    try {
      const { error } = await supabase
        .from("support_messages")
        .update({
          admin_reply: replyText,
          status: "replied",
          replied_at: new Date().toISOString()
        })
        .eq("id", selectedMessage.id);

      if (error) throw error;
      
      toast.success("Resposta enviada!");
      setSelectedMessage(null);
      setReplyText("");
      await fetchSupportMessages();
    } catch (error) {
      toast.error("Erro ao enviar resposta");
    } finally {
      setReplying(false);
    }
  };

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const formatFullDate = (dateString: string) => {
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Carregando painel...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin || !dashboardData) return null;

  // Filtered data
  const filteredUsers = dashboardData.users.filter((user) => {
    const matchesFilter = 
      userFilter === "all" ? true :
      userFilter === "subscribed" ? user.subscription !== null :
      user.subscription === null;
    
    const matchesSearch = user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const filteredMessages = supportMessages.filter(msg => {
    if (supportFilter === "pending") return msg.status === "pending";
    if (supportFilter === "replied") return msg.status === "replied";
    return true;
  });

  // Metrics
  const conversionRate = dashboardData.total_users > 0
    ? Math.round((dashboardData.total_subscriptions / dashboardData.total_users) * 100)
    : 0;

  const pendingMessages = supportMessages.filter(m => m.status === "pending").length;
  const quizCompletionRate = dashboardData.total_users > 0
    ? Math.round((quizResponses.filter(q => !q.skipped).length / dashboardData.total_users) * 100)
    : 0;

  // Calculate users by day for chart (last 7 days)
  const getLast7DaysData = () => {
    const days: { date: string; users: number; subs: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const usersCount = dashboardData.users.filter(u => {
        const created = new Date(u.created_at);
        return created >= dayStart && created <= dayEnd;
      }).length;

      const subsCount = dashboardData.users.filter(u => {
        if (!u.subscription) return false;
        const created = new Date(u.created_at);
        return created >= dayStart && created <= dayEnd && u.subscription;
      }).length;

      days.push({ date: dateStr, users: usersCount, subs: subsCount });
    }
    return days;
  };

  // Quiz analytics
  const getQuizSourceData = () => {
    const sources: Record<string, number> = {};
    quizResponses.forEach(q => {
      if (q.how_found_us) {
        const label = howFoundUsLabels[q.how_found_us] || q.how_found_us;
        sources[label] = (sources[label] || 0) + 1;
      }
    });
    return Object.entries(sources).map(([name, value]) => ({ name, value }));
  };

  const getObjectiveData = () => {
    const objectives: Record<string, number> = {};
    quizResponses.forEach(q => {
      if (q.objective) {
        const label = objectiveLabels[q.objective] || q.objective;
        objectives[label] = (objectives[label] || 0) + 1;
      }
    });
    return Object.entries(objectives).map(([name, value]) => ({ name, value }));
  };

  const getEnemExperienceData = () => {
    const experience: Record<string, number> = {};
    quizResponses.forEach(q => {
      if (q.done_enem_before) {
        const label = doneEnemLabels[q.done_enem_before] || q.done_enem_before;
        experience[label] = (experience[label] || 0) + 1;
      }
    });
    return Object.entries(experience).map(([name, value]) => ({ name, value }));
  };

  // Recent activity
  const recentUsers = [...dashboardData.users]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const usersWithCancelingSub = dashboardData.users.filter(u => u.subscription?.cancel_at_period_end);

  const chartData = getLast7DaysData();
  const sourceData = getQuizSourceData();
  const objectiveData = getObjectiveData();
  const enemData = getEnemExperienceData();

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
                <p className="text-sm text-muted-foreground">Gestão completa da plataforma</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
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
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
            <TabsTrigger value="dashboard" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Usuários</span>
            </TabsTrigger>
            <TabsTrigger value="quiz" className="gap-2">
              <ClipboardList className="w-4 h-4" />
              <span className="hidden sm:inline">Quiz</span>
            </TabsTrigger>
            <TabsTrigger value="support" className="gap-2 relative">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Suporte</span>
              {pendingMessages > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {pendingMessages}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="mt-6 space-y-6">
            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.total_users}</div>
                  <p className="text-xs text-muted-foreground">
                    +{recentUsers.length} nos últimos 7 dias
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Assinantes Ativos</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{dashboardData.total_subscriptions}</div>
                  <p className="text-xs text-muted-foreground">
                    {usersWithCancelingSub.length > 0 && (
                      <span className="text-orange-500">{usersWithCancelingSub.length} cancelando</span>
                    )}
                    {usersWithCancelingSub.length === 0 && "Nenhum cancelamento pendente"}
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
                  <Progress value={conversionRate} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Suporte Pendente</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${pendingMessages > 0 ? 'text-orange-500' : 'text-green-600'}`}>
                    {pendingMessages}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {supportMessages.length} mensagens totais
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* User Growth Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Crescimento (7 dias)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="date" className="text-xs" />
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
                          dataKey="users" 
                          name="Novos Usuários"
                          stroke="hsl(var(--primary))" 
                          fill="hsl(var(--primary))" 
                          fillOpacity={0.3} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="subs" 
                          name="Novas Assinaturas"
                          stroke="hsl(142, 76%, 36%)" 
                          fill="hsl(142, 76%, 36%)" 
                          fillOpacity={0.3} 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Quiz Source Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Origem dos Usuários
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    {sourceData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <RePieChart>
                          <Pie
                            data={sourceData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {sourceData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RePieChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground">
                        Sem dados do quiz ainda
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Secondary Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Objectives Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Objetivos dos Usuários
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    {objectiveData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={objectiveData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" width={100} className="text-xs" />
                          <Tooltip />
                          <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground">
                        Sem dados ainda
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* ENEM Experience Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Experiência com ENEM
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    {enemData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={enemData}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="name" className="text-xs" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-muted-foreground">
                        Sem dados ainda
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Alerts and Recent Activity */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    Alertas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {pendingMessages > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-orange-500/10 rounded-lg">
                      <MessageSquare className="w-5 h-5 text-orange-500" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{pendingMessages} mensagem(ns) sem resposta</p>
                        <p className="text-xs text-muted-foreground">Verifique a aba Suporte</p>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => setActiveTab("support")}>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  {usersWithCancelingSub.length > 0 && (
                    <div className="flex items-center gap-3 p-3 bg-red-500/10 rounded-lg">
                      <TrendingDown className="w-5 h-5 text-red-500" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{usersWithCancelingSub.length} cancelamento(s) pendente(s)</p>
                        <p className="text-xs text-muted-foreground">Assinaturas que serão canceladas</p>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => setActiveTab("users")}>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  {pendingMessages === 0 && usersWithCancelingSub.length === 0 && (
                    <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <p className="font-medium text-sm">Tudo em ordem!</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Users */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Usuários Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentUsers.map(user => (
                      <div key={user.id} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-medium text-primary">
                            {user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{user.email}</p>
                          <p className="text-xs text-muted-foreground">{formatFullDate(user.created_at)}</p>
                        </div>
                        {user.subscription ? (
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0">
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
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  <div>
                    <CardTitle>Gestão de Usuários</CardTitle>
                    <CardDescription>
                      {filteredUsers.length} de {dashboardData.total_users} usuário(s)
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

          {/* Quiz Responses Tab */}
          <TabsContent value="quiz" className="mt-6 space-y-6">
            {/* Quiz Stats */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total de Respostas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{quizResponses.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Completaram</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {quizResponses.filter(q => !q.skipped).length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Pularam</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-500">
                    {quizResponses.filter(q => q.skipped).length}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Respostas do Quiz de Onboarding</CardTitle>
                <CardDescription>
                  {quizResponses.length} resposta(s) registrada(s)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {quizResponses.length === 0 ? (
                  <div className="text-center py-12">
                    <ClipboardList className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Nenhuma resposta ainda</p>
                  </div>
                ) : (
                  <div className="rounded-lg border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>Usuário</TableHead>
                          <TableHead>Como nos conheceu?</TableHead>
                          <TableHead>Objetivo</TableHead>
                          <TableHead>Fez ENEM antes?</TableHead>
                          <TableHead>Data</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {quizResponses.map((response) => (
                          <TableRow key={response.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="text-xs font-medium text-primary">
                                    {response.user_email.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <span className="font-medium text-sm">{response.user_email}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {response.how_found_us ? (
                                <Badge variant="outline">
                                  {howFoundUsLabels[response.how_found_us] || response.how_found_us}
                                </Badge>
                              ) : (
                                <span className="text-xs text-muted-foreground">Pulou</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {response.objective ? (
                                <Badge variant="outline">
                                  {objectiveLabels[response.objective] || response.objective}
                                </Badge>
                              ) : (
                                <span className="text-xs text-muted-foreground">Pulou</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {response.done_enem_before ? (
                                <Badge variant="outline">
                                  {doneEnemLabels[response.done_enem_before] || response.done_enem_before}
                                </Badge>
                              ) : (
                                <span className="text-xs text-muted-foreground">Pulou</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-muted-foreground">
                                {formatFullDate(response.created_at)}
                              </span>
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
          <TabsContent value="support" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                  <div>
                    <CardTitle>Central de Suporte</CardTitle>
                    <CardDescription>
                      {filteredMessages.length} mensagem(ns)
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant={supportFilter === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSupportFilter("all")}
                    >
                      Todas
                    </Button>
                    <Button
                      variant={supportFilter === "pending" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSupportFilter("pending")}
                      className="gap-1"
                    >
                      <Clock className="w-4 h-4" />
                      Pendentes
                      {pendingMessages > 0 && (
                        <Badge variant="destructive" className="ml-1">{pendingMessages}</Badge>
                      )}
                    </Button>
                    <Button
                      variant={supportFilter === "replied" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSupportFilter("replied")}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Respondidas
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredMessages.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Nenhuma mensagem</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredMessages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`p-4 rounded-lg border ${msg.status === 'pending' ? 'border-orange-500/50 bg-orange-500/5' : 'bg-muted/30'}`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Mail className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium text-sm">{msg.user_email}</span>
                              <Badge variant={msg.status === "pending" ? "outline" : "secondary"}>
                                {msg.status === "pending" ? "Pendente" : "Respondida"}
                              </Badge>
                            </div>
                            <h4 className="font-semibold mb-1">{msg.subject}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">{msg.message}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {formatFullDate(msg.created_at)}
                            </p>
                            {msg.admin_reply && (
                              <div className="mt-3 p-3 bg-primary/5 rounded-lg border-l-2 border-primary">
                                <p className="text-xs font-medium text-primary mb-1">Sua resposta:</p>
                                <p className="text-sm">{msg.admin_reply}</p>
                              </div>
                            )}
                          </div>
                          <Button 
                            size="sm" 
                            variant={msg.status === "pending" ? "default" : "outline"}
                            onClick={() => {
                              setSelectedMessage(msg);
                              setReplyText(msg.admin_reply || "");
                            }}
                          >
                            {msg.status === "pending" ? (
                              <>
                                <Reply className="w-4 h-4 mr-1" />
                                Responder
                              </>
                            ) : (
                              <>
                                <Eye className="w-4 h-4 mr-1" />
                                Ver
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Reply Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Mensagem de Suporte</DialogTitle>
            <DialogDescription>
              De: {selectedMessage?.user_email}
            </DialogDescription>
          </DialogHeader>
          
          {selectedMessage && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-lg">{selectedMessage.subject}</h4>
                <p className="text-sm text-muted-foreground mt-2">{selectedMessage.message}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Enviado em: {formatFullDate(selectedMessage.created_at)}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Sua Resposta</label>
                <Textarea 
                  placeholder="Digite sua resposta..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={5}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleReply} 
                  disabled={!replyText.trim() || replying}
                >
                  {replying ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Resposta
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
