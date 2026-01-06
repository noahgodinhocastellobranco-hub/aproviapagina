import { Star, TrendingUp, Users, FileText } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "12.547",
    label: "estudantes ativos",
    color: "text-primary"
  },
  {
    icon: FileText,
    value: "73.000+",
    label: "redações corrigidas",
    color: "text-accent"
  },
  {
    icon: TrendingUp,
    value: "+200",
    label: "pontos em média",
    color: "text-primary"
  },
  {
    icon: Star,
    value: "94%",
    label: "taxa de aprovação",
    color: "text-accent"
  }
];

const logos = [
  "USP", "UNICAMP", "UNESP", "UFMG", "UFRJ", "UnB"
];

const SocialProof = () => {
  return (
    <section className="py-12 md:py-16 bg-muted/50 border-y">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-card border shadow-sm mb-3`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className={`text-2xl md:text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* Universities */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Nossos alunos foram aprovados nas melhores universidades do Brasil
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              {logos.map((logo, index) => (
                <div 
                  key={index} 
                  className="px-4 py-2 rounded-lg bg-card border text-sm font-semibold text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors"
                >
                  {logo}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
