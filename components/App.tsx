import React, { useState, useEffect } from 'react';
import { AppMode } from '../types';
import { StudioSelector } from './StudioSelector';
import { DreamTeam } from './DreamTeam';
import { ImageStudio } from './ImageStudio';
import { VideoStudio } from './VideoStudio';
import { LiveChat } from './LiveChat';
import { ApiKeyManager } from './ApiKeyManager';
import { Auth } from './Auth';
import { useAuth } from '../contexts/AuthContext';

export default function App() {
  const { user, signOut } = useAuth();
  const [appMode, setAppMode] = useState<AppMode>(AppMode.DREAM_TEAM);
  const [headerActions, setHeaderActions] = useState<React.ReactNode>(null);
  const [showApiKeyManager, setShowApiKeyManager] = useState(false);

  useEffect(() => {
    if (appMode !== AppMode.DREAM_TEAM) {
      setHeaderActions(null);
    }
  }, [appMode]);

  if (!user) {
    return <Auth />;
  }

  const renderStudio = () => {
    switch (appMode) {
      case AppMode.IMAGE_STUDIO:
        return <ImageStudio />;
      case AppMode.VIDEO_STUDIO:
        return <VideoStudio />;
      case AppMode.LIVE_CHAT:
        return <LiveChat />;
      case AppMode.DREAM_TEAM:
      default:
        return <DreamTeam setHeaderActions={setHeaderActions} />;
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gray-950 text-gray-200 font-sans flex flex-col">
        <header className="fixed top-0 left-0 right-0 bg-gray-950/80 backdrop-blur-sm border-b border-gray-700/50 p-4 z-20 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">
            <span className="text-blue-400">MultiPowerAI</span> Suite
          </h1>
          <div className="flex items-center gap-4">
            {headerActions}
            <button
              onClick={() => setShowApiKeyManager(true)}
              className="text-sm bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-3 rounded-lg transition-colors"
            >
              API Keys
            </button>
            <div className="group relative">
              <button className="text-sm bg-gray-800 rounded-full h-8 w-8 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500">
                {user?.email?.charAt(0).toUpperCase()}
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                <div className="px-4 py-2 text-xs text-gray-400 truncate">{user?.email}</div>
                <button
                  onClick={signOut}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 flex flex-col pt-16">
          <StudioSelector activeMode={appMode} onModeChange={setAppMode} />
          <div className="flex-1 flex">
            {renderStudio()}
          </div>
        </main>
      </div>
      {showApiKeyManager && <ApiKeyManager onClose={() => setShowApiKeyManager(false)} />}
    </>
  );
}