import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "A AprovI.A funciona para qualquer área do ENEM?",
    answer: "Sim! Nossa IA foi treinada para todas as 4 áreas do conhecimento (Linguagens, Matemática, Ciências Humanas e Ciências da Natureza), além de Redação. Você pode tirar dúvidas de qualquer matéria."
  },
  {
    question: "Como funciona a correção de redação?",
    answer: "Você envia sua redação por texto ou foto, e em menos de 30 segundos recebe a nota nos 5 critérios do ENEM (cada um de 0 a 200), feedback detalhado de onde errou e como melhorar, além de sugestões específicas para sua próxima redação."
  },
  {
    question: "Posso cancelar quando quiser?",
    answer: "Sim, absolutamente! Você pode cancelar sua assinatura a qualquer momento com apenas um clique. Sem multas, sem burocracia, sem pegadinhas. Além disso, oferecemos garantia de 7 dias: se não gostar, devolvemos 100% do seu dinheiro."
  },
  {
    question: "A AprovI.A é diferente do ChatGPT?",
    answer: "Muito! Enquanto o ChatGPT é uma IA genérica, a AprovI.A foi especificamente treinada para o ENEM brasileiro. Ela conhece os padrões de prova, os truques mais comuns, e sabe exatamente como o ENEM avalia redações. É como ter um professor especialista disponível 24/7."
  },
  {
    question: "Quanto tempo leva para ver resultados?",
    answer: "A maioria dos nossos alunos começa a ver melhora nas notas de redação já na primeira semana. Em média, nossos estudantes aumentam mais de 200 pontos na nota total do ENEM após 3 meses de uso consistente."
  },
  {
    question: "Funciona no celular?",
    answer: "Sim! A AprovI.A funciona perfeitamente em qualquer dispositivo: celular, tablet ou computador. Você pode estudar de onde estiver, a qualquer hora."
  }
];

const FAQ = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
              <HelpCircle className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Perguntas <span className="text-primary">Frequentes</span>
            </h2>
            <p className="text-muted-foreground">
              Tudo que você precisa saber antes de começar
            </p>
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border-2 rounded-xl px-6 data-[state=open]:border-primary/50 transition-colors"
              >
                <AccordionTrigger className="text-left font-semibold hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Additional CTA */}
          <div className="mt-10 text-center p-6 rounded-2xl bg-muted/50 border">
            <p className="text-muted-foreground mb-2">Ainda tem dúvidas?</p>
            <p className="font-medium">
              Fale com nosso suporte pelo chat ou envie um e-mail para{" "}
              <a href="mailto:suporte@aprovia.com.br" className="text-primary hover:underline">
                suporte@aprovia.com.br
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
