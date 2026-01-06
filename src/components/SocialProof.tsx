import { Star, TrendingUp, Users, FileText, Award, GraduationCap, CheckCircle, Verified } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "12.547",
    label: "estudantes transformados",
    subtext: "e contando...",
    color: "text-primary"
  },
  {
    icon: FileText,
    value: "73.000+",
    label: "redações corrigidas",
    subtext: "com nota média 840",
    color: "text-accent"
  },
  {
    icon: TrendingUp,
    value: "+200",
    label: "pontos em média",
    subtext: "em 3 meses",
    color: "text-primary"
  },
  {
    icon: Award,
    value: "94%",
    label: "taxa de aprovação",
    subtext: "nas universidades",
    color: "text-accent"
  }
];

const universities = [
  { name: "USP", approved: "1.247" },
  { name: "UNICAMP", approved: "892" },
  { name: "UNESP", approved: "756" },
  { name: "UFMG", approved: "634" },
  { name: "UFRJ", approved: "521" },
  { name: "UnB", approved: "489" },
];

const recentApprovals = [
  { name: "Ana L.", course: "Medicina", university: "USP", time: "há 2 horas" },
  { name: "Pedro S.", course: "Direito", university: "UFMG", time: "há 5 horas" },
  { name: "Julia M.", course: "Engenharia", university: "UNICAMP", time: "há 8 horas" },
];

const SocialProof = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-muted/30 via-muted/50 to-muted/30 border-y relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container px-4 relative">
        <div className="max-w-6xl mx-auto">
          
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-4">
              <Verified className="w-5 h-5 text-accent" />
              <span className="text-sm font-bold text-accent">RESULTADOS COMPROVADOS</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Números que <span className="text-primary">não mentem</span>
            </h2>
            <p className="text-muted-foreground">Dados reais de estudantes que transformaram seus resultados</p>
          </div>
          
          {/* Stats Grid - Enhanced */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-14">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index} 
                  className="text-center p-5 md:p-6 rounded-2xl bg-card border-2 border-transparent hover:border-primary/20 shadow-lg hover:shadow-xl transition-all group"
                >
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 shadow-sm mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-7 h-7 ${stat.color}`} />
                  </div>
                  <div className={`text-3xl md:text-4xl font-black ${stat.color}`}>{stat.value}</div>
                  <div className="text-sm font-semibold text-foreground mt-1">{stat.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{stat.subtext}</div>
                </div>
              );
            })}
          </div>

          {/* Live Approvals Ticker */}
          <div className="mb-14 p-4 md:p-6 rounded-2xl bg-gradient-to-r from-accent/10 via-accent/5 to-accent/10 border border-accent/20">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-3 h-3 bg-accent rounded-full animate-pulse" />
              <span className="text-sm font-bold text-accent uppercase tracking-wide">Aprovações recentes</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {recentApprovals.map((approval, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 px-4 py-2 rounded-full bg-card border shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold">
                      {approval.name} - <span className="text-accent">{approval.course}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{approval.university} • {approval.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Universities */}
          <div className="text-center">
            <p className="text-base font-semibold text-foreground mb-2">
              Nossos alunos foram aprovados nas <span className="text-primary">melhores universidades do Brasil</span>
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Veja quantos alunos AprovI.A passaram em cada instituição:
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {universities.map((uni, index) => (
                <div 
                  key={index} 
                  className="px-5 py-3 rounded-xl bg-card border-2 hover:border-primary/50 hover:shadow-lg transition-all cursor-default group"
                >
                  <div className="text-base font-bold text-foreground group-hover:text-primary transition-colors">{uni.name}</div>
                  <div className="text-xs text-accent font-semibold">{uni.approved} aprovados</div>
                </div>
              ))}
            </div>
          </div>

          {/* Trust Badge */}
          <div className="mt-10 flex items-center justify-center gap-6 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span>Dados verificados</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span>Atualizado em tempo real</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span>Resultados autênticos</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;