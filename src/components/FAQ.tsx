import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Shield, MessageCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const faqs = [
  {
    question: "A AprovI.A funciona para qualquer área do ENEM?",
    answer: "Sim! Nossa IA foi treinada para TODAS as 4 áreas do conhecimento (Linguagens, Matemática, Ciências Humanas e Ciências da Natureza), além de Redação. Você pode tirar dúvidas de qualquer matéria, a qualquer hora.",
    highlight: "Cobertura completa do ENEM"
  },
  {
    question: "Como funciona a correção de redação?",
    answer: "Super simples: você envia sua redação por texto ou foto, e em menos de 30 segundos recebe a nota nos 5 critérios do ENEM (cada um de 0 a 200), feedback detalhado de onde errou, como melhorar, e sugestões específicas para sua próxima redação. É como ter um professor corrigindo em tempo real!",
    highlight: "Correção em 30 segundos"
  },
  {
    question: "E se eu não gostar? Posso cancelar?",
    answer: "Absolutamente! Você pode cancelar sua assinatura a qualquer momento com UM CLIQUE. Sem multas, sem burocracia, sem pegadinhas. Além disso, oferecemos GARANTIA de 7 dias: se não gostar, devolvemos 100% do seu dinheiro, sem perguntas.",
    highlight: "Garantia de satisfação"
  },
  {
    question: "A AprovI.A é diferente do ChatGPT?",
    answer: "MUITO diferente! Enquanto o ChatGPT é uma IA genérica que sabe um pouco de tudo, a AprovI.A foi ESPECIFICAMENTE treinada para o ENEM brasileiro. Ela conhece os padrões de prova, os truques mais comuns, sabe exatamente como o ENEM avalia redações e entende o que os corretores querem ver. É como ter um professor especialista em ENEM disponível 24/7.",
    highlight: "Tecnologia exclusiva"
  },
  {
    question: "Quanto tempo leva para ver resultados?",
    answer: "A maioria dos nossos alunos começa a ver melhora nas notas de redação já na PRIMEIRA SEMANA. Em média, nossos estudantes aumentam mais de 200 pontos na nota total do ENEM após 3 meses de uso consistente. Alguns alunos relataram ganhos de até 300 pontos!",
    highlight: "+200 pontos em 3 meses"
  },
  {
    question: "Funciona no celular?",
    answer: "Sim! A AprovI.A funciona perfeitamente em qualquer dispositivo: celular, tablet ou computador. Você pode estudar no ônibus, na fila do banco, antes de dormir... a qualquer hora, em qualquer lugar. Sua sala de estudos está sempre no seu bolso.",
    highlight: "Estude em qualquer lugar"
  },
  {
    question: "Preciso ter conhecimento prévio de tecnologia?",
    answer: "Não! A plataforma foi desenhada para ser super intuitiva. Se você sabe usar WhatsApp, sabe usar a AprovI.A. Nossos alunos de 15 a 50 anos usam sem nenhuma dificuldade.",
    highlight: "Fácil de usar"
  },
  {
    question: "Vale a pena o investimento?",
    answer: "Pense assim: quanto vale entrar na universidade dos seus sonhos? Quanto custaria um professor particular de cada matéria? A AprovI.A custa menos que um lanche por dia e te dá acesso a TODAS as funcionalidades. Considerando que nossos alunos têm 94% de taxa de aprovação, o retorno é gigantesco.",
    highlight: "Investimento que se paga"
  }
];

const FAQ = () => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-background to-muted/30 relative">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <HelpCircle className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              Ainda tem <span className="text-primary">dúvidas</span>?
            </h2>
            <p className="text-lg text-muted-foreground">
              Respondemos as perguntas mais comuns. Se a sua não estiver aqui, é só chamar!
            </p>
          </div>

          {/* FAQ Accordion - Enhanced */}
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border-2 rounded-2xl px-6 bg-card data-[state=open]:border-primary/50 data-[state=open]:shadow-lg transition-all"
              >
                <AccordionTrigger className="text-left font-bold text-base md:text-lg hover:text-primary py-5">
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                      {index + 1}
                    </span>
                    <span>{faq.question}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  <div className="pl-10">
                    <p className="mb-3">{faq.answer}</p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent bg-accent/10 px-3 py-1 rounded-full">
                      <CheckCircle2 className="w-4 h-4" />
                      {faq.highlight}
                    </span>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Additional CTA */}
          <div className="mt-12 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/20 text-center">
            <MessageCircle className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Ainda tem alguma dúvida?</h3>
            <p className="text-muted-foreground mb-4">
              Nossa equipe responde em até 2 horas no horário comercial
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="mailto:suporte@aprovia.com.br" 
                className="text-primary hover:underline font-semibold flex items-center gap-2"
              >
                suporte@aprovia.com.br
              </a>
              <span className="hidden sm:block text-muted-foreground">ou</span>
              <Button asChild variant="outline" className="border-2">
                <Link to="/pricing">
                  Ver Planos e Preços
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Final guarantee */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-accent/10 border border-accent/20">
              <Shield className="w-6 h-6 text-accent" />
              <span className="font-semibold">
                Lembre-se: você tem <span className="text-accent">7 dias de garantia</span> incondicional
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;