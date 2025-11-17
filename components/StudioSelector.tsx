
import React from 'react';
import type { AppMode } from '../types';
import { AppMode as AppModes } from '../types';
import { TeamIcon, ImageEditIcon, MovieIcon, MicIcon } from './icons/UIIcons';

interface StudioSelectorProps {
    activeMode: AppMode;
    onModeChange: (mode: AppMode) => void;
}

const modes = [
    { id: AppModes.DREAM_TEAM, label: 'Dream Team', icon: TeamIcon },
    { id: AppModes.IMAGE_STUDIO, label: 'Image Studio', icon: ImageEditIcon },
    { id: AppModes.VIDEO_STUDIO, label: 'Video Studio', icon: MovieIcon },
    { id: AppModes.LIVE_CHAT, label: 'Live Chat', icon: MicIcon },
];

export const StudioSelector: React.FC<StudioSelectorProps> = ({ activeMode, onModeChange }) => {
    return (
        <div className="bg-gray-900 border-b border-gray-800 px-4 md:px-8">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                {modes.map(mode => {
                    const Icon = mode.icon;
                    const isActive = activeMode === mode.id;
                    return (
                        <button
                            key={mode.id}
                            onClick={() => onModeChange(mode.id)}
                            className={`flex items-center text-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                                isActive
                                ? 'border-blue-500 text-blue-400'
                                : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                            }`}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-blue-400' : 'text-gray-500'}`} />
                            {mode.label}
                        </button>
                    )
                })}
            </nav>
        </div>
    );
};
