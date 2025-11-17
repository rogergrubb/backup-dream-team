
import React, { ComponentType } from 'react';
import { GptIcon, ClaudeIcon, DeepSeekIcon, PerplexityIcon, ImagenIcon, GeminiIcon, VeoIcon, LiveIcon, GoogleIcon } from './AIIcons';

export const AVATAR_MAP: Record<string, ComponentType<{ className?: string }>> = {
  gpt: GptIcon,
  claude: ClaudeIcon,
  deepseek: DeepSeekIcon,
  perplexity: PerplexityIcon,
  imagen: ImagenIcon,
  gemini: GeminiIcon,
  veo: VeoIcon,
  live: LiveIcon,
  google: GoogleIcon,
};

export const AVATAR_OPTIONS = Object.keys(AVATAR_MAP);