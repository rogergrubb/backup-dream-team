// ===================================
// FINAL CORRECT constants.ts
// Uses ONLY existing avatars from AvatarRegistry
// ===================================

// ===================================
// AI MODEL CONFIGURATIONS
// ===================================

export const AVAILABLE_MODELS: Record<string, string[]> = {
  gemini: [
    'gemini-2.5-pro',
    'gemini-2.5-flash',
    'gemini-1.5-pro'
  ],
  openai: [
    'gpt-4o',
    'gpt-4-turbo',
    'gpt-3.5-turbo'
  ],
  anthropic: [
    'claude-sonnet-4-5-20250929',
    'claude-opus-4-1-20250805',
    'claude-haiku-4-5-20251015'
  ],
  deepseek: [
    'deepseek-chat',
    'deepseek-reasoner'
  ],
  grok: [
    'grok-4',
    'grok-3',
    'grok-3-mini'
  ],
  kimi: [
    'kimi-k2-0905-preview',
    'kimi-latest',
    'kimi-k2-thinking',
    'kimi-k2-turbo-preview'
  ],
};

// ===================================
// PROVIDER LABELS
// ===================================

export const PROVIDER_LABELS: Record<string, string> = {
  gemini: 'Google Gemini',
  openai: 'OpenAI GPT',
  anthropic: 'Anthropic Claude',
  deepseek: 'DeepSeek',
  grok: 'Grok (X.AI)',
  kimi: 'Kimi (Moonshot)',
};

// ===================================
// COLOR OPTIONS - Tailwind Classes
// ===================================

export const COLOR_OPTIONS = [
  'bg-blue-500',
  'bg-purple-500',
  'bg-green-500',
  'bg-red-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-teal-500',
  'bg-indigo-500',
  'bg-yellow-500',
  'bg-cyan-500',
];

// ===================================
// AVATAR STYLES
// Must match keys in AvatarRegistry.ts AVATAR_MAP
// ===================================

export const AVATAR_STYLES = [
  'gpt',
  'claude',
  'deepseek',
  'gemini',
  'perplexity',
  'imagen',
  'veo',
  'live',
  'google',
];

// ===================================
// DEFAULT AI PROFILES - ALL 6 PROVIDERS
// Using ONLY existing avatars from AvatarRegistry
// ===================================

export interface AIProfile {
  name: string;
  avatar: string;
  color: string;
  provider: string;
  model: string;
  systemInstruction: string;
}

export const DEFAULT_AI_PROFILES: AIProfile[] = [
  {
    name: 'Strategist',
    avatar: 'gpt',
    color: 'bg-blue-500',
    provider: 'openai',
    model: 'gpt-4o',
    systemInstruction: 'You are a strategic thinker focused on big-picture analysis and planning. Provide insightful strategic recommendations.',
  },
  {
    name: 'Creative Director',
    avatar: 'claude',
    color: 'bg-purple-500',
    provider: 'anthropic',
    model: 'claude-sonnet-4-5-20250929',
    systemInstruction: 'You are a creative director with expertise in innovation and design thinking. Provide creative solutions and out-of-the-box ideas.',
  },
  {
    name: 'Lead Technologist',
    avatar: 'gemini',
    color: 'bg-green-500',
    provider: 'gemini',
    model: 'gemini-2.5-pro',
    systemInstruction: 'You are a technical expert focused on implementation and feasibility. Provide detailed technical analysis and solutions.',
  },
  {
    name: 'Code Expert',
    avatar: 'deepseek',
    color: 'bg-red-500',
    provider: 'deepseek',
    model: 'deepseek-chat',
    systemInstruction: 'You are a coding expert specializing in software architecture and best practices. Provide detailed technical solutions.',
  },
  {
    name: 'Research Analyst',
    avatar: 'google',
    color: 'bg-orange-500',
    provider: 'grok',
    model: 'grok-4',
    systemInstruction: 'You are a research analyst with access to real-time information. Provide data-driven insights and current trends.',
  },
  {
    name: 'Context Specialist',
    avatar: 'perplexity',
    color: 'bg-teal-500',
    provider: 'kimi',
    model: 'kimi-k2-0905-preview',
    systemInstruction: 'You are a context specialist capable of analyzing long documents and complex scenarios. Provide comprehensive analysis.',
  },
];

// ===================================
// MODEL DISPLAY LABELS
// ===================================

