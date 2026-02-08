import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Rocket, Settings, LogOut, MessageSquare, User, BookOpen, Brain, Sparkles, ChevronRight, LayoutDashboard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useTheme } from "@/hooks/use-theme";
import { Moon, Sun } from "lucide-react";
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

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Bom dia";
  if (hour >= 12 && hour < 18) return "Boa tarde";
  return "Boa noite";
}

function getDailyTopic() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return ENEM_TOPICS[dayOfYear % ENEM_TOPICS.length];
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
  const dailyTopic = getDailyTopic();
  const userName = getUserName(user);
  const avatarUrl = getUserAvatar(user);
  const firstName = userName.split(" ")[0];

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
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      {/* Header with profile */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container px-4 py-3 flex justify-between items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Foto de perfil"
                    className="w-10 h-10 rounded-full border-2 border-primary/30 object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                )}
                <span className="text-sm font-medium text-foreground hidden sm:inline">
                  {firstName}
                </span>
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

          <div className="flex items-center gap-2">
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
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container px-4 py-8 md:py-12 max-w-3xl mx-auto space-y-8">
        {/* Greeting */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            {greeting}, <span className="text-primary">{firstName}</span>! 👋
          </h1>
          <p className="text-muted-foreground text-lg">
            Pronto para mais uma sessão de estudos?
          </p>
        </div>

        {/* CTA - Enter App */}
        <Button
          size="lg"
          className="w-full text-lg py-8 shadow-xl hover:shadow-primary/30 hover:scale-[1.02] transition-all bg-gradient-to-r from-primary via-primary to-primary/90 group font-bold"
          asChild
        >
          <a href="https://aproviaapp.lovable.app" target="_blank" rel="noopener noreferrer">
            <Rocket className="mr-3 h-6 w-6 group-hover:animate-bounce" />
            Entrar no Aplicativo
            <ChevronRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </Button>

        {/* Daily Topic Card */}
        <div className="rounded-2xl border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5 p-6 md:p-8 space-y-4 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{dailyTopic.icon}</span>
            <div>
              <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                Matéria do dia
              </p>
              <h2 className="text-xl md:text-2xl font-bold text-foreground">
                {dailyTopic.subject}
              </h2>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              {dailyTopic.topic}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {dailyTopic.tip}
            </p>
          </div>
          <Button variant="outline" className="gap-2 border-primary/30 text-primary hover:bg-primary/10" asChild>
            <a href="https://aproviaapp.lovable.app" target="_blank" rel="noopener noreferrer">
              <Brain className="w-4 h-4" />
              Estudar este tema no App
            </a>
          </Button>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/settings"
            className="flex items-center gap-3 p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors"
          >
            <Settings className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium">Configurações</span>
          </Link>
          <a
            href="https://aproviaapp.lovable.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors"
          >
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Abrir App</span>
          </a>
        </div>
      </main>
    </div>
  );
};

export default PremiumHome;
