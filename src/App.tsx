import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { useGoogleAdsPageView } from "@/hooks/useGoogleAds";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import Settings from "./pages/Settings";
import Success from "./pages/Success";
import Quiz from "./pages/Quiz";
import NotFound from "./pages/NotFound";

// App pages
import { AppLayout } from "./components/app/AppLayout";
import AppHome from "./pages/app/AppHome";
import AppChat from "./pages/app/AppChat";
import AppRedacao from "./pages/app/AppRedacao";
import AppProfessoraVirtual from "./pages/app/AppProfessoraVirtual";
import AppMaterias from "./pages/app/AppMaterias";
import AppRotina from "./pages/app/AppRotina";
import AppDicas from "./pages/app/AppDicas";
import AppMateriaisEstudo from "./pages/app/AppMateriaisEstudo";
import AppPomodoro from "./pages/app/AppPomodoro";
import AppSimulados from "./pages/app/AppSimulados";
import AppComoResolverQuestao from "./pages/app/AppComoResolverQuestao";
import AppResolverQuestao from "./pages/app/AppResolverQuestao";
import AppFazendoSimulado from "./pages/app/AppFazendoSimulado";
import AppProvaENEM from "./pages/app/AppProvaENEM";
import AppConsultarCurso from "./pages/app/AppConsultarCurso";

const queryClient = new QueryClient();

// Componente wrapper para rastrear page views
const GoogleAdsTracker = ({ children }: { children: React.ReactNode }) => {
  useGoogleAdsPageView();
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <GoogleAdsTracker>
            <Routes>
              {/* Landing / public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/success" element={<Success />} />
              <Route path="/quiz" element={<Quiz />} />

              {/* App routes (protected, with sidebar) */}
              <Route path="/app" element={<AppLayout />}>
                <Route index element={<AppHome />} />
                <Route path="chat" element={<AppChat />} />
                <Route path="redacao" element={<AppRedacao />} />
                <Route path="professora-virtual" element={<AppProfessoraVirtual />} />
                <Route path="materias" element={<AppMaterias />} />
                <Route path="rotina" element={<AppRotina />} />
                <Route path="dicas" element={<AppDicas />} />
                <Route path="materiais-estudo" element={<AppMateriaisEstudo />} />
                <Route path="pomodoro" element={<AppPomodoro />} />
                <Route path="simulados" element={<AppSimulados />} />
                <Route path="como-resolver-questao" element={<AppComoResolverQuestao />} />
                <Route path="resolver-questao" element={<AppResolverQuestao />} />
                <Route path="fazendo-simulado" element={<AppFazendoSimulado />} />
                <Route path="prova-enem" element={<AppProvaENEM />} />
                <Route path="consultar-curso" element={<AppConsultarCurso />} />
              </Route>

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </GoogleAdsTracker>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
