import type { Agent } from '../types/chat.types';

export interface AgentCategory {
  name: string;
  agents: Agent[];
}

export const AGENT_CATEGORIES: AgentCategory[] = [
  {
    name: 'General',
    agents: [
      {
        id: 'main',
        name: 'Main Agent',
        webhookUrl: 'https://ribtrnwb.rpcld.net/webhook/markless',
        iconName: 'Bot',
        tagline: 'Your primary AI assistant.',
      },
    ],
  },
  {
    name: 'Government',
    agents: [
      {
        id: 'pm',
        name: 'Jordanian Prime Ministry',
        webhookUrl: 'https://ribtrnwb.rpcld.net/webhook/pm',
        imageUrl: '/assets/agents/jpm.png', // Changed to .png
        tagline: "Leading Jordan's Progress.",
      },
      {
        id: 'modee',
        name: 'Ministry of Digital Economy and Entrepreneurship',
        webhookUrl: 'https://ribtrnwb.rpcld.net/webhook/modee',
        imageUrl: '/assets/agents/modee.png',
        tagline: "Powering Jordan's Digital Future.",
      },
    ],
  },
  {
    name: 'NGOs',
    agents: [
      {
        id: 'cpf',
        name: 'Crown Prince Foundation',
        webhookUrl: 'https://ribtrnwb.rpcld.net/webhook/cpf',
        imageUrl: '/assets/agents/cpf.png', // Changed to .png
        tagline: "Inspiring Jordan's Youth.",
      },
      {
        id: 'kafd',
        name: 'King Abdullah Fund for Development',
        webhookUrl: 'https://ribtrnwb.rpcld.net/webhook/kafd',
        imageUrl: '/assets/agents/kafd.png',
        tagline: "Investing in Jordan's Potential.",
      },
    ],
  },
];

// Helper to get all agents in a flat list if needed elsewhere, though AgentSidebar will use categories
export const ALL_AGENTS: Agent[] = AGENT_CATEGORIES.flatMap(category => category.agents);

export const DEFAULT_AGENT_ID = AGENT_CATEGORIES[0].agents[0].id; // Main Agent from General category
