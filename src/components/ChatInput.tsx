import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isProcessing }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isProcessing) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <form 
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto"
      >
        <div className="relative rounded-lg border border-gray-300 shadow-sm focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500">
          <textarea
            ref={textareaRef}
            className="w-full resize-none border-0 bg-transparent py-3 px-4 pr-12 focus:ring-0 focus:outline-none"
            placeholder="Type your message..."
            rows={1}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
          />
          <button
            type="submit"
            className={`absolute right-2 bottom-2 rounded-md p-2 ${
              message.trim() && !isProcessing
                ? 'text-orange-500 hover:bg-orange-50'
                : 'text-gray-400 cursor-not-allowed'
            }`}
            disabled={!message.trim() || isProcessing}
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;