import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface SupportMessage {
  id: string;
  subject: string;
  message: string;
  status: string;
  admin_reply: string | null;
  replied_at: string | null;
  created_at: string;
}

const SupportChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isOpen && user) {
      fetchMessages();
      
      // Realtime subscription
      const channel = supabase
        .channel('support-messages')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'support_messages',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            fetchMessages();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isOpen, user]);

  const fetchMessages = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('support_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Você precisa estar logado para enviar mensagens");
      return;
    }

    if (!subject.trim() || !message.trim()) {
      toast.error("Preencha todos os campos");
      return;
    }

    setSending(true);
    try {
      const { error } = await supabase
        .from('support_messages')
        .insert({
          user_id: user.id,
          user_email: user.email,
          subject: subject.trim(),
          message: message.trim(),
        });

      if (error) throw error;

      toast.success("Mensagem enviada! Responderemos em breve.");
      setSubject("");
      setMessage("");
      fetchMessages();
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast.error("Erro ao enviar mensagem");
    } finally {
      setSending(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pendente</Badge>;
      case 'read':
        return <Badge variant="outline">Lido</Badge>;
      case 'replied':
        return <Badge className="bg-green-600">Respondido</Badge>;
      case 'closed':
        return <Badge variant="destructive">Fechado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user) {
    return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <MessageCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Suporte</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Dúvidas & Contato
          </SheetTitle>
          <SheetDescription>
            Envie suas dúvidas e entraremos em contato.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 flex flex-col gap-4 mt-4 min-h-0">
          {/* Formulário de nova mensagem */}
          <form onSubmit={handleSendMessage} className="space-y-3 border-b pb-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Assunto</Label>
              <Input
                id="subject"
                placeholder="Ex: Dúvida sobre assinatura"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Mensagem</Label>
              <Textarea
                id="message"
                placeholder="Descreva sua dúvida ou sugestão..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                maxLength={1000}
              />
            </div>
            <Button type="submit" className="w-full gap-2" disabled={sending}>
              {sending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              Enviar Mensagem
            </Button>
          </form>

          {/* Lista de mensagens */}
          <div className="flex-1 min-h-0">
            <h4 className="font-medium mb-2">Suas mensagens</h4>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : messages.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhuma mensagem enviada ainda.
              </p>
            ) : (
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-3">
                  {messages.map((msg) => (
                    <div key={msg.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="font-medium text-sm line-clamp-1">{msg.subject}</h5>
                        {getStatusBadge(msg.status)}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{msg.message}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(msg.created_at)}</p>
                      
                      {msg.admin_reply && (
                        <div className="mt-2 p-2 bg-primary/10 rounded border-l-2 border-primary">
                          <p className="text-xs font-medium text-primary mb-1">Resposta do suporte:</p>
                          <p className="text-sm">{msg.admin_reply}</p>
                          {msg.replied_at && (
                            <p className="text-xs text-muted-foreground mt-1">{formatDate(msg.replied_at)}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SupportChat;
