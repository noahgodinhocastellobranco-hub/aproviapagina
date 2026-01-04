-- Create table for quiz responses
CREATE TABLE public.quiz_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  user_email TEXT NOT NULL,
  how_found_us TEXT,
  objective TEXT,
  done_enem_before TEXT,
  skipped BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.quiz_responses ENABLE ROW LEVEL SECURITY;

-- Users can insert their own responses
CREATE POLICY "Users can insert their own quiz response"
ON public.quiz_responses
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can view their own responses
CREATE POLICY "Users can view their own quiz response"
ON public.quiz_responses
FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all responses
CREATE POLICY "Admins can view all quiz responses"
ON public.quiz_responses
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Create index for faster queries
CREATE INDEX idx_quiz_responses_user_id ON public.quiz_responses(user_id);
CREATE INDEX idx_quiz_responses_created_at ON public.quiz_responses(created_at DESC);