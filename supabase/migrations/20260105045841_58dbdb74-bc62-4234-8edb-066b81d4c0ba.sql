-- Remove a política atual que usa email matching (vulnerável)
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.subscriptions;

-- Criar nova política usando apenas auth.uid() (mais segura)
CREATE POLICY "Users can view their own subscriptions" 
ON public.subscriptions 
FOR SELECT 
USING (auth.uid() = user_id);