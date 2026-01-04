-- Criar função para atualizar updated_at se não existir
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Criar tabela para mensagens de suporte
CREATE TABLE public.support_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'read', 'replied', 'closed')),
  admin_reply TEXT,
  replied_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;

-- Usuários podem ver suas próprias mensagens
CREATE POLICY "Users can view their own messages" 
ON public.support_messages 
FOR SELECT 
USING (auth.uid() = user_id);

-- Usuários podem criar mensagens
CREATE POLICY "Users can create messages" 
ON public.support_messages 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Admins podem ver todas as mensagens
CREATE POLICY "Admins can view all messages" 
ON public.support_messages 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins podem atualizar mensagens (para responder)
CREATE POLICY "Admins can update messages" 
ON public.support_messages 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_support_messages_updated_at
BEFORE UPDATE ON public.support_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Habilitar realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_messages;