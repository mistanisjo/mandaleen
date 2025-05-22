import type React from 'react';
import { Bot, Users, Briefcase, CheckCircle } from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { Agent } from '../types/chat.types';
import type { AgentCategory } from '../lib/agents.config';

const getLucideIcon = (iconName: string): React.ElementType<LucideProps> | null => {
  switch (iconName) {
    case 'Bot':
      return Bot;
    case 'Users':
      return Users;
    case 'Briefcase':
      return Briefcase;
    default:
      return null;
  }
};

interface AgentSidebarProps {
  agentCategories: AgentCategory[];
  currentAgentId: string;
  onSelectAgent: (agentId: string) => void;
}

const AgentSidebar: React.FC<AgentSidebarProps> = ({
  agentCategories,
  currentAgentId,
  onSelectAgent,
}) => {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">AI Agents</h2>
        <p className="text-sm text-gray-500 mt-0.5">Choose an assistant for your task</p>
      </div>
      
      {/* Agent Categories */}
      <div className="flex-1 overflow-y-auto py-4">
        {agentCategories.map((category) => (
          <div key={category.name} className="mb-6 last:mb-0">
            <h3 className="px-4 text-xs font-medium text-gray-500 tracking-wider uppercase mb-2">
              {category.name}
            </h3>
            <div className="space-y-1 px-2">
              {category.agents.map((agent) => {
                const IconComponent = agent.iconName ? getLucideIcon(agent.iconName) : null;
                const isActive = agent.id === currentAgentId;
                
                return (
                  <button
                    key={agent.id}
                    onClick={() => onSelectAgent(agent.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200
                      ${isActive 
                        ? 'bg-orange-50/80 hover:bg-orange-50' 
                        : 'hover:bg-gray-50/80'
                      }`}
                  >
                    {/* Agent Icon/Image */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0
                      ${isActive
                        ? 'bg-orange-100'
                        : 'bg-gray-100'
                      }`}
                    >
                      {agent.imageUrl ? (
                        <img 
                          src={agent.imageUrl} 
                          alt={agent.name}
                          className="w-full h-full object-cover"
                        />
                      ) : IconComponent ? (
                        <IconComponent 
                          size={24} 
                          className={isActive ? 'text-orange-600' : 'text-gray-500'} 
                        />
                      ) : (
                        <Bot 
                          size={24} 
                          className={isActive ? 'text-orange-600' : 'text-gray-500'} 
                        />
                      )}
                    </div>

                    {/* Agent Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className={`text-sm font-medium truncate
                          ${isActive ? 'text-orange-900' : 'text-gray-900'}`}>
                          {agent.name}
                        </h4>
                        {isActive && (
                          <CheckCircle size={14} className="text-orange-500 flex-shrink-0" />
                        )}
                      </div>
                      {agent.tagline && (
                        <p className="text-xs text-gray-500 mt-0.5 truncate">
                          {agent.tagline}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentSidebar;