import { GoogleGenAI, Modality, type Operation, type GenerateVideosResponse } from '@google/genai';
import type { Message, UploadedFile, InteractiveSummary, ConfiguredAIProfile } from '../types';
import { auth } from '../lib/firebaseClient';

// Helper to get the user's auth token
async function getAuthToken() {
    const user = auth.currentUser;
    if (!user) {
        throw new Error("User not authenticated.");
    }
    return await user.getIdToken();
}

// Firebase Function URL - will be set via environment variable
const cloudFunctionUrl = import.meta.env.VITE_FIREBASE_FUNCTION_URL || 'https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/dreamTeamStream';

if (cloudFunctionUrl.includes('YOUR_REGION') || cloudFunctionUrl.includes('YOUR_PROJECT_ID')) {
    console.error("Firebase Function URL is not configured. Please add VITE_FIREBASE_FUNCTION_URL to your .env.local file");
}

interface StreamChunk {
  text?: string;
  citations?: { web: { uri: string; title: string; } }[];
  error?: string;
}

// --- Text/Image Generation (Dream Team) ---
export const generateStream = async function* (
  profile: ConfiguredAIProfile,
  prompt: string,
  context: Message[],
  files: UploadedFile[],
  overridePrompt?: string
): AsyncGenerator<StreamChunk> {
  try {
    const authToken = await getAuthToken();
    const response = await fetch(cloudFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        type: 'generate',
        profile,
        prompt,
        context,
        files,
        overridePrompt,
      }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("Response body is empty.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
            if (line.startsWith('data: ')) {
                const jsonStr = line.substring(6);
                if (jsonStr) {
                    try {
                        const chunk = JSON.parse(jsonStr);
                        yield chunk;
                    } catch (e) {
                        console.error("Failed to parse stream chunk JSON:", jsonStr, e);
                    }
                }
            }
        }
    }
  } catch (error) {
    console.error("Cloud function error:", error);
    yield { error: `Error: ${error instanceof Error ? error.message : 'An unknown error occurred.'}` };
  }
};

export const generateSummary = async (prompt: string, conversation: Message[], aiProfiles: ConfiguredAIProfile[]): Promise<InteractiveSummary> => {
  try {
    const authToken = await getAuthToken();
    const response = await fetch(cloudFunctionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        type: 'summarize',
        prompt,
        conversation,
        aiProfiles,
      }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Cloud function error during summary:", error);
    return {
        title: "Error Generating Summary",
        overview: `Could not generate interactive summary. Details: ${error instanceof Error ? error.message : 'Unknown error'}`,
        points: []
    };
  }
};

// --- Client-side Gemini Functions for Studios ---
export const editImage = async (image: UploadedFile, prompt: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                {
                    inlineData: {
                        data: image.base64Data,
                        mimeType: image.type,
                    },
                },
                {
                    text: prompt,
                },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    const candidate = response.candidates?.[0];
    if (candidate) {
        for (const part of candidate.content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
            }
        }
    }
    throw new Error("No image was generated in the response.");
};

export const generateVideo = async (
    image: UploadedFile,
    prompt: string,
    aspectRatio: '16:9' | '9:16'
): Promise<Operation<GenerateVideosResponse>> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    const operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        image: {
            imageBytes: image.base64Data,
            mimeType: image.type,
        },
        config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: aspectRatio
        }
    });
    return operation;
};

export const getVideosOperation = async (
    operation: Operation<GenerateVideosResponse>
): Promise<Operation<GenerateVideosResponse>> => {
    // FIX: API key must be provided when creating the GoogleGenAI instance for polling video operations.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
    const updatedOperation = await ai.operations.getVideosOperation({ operation });
    return updatedOperation;
};