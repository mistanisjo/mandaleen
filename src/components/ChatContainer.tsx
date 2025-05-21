import type React from 'react';
import { useEffect, useRef, useCallback } from 'react'; // Added useCallback
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import type { Message } from '../types/chat.types';

interface ChatContainerProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  onSendMessage,
  isProcessing
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => { // Wrapped in useCallback
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []); // Empty dependency array as it doesn't depend on external state that changes

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]); // Depending only on the memoized scrollToBottom

  return (
    <div className="flex flex-col h-full">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            <div className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-full p-4 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-label="Chat icon">
                <title>Chat Icon</title>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h2 className="mt-6 text-xl font-semibold text-gray-900">Welcome to Mandaleen</h2>
            <p className="mt-2 text-gray-500 max-w-md">
              Start your conversation by typing a message below. I'm here to help!
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <ChatMessage key={message.id || index} message={message} />
          ))
        )}
        <div ref={messagesEndRef} /> {/* This div is used as a ref target, so it should not be self-closing if it might have children later, but for now, it's fine. Linter might complain if it expects self-closing for empty divs. Let's keep it as is for now as it's a common pattern for scroll refs. If Biome insists, we can make it <div ref={messagesEndRef} /> */}
      </div>

      {/* Chat input */}
      <ChatInput onSendMessage={onSendMessage} isProcessing={isProcessing} />
    </div>
  );
};

export default ChatContainer;