export const MODEL_LABELS: Record<string, Record<string, string>> = {
  gemini: {
    'gemini-2.5-pro': 'Gemini 2.5 Pro',
    'gemini-2.5-flash': 'Gemini 2.5 Flash',
    'gemini-1.5-pro': 'Gemini 1.5 Pro',
  },
  openai: {
    'gpt-4o': 'GPT-4o',
    'gpt-4-turbo': 'GPT-4 Turbo',
    'gpt-3.5-turbo': 'GPT-3.5 Turbo',
  },
  anthropic: {
    'claude-sonnet-4-5-20250929': 'Claude Sonnet 4.5',
    'claude-opus-4-1-20250805': 'Claude Opus 4.1',
    'claude-haiku-4-5-20251015': 'Claude Haiku 4.5',
  },
  deepseek: {
    'deepseek-chat': 'DeepSeek Chat (V3)',
    'deepseek-reasoner': 'DeepSeek Reasoner (R1)',
  },
  grok: {
    'grok-4': 'Grok 4',
    'grok-3': 'Grok 3',
    'grok-3-mini': 'Grok 3 Mini',
  },
  kimi: {
    'kimi-k2-0905-preview': 'Kimi K2 (0905 Preview)',
    'kimi-latest': 'Kimi Latest',
    'kimi-k2-thinking': 'Kimi K2 Thinking',
    'kimi-k2-turbo-preview': 'Kimi K2 Turbo',
  },
};

// ===================================
// MODEL DESCRIPTIONS
// ===================================

export const MODEL_DESCRIPTIONS: Record<string, Record<string, string>> = {
  gemini: {
    'gemini-2.5-pro': 'Best for complex reasoning and multimodal tasks',
    'gemini-2.5-flash': 'Fast and efficient for most tasks',
    'gemini-1.5-pro': 'Stable and reliable for general use',
  },
  openai: {
    'gpt-4o': 'Latest GPT-4 with optimized performance',
    'gpt-4-turbo': 'Faster GPT-4 for real-time applications',
    'gpt-3.5-turbo': 'Cost-effective for simpler tasks',
  },
  anthropic: {
    'claude-sonnet-4-5-20250929': 'Best coding model, excellent for agents',
    'claude-opus-4-1-20250805': 'Most capable for complex reasoning',
    'claude-haiku-4-5-20251015': 'Fastest and most cost-effective',
  },
  deepseek: {
    'deepseek-chat': 'General purpose conversational AI',
    'deepseek-reasoner': 'Advanced reasoning for math and coding',
  },
  grok: {
    'grok-4': 'Most powerful with real-time X integration',
    'grok-3': 'Balanced performance',
    'grok-3-mini': 'Fast and cost-effective',
  },
  kimi: {
    'kimi-k2-0905-preview': 'Latest K2 model - balanced performance (default)',
    'kimi-latest': 'Always the newest Kimi model available',
    'kimi-k2-thinking': 'Optimized for complex reasoning tasks',
    'kimi-k2-turbo-preview': 'Fastest model for quick responses',
  },
};

// ===================================
// MODEL PRICING (per million tokens)
// ===================================

export const MODEL_PRICING: Record<string, Record<string, { input: number; output: number }>> = {
  anthropic: {
    'claude-sonnet-4-5-20250929': { input: 3, output: 15 },
    'claude-opus-4-1-20250805': { input: 15, output: 75 },
    'claude-haiku-4-5-20251015': { input: 1, output: 5 },
  },
  openai: {
    'gpt-4o': { input: 2.5, output: 10 },
    'gpt-4-turbo': { input: 10, output: 30 },
    'gpt-3.5-turbo': { input: 0.5, output: 1.5 },
  },
  gemini: {
    'gemini-2.5-pro': { input: 1.25, output: 5 },
    'gemini-2.5-flash': { input: 0.075, output: 0.3 },
    'gemini-1.5-pro': { input: 1.25, output: 5 },
  },
  deepseek: {
    'deepseek-chat': { input: 0.27, output: 1.1 },
    'deepseek-reasoner': { input: 0.55, output: 2.19 },
  },
  grok: {
    'grok-4': { input: 5, output: 15 },
    'grok-3': { input: 3, output: 10 },
    'grok-3-mini': { input: 1, output: 3 },
  },
  kimi: {
    'kimi-k2-0905-preview': { input: 0.5, output: 2 },
    'kimi-latest': { input: 0.5, output: 2 },
    'kimi-k2-thinking': { input: 0.7, output: 2.5 },
    'kimi-k2-turbo-preview': { input: 0.3, output: 1.5 },
  },
};

// ===================================
// SYSTEM INSTRUCTION TEMPLATES
// ===================================

export const INSTRUCTION_TEMPLATES = {
  strategist: 'You are a strategic advisor focused on long-term planning and analysis. Provide actionable insights.',
  creative: 'You are a creative thinker who excels at brainstorming and innovative solutions.',
  technical: 'You are a technical expert who provides detailed implementation guidance.',
  analyst: 'You are an analytical thinker who breaks down complex problems systematically.',
  writer: 'You are an experienced writer focused on clear, engaging communication.',
  researcher: 'You are a thorough researcher who provides well-sourced information.',
};

// ===================================
// HELPER FUNCTIONS
// ===================================

export const getModelLabel = (provider: string, model: string): string => {
  return MODEL_LABELS[provider]?.[model] || model;
};

export const getProviderLabel = (provider: string): string => {
  return PROVIDER_LABELS[provider] || provider;
};

export const getModelDescription = (provider: string, model: string): string => {
  return MODEL_DESCRIPTIONS[provider]?.[model] || '';
};

export const getModelPricing = (provider: string, model: string) => {
  return MODEL_PRICING[provider]?.[model] || null;
};