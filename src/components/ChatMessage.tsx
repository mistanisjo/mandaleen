import type React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // Import remark-gfm
import { MessageSquare, Bot, AlertCircle, Loader2 } from 'lucide-react';
import type { Message } from '../types/chat.types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div 
      className={`py-5 ${isUser ? 'bg-white' : 'bg-gray-50'}`}
      data-user={isUser ? 'true' : 'false'}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 flex gap-4">
        <div className={`flex-shrink-0 mt-1 ${isUser ? 'bg-orange-100 text-orange-600' : 'bg-gradient-to-r from-orange-400 to-orange-600 text-white'} h-8 w-8 rounded-full flex items-center justify-center`}>
          {isUser ? (
            <MessageSquare size={16} />
          ) : (
            <Bot size={16} />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          {message.pending ? (
            <div className="flex items-center text-gray-500">
              <Loader2 className="animate-spin mr-2" size={16} />
              <span>Generating response...</span>
            </div>
          ) : message.error ? (
            <div className="flex items-center text-red-500">
              <AlertCircle className="mr-2" size={16} />
              <span>Error: {message.content}</span>
            </div>
          ) : (
            <div className="prose prose-gray max-w-none" style={{ whiteSpace: 'pre-line' }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
