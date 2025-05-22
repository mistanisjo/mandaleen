import type React from 'react';
import { MessageSquare, Plus, Search, LogOut, User as UserIcon } from 'lucide-react';
import type { Conversation } from '../types/chat.types';
import type { User } from '@supabase/supabase-js';

interface ChatHistoryProps {
  user: User | null;
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onSignOut: () => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  user,
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onSignOut,
}) => {
  return (
    <div className="flex flex-col h-full bg-white/80 backdrop-blur-lg border-r border-gray-100">
      {/* Top Section */}
      <div className="p-5 space-y-4">
        <button
          onClick={onNewConversation}
          className="w-full group relative flex items-center justify-center gap-2 bg-gradient-to-br from-orange-500 to-orange-600 
            text-white py-3.5 px-4 rounded-2xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 
            shadow-[0_2px_12px_rgba(249,115,22,0.15)] hover:shadow-[0_4px_20px_rgba(249,115,22,0.25)]"
        >
          <Plus 
            size={20} 
            className="transition-transform group-hover:rotate-90 duration-300" 
          />
          <span className="font-medium tracking-wide">New Chat</span>
          <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>

        <div className="relative group">
          <Search 
            size={18} 
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-orange-500" 
          />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl text-[15px] 
              placeholder:text-gray-400 focus:outline-none focus:border-orange-100 focus:ring-[3px] focus:ring-orange-500/10 
              transition-all duration-300"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-3">
        <div className="sticky top-0 px-2 py-3 text-xs font-medium text-gray-500 tracking-wider uppercase bg-white/80 backdrop-blur-sm">
          Conversations
        </div>
        <div className="space-y-1.5 pb-4">
          {conversations.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 
                flex items-center justify-center">
                <MessageSquare size={24} className="text-gray-400" />
              </div>
              <p className="text-sm font-medium text-gray-600">No conversations yet</p>
              <p className="text-xs text-gray-400 mt-1">Start a new chat to begin</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={`w-full text-left flex items-start gap-3.5 p-3.5 rounded-xl transition-all duration-300
                  ${currentConversationId === conversation.id
                    ? 'bg-orange-50/80 hover:bg-orange-50'
                    : 'hover:bg-gray-50/80'
                  }`}
              >
                <div className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-colors duration-300
                  ${currentConversationId === conversation.id
                    ? 'bg-gradient-to-br from-orange-100 to-orange-50'
                    : 'bg-gradient-to-br from-gray-100 to-gray-50'
                  }`}>
                  <MessageSquare 
                    size={18} 
                    className={`transition-colors duration-300 ${
                      currentConversationId === conversation.id ? 'text-orange-600' : 'text-gray-500'
                    }`} 
                  />
                </div>
                <div className="flex-1 min-w-0 py-0.5">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`text-[15px] font-medium truncate transition-colors duration-300
                      ${currentConversationId === conversation.id ? 'text-orange-900' : 'text-gray-900'}`}>
                      {conversation.title || `Chat ${conversation.id.substring(0, 6)}`}
                    </h3>
                    {conversation.created_at && (
                      <span className="text-[11px] text-gray-400 flex-shrink-0 ml-2">
                        {new Date(conversation.created_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    Click to continue conversation
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* User Profile Section */}
      {user && (
        <div className="mt-auto border-t border-gray-100">
          <div className="p-4">
            <div className="flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-gray-50/80 transition-all group">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 
                flex items-center justify-center text-orange-600">
                <UserIcon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-medium text-gray-900 truncate" title={user.email}>
                  {user.email || 'Account'}
                </p>
              </div>
              <button
                onClick={onSignOut}
                className="p-2.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                aria-label="Sign out"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHistory;