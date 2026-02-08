import {
  Home, FileText, BookOpen, PenTool, MessageCircle, Lightbulb,
  ExternalLink, Timer, HelpCircle, ClipboardList, FolderDown,
  GraduationCap, Trophy, Search, Calendar
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

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

function NavItem({ item }: { item: { title: string; url: string; icon: React.ComponentType<{ className?: string }> } }) {
  return (
    <SidebarMenuItem>
      <NavLink
        to={item.url}
        end={item.url === "/app"}
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 no-underline ${
            isActive
              ? "bg-primary text-primary-foreground shadow-md font-semibold"
              : "text-primary hover:bg-primary/10"
          }`
        }
      >
        <item.icon className="w-4 h-4" />
        {item.title}
      </NavLink>
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  const { open } = useSidebar();
  const isMobile = useIsMobile();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-3 py-4">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">✦</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight">AprovI.A</span>
            <span className="text-xs text-muted-foreground">Assistente ENEM</span>
          </div>
          {isMobile && (
            <SidebarTrigger />
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Principal
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <NavItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Estudos
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {studyItems.map((item) => (
                <NavItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Praticar
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {practiceItems.map((item) => (
                <NavItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="px-3 py-2">
          <ThemeToggle />
        </div>
        <div className="px-3 py-2">
          <a
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Página Inicial
          </a>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
