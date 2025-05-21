import type React from 'react';
import { Bot, Users, Briefcase, CheckCircle } from 'lucide-react'; // Added CheckCircle
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
    <div className="flex flex-col h-full bg-white border-l border-gray-200/80"> {/* Changed background and border */}
      {/* Header */}
      <div className="p-4 border-b border-gray-200/80">
        <h2 className="text-base font-semibold text-gray-900">AI Agents</h2> {/* Adjusted title styling */}
        <p className="text-xs text-gray-500 mt-0.5">Choose an assistant for your task</p> {/* Adjusted subtitle */}
      </div>
      
      {/* Agent List */}
      <div className="flex-1 overflow-y-auto pt-2 pb-4">
        {agentCategories.map((category) => (
          <div key={category.name} className="mb-3 last:mb-0">
            <h3 className="px-4 pt-2 pb-1.5 text-xs font-medium text-gray-500 uppercase tracking-wide"> {/* Adjusted category title styling */}
              {category.name}
            </h3>
            <div className="space-y-1 px-2.5"> {/* Adjusted spacing */}
              {category.agents.map((agent) => {
                const IconComponent = agent.iconName ? getLucideIcon(agent.iconName) : null;
                const isActive = agent.id === currentAgentId;
                return (
                  <button
                    type="button"
                    key={agent.id}
                    onClick={() => onSelectAgent(agent.id)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-md transition-colors duration-150
                      ${isActive 
                        ? 'bg-orange-50 text-orange-700' // Simplified active state
                        : 'text-gray-700 hover:bg-gray-100/70' // Simplified hover state
                      }`}
                  >
                    {/* Icon/Image */}
                    <div className={`w-9 h-9 rounded-md flex items-center justify-center overflow-hidden flex-shrink-0
                      ${isActive
                        ? 'bg-orange-100' // Icon background for active state
                        : 'bg-gray-100'   // Icon background for inactive state
                      }`}
                    >
                      {agent.imageUrl ? (
                        <img src={agent.imageUrl} alt={agent.name} className="w-full h-full object-contain" />
                      ) : IconComponent ? (
                        <IconComponent size={18} className={isActive ? 'text-orange-600' : 'text-gray-500'} />
                      ) : (
                        <Bot size={18} className={isActive ? 'text-orange-600' : 'text-gray-500'} /> // Default icon
                      )}
                    </div>
                    {/* Text Content */}
                    <div className="flex-1 text-left min-w-0">
                      <h4 className={`text-sm font-medium ${isActive ? 'text-orange-700' : 'text-gray-800'}`}>{agent.name}</h4>
                      {agent.tagline && (
                        <p className="text-xs text-gray-500 mt-0.5 truncate" title={agent.tagline}>
                          {agent.tagline}
                        </p>
                      )}
                    </div>
                    {/* Active Indicator (Optional) */}
                    {isActive && (
                      <CheckCircle size={16} className="text-orange-500 flex-shrink-0" />
                    )}
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
