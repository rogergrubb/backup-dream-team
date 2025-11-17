
import type { ComponentType } from 'react';

export type AIProfileId = string;

export interface AIProfile {
  id: AIProfileId;
  name: string;
  avatar: string; // Avatar component key
  systemInstruction: string;
  color: string;
  // Provider and model are now handled by the user's dynamic configuration and the backend.
  // We remove them from the core type to reflect this new flexibility.
}

// FIX: Add ConfiguredAIProfile interface to be shared across components
export interface ConfiguredAIProfile extends AIProfile {
  provider: string;
  model: string;
}

export interface Message {
  id: string;
  aiId: AIProfileId;
  cycle: number;
  content: string;
  isStreaming: boolean;
  citations?: { web: { uri: string; title: string; } }[];
}

export interface UploadedFile {
  name: string;
  type: string;
  base64Data: string;
}

export type Conversation = Message[];

export type AppStatus = 'idle' | 'running' | 'paused' | 'summarizing' | 'finished';

export type RunMode = 'autonomous' | 'manual';

export enum AppMode {
    DREAM_TEAM = 'DREAM_TEAM',
    IMAGE_STUDIO = 'IMAGE_STUDIO',
    VIDEO_STUDIO = 'VIDEO_STUDIO',
    LIVE_CHAT = 'LIVE_CHAT',
}

export interface TraceableSummaryPoint {
  point: string;
  sourceMessageIds: string[];
}

export interface InteractiveSummary {
  title: string;
  overview: string;
  points: TraceableSummaryPoint[];
}