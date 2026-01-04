import { Brain } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t py-12">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Brain className="w-8 h-8 text-primary" />
                <span className="text-xl font-bold text-primary">AprovI.A</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Seu assistente inteligente para mandar bem no ENEM
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Recursos</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Correção de Redação</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Chat Inteligente</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Simulados</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Matérias</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contato</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="mailto:suporteaprovia@gmail.com" className="hover:text-primary transition-colors">suporteaprovia@gmail.com</a></li>
                <li><a href="tel:+5521973781012" className="hover:text-primary transition-colors">+55 21 97378-1012</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2024 AprovI.A. Todos os direitos reservados.</p>
            <div className="flex gap-6">
              <a href="https://instagram.com/aprovi.a" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Instagram</a>
              <a href="https://tiktok.com/@aprovi.a" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">TikTok</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
