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
    <div className="flex flex-col h-full bg-white">
      {/* Top Section */}
      <div className="p-4 space-y-4">
        <button
          onClick={onNewConversation}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-sm hover:shadow group"
        >
          <Plus size={20} className="transition-transform group-hover:rotate-90 duration-200" />
          <span className="font-medium">New Chat</span>
        </button>

        <div className="relative group">
          <Search 
            size={18} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-orange-500" 
          />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-100 rounded-xl text-sm placeholder:text-gray-400
              focus:outline-none focus:border-orange-100 focus:ring-2 focus:ring-orange-500/10 transition-all"
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        <div className="px-2 py-2 text-xs font-medium text-gray-500 tracking-wider uppercase">Conversations</div>
        <div className="space-y-1">
          {conversations.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
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
                className={`w-full text-left flex items-start gap-3 p-3 rounded-xl transition-all duration-200
                  ${currentConversationId === conversation.id
                    ? 'bg-orange-50/80 hover:bg-orange-50'
                    : 'hover:bg-gray-50/80'
                  }`}
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center
                  ${currentConversationId === conversation.id
                    ? 'bg-orange-100'
                    : 'bg-gray-100'
                  }`}>
                  <MessageSquare 
                    size={18} 
                    className={currentConversationId === conversation.id ? 'text-orange-600' : 'text-gray-500'} 
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`text-sm font-medium truncate
                      ${currentConversationId === conversation.id ? 'text-orange-900' : 'text-gray-900'}`}>
                      {conversation.title || `Chat ${conversation.id.substring(0, 6)}`}
                    </h3>
                    {conversation.created_at && (
                      <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">
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
        <div className="p-3 mt-auto border-t border-gray-100">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center text-orange-600">
              <UserIcon size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate" title={user.email}>
                {user.email || 'Account'}
              </p>
            </div>
            <button
              onClick={onSignOut}
              className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
              aria-label="Sign out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHistory;