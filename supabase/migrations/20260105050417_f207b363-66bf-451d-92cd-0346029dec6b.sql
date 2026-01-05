-- Dropar políticas SELECT existentes (que estão como RESTRICTIVE)
DROP POLICY IF EXISTS "Users can view their own messages" ON public.support_messages;
DROP POLICY IF EXISTS "Admins can view all messages" ON public.support_messages;

-- Recriar como PERMISSIVE (padrão) para permitir acesso correto
CREATE POLICY "Users can view their own messages" 
ON public.support_messages 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all messages" 
ON public.support_messages 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));