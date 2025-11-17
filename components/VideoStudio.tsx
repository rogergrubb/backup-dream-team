
import React, { useState, useEffect, useRef } from 'react';
import type { UploadedFile } from '../types';
import { generateVideo, getVideosOperation } from '../services/geminiService';
import { FileUploadSingle } from './common/FileUploadSingle';
import { MovieIcon, DownloadIcon } from './icons/UIIcons';
import type { Operation, GenerateVideosResponse } from '@google/genai';
import { useApiKeys } from '../hooks/useApiKeys';

export function VideoStudio() {
    const [image, setImage] = useState<UploadedFile | null>(null);
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
    const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
    const [status, setStatus] = useState<'idle' | 'generating' | 'polling' | 'success' | 'error'>('idle');
    const [error, setError] = useState('');
    const { isConfigured } = useApiKeys();
    const pollingInterval = useRef<number | null>(null);

    const isGeminiKeyConfigured = isConfigured('gemini');

    useEffect(() => {
        return () => {
            if (pollingInterval.current) clearInterval(pollingInterval.current);
        };
    }, []);

    const pollOperation = (operation: Operation<GenerateVideosResponse>) => {
        pollingInterval.current = window.setInterval(async () => {
            try {
                const updatedOp = await getVideosOperation(operation);
                if (updatedOp.done) {
                    clearInterval(pollingInterval.current!);
                    pollingInterval.current = null;
                    const uri = updatedOp.response?.generatedVideos?.[0]?.video?.uri;
                    if (uri) {
                        const response = await fetch(`${uri}&key=${process.env.API_KEY}`);
                        if (!response.ok) throw new Error(`Failed to fetch video: ${response.statusText}`);
                        const blob = await response.blob();
                        const videoUrl = URL.createObjectURL(blob);
                        setGeneratedVideo(videoUrl);
                        setStatus('success');
                    } else {
                        const errorMessage = updatedOp.error?.message || "Video generation completed but no URI was found.";
                        setError(errorMessage);
                        setStatus('error');
                    }
                }
            } catch (err) {
                if (pollingInterval.current) clearInterval(pollingInterval.current);
                pollingInterval.current = null;
                setError(err instanceof Error ? err.message : 'Failed to poll for video status.');
                setStatus('error');
            }
        }, 10000);
    };

    const handleGenerate = async () => {
        if (!image) {
            setError('Please upload an image to animate.');
            return;
        }
        if (!isGeminiKeyConfigured) {
            setError("Please add a Gemini API key in the 'API Keys' manager to use the Video Studio.");
            return;
        }
        
        setStatus('generating');
        setError('');
        setGeneratedVideo(null);
        try {
            const operation = await generateVideo(image, prompt, aspectRatio);
            setStatus('polling');
            pollOperation(operation);
        } catch (err) {
            const message = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(message);
            setStatus('error');
        }
    };
    
    const handleReset = () => {
        if (pollingInterval.current) clearInterval(pollingInterval.current);
        pollingInterval.current = null;
        setImage(null);
        setPrompt('');
        setGeneratedVideo(null);
        setStatus('idle');
        setError('');
    };

    const isLoading = status === 'generating' || status === 'polling';
    const canGenerate = image && !isLoading && status !== 'success' && isGeminiKeyConfigured;

    const getLoadingText = () => {
        if (status === 'generating') return "Initializing video generation...";
        if (status === 'polling') return "Animating your image... This may take a few minutes.";
        return "";
    }

    return (
        <div className="w-full flex flex-col p-4 md:p-8 bg-gray-950/40">
            <div className="flex-grow flex flex-col md:flex-row gap-8 items-start">
                <div className="w-full md:w-1/3 lg:w-1/4 space-y-6">
                    <h2 className="text-2xl font-bold text-white">Video Studio</h2>
                    {!isGeminiKeyConfigured && (
                        <div className="p-3 bg-yellow-500/20 rounded-lg text-yellow-300 text-sm">
                            Video Studio requires a Gemini API key. Please add one in the API Keys manager.
                        </div>
                    )}

                    <FileUploadSingle file={image} onFileChange={setImage} disabled={isLoading || status === 'success'} />

                    <div>
                        <label htmlFor="video-prompt" className="block text-sm font-medium text-blue-300 mb-2">Animation Prompt (Optional)</label>
                        <textarea
                            id="video-prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., A gentle breeze blows through the trees"
                            className="w-full h-24 bg-gray-800 border border-gray-700 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-200 transition"
                            disabled={!image || isLoading || status === 'success'}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-blue-300 mb-2">Aspect Ratio</label>
                        <div className="flex gap-2">
                            <button onClick={() => setAspectRatio('16:9')} disabled={!image || isLoading || status === 'success'} className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition ${aspectRatio === '16:9' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>16:9 (Landscape)</button>
                            <button onClick={() => setAspectRatio('9:16')} disabled={!image || isLoading || status === 'success'} className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition ${aspectRatio === '9:16' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}>9:16 (Portrait)</button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <button onClick={handleGenerate} disabled={!canGenerate} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition">
                            <MovieIcon className="h-5 w-5" />
                            {isLoading ? 'Animating...' : 'Animate Image'}
                        </button>
                        {(isLoading || status === 'success' || status === 'error') && (
                            <button onClick={handleReset} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">Start Over</button>
                        )}
                    </div>
                     {error && <p className="text-sm text-red-400">{error}</p>}
                </div>

                <div className="flex-grow w-full md:w-2/3 lg:w-3/4 flex items-center justify-center p-4 bg-gray-900 rounded-lg border border-gray-700/50 min-h-[60vh]">
                   {status === 'idle' && !image && <p className="text-gray-500">Upload an image to animate</p>}
                   {status === 'idle' && image && (
                        <div className="text-center">
                            <img src={`data:${image.type};base64,${image.base64Data}`} alt="For animation" className="max-w-full max-h-[50vh] object-contain rounded-md mb-4" />
                            <p className="text-gray-400">Ready to animate!</p>
                        </div>
                   )}
                   {isLoading && (
                        <div className="text-center">
                            <MovieIcon className="h-16 w-16 text-blue-400 animate-pulse-fast mx-auto"/>
                            <p className="mt-4 text-lg text-gray-300">{getLoadingText()}</p>
                        </div>
                   )}
                   {status === 'success' && generatedVideo && (
                        <div className="w-full">
                            <video src={generatedVideo} controls autoPlay loop className="w-full rounded-lg max-h-[70vh]"></video>
                            <a href={generatedVideo} download={`animated-${image?.name || 'video'}.mp4`} className="mt-4 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">
                                <DownloadIcon className="h-5 w-5" /> Download Video
                            </a>
                        </div>
                   )}
                </div>
            </div>
        </div>
    );
}
