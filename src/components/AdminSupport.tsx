import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MessageCircle, Send, Eye, Loader2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SupportMessage {
  id: string;
  user_id: string;
  user_email: string;
  subject: string;
  message: string;
  status: string;
  admin_reply: string | null;
  replied_at: string | null;
  created_at: string;
  updated_at: string;
}

const AdminSupport = () => {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<SupportMessage | null>(null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "replied">("all");

  useEffect(() => {
    fetchMessages();

    // Realtime subscription
    const channel = supabase
      .channel('admin-support-messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'support_messages'
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('support_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Erro ao buscar mensagens:", error);
      toast.error("Erro ao carregar mensagens");
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!selectedMessage || !reply.trim()) {
      toast.error("Digite uma resposta");
      return;
    }

    setSending(true);
    try {
      const { error } = await supabase
        .from('support_messages')
        .update({
          admin_reply: reply.trim(),
          status: 'replied',
          replied_at: new Date().toISOString(),
        })
        .eq('id', selectedMessage.id);

      if (error) throw error;

      toast.success("Resposta enviada com sucesso!");
      setReply("");
      setSelectedMessage(null);
      fetchMessages();
    } catch (error) {
      console.error("Erro ao enviar resposta:", error);
      toast.error("Erro ao enviar resposta");
    } finally {
      setSending(false);
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('support_messages')
        .update({ status: 'read' })
        .eq('id', messageId);

      if (error) throw error;
      fetchMessages();
    } catch (error) {
      console.error("Erro ao marcar como lido:", error);
    }
  };

  const handleCloseTicket = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('support_messages')
        .update({ status: 'closed' })
        .eq('id', messageId);

      if (error) throw error;
      toast.success("Ticket fechado");
      fetchMessages();
    } catch (error) {
      console.error("Erro ao fechar ticket:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
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

  const filteredMessages = messages.filter((msg) => {
    if (filter === "pending") return msg.status === "pending" || msg.status === "read";
    if (filter === "replied") return msg.status === "replied" || msg.status === "closed";
    return true;
  });

  const pendingCount = messages.filter(m => m.status === "pending").length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <div>
              <CardTitle>Mensagens de Suporte</CardTitle>
              <CardDescription>
                {pendingCount > 0 ? (
                  <span className="text-yellow-600">{pendingCount} mensagens pendentes</span>
                ) : (
                  "Todas as mensagens respondidas"
                )}
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchMessages} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Atualizar
            </Button>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            Todas ({messages.length})
          </Button>
          <Button
            variant={filter === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("pending")}
          >
            Pendentes ({messages.filter(m => m.status === "pending" || m.status === "read").length})
          </Button>
          <Button
            variant={filter === "replied" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("replied")}
          >
            Respondidas ({messages.filter(m => m.status === "replied" || m.status === "closed").length})
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma mensagem encontrada
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Assunto</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMessages.map((msg) => (
                <TableRow 
                  key={msg.id}
                  className={msg.status === "pending" ? "bg-yellow-50 dark:bg-yellow-950/20" : ""}
                >
                  <TableCell className="font-medium">{msg.user_email}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{msg.subject}</TableCell>
                  <TableCell>{getStatusBadge(msg.status)}</TableCell>
                  <TableCell>{formatDate(msg.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedMessage(msg);
                          setReply(msg.admin_reply || "");
                          if (msg.status === "pending") {
                            handleMarkAsRead(msg.id);
                          }
                        }}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                      {msg.status !== "closed" && msg.status !== "replied" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCloseTicket(msg.id)}
                        >
                          Fechar
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Modal de resposta */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedMessage?.subject}</DialogTitle>
            <DialogDescription>
              De: {selectedMessage?.user_email} • {selectedMessage && formatDate(selectedMessage.created_at)}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm whitespace-pre-wrap">{selectedMessage?.message}</p>
            </div>

            {selectedMessage?.admin_reply && (
              <div className="p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
                <p className="text-xs font-medium text-primary mb-1">Sua resposta anterior:</p>
                <p className="text-sm whitespace-pre-wrap">{selectedMessage.admin_reply}</p>
              </div>
            )}

            <div className="space-y-2">
              <Textarea
                placeholder="Digite sua resposta..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={4}
              />
              <div className="flex gap-2">
                <Button onClick={handleReply} disabled={sending} className="gap-2">
                  {sending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {selectedMessage?.admin_reply ? "Atualizar Resposta" : "Enviar Resposta"}
                </Button>
                {selectedMessage?.status !== "closed" && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (selectedMessage) {
                        handleCloseTicket(selectedMessage.id);
                        setSelectedMessage(null);
                      }
                    }}
                  >
                    Fechar Ticket
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AdminSupport;
