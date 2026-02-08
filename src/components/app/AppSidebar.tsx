import {
  Home,
  FileText,
  BookOpen,
  PenTool,
  MessageCircle,
  Lightbulb,
  Timer,
  HelpCircle,
  ClipboardList,
  FolderDown,
  GraduationCap,
  Trophy,
  Search,
  Brain,
  Calendar,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { ThemeToggle } from "./ThemeToggle";

const mainItems = [
  { title: "Início", url: "/app", icon: Home },
  { title: "Chat AprovI.A", url: "/app/chat", icon: MessageCircle },
  { title: "Redação", url: "/app/redacao", icon: PenTool },
  { title: "Professora Virtual", url: "/app/professora-virtual", icon: GraduationCap },
];

const studyItems = [
  { title: "Matérias", url: "/app/materias", icon: BookOpen },
  { title: "Rotina de Estudos", url: "/app/rotina", icon: Calendar },
  { title: "Dicas", url: "/app/dicas", icon: Lightbulb },
  { title: "Materiais de Estudo", url: "/app/materiais-estudo", icon: FolderDown },
  { title: "Pomodoro", url: "/app/pomodoro", icon: Timer },
];

const practiceItems = [
  { title: "Simulados", url: "/app/simulados", icon: FileText },
  { title: "Resolver Questão", url: "/app/como-resolver-questao", icon: HelpCircle },
  { title: "Fazer Simulado", url: "/app/fazendo-simulado", icon: ClipboardList },
  { title: "Prova ENEM", url: "/app/prova-enem", icon: Trophy },
  { title: "Consultar Curso", url: "/app/consultar-curso", icon: Search },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const isMobile = useIsMobile();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-bold text-foreground leading-none">AprovI.A</h2>
              <p className="text-xs text-muted-foreground">Assistente ENEM</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/app"}
                      className="hover:bg-muted/50"
                      activeClassName="bg-primary/10 text-primary font-semibold"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Estudos</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {studyItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      className="hover:bg-muted/50"
                      activeClassName="bg-primary/10 text-primary font-semibold"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Praticar</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {practiceItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      className="hover:bg-muted/50"
                      activeClassName="bg-primary/10 text-primary font-semibold"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="flex items-center justify-between px-3 py-2">
          <ThemeToggle />
          {!collapsed && (
            <NavLink
              to="/"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Página Inicial
            </NavLink>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
