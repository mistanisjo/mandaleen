ALTER TABLE public.conversations
ADD COLUMN agent_id TEXT;

COMMENT ON COLUMN public.conversations.agent_id IS 'Identifier for the AI agent associated with this conversation.';
