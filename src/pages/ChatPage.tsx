import type React from 'react';
import { useState, useEffect } from 'react';
import type { User } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import Header from '../components/Header';
import ChatContainer from '../components/ChatContainer';
import ChatHistory from '../components/ChatHistory';
import AgentSidebar from '../components/AgentSidebar';
import { supabase } from '../lib/supabase';
import { 
  sendMessageToWebhook, 
  getSessionId,
  createConversation,
  saveMessage,
  getMessages,
  getConversations
} from '../lib/api';
import type { Message, Conversation } from '../types/chat.types'; // Agent type is part of AgentCategory now
import { AGENT_CATEGORIES, ALL_AGENTS, DEFAULT_AGENT_ID } from '../lib/agents.config'; // Import new structures
import useMediaQuery from '../hooks/useMediaQuery'; // Import the hook

const ChatPage: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 767px)'); // Add this line
  const [user, setUser] = useState<User | null>(null);
  const [currentAgentId, setCurrentAgentId] = useState<string>(DEFAULT_AGENT_ID);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSignOut = async () => { // Define handleSignOut here
    await supabase.auth.signOut();
  };

  const toggleLeftSidebar = () => {
    const newIsOpen = !isLeftSidebarOpen;
    setIsLeftSidebarOpen(newIsOpen);
    if (isMobile && newIsOpen && isRightSidebarOpen) {
      setIsRightSidebarOpen(false);
    }
  };

  const toggleRightSidebar = () => {
    const newIsOpen = !isRightSidebarOpen;
    setIsRightSidebarOpen(newIsOpen);
    if (isMobile && newIsOpen && isLeftSidebarOpen) {
      setIsLeftSidebarOpen(false);
    }
  };

  useEffect(() => {
    // Close sidebars on initial mobile load if both are set to open by default
    if (isMobile) {
      setIsLeftSidebarOpen(false); // Or true, depending on desired default for mobile
      setIsRightSidebarOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data?.user || null);
      
      if (data?.user) {
        fetchConversations(data.user.id, currentAgentId);
      }
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user || null);
        
        if (session?.user) {
          fetchConversations(session.user.id, currentAgentId);
        } else {
          setConversations([]);
          setCurrentConversationId(null);
          setMessages([]);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [currentAgentId]);

  const fetchConversations = async (userId: string, agentId: string) => {
    try {
      const conversationsData = await getConversations(userId, agentId);
      setConversations(conversationsData);
      
      if (conversationsData.length > 0) {
        if (!currentConversationId || !conversationsData.find(c => c.id === currentConversationId)) {
          selectConversation(conversationsData[0].id);
        }
      } else {
        setCurrentConversationId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setConversations([]);
      setCurrentConversationId(null);
      setMessages([]);
    }
  };
  
  const handleSelectAgent = (agentId: string) => {
    if (agentId === currentAgentId) return;
    
    setCurrentAgentId(agentId);
    setCurrentConversationId(null);
    setMessages([]);
    if (user) {
      fetchConversations(user.id, agentId);
    }
  };

  const selectConversation = async (conversationId: string) => {
    setCurrentConversationId(conversationId);
    
    try {
      const messagesData = await getMessages(conversationId);
      const typedMessages = messagesData.map(m => ({
        ...m,
        id: m.id || uuidv4(),
        role: m.role as 'user' | 'assistant',
        created_at: m.created_at,
      })) as Message[];
      setMessages(typedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleNewConversation = async (): Promise<Conversation | null> => {
    if (!user || !currentAgentId) return null;
    
    try {
      const sessionId = getSessionId();
      const conversation = await createConversation(user.id, sessionId, currentAgentId);
      
      setConversations(prev => 
        [conversation, ...prev].sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateB - dateA;
        })
      );
      setCurrentConversationId(conversation.id);
      setMessages([]);
      return conversation;
    } catch (error) {
      console.error('Error creating new conversation:', error);
      return null;
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!user || isProcessing || !currentAgentId) return;
    
    const selectedAgent = ALL_AGENTS.find(agent => agent.id === currentAgentId); // Use ALL_AGENTS
    if (!selectedAgent) {
      console.error("Selected agent not found");
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Error: Agent configuration not found.', error: true },
      ]);
      return;
    }

    setIsProcessing(true);
    let convId = currentConversationId;
    
    try {
      if (!convId) {
        const newConversation = await handleNewConversation();
        if (newConversation) {
          convId = newConversation.id;
        } else {
          setMessages(prev => [
            ...prev,
            {
              role: 'assistant',
              content: 'Error starting a new conversation. Please try again.',
              error: true,
            },
          ]);
          setIsProcessing(false);
          return;
        }
      }
      
      const userMessage: Message = {
        id: uuidv4(),
        role: 'user',
        content,
        conversation_id: convId,
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      if (convId) {
        await saveMessage(convId, userMessage);
      } else {
        console.error("Conversation ID is null, cannot save message");
        throw new Error("Conversation ID is null");
      }
      
      const pendingMessage: Message = {
        role: 'assistant',
        content: '',
        pending: true,
      };
      
      setMessages(prev => [...prev, pendingMessage]);
      
      const sessionId = getSessionId();
      const webhookResponse = await sendMessageToWebhook(content, sessionId, selectedAgent.webhookUrl);
      
      setMessages(prev => prev.filter(msg => !msg.pending));
      
      const assistantMessageContent = (webhookResponse.error || webhookResponse.response) ?? '';
      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: assistantMessageContent,
        error: !!webhookResponse.error,
        conversation_id: convId,
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      if (convId) {
        await saveMessage(convId, assistantMessage);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      setMessages(prev => prev.filter(msg => !msg.pending));
      
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'An error occurred. Please try again.',
          error: true,
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <Header 
        user={user} 
        onToggleLeftSidebar={toggleLeftSidebar}
        onToggleRightSidebar={toggleRightSidebar}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Conversations */}
        <div className={`transition-all duration-300 ease-in-out flex-shrink-0 overflow-hidden ${isLeftSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full'}`}
        >
          {user && (
            <ChatHistory
              user={user} // Pass user
              conversations={conversations}
              currentConversationId={currentConversationId}
              onSelectConversation={selectConversation}
              onNewConversation={handleNewConversation}
              onSignOut={handleSignOut} // Pass handleSignOut
            />
          )}
        </div>
        
        {/* Main Chat Area */}
        <main className="flex-1 overflow-hidden flex flex-col">
          <ChatContainer
            messages={messages}
            onSendMessage={handleSendMessage}
            isProcessing={isProcessing}
          />
        </main>

        {/* Right Sidebar - Agents */}
        <div className={`transition-all duration-300 ease-in-out flex-shrink-0 overflow-hidden ${isRightSidebarOpen ? 'w-72 translate-x-0' : 'w-0 translate-x-full'}`}
        >
          {user && (
            <AgentSidebar
              agentCategories={AGENT_CATEGORIES} // Pass categories
              currentAgentId={currentAgentId}
              onSelectAgent={handleSelectAgent}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
