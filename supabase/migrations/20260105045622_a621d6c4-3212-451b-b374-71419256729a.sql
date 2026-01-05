-- 1. Política de INSERT para subscriptions (apenas via webhook/service role)
CREATE POLICY "Only service role can insert subscriptions" 
ON public.subscriptions 
FOR INSERT 
WITH CHECK (false);

-- 2. Política de UPDATE para subscriptions (apenas via webhook/service role)
CREATE POLICY "Only service role can update subscriptions" 
ON public.subscriptions 
FOR UPDATE 
USING (false);

-- 3. Política de DELETE para subscriptions (ninguém pode deletar)
CREATE POLICY "No one can delete subscriptions" 
ON public.subscriptions 
FOR DELETE 
USING (false);

-- 4. Política de UPDATE para quiz_responses (usuários podem atualizar suas próprias respostas)
CREATE POLICY "Users can update their own quiz responses" 
ON public.quiz_responses 
FOR UPDATE 
USING (auth.uid() = user_id);

-- 5. Política de DELETE para quiz_responses (ninguém pode deletar)
CREATE POLICY "No one can delete quiz responses" 
ON public.quiz_responses 
FOR DELETE 
USING (false);

-- 6. Política de DELETE para support_messages (apenas admins podem deletar)
CREATE POLICY "Only admins can delete support messages" 
ON public.support_messages 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- 7. Política de UPDATE para user_roles (apenas admins podem atualizar)
CREATE POLICY "Only admins can update user roles" 
ON public.user_roles 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

-- 8. Política de DELETE para user_roles (apenas admins podem deletar)
CREATE POLICY "Only admins can delete user roles" 
ON public.user_roles 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));