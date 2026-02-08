import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Rocket, Settings, LogOut, MessageSquare, User, BookOpen, Brain,
  Sparkles, ChevronRight, LayoutDashboard, Zap, Star, Shield,
  CheckCircle2, FileText, GraduationCap, Timer, PenTool, Moon, Sun, Flame, TrendingUp,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
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

interface PremiumHomeProps {
  user: any;
  isAdmin: boolean;
}

const ENEM_TOPICS = [
  { subject: "Matemática", topic: "Porcentagem e Juros Compostos", icon: "📐", tip: "Pratique converter frações em porcentagens e calcule juros compostos." },
  { subject: "Redação", topic: "Repertório Sociocultural", icon: "✍️", tip: "Leia sobre direitos humanos e questões sociais brasileiras." },
  { subject: "Biologia", topic: "Ecologia e Meio Ambiente", icon: "🧬", tip: "Revise cadeias alimentares, ciclos biogeoquímicos e biomas." },
  { subject: "História", topic: "Era Vargas e Estado Novo", icon: "📜", tip: "Entenda o populismo, as leis trabalhistas e o contexto político." },
  { subject: "Física", topic: "Cinemática e Dinâmica", icon: "⚡", tip: "Revise MRU, MRUV e as Leis de Newton com exercícios práticos." },
  { subject: "Química", topic: "Estequiometria", icon: "🧪", tip: "Pratique balanceamento de equações e cálculos de massa molar." },
  { subject: "Geografia", topic: "Urbanização Brasileira", icon: "🌍", tip: "Estude êxodo rural, metropolização e problemas urbanos." },
  { subject: "Português", topic: "Interpretação de Texto", icon: "📖", tip: "Leia textos variados e identifique a ideia central e intertextualidade." },
  { subject: "Filosofia", topic: "Ética e Moral", icon: "🤔", tip: "Revise Kant, Aristóteles e o conceito de imperativo categórico." },
  { subject: "Sociologia", topic: "Movimentos Sociais", icon: "👥", tip: "Estude os principais movimentos sociais no Brasil e no mundo." },
  { subject: "Matemática", topic: "Geometria Plana e Espacial", icon: "📏", tip: "Revise áreas, volumes e o Teorema de Pitágoras." },
  { subject: "Redação", topic: "Proposta de Intervenção", icon: "💡", tip: "Pratique escrever soluções detalhadas com agente, ação, meio e efeito." },
  { subject: "Biologia", topic: "Genética e Hereditariedade", icon: "🧬", tip: "Revise as Leis de Mendel, cruzamentos e heredogramas." },
  { subject: "História", topic: "Revolução Industrial", icon: "🏭", tip: "Entenda as transformações econômicas e sociais da industrialização." },
  { subject: "Física", topic: "Eletricidade e Circuitos", icon: "🔌", tip: "Revise Lei de Ohm, potência elétrica e circuitos em série/paralelo." },
  { subject: "Química", topic: "Funções Orgânicas", icon: "⚗️", tip: "Identifique álcoois, aldeídos, cetonas e ácidos carboxílicos." },
  { subject: "Geografia", topic: "Clima e Vegetação do Brasil", icon: "🌿", tip: "Revise os climas tropicais, equatoriais e a relação com biomas." },
  { subject: "Português", topic: "Figuras de Linguagem", icon: "🎭", tip: "Identifique metáforas, metonímias, ironias e hipérboles em textos." },
  { subject: "Filosofia", topic: "Existencialismo", icon: "💭", tip: "Revise Sartre, Heidegger e o conceito de liberdade e angústia." },
  { subject: "Sociologia", topic: "Cultura e Identidade", icon: "🎨", tip: "Estude diversidade cultural, etnocentrismo e relativismo cultural." },
  { subject: "Matemática", topic: "Probabilidade e Estatística", icon: "🎲", tip: "Pratique média, mediana, moda e cálculos de probabilidade." },
  { subject: "Física", topic: "Termodinâmica", icon: "🌡️", tip: "Revise as leis da termodinâmica, calor e trabalho." },
  { subject: "Química", topic: "Soluções e Concentração", icon: "🫧", tip: "Pratique cálculos de concentração, diluição e mistura de soluções." },
  { subject: "História", topic: "Brasil República", icon: "🇧🇷", tip: "Revise República Velha, coronelismo e política do café com leite." },
  { subject: "Biologia", topic: "Fisiologia Humana", icon: "❤️", tip: "Revise sistema circulatório, digestório e nervoso." },
  { subject: "Redação", topic: "Coesão e Coerência", icon: "🔗", tip: "Pratique o uso de conectivos e a organização lógica dos parágrafos." },
  { subject: "Geografia", topic: "Globalização e Comércio", icon: "🌐", tip: "Estude blocos econômicos, OMC e relações internacionais." },
  { subject: "Português", topic: "Variação Linguística", icon: "🗣️", tip: "Entenda regionalismos, gírias e norma culta vs. coloquial." },
  { subject: "Matemática", topic: "Funções e Gráficos", icon: "📈", tip: "Revise funções do 1° e 2° grau, exponencial e logarítmica." },
  { subject: "História", topic: "Guerra Fria", icon: "🌍", tip: "Estude bipolaridade, corrida espacial e influências na América Latina." },
  { subject: "Física", topic: "Óptica e Ondas", icon: "🌊", tip: "Revise reflexão, refração, difração e propriedades das ondas." },
];

const MOTIVATIONAL_QUOTES = [
  { quote: "A consistência é mais importante que a perfeição.", author: "Provérbio" },
  { quote: "O segredo do sucesso é começar antes de estar pronto.", author: "Marie Forleo" },
  { quote: "Não importa o quão devagar você vá, desde que não pare.", author: "Confúcio" },
  { quote: "Estudar não é um fardo, é a chave para a liberdade.", author: "Anônimo" },
  { quote: "O único lugar onde o sucesso vem antes do trabalho é no dicionário.", author: "Albert Einstein" },
  { quote: "Disciplina é a ponte entre metas e conquistas.", author: "Jim Rohn" },
  { quote: "Acredite que você pode, e você já está no meio do caminho.", author: "Theodore Roosevelt" },
  { quote: "Todo expert já foi um iniciante.", author: "Helen Hayes" },
  { quote: "A educação é a arma mais poderosa para mudar o mundo.", author: "Nelson Mandela" },
  { quote: "Você não precisa ser perfeito para começar, mas precisa começar para ser perfeito.", author: "Zig Ziglar" },
  { quote: "Grandes conquistas são feitas por quem ousa começar.", author: "Anônimo" },
  { quote: "O esforço de hoje é o resultado de amanhã.", author: "Provérbio" },
  { quote: "Sua única limitação é aquela que você impõe a si mesmo.", author: "Napoleon Hill" },
  { quote: "A persistência é o caminho do êxito.", author: "Charles Chaplin" },
  { quote: "O conhecimento é o único bem que ninguém pode tirar de você.", author: "Benjamin Franklin" },
  { quote: "Cada dia é uma nova chance de fazer melhor.", author: "Anônimo" },
  { quote: "Sonhos determinam o que você quer. Ação determina o que você conquista.", author: "Aldo Novak" },
  { quote: "O futuro pertence àqueles que acreditam na beleza de seus sonhos.", author: "Eleanor Roosevelt" },
  { quote: "Não espere por oportunidades. Crie-as.", author: "George Bernard Shaw" },
  { quote: "A dor do estudo é temporária. A dor da ignorância é permanente.", author: "Anônimo" },
  { quote: "Faça o que puder, com o que tiver, onde estiver.", author: "Theodore Roosevelt" },
  { quote: "O sucesso nasce do querer. Sempre que o homem aplicar determinação, ele fará.", author: "José de Alencar" },
  { quote: "Inteligência sem ambição é como um pássaro sem asas.", author: "Salvador Dalí" },
  { quote: "Nunca é tarde demais para ser aquilo que sempre desejou.", author: "George Eliot" },
  { quote: "O estudo é a luz que ilumina os caminhos da vida.", author: "Anônimo" },
  { quote: "Quem não luta pelo futuro que quer, deve aceitar o futuro que vier.", author: "Anônimo" },
  { quote: "A vontade de se preparar precisa ser maior que a vontade de vencer.", author: "Bobby Knight" },
  { quote: "Plante hoje as sementes que colherá amanhã.", author: "Og Mandino" },
  { quote: "O impossível é apenas o que ainda não foi tentado.", author: "Anônimo" },
  { quote: "Suas escolhas de hoje moldam o seu amanhã.", author: "Provérbio" },
  { quote: "Aprender é a única coisa que a mente nunca se cansa.", author: "Leonardo da Vinci" },
];

const PLATFORM_FEATURES = [
  { icon: PenTool, label: "Correção de Redação", desc: "Feedback detalhado com IA" },
  { icon: Brain, label: "Chat AprovI.A", desc: "Tire dúvidas 24/7" },
  { icon: FileText, label: "Simulados ENEM", desc: "Provas de 2009 a 2025" },
  { icon: GraduationCap, label: "Professor Virtual", desc: "Explicações personalizadas" },
  { icon: Timer, label: "Pomodoro", desc: "Gestão de tempo inteligente" },
  { icon: Star, label: "Plano de Estudos", desc: "Baseado nas suas dificuldades" },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Bom dia";
  if (hour >= 12 && hour < 18) return "Boa tarde";
  return "Boa noite";
}

function getDailyItem<T>(items: T[]): T {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return items[dayOfYear % items.length];
}

function getUserName(user: any): string {
  return (
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Estudante"
  );
}

function getUserAvatar(user: any): string | null {
  return user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null;
}

const PremiumHome = ({ user, isAdmin }: PremiumHomeProps) => {
  const navigate = useNavigate();
  const { resolvedTheme, setTheme } = useTheme();
  const greeting = getGreeting();
  const dailyTopic = getDailyItem(ENEM_TOPICS);
  const dailyQuote = getDailyItem(MOTIVATIONAL_QUOTES);
  const userName = getUserName(user);
  const avatarUrl = getUserAvatar(user);
  const firstName = userName.split(" ")[0];

  // ENEM 2026 countdown — prova em 01/11/2026 (primeiro domingo de novembro)
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const enemDate = new Date("2026-11-01T12:00:00-03:00");
    const update = () => {
      const now = new Date();
      const diff = Math.max(0, enemDate.getTime() - now.getTime());
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  // Streak fire system
  const todayKey = new Date().toISOString().split("T")[0];
  const [fireActive, setFireActive] = useState(false);
  const [justActivated, setJustActivated] = useState(false);
  const [streakDays, setStreakDays] = useState(0);
  const [visitHistory, setVisitHistory] = useState<Record<string, number>>({});

  // Load visit history and streak on mount
  useEffect(() => {
    const storedDate = localStorage.getItem("aprovia_fire_date");
    const storedStreak = parseInt(localStorage.getItem("aprovia_fire_streak") || "0", 10);
    const storedVisits = JSON.parse(localStorage.getItem("aprovia_visits") || "{}") as Record<string, number>;
    setVisitHistory(storedVisits);
    
    if (storedDate === todayKey) {
      setFireActive(true);
      setStreakDays(storedStreak);
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayKey = yesterday.toISOString().split("T")[0];
      
      if (storedDate === yesterdayKey) {
        setStreakDays(storedStreak);
      } else {
        setStreakDays(0);
        localStorage.setItem("aprovia_fire_streak", "0");
      }
      setFireActive(false);
    }
  }, [todayKey]);

  // Build chart data for last 7 days
  const chartData = useMemo(() => {
    const days: { day: string; acessos: number }[] = [];
    const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      days.push({
        day: weekDays[d.getDay()],
        acessos: visitHistory[key] || 0,
      });
    }
    return days;
  }, [visitHistory]);

  const totalVisits = useMemo(() => {
    return Object.values(visitHistory).reduce((sum, v) => sum + v, 0);
  }, [visitHistory]);

  const recordVisit = useCallback(() => {
    const stored = JSON.parse(localStorage.getItem("aprovia_visits") || "{}") as Record<string, number>;
    stored[todayKey] = (stored[todayKey] || 0) + 1;
    
    // Keep only last 30 days
    const keys = Object.keys(stored).sort();
    if (keys.length > 30) {
      const toRemove = keys.slice(0, keys.length - 30);
      toRemove.forEach((k) => delete stored[k]);
    }
    
    localStorage.setItem("aprovia_visits", JSON.stringify(stored));
    setVisitHistory({ ...stored });
  }, [todayKey]);

  const activateFire = useCallback(() => {
    if (fireActive) return;
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = yesterday.toISOString().split("T")[0];
    const storedDate = localStorage.getItem("aprovia_fire_date");
    const storedStreak = parseInt(localStorage.getItem("aprovia_fire_streak") || "0", 10);
    
    let newStreak = 1;
    if (storedDate === yesterdayKey) {
      newStreak = storedStreak + 1;
    }
    
    localStorage.setItem("aprovia_fire_date", todayKey);
    localStorage.setItem("aprovia_fire_streak", String(newStreak));
    setFireActive(true);
    setStreakDays(newStreak);
    setJustActivated(true);
    setTimeout(() => setJustActivated(false), 1500);
  }, [fireActive, todayKey]);

  const handleAppClick = () => {
    activateFire();
    recordVisit();
  };

  // Listen for returning focus (user came back from app)
  useEffect(() => {
    const onFocus = () => {
      const storedDate = localStorage.getItem("aprovia_fire_date");
      if (storedDate === todayKey && !fireActive) {
        setFireActive(true);
        setJustActivated(true);
        const storedStreak = parseInt(localStorage.getItem("aprovia_fire_streak") || "0", 10);
        setStreakDays(storedStreak);
        setTimeout(() => setJustActivated(false), 1500);
      }
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [todayKey, fireActive]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logout realizado com sucesso");
      navigate("/");
    } catch {
      toast.error("Erro ao sair");
      navigate("/");
    }
  };

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container px-4 py-3 flex justify-between items-center">
          {/* Profile (left) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Foto de perfil"
                    className="w-10 h-10 rounded-full border-2 border-primary/30 object-cover shadow-sm"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                )}
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-sm font-semibold text-foreground leading-tight">{firstName}</span>
                  <span className="text-[11px] text-primary font-medium leading-tight flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
                    PRO Ativo
                  </span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{userName}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  Configurações
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Suporte
                </Link>
              </DropdownMenuItem>
              {isAdmin && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="cursor-pointer">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Painel Admin
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Fire Streak */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all duration-500 ${
              fireActive
                ? "bg-orange-500/10 border-orange-400/30 shadow-sm shadow-orange-500/10"
                : "bg-muted/50 border-border"
            } ${justActivated ? "animate-scale-in" : ""}`}>
              <Flame
                className={`w-5 h-5 transition-all duration-500 ${
                  fireActive
                    ? "text-orange-500 drop-shadow-[0_0_6px_rgba(249,115,22,0.5)]"
                    : "text-muted-foreground/40"
                } ${justActivated ? "animate-bounce" : ""}`}
                fill={fireActive ? "currentColor" : "none"}
              />
              <span className={`text-sm font-bold tabular-nums transition-colors duration-500 ${
                fireActive ? "text-orange-500" : "text-muted-foreground/40"
              }`}>
                {streakDays}
              </span>
            </div>
            <SupportChat />
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
              {resolvedTheme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated background — same style as landing */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-primary/10 to-transparent rounded-full blur-3xl" />
        </div>

        <div className="container px-4 py-10 md:py-16">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Greeting + Logo */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 text-accent-foreground shadow-sm">
                <Shield className="w-4 h-4 text-accent" />
                <span className="text-sm font-bold text-accent">Plano PRO Ativo</span>
              </div>

              <div className="flex items-center justify-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-150" />
                  <Brain className="w-12 h-12 md:w-14 md:h-14 text-primary relative" strokeWidth={1.5} />
                  <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-accent absolute -top-1 -right-1 animate-bounce" />
                </div>
                <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  AprovI.A
                </h1>
              </div>

              <h2 className="text-2xl md:text-4xl font-bold text-foreground leading-tight">
                {greeting}, <span className="text-primary">{firstName}</span>! 👋
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl">
                Sua plataforma de estudos com IA está pronta. Continue de onde parou!
              </p>
            </div>

            {/* Main CTA */}
            <div className="flex justify-center">
              <Button
                size="lg"
                className="text-lg md:text-xl px-12 md:px-16 py-7 md:py-8 shadow-2xl hover:shadow-primary/30 hover:scale-105 transition-all bg-gradient-to-r from-primary via-primary to-primary/90 relative group font-bold"
                asChild
              >
                <a href="https://aproviaapp.lovable.app" target="_blank" rel="noopener noreferrer" onClick={handleAppClick}>
                  <Rocket className="mr-3 h-6 w-6 group-hover:animate-bounce" />
                  ENTRAR NO APLICATIVO
                  <ChevronRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>

            {/* Trust Signals */}
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm">
              <span className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                Acesso ilimitado
              </span>
              <span className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                IA disponível 24/7
              </span>
              <span className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                Suporte humanizado
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container px-4 py-8 md:py-12 max-w-5xl mx-auto space-y-10">
        {/* ENEM Countdown */}
        <div className="rounded-2xl border-2 border-destructive/20 bg-gradient-to-r from-card via-card to-destructive/5 p-6 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-destructive/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center shadow-sm">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-destructive uppercase tracking-wider">Contagem Regressiva</p>
                <h3 className="text-lg font-bold text-foreground">ENEM 2026</h3>
              </div>
            </div>
            <div className="flex items-center gap-3 md:gap-4">
              {[
                { value: countdown.days, label: "dias" },
                { value: countdown.hours, label: "horas" },
                { value: countdown.minutes, label: "min" },
                { value: countdown.seconds, label: "seg" },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-background border-2 border-destructive/20 flex items-center justify-center shadow-sm">
                    <span className="text-xl md:text-2xl font-black text-foreground tabular-nums">
                      {String(item.value).padStart(2, "0")}
                    </span>
                  </div>
                  <p className="text-[10px] md:text-xs text-muted-foreground mt-1 font-medium">{item.label}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground font-medium md:max-w-[140px] text-center md:text-right">
              Cada segundo conta. Continue estudando! 🚀
            </p>
          </div>
        </div>

        {/* Daily Topic + Performance Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Daily Topic Card */}
          <div className="lg:col-span-3 rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 p-6 md:p-8 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl shadow-sm">
                  {dailyTopic.icon}
                </div>
                <div>
                  <p className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Matéria do Dia
                  </p>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground">
                    {dailyTopic.subject}: {dailyTopic.topic}
                  </h3>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed pl-[4.5rem]">
                💡 <strong>Dica:</strong> {dailyTopic.tip}
              </p>
              <div className="pl-[4.5rem]">
                <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80 shadow-md hover:shadow-lg" asChild>
                  <a href="https://aproviaapp.lovable.app" target="_blank" rel="noopener noreferrer" onClick={handleAppClick}>
                    <BookOpen className="w-4 h-4" />
                    Estudar este tema agora
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Performance Chart */}
          <div className="lg:col-span-2 rounded-2xl border-2 border-accent/20 bg-gradient-to-br from-card via-card to-accent/5 p-6 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl -translate-y-1/2 -translate-x-1/2" />
            <div className="relative space-y-4 h-full flex flex-col">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-accent uppercase tracking-wider flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Seu Desempenho
                  </p>
                  <h3 className="text-lg font-bold text-foreground">
                    Últimos 7 dias
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-accent">{totalVisits}</p>
                  <p className="text-[11px] text-muted-foreground">acessos total</p>
                </div>
              </div>
              
              <div className="flex-1 min-h-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAcessos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="day"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                      labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
                      formatter={(value: number) => [`${value} acesso${value !== 1 ? "s" : ""}`, "Acessos"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="acessos"
                      stroke="hsl(var(--accent))"
                      strokeWidth={2.5}
                      fill="url(#colorAcessos)"
                      dot={{ r: 3, fill: "hsl(var(--accent))", strokeWidth: 0 }}
                      activeDot={{ r: 5, fill: "hsl(var(--accent))", strokeWidth: 2, stroke: "hsl(var(--card))" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                {chartData[6]?.acessos > 0
                  ? `🔥 Você acessou ${chartData[6].acessos}x hoje!`
                  : "Acesse o app para registrar seu progresso!"}
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-foreground text-center">
            Suas ferramentas PRO
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {PLATFORM_FEATURES.map((feature) => (
              <a
                key={feature.label}
                href="https://aproviaapp.lovable.app"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleAppClick}
                className="group text-center p-5 rounded-2xl bg-gradient-to-br from-card to-primary/5 border-2 border-primary/10 shadow-md hover:shadow-lg hover:border-primary/30 hover:scale-[1.02] transition-all"
              >
                <feature.icon className="w-8 h-8 text-primary mx-auto mb-3 group-hover:scale-110 transition-transform" />
                <div className="text-sm font-bold text-foreground">{feature.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{feature.desc}</div>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button
            size="lg"
            className="w-full py-6 gap-3 bg-gradient-to-r from-primary via-primary to-primary/90 shadow-lg hover:shadow-xl font-bold"
            asChild
          >
            <a href="https://aproviaapp.lovable.app" target="_blank" rel="noopener noreferrer" onClick={handleAppClick}>
              <Rocket className="w-5 h-5" />
              Abrir App
            </a>
          </Button>
          <Button size="lg" variant="outline" className="w-full py-6 gap-3 border-2" asChild>
            <Link to="/settings">
              <Settings className="w-5 h-5" />
              Configurações
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="w-full py-6 gap-3 border-2 border-primary/30 text-primary hover:bg-primary/5" asChild>
            <Link to="/settings">
              <MessageSquare className="w-5 h-5" />
              Falar com Suporte
            </Link>
          </Button>
        </div>

        {/* Motivational Quote of the Day */}
        <div className="text-center py-8 space-y-3 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 px-6">
          <Sparkles className="w-6 h-6 text-primary mx-auto" />
          <p className="text-foreground italic text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
            "{dailyQuote.quote}"
          </p>
          <p className="text-sm text-muted-foreground font-medium">
            — {dailyQuote.author}
          </p>
          <p className="text-xs text-muted-foreground pt-1">
            ✨ Frase motivacional do dia — volte amanhã para uma nova!
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container px-4 py-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} AprovI.A — Todos os direitos reservados</p>
        </div>
      </footer>
    </div>
  );
};

export default PremiumHome;
