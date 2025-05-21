import type React from 'react';
import { MessageSquare, Plus, Search, LogOut, User as UserIcon } from 'lucide-react'; // Added LogOut, UserIcon
import type { Conversation } from '../types/chat.types';
import type { User } from '@supabase/supabase-js'; // Import User type

interface ChatHistoryProps {
  user: User | null; // Add user prop
  conversations: Conversation[];
  currentConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onSignOut: () => void; // Add onSignOut prop
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  user, // Destructure user
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onSignOut, // Destructure onSignOut
}) => {
  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Top Section: Search and New Chat */}
      <div className="p-4 space-y-3 border-b border-gray-100">
        <button
          type="button"
          onClick={onNewConversation}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-br from-orange-500 to-orange-600 text-white py-2.5 px-4 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-orange-500/10"
        >
          <Plus size={18} className="stroke-[2.5]" />
          <span className="text-sm font-medium">New Chat</span>
        </button>

        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500/20 transition-all"
          />
        </div>
      </div>

      {/* Middle Section: Conversations List */}
      <div className="flex-1 overflow-y-auto py-2">
        <h2 className="text-xs font-medium text-gray-500 px-5 py-2">Conversations</h2>
        <div className="px-2 space-y-0.5">
          {conversations.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                <MessageSquare size={20} className="text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">No conversations yet</p>
              <p className="text-xs text-gray-400 mt-1">Start a new chat to begin</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <button
                key={conversation.id}
                type="button"
                onClick={() => onSelectConversation(conversation.id)}
                className={`w-full text-left flex items-center gap-3 p-3 rounded-xl transition-all duration-200
                  ${currentConversationId === conversation.id
                    ? 'bg-orange-50 text-orange-700'
                    : 'text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                  ${currentConversationId === conversation.id
                    ? 'bg-orange-100'
                    : 'bg-gray-100'
                  }`}>
                  <MessageSquare size={16} className={`
                    ${currentConversationId === conversation.id
                      ? 'text-orange-600'
                      : 'text-gray-500'
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium truncate">
                      {conversation.title || `Chat ${conversation.id.substring(0, 6)}`}
                    </h3>
                    {conversation.created_at && (
                      <span className="text-[10px] text-gray-400 flex-shrink-0">
                        {new Date(conversation.created_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    Click to continue conversation
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Bottom Section: Account Info and Sign Out */}
      {user && (
        <div className="p-3 border-t border-gray-200">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              <UserIcon size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate" title={user.email}>
                {user.email || 'Account'}
              </p>
            </div>
            <button
              type="button"
              onClick={onSignOut}
              className="p-2 rounded-md text-gray-500 hover:text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500"
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
