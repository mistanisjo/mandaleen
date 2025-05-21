export interface Message {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  created_at?: string | null; // Allow null
  conversation_id?: string;
  pending?: boolean;
  error?: boolean;
}

export interface Agent {
  id: string; // Unique identifier like 'main', 'cpf'
  name: string; // Display name like 'Main Agent'
  webhookUrl: string; // The specific n8n webhook URL
  iconName?: string; // A name of a Lucide icon (e.g., 'Bot', 'Users') - now optional
  imageUrl?: string; // Optional URL for an image avatar
  tagline?: string; // Optional tagline for the agent
}

export interface Conversation {
  id: string;
  title: string | null;
  created_at: string | null; // Allow null
  session_id: string;
  user_id: string; // Assuming this should be here based on ChatPage.tsx usage
  agent_id?: string; // Added agent_id
  messages?: Message[];
}

export interface WebhookRequest {
  message: string;
  sessionId: string;
}

export interface WebhookResponse {
  response: string;
  error?: string;
}
