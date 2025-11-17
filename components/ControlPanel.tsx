
import React, { useState, useRef, useCallback, type SetStateAction } from 'react';
import type { AppStatus, RunMode, AIProfileId, UploadedFile, ConfiguredAIProfile } from '../types';
// FIX: Add missing import for XCircleIcon.
import { PlayIcon, PauseIcon, StopIcon, FastForwardIcon, SparklesIcon, EditIcon, InfoIcon, TeamIcon, XCircleIcon } from './icons/UIIcons';
import { FileUpload } from './FileUpload';
import { AVATAR_MAP } from './icons/AvatarRegistry';
import { AVAILABLE_MODELS } from '../constants';

// --- Step 1: Task Description ---
const Step1Task: React.FC<{
  prompt: string;
  setPrompt: (value: SetStateAction<string>) => void;
  recentQueries: string[];
}> = ({ prompt, setPrompt, recentQueries }) => {
    return (
        <div className="flex flex-col gap-4">
            <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., How can we build a successful SaaS product?"
                className="w-full h-36 bg-gray-800 border border-gray-700 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-200 transition"
            />
            {recentQueries.length > 0 && (
                <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Recent Queries</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {recentQueries.map((query, i) => (
                            <button 
                                key={i} 
                                onClick={() => setPrompt(query)} 
                                className="w-full text-left text-xs p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-md text-gray-400 transition-colors"
                                style={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 5,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                                title={query}
                            >
                                {query}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Step 2: Attach Inputs ---
const Step2Inputs: React.FC<{
  uploadedFiles: UploadedFile[];
  onAddFiles: (files: UploadedFile[]) => void;
  onRemoveFile: (fileName: string) => void;
}> = ({ uploadedFiles, onAddFiles, onRemoveFile }) => (
    <div className="flex flex-col gap-4">
        <FileUpload
            files={uploadedFiles}
            onAddFiles={onAddFiles}
            onRemoveFile={onRemoveFile}
            disabled={false}
        />
        <div className="text-xs text-gray-500 text-center space-y-1">
            <p>Accepted types: Images, Text, CSV, Docs, and more.</p>
            <p>Max 10 files, up to 100MB each.</p>
            <p>Current files: {uploadedFiles.length}</p>
        </div>
    </div>
);

// --- Step 3: Assemble Team ---
const Step3Team: React.FC<{
  team: ConfiguredAIProfile[];
  onReorderAgents: (draggedId: string, targetId: string) => void;
  onEditProfile: (profileId: string) => void;
  onAddAgent: () => void;
  onRemoveAgent: (profileId: string) => void;
}> = ({ team, onReorderAgents, onEditProfile, onAddAgent, onRemoveAgent }) => {
    const dragItem = useRef<string | null>(null);
    const dragOverItem = useRef<string | null>(null);

    const handleDragStart = (id: string) => dragItem.current = id;
    const handleDragEnter = (id: string) => dragOverItem.current = id;
    const handleDragEnd = () => {
        if (dragItem.current && dragOverItem.current && dragItem.current !== dragOverItem.current) {
            onReorderAgents(dragItem.current, dragOverItem.current);
        }
        dragItem.current = null;
        dragOverItem.current = null;
    };

    return (
      <div className="space-y-4">
        <div className="p-3 bg-yellow-900/30 border border-yellow-700/50 text-yellow-300 text-xs rounded-lg">
            <strong>Warning:</strong> You are responsible for any costs incurred from your own API keys. Monitor your usage with your provider.
        </div>
        <div className="space-y-3">
            {team.map(profile => {
                const Avatar = AVATAR_MAP[profile.avatar];
                return (
                    <div
                        key={profile.id}
                        draggable
                        onDragStart={() => handleDragStart(profile.id)}
                        onDragEnter={() => handleDragEnter(profile.id)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => e.preventDefault()}
                        className={`relative p-3 rounded-lg border-2 flex items-center gap-4 transition-all duration-200 cursor-grab ${profile.color} bg-gray-800`}
                    >
                         <Avatar className="h-10 w-10 shrink-0" />
                         <div className="flex-grow">
                            <p className="font-bold text-white">{profile.name}</p>
                            <p className="text-xs text-gray-400">{profile.provider} / {profile.model}</p>
                         </div>
                         <button
                            onClick={() => onEditProfile(profile.id)}
                            className="p-1 rounded-full bg-gray-700/50 hover:bg-gray-600 text-gray-300 hover:text-white transition"
                            title={`Edit ${profile.name}`}
                        >
                            <EditIcon className="h-4 w-4" />
                        </button>
                         <button
                            onClick={() => onRemoveAgent(profile.id)}
                            className="p-1 rounded-full bg-red-900/50 hover:bg-red-800/80 text-gray-300 hover:text-white transition"
                            title={`Remove ${profile.name}`}
                        >
                            <XCircleIcon className="h-4 w-4" />
                        </button>
                    </div>
                );
            })}
        </div>
        <button
            onClick={onAddAgent}
            disabled={team.length >= 6}
            className="w-full bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <TeamIcon className="h-5 w-5" />
          Add Agent (Max 6)
        </button>
      </div>
    );
};


// --- Step 4: Settings ---
const Step4Settings: React.FC<{
  mode: RunMode;
  setMode: (mode: RunMode) => void;
  targetCycles: number;
  setTargetCycles: (cycles: number) => void;
}> = ({ mode, setMode, targetCycles, setTargetCycles }) => (
    <div className="space-y-6">
        <div>
            <label className="block text-sm font-medium text-blue-300 mb-2">Mode</label>
            <div className="flex gap-2">
                <button
                    onClick={() => setMode('autonomous')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition ${mode === 'autonomous' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                >Autonomous</button>
                <button
                    onClick={() => setMode('manual')}
                    className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition ${mode === 'manual' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                >Manual</button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
                {mode === 'autonomous'
                    ? "Runs all rounds automatically."
                    : "Pauses after each round for your review."}
            </p>
        </div>
        <div>
            <label htmlFor="cycles" className="block text-sm font-medium text-blue-300 mb-2">Iterations</label>
            <input
                type="number"
                id="cycles"
                min="1"
                max="10"
                value={targetCycles}
                onChange={(e) => setTargetCycles(Math.max(1, Math.min(10, Number(e.target.value))))}
                className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-200"
            />
             <p className="text-xs text-gray-500 mt-2">Number of full conversation cycles the team will complete.</p>
        </div>
    </div>
);


interface ControlPanelProps {
  prompt: string;
  setPrompt: (value: SetStateAction<string>) => void;
  status: AppStatus;
  mode: RunMode;
  setMode: (mode: RunMode) => void;
  targetCycles: number;
  setTargetCycles: (cycles: number) => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSummarize: () => void;
  onContinue: () => void;
  currentCycle: number;
  team: ConfiguredAIProfile[];
  onReorderAgents: (draggedId: string, targetId: string) => void;
  onEditProfile: (profileId: string) => void;
  onAddAgent: () => void;
  onRemoveAgent: (profileId: string) => void;
  uploadedFiles: UploadedFile[];
  onAddFiles: (files: UploadedFile[]) => void;
  onRemoveFile: (fileName: string) => void;
  recentQueries: string[];
  isCallToActionPulsing: boolean;
}

const STEPS = [
    { id: 1, title: 'Describe the Task' },
    { id: 2, title: 'Attach Inputs (Optional)' },
    { id: 3, title: 'Assemble Team' },
    { id: 4, title: 'Configure Settings' },
];

export const ControlPanel: React.FC<ControlPanelProps> = (props) => {
    const [currentStep, setCurrentStep] = useState(1);
    const { status, currentCycle, targetCycles, onPause, onSummarize, onContinue, mode, onReset, isCallToActionPulsing } = props;
    const isIdle = props.status === 'idle';
    
    const canGoNext = () => {
        if (currentStep === 1 && !props.prompt.trim()) return false;
        if (currentStep === 3 && props.team.length === 0) return false;
        return true;
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1: return <Step1Task prompt={props.prompt} setPrompt={props.setPrompt} recentQueries={props.recentQueries} />;
            case 2: return <Step2Inputs uploadedFiles={props.uploadedFiles} onAddFiles={props.onAddFiles} onRemoveFile={props.onRemoveFile} />;
            case 3: return <Step3Team {...props} />;
            case 4: return <Step4Settings mode={props.mode} setMode={props.setMode} targetCycles={props.targetCycles} setTargetCycles={props.setTargetCycles} />;
            default: return null;
        }
    };
    
    const getStatusText = () => {
        switch (status) {
            case 'running': return `Running Round ${currentCycle + 1} of ${targetCycles}...`;
            case 'paused': return `Paused after Round ${currentCycle}`;
            case 'summarizing': return 'Generating summary...';
            case 'finished': return 'Conversation Finished';
            default: return '...';
        }
    };
    const progress = status === 'idle' ? 0 : Math.min(((currentCycle) / targetCycles) * 100, 100);

    return (
        <aside className="w-full md:w-1/3 lg:w-1/4 bg-gray-900 border-r border-gray-800 flex flex-col">
            {isIdle ? (
                <>
                    <div className="flex-grow p-4 flex flex-col gap-6 overflow-y-auto">
                        <div className="flex items-center gap-2">
                            {STEPS.map(step => (
                                <div key={step.id} className={`flex-1 h-1 rounded-full ${currentStep >= step.id ? 'bg-blue-500' : 'bg-gray-700'}`}></div>
                            ))}
                        </div>
                        <div>
                            <span className="text-sm font-semibold text-blue-400">Step {currentStep} of {STEPS.length}</span>
                            <h3 className="text-lg font-bold text-white mt-1">{STEPS[currentStep - 1].title}</h3>
                        </div>
                        {renderStepContent()}
                    </div>
                    <div className="flex-shrink-0 p-4 border-t border-gray-800 bg-gray-900 space-y-3">
                        <div className="flex items-center justify-between">
                            <button onClick={() => setCurrentStep(s => s - 1)} disabled={currentStep === 1} className="py-2 px-4 text-sm font-semibold text-gray-300 hover:text-white disabled:opacity-50">Back</button>
                            {currentStep < STEPS.length && (
                                <button
                                    onClick={() => setCurrentStep(s => s + 1)}
                                    disabled={!canGoNext()}
                                    className={`py-2 px-4 rounded-md text-sm font-semibold disabled:opacity-50 transition-colors ${isCallToActionPulsing && canGoNext() ? 'bg-blue-600 hover:bg-blue-700 text-white animate-pulse-strong' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'}`}
                                >Next</button>
                            )}
                        </div>
                        <button
                            onClick={props.onStart}
                            disabled={!props.prompt.trim() || props.team.length === 0}
                            className={`w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105 shadow-lg hover:shadow-blue-500/50 ${isCallToActionPulsing && currentStep === 4 ? 'animate-pulse-strong' : ''}`}
                        >
                            <SparklesIcon className="h-5 w-5" /> Start Dream Team
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex-grow p-4 flex flex-col gap-4 items-center justify-center">
                        <div className="relative w-32 h-32">
                            <svg className="w-full h-full" viewBox="0 0 100 100">
                                <circle className="text-gray-700" strokeWidth="8" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
                                <circle
                                    className="text-blue-500"
                                    strokeWidth="8" strokeDasharray={2 * Math.PI * 45} strokeDashoffset={(2 * Math.PI * 45) - (progress / 100) * (2 * Math.PI * 45)}
                                    strokeLinecap="round" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50"
                                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.5s ease-in-out' }} />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-bold text-white">{currentCycle}</span>
                                <span className="text-sm text-gray-400 -mt-1">of {targetCycles}</span>
                            </div>
                        </div>
                        <p className="text-center text-sm font-semibold text-gray-300">{getStatusText()}</p>
                    </div>
                    <div className="flex-shrink-0 p-4 border-t border-gray-800 bg-gray-900">
                        <div className="w-full grid grid-cols-2 gap-2">
                            {status === 'running' || status === 'paused' ? (
                                <>
                                    <button onClick={onPause} className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2">
                                        {status === 'running' ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
                                        {status === 'running' ? 'Pause' : 'Resume'}
                                    </button>
                                    <button onClick={onSummarize} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2">
                                        <SparklesIcon className="h-5 w-5" /> Summarize
                                    </button>
                                </>
                            ) : null}
                            {status === 'paused' && mode === 'manual' && currentCycle < targetCycles && (
                                <button onClick={onContinue} className="col-span-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2">
                                    <FastForwardIcon className="h-5 w-5" /> Continue Next Round
                                </button>
                            )}
                            <button onClick={onReset} className="col-span-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2">
                                <StopIcon className="h-5 w-5" /> End & Reset
                            </button>
                        </div>
                    </div>
                </>
            )}
        </aside>
    );
};
