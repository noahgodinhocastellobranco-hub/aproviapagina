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
    answer: "Você envia sua redação por texto ou foto, e em segundos recebe a nota nos 5 critérios do ENEM (cada um de 0 a 200), feedback detalhado de onde pode melhorar, e sugestões específicas para sua próxima redação.",
    highlight: "Feedback detalhado"
  },
  {
    question: "E se eu não gostar? Posso cancelar?",
    answer: "Sim! Você pode cancelar sua assinatura a qualquer momento com um clique. Sem multas, sem burocracia. Além disso, oferecemos garantia de 7 dias: se não gostar, devolvemos 100% do seu dinheiro.",
    highlight: "Garantia de satisfação"
  },
  {
    question: "A AprovI.A é diferente do ChatGPT?",
    answer: "Sim! Enquanto o ChatGPT é uma IA genérica, a AprovI.A foi treinada especificamente para o ENEM brasileiro. Ela conhece os padrões de prova, sabe como o ENEM avalia redações e entende o formato da prova.",
    highlight: "Focada no ENEM"
  },
  {
    question: "Funciona no celular?",
    answer: "Sim! A AprovI.A funciona em qualquer dispositivo: celular, tablet ou computador. Você pode estudar de onde quiser, quando quiser.",
    highlight: "Estude em qualquer lugar"
  },
  {
    question: "Preciso ter conhecimento de tecnologia?",
    answer: "Não! A plataforma foi feita para ser simples e intuitiva. Se você sabe usar redes sociais, consegue usar a AprovI.A sem dificuldade.",
    highlight: "Fácil de usar"
  },
  {
    question: "Posso tirar dúvidas a qualquer hora?",
    answer: "Sim! O chat com IA está disponível 24 horas por dia, 7 dias por semana. Não precisa esperar pela próxima aula ou horário do professor.",
    highlight: "Disponível 24/7"
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
              Nossa equipe está pronta para te ajudar
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="mailto:suporteaprovia@gmail.com" 
                className="text-primary hover:underline font-semibold flex items-center gap-2"
              >
                suporteaprovia@gmail.com
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
                Você tem <span className="text-accent">7 dias de garantia</span> — se não gostar, devolvemos seu dinheiro
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;