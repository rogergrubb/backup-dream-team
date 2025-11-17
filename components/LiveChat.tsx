
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MicIcon, StopIcon, DownloadIcon } from './icons/UIIcons';
import { GoogleGenAI, Modality, type LiveServerMessage } from '@google/genai';
import { useApiKeys } from '../hooks/useApiKeys';

interface Blob {
    data: string;
    mimeType: string;
}

interface LiveSession {
    close: () => void;
    sendRealtimeInput: (input: { media: Blob }) => void;
}

function encode(bytes: Uint8Array): string {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

function decode(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length;
    const buffer = ctx.createBuffer(1, frameCount, 24000);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i] / 32768.0;
    }
    return buffer;
}

function createBlob(data: Float32Array): Blob {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
        int16[i] = data[i] * 32768;
    }
    return {
        data: encode(new Uint8Array(int16.buffer)),
        mimeType: 'audio/pcm;rate=16000',
    };
}

type TranscriptEntry = {
    id: string;
    source: 'user' | 'model';
    text: string;
    isFinal: boolean;
};

export function LiveChat() {
    const [status, setStatus] = useState<'idle' | 'connecting' | 'active' | 'error' | 'stopped'>('idle');
    const [error, setError] = useState('');
    const { keys, isConfigured } = useApiKeys();
    const isGeminiKeyConfigured = isConfigured('gemini');

    const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
    const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const nextStartTimeRef = useRef(0);
    const sourcesRef = useRef(new Set<AudioBufferSourceNode>());

    const addOrUpdateTranscript = useCallback((source: 'user' | 'model', text: string, isFinal: boolean) => {
        setTranscript(prev => {
            const lastEntry = prev[prev.length - 1];
            if (lastEntry && lastEntry.source === source && !lastEntry.isFinal) {
                return [...prev.slice(0, -1), { ...lastEntry, text: lastEntry.text + text, isFinal }];
            }
             if (isFinal && lastEntry && !lastEntry.isFinal) {
                 return [...prev.slice(0,-1), {...lastEntry, isFinal: true }, { id: `${source}-${Date.now()}`, source, text, isFinal: true }];
            }
            return [...prev, { id: `${source}-${Date.now()}`, source, text, isFinal }];
        });
    }, []);

    const startConversation = async () => {
        if (!isGeminiKeyConfigured) {
            setError("Please add a Gemini API key to use Live Chat.");
            return;
        }

        setStatus('connecting');
        setError('');
        setTranscript([]);

        try {
            const ai = new GoogleGenAI({ apiKey: keys.gemini });
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            
            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        setStatus('active');
                        const source = inputAudioContextRef.current!.createMediaStreamSource(stream);
                        const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
                        scriptProcessorRef.current = scriptProcessor;

                        scriptProcessor.onaudioprocess = (event) => {
                            const inputData = event.inputBuffer.getChannelData(0);
                            sessionPromiseRef.current?.then((session) => session.sendRealtimeInput({ media: createBlob(inputData) }));
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputAudioContextRef.current!.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        if (message.serverContent?.inputTranscription) addOrUpdateTranscript('user', message.serverContent.inputTranscription.text, false);
                        if (message.serverContent?.outputTranscription) addOrUpdateTranscript('model', message.serverContent.outputTranscription.text, false);
                        if (message.serverContent?.turnComplete) setTranscript(prev => prev.map(t => ({...t, isFinal: true})));

                        const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                        if (audioData) {
                            const outCtx = outputAudioContextRef.current!;
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
                            const audioBuffer = await decodeAudioData(decode(audioData), outCtx);
                            const sourceNode = outCtx.createBufferSource();
                            sourceNode.buffer = audioBuffer;
                            sourceNode.connect(outCtx.destination);
                            sourceNode.addEventListener('ended', () => sourcesRef.current.delete(sourceNode));
                            sourceNode.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                            sourcesRef.current.add(sourceNode);
                        }

                        if (message.serverContent?.interrupted) {
                           for (const source of sourcesRef.current.values()) source.stop();
                           sourcesRef.current.clear();
                           nextStartTimeRef.current = 0;
                        }
                    },
                    onerror: (e: ErrorEvent) => { setError(`An error occurred: ${e.message}`); setStatus('error'); },
                    onclose: () => { if (status !== 'error') setStatus('stopped'); },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {}, outputAudioTranscription: {},
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                },
            });
        } catch (err) {
            setError(err instanceof Error ? `Failed to start: ${err.message}` : 'An unknown error occurred.');
            setStatus('error');
        }
    };
    
    const stopConversation = async () => {
        if (sessionPromiseRef.current) (await sessionPromiseRef.current).close();
        if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach(track => track.stop());
        if (scriptProcessorRef.current) scriptProcessorRef.current.disconnect();
        if (inputAudioContextRef.current?.state !== 'closed') await inputAudioContextRef.current?.close();
        if (outputAudioContextRef.current?.state !== 'closed') await outputAudioContextRef.current?.close();
        sourcesRef.current.clear();
        setStatus('stopped');
    };

    return (
        <div className="w-full flex flex-col p-4 md:p-8 bg-gray-950/40 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Live Chat</h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">Engage in a live voice conversation to brainstorm, overcome challenges, or refine strategies.</p>

            <div className="mb-8">
                <button
                    onClick={status === 'active' ? stopConversation : startConversation}
                    disabled={status === 'connecting' || !isGeminiKeyConfigured}
                    className={`mx-auto px-8 py-4 rounded-full font-bold text-lg text-white transition flex items-center gap-3 ${
                        status === 'active' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                    } disabled:bg-gray-600 disabled:cursor-not-allowed`}
                >
                    {status === 'active' ? <StopIcon className="h-6 w-6" /> : <MicIcon className="h-6 w-6" />}
                    {status === 'connecting' ? 'Connecting...' : status === 'active' ? 'Stop Conversation' : 'Start Conversation'}
                </button>
                {!isGeminiKeyConfigured && <p className="mt-4 text-yellow-400 text-sm">Please add a Gemini API key in the 'API Keys' manager to enable Live Chat.</p>}
                {status === 'active' && <div className="mt-4 text-green-400 font-semibold animate-pulse">Listening...</div>}
                {error && <p className="mt-4 text-red-400">{error}</p>}
            </div>

            <div className="flex-grow bg-gray-900 rounded-lg p-4 text-left overflow-y-auto w-full max-w-3xl mx-auto border border-gray-700/50">
                <h3 className="text-lg font-semibold mb-3 text-white">Transcript</h3>
                {transcript.length === 0 && <p className="text-gray-500">Conversation will appear here...</p>}
                <div className="space-y-4">
                    {transcript.map((entry) => (
                        <div key={entry.id} className={`flex items-start gap-3 ${entry.source === 'user' ? 'flex-row-reverse' : ''}`}>
                            <div className={`p-3 rounded-lg max-w-sm ${entry.source === 'user' ? 'bg-blue-900/50' : 'bg-gray-800'}`}>
                                <p className="text-gray-200">{entry.text}{!entry.isFinal && '...'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
