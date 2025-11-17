
import React, { useState } from 'react';
import type { UploadedFile } from '../types';
import { editImage } from '../services/geminiService';
import { FileUploadSingle } from './common/FileUploadSingle';
import { SparklesIcon, DownloadIcon } from './icons/UIIcons';
import { useAuth } from '../contexts/AuthContext';

export function ImageStudio() {
    // FIX: Destructure `user` from `useAuth` as `session` is not provided by the context.
    const { user } = useAuth();
    const [image, setImage] = useState<UploadedFile | null>(null);
    const [prompt, setPrompt] = useState('');
    const [editedImage, setEditedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleEdit = async () => {
        // FIX: Check for `user` to ensure authentication, not `session`.
        if (!image || !prompt || !user) {
            setError('Please upload an image, provide an editing prompt, and ensure you are logged in.');
            return;
        }
        setIsLoading(true);
        setError('');
        setEditedImage(null);
        try {
            const result = await editImage(image, prompt);
            setEditedImage(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleReset = () => {
        setImage(null);
        setPrompt('');
        setEditedImage(null);
        setError('');
        setIsLoading(false);
    };

    const isIdle = !image;
    // FIX: Check for `user` to determine if the edit button should be enabled.
    const canEdit = image && prompt && !isLoading && user;

    return (
        <div className="w-full flex flex-col p-4 md:p-8 bg-gray-950/40">
            <div className="flex-grow flex flex-col md:flex-row gap-8 items-start">
                <div className="w-full md:w-1/3 lg:w-1/4 space-y-6">
                    <h2 className="text-2xl font-bold text-white">Image Studio</h2>
                    <FileUploadSingle file={image} onFileChange={setImage} disabled={isLoading || !!editedImage} />
                    
                    <div>
                        <label htmlFor="edit-prompt" className="block text-sm font-medium text-blue-300 mb-2">Edit Instruction</label>
                        <textarea
                            id="edit-prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="e.g., Add a retro filter"
                            className="w-full h-24 bg-gray-800 border border-gray-700 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-200 transition"
                            disabled={isIdle || isLoading || !!editedImage}
                        />
                    </div>

                    <div className="space-y-2">
                        <button
                            onClick={handleEdit}
                            disabled={!canEdit}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition"
                        >
                            <SparklesIcon className="h-5 w-5" />
                            {isLoading ? 'Generating...' : 'Apply Edit'}
                        </button>
                        {(isLoading || editedImage) && (
                            <button onClick={handleReset} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">
                                Start Over
                            </button>
                        )}
                    </div>
                    {error && <p className="text-sm text-red-400">{error}</p>}
                </div>

                <div className="flex-grow w-full md:w-2/3 lg:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div className="w-full p-4 bg-gray-900 rounded-lg border border-gray-700/50 aspect-square flex flex-col items-center justify-center">
                        <h3 className="text-lg font-semibold mb-2">Original</h3>
                        {image ? <img src={`data:${image.type};base64,${image.base64Data}`} alt="Original" className="max-w-full max-h-full object-contain rounded-md" /> : <p className="text-gray-500">Upload an image to start</p>}
                    </div>
                    <div className="w-full p-4 bg-gray-900 rounded-lg border border-gray-700/50 aspect-square flex flex-col items-center justify-center">
                        <h3 className="text-lg font-semibold mb-2">Edited</h3>
                        {isLoading && (
                            <div className="text-center">
                                <SparklesIcon className="h-12 w-12 text-blue-400 animate-pulse-fast mx-auto"/>
                                <p className="mt-2 text-gray-400">Editing in progress...</p>
                            </div>
                        )}
                        {editedImage && (
                            <div className="relative group w-full h-full flex items-center justify-center">
                                <img src={editedImage} alt="Edited" className="max-w-full max-h-full object-contain rounded-md" />
                                <a href={editedImage} download={`edited-${image?.name || 'image.png'}`} className="absolute bottom-4 right-4 bg-blue-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <DownloadIcon className="h-6 w-6"/>
                                </a>
                            </div>
                        )}
                        {!isLoading && !editedImage && <p className="text-gray-500">Your edited image will appear here</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}