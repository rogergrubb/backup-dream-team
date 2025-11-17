import type { AIProfile, AIProfileId } from './types';

// This list now defines the available models that the user can select from in the UI.
// The backend will need to know how to handle these selections.
export const AVAILABLE_MODELS: Record<string, string[]> = {
  gemini: ['gemini-2.5-pro', 'gemini-flash-latest', 'imagen-4.0-generate-001'],
  openai: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'],
  anthropic: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-haiku-20240307'],
  deepseek: ['deepseek-chat', 'deepseek-coder'],
  grok: ['grok-1'],
  kimi: ['moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k'],
};

// This is the default team setup for a new user.
export const DEFAULT_AI_PROFILES: AIProfile[] = [
  {
    id: 'strategist',
    name: 'Strategist',
    avatar: 'gpt',
    systemInstruction: "You are a master strategist. Analyze the user's request from a high-level perspective, considering long-term goals, potential risks, and market positioning. Outline a strategic plan.",
    color: 'border-green-500/50',
  },
  {
    id: 'creative-director',
    name: 'Creative Director',
    avatar: 'claude',
    systemInstruction: "You are a creative director. Focus on brainstorming innovative ideas, user experience, and branding. Think outside the box and propose novel solutions.",
    color: 'border-yellow-500/50',
  },
  {
    id: 'lead-technologist',
    name: 'Lead Technologist',
    avatar: 'gemini',
    systemInstruction: "You are a lead technologist. Evaluate the technical feasibility of the proposed ideas. Suggest a robust and scalable architecture, specific technologies, and implementation steps.",
    color: 'border-purple-500/50',
  },
   {
    id: 'visualizer',
    name: 'Visualizer',
    avatar: 'imagen',
    systemInstruction: "You are a concept visualizer. Based on the team's discussion, generate a high-quality image that represents the core idea, a user interface mockup, or a conceptual diagram.",
    color: 'border-pink-500/50',
  },
];

export const AI_ORDER: AIProfileId[] = DEFAULT_AI_PROFILES.map(p => p.id);


export const COLOR_OPTIONS: string[] = [
  'border-green-500/50',
  'border-yellow-500/50',
  'border-purple-500/50',
  'border-blue-500/50',
  'border-orange-500/50',
  'border-pink-500/50',
  'border-cyan-500/50',
  'border-red-500/50',
  'border-indigo-500/50',
];