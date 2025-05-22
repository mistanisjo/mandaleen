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
    <div className="flex flex-col h-full bg-white/80 backdrop-blur-lg border-l border-gray-100">
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <h2 className="text-xl font-semibold bg-gradient-to-br from-gray-900 to-gray-700 bg-clip-text text-transparent">
          AI Agents
        </h2>
        <p className="text-[15px] text-gray-500 mt-1">Choose an assistant for your task</p>
      </div>
      
      {/* Agent Categories */}
      <div className="flex-1 overflow-y-auto py-4">
        {agentCategories.map((category) => (
          <div key={category.name} className="mb-6 last:mb-0">
            <h3 className="px-5 text-xs font-medium text-gray-500 tracking-wider uppercase mb-3">
              {category.name}
            </h3>
            <div className="space-y-2 px-3">
              {category.agents.map((agent) => {
                const IconComponent = agent.iconName ? getLucideIcon(agent.iconName) : null;
                const isActive = agent.id === currentAgentId;
                
                return (
                  <button
                    key={agent.id}
                    onClick={() => onSelectAgent(agent.id)}
                    className={`w-full flex items-center gap-4 p-3.5 rounded-xl transition-all duration-300
                      ${isActive 
                        ? 'bg-orange-50/80 hover:bg-orange-50' 
                        : 'hover:bg-gray-50/80'
                      }`}
                  >
                    {/* Agent Icon/Image */}
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0
                      transition-colors duration-300 ${isActive ? 'bg-orange-100' : 'bg-gray-100'}`}
                    >
                      {agent.imageUrl ? (
                        <img 
                          src={agent.imageUrl} 
                          alt={agent.name}
                          className="w-full h-full object-cover"
                        />
                      ) : IconComponent ? (
                        <IconComponent 
                          size={26} 
                          className={`transition-colors duration-300 ${isActive ? 'text-orange-600' : 'text-gray-500'}`} 
                        />
                      ) : (
                        <Bot 
                          size={26} 
                          className={`transition-colors duration-300 ${isActive ? 'text-orange-600' : 'text-gray-500'}`} 
                        />
                      )}
                    </div>

                    {/* Agent Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`text-[15px] font-medium truncate transition-colors duration-300
                          ${isActive ? 'text-orange-900' : 'text-gray-900'}`}>
                          {agent.name}
                        </h4>
                        {isActive && (
                          <CheckCircle size={14} className="text-orange-500 flex-shrink-0" />
                        )}
                      </div>
                      {agent.tagline && (
                        <p className="text-sm text-gray-500 truncate">
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