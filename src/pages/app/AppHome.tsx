import { Zap, MessageSquare, Target, CheckCircle, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Zap,
    title: "Redação Corrigida",
    desc: "Em segundos com feedback",
    link: "/app/redacao",
    cta: "Praticar",
  },
  {
    icon: MessageSquare,
    title: "Tire Dúvidas 24/7",
    desc: "IA especializada para o ENEM",
    link: "/app/chat",
    cta: "Conversar",
  },
  {
    icon: Target,
    title: "Plano de Estudos",
    desc: "Rotina personalizada com IA",
    link: "/app/rotina",
    cta: "Explorar",
  },
];

const AppHome = () => {
  return (
    <div className="min-h-[calc(100vh-3rem)] flex flex-col">
      {/* Top Banner */}
      <div className="flex justify-center pt-6 pb-2">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium">
          <Zap className="w-4 h-4" />
          ENEM 2026 está chegando — Comece a estudar agora
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-3xl mx-auto">
        {/* Logo text */}
        <p className="text-4xl md:text-5xl font-bold text-primary/30 mb-2">
          ✦ Aprovação A
        </p>

        {/* Main Headline */}
        <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4">
          Sua{" "}
          <span className="text-primary">Inteligência Artificial</span>
          <br />
          para <span className="text-foreground">passar no ENEM</span>
        </h1>

        {/* Subtitle */}
        <p className="text-muted-foreground text-base md:text-lg max-w-xl mb-6">
          <strong>Correção de redação em segundos</strong>, chat para tirar dúvidas 24/7 e plano de estudos personalizado — tudo com inteligência artificial.
        </p>

        {/* Feature Badges */}
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm">
            <Zap className="w-4 h-4 text-primary" />
            Correção instantânea de redação
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm">
            <MessageSquare className="w-4 h-4 text-primary" />
            Bate-papo com IA especializada
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            100% gratuito
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 justify-center mb-4">
          <Button asChild size="lg" className="gap-2 px-8 text-base font-bold uppercase">
            <Link to="/app/chat">
              <Sparkles className="w-4 h-4" />
              Começar Agora
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="px-8 text-base">
            <Link to="/auth">Já tenho conta</Link>
          </Button>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap gap-6 justify-center text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-accent" />
            Totalmente gratuito
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-accent" />
            Sem cartão de crédito
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-accent" />
            IA humanizada
          </span>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="px-6 pb-8">
        <div className="grid gap-4 sm:grid-cols-3 max-w-3xl mx-auto">
          {features.map((f) => (
            <Link
              key={f.title}
              to={f.link}
              className="group rounded-2xl border p-6 text-center hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
                <f.icon className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="font-bold mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground mb-3">{f.desc}</p>
              <span className="text-sm text-primary font-medium group-hover:underline">
                {f.cta} →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppHome;
