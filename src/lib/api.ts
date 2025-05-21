import { v4 as uuidv4 } from 'uuid';
import { supabase } from './supabase';
import type { PostgrestError } from '@supabase/supabase-js'; // Import PostgrestError
import type { WebhookRequest, WebhookResponse, Message, Conversation } from '../types/chat.types'; // Added Conversation

// const WEBHOOK_URL = 'https://ribtrnwb.rpcld.net/webhook/markless'; // This will be passed as a parameter
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms

// Generate a session ID if not already stored
export const getSessionId = (): string => {
  let sessionId = localStorage.getItem('sessionId');
  
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem('sessionId', sessionId);
  }
  
  return sessionId;
};

// Send message to webhook with retry logic
export const sendMessageToWebhook = async (
  message: string,
  sessionId: string,
  webhookUrl: string, // New parameter
  retryCount = 0
): Promise<WebhookResponse> => {
  const payload: WebhookRequest = {
    message,
    sessionId
  };

  try {
    const response = await fetch(webhookUrl, { // Use passed webhookUrl
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text(); // Attempt to get more error details
      console.error(`Webhook fetch error for ${webhookUrl}: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Server responded with ${response.status}: ${response.statusText}. Details: ${errorText}`);
    }

    const n8nRawResponse = await response.json();

    // Normalize n8n response
    if (Array.isArray(n8nRawResponse) && n8nRawResponse.length > 0 && n8nRawResponse[0] && typeof n8nRawResponse[0].output === 'string') {
      return { response: n8nRawResponse[0].output, error: undefined };
    }
    
    // Check if it already fits the WebhookResponse structure (or part of it)
    if (n8nRawResponse && typeof n8nRawResponse.response === 'string') {
      return { response: n8nRawResponse.response, error: typeof n8nRawResponse.error === 'string' ? n8nRawResponse.error : undefined };
    }

    // If the response is unexpected, return an error or a default response
    console.warn('Unexpected n8n webhook response format:', n8nRawResponse);
    // Return an error structure that ChatPage can handle
    return { response: '', error: 'Received an unexpected response format from the assistant.' };

  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (retryCount + 1)));
      return sendMessageToWebhook(message, sessionId, webhookUrl, retryCount + 1); // Pass webhookUrl in retry
    }
    // If retries exhausted, handle the final error
    console.error(`Failed to send message to ${webhookUrl} after retries:`, error); // Log the specific error
    return { 
      response: '', 
      error: `Failed to communicate with the server for ${webhookUrl}. Please try again later.` // More specific error
    };
  }
};

// Save conversation to Supabase
export const createConversation = async (
  userId: string,
  sessionId: string,
  agentId: string, // New parameter
  title?: string
): Promise<Conversation> => {
  const { data, error } = await supabase
    .from('conversations')
    .insert({
      user_id: userId,
      session_id: sessionId,
      agent_id: agentId, // Save agent_id
      title: title || 'New Conversation',
    })
    .select()
    .single();

  if (error || !data) { // Check for !data as well
    console.error('Error creating conversation:', error);
    throw error || new Error('Failed to create conversation, no data returned.');
  }

  return data as Conversation; // Cast to Conversation
};

// Save message to Supabase
export const saveMessage = async (conversationId: string, message: Message) => {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      content: message.content,
      role: message.role
    });

  if (error) {
    console.error('Error saving message:', error);
    // Log more details from the Supabase error object
    if (error && typeof error === 'object' && 'code' in error && 'message' in error) { // Check if properties exist
      const supabaseError = error as PostgrestError; // Cast to PostgrestError
      console.error('Supabase error code:', supabaseError.code);
      console.error('Supabase error message:', supabaseError.message);
      console.error('Supabase error details:', supabaseError.details);
      console.error('Supabase error hint:', supabaseError.hint);
    }
    throw error;
  }

  return data;
};

// Get all messages for a conversation
export const getMessages = async (conversationId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }

  return data || [];
};

// Get all conversations for a user and agent
export const getConversations = async (userId: string, agentId: string): Promise<Conversation[]> => {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('user_id', userId)
    .eq('agent_id', agentId) // Filter by agent_id
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }

  return (data || []) as Conversation[]; // Cast to Conversation[]
};

// Update conversation title in Supabase
export const updateConversationTitle = async (
  conversationId: string,
  title: string
): Promise<Conversation | null> => {
  // Truncate title if it's too long for the database or for display purposes
  const truncatedTitle = title.length > 100 ? `${title.substring(0, 97)}...` : title;

  const { data, error } = await supabase
    .from('conversations')
    .update({ title: truncatedTitle })
    .eq('id', conversationId)
    .select()
    .single();

  if (error) {
    console.error('Error updating conversation title:', error);
    // Optionally, you could throw the error or handle it more gracefully
    // For now, returning null to indicate failure without crashing
    return null; 
  }

  return data as Conversation | null;
};
