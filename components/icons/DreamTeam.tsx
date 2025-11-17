
import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { AppStatus, Conversation, Message, RunMode, UploadedFile, InteractiveSummary, ConfiguredAIProfile } from '../types';
import { DEFAULT_AI_PROFILES, AVAILABLE_MODELS } from '../constants';
import { generateStream, generateSummary } from '../services/geminiService';
import { ControlPanel } from './ControlPanel';
import { ConversationDisplay } from './ConversationDisplay';
import { SummaryModal } from './SummaryModal';
import { AIProfileEditor } from './AIProfileEditor';
import { SparklesIcon } from './icons/UIIcons';
import { useAuth } from '../contexts/AuthContext';

interface DreamTeamProps {
  setHeaderActions: React.Dispatch<React.SetStateAction<React.ReactNode>>;
}

export function DreamTeam({ setHeaderActions }: DreamTeamProps) {
  // FIX: Destructure `user` from `useAuth` as `session` is not provided by the context.
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [conversation, setConversation] = useState<Conversation>([]);
  const [status, setStatus] = useState<AppStatus>('idle');
  const [mode, setMode] = useState<RunMode>('autonomous');
  const [targetCycles, setTargetCycles] = useState(3);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [finalSummary, setFinalSummary] = useState<InteractiveSummary | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [highlightedMessageIds, setHighlightedMessageIds] = useState<string[]>([]);
  const [recentQueries, setRecentQueries] = useState<string[]>([]);
  const [isCallToActionPulsing, setIsCallToActionPulsing] = useState(false);

  const [team, setTeam] = useState<ConfiguredAIProfile[]>(() => 
      DEFAULT_AI_PROFILES.map(p => ({
          ...p,
          provider: p.avatar === 'gpt' ? 'openai' : p.avatar === 'claude' ? 'anthropic' : 'gemini',
          model: p.avatar === 'gpt' ? 'gpt-4o' : p.avatar === 'claude' ? 'claude-3-sonnet-20240229' : 'gemini-2.5-pro'
      }))
  );
  
  const [editingProfile, setEditingProfile] = useState<ConfiguredAIProfile | null>(null);

  const statusRef = useRef(status);
  const conversationRef = useRef(conversation);
  
  useEffect(() => { 
    statusRef.current = status; 
  }, [status]);
  
  useEffect(() => { 
    conversationRef.current = conversation; 
  }, [conversation]);

  useEffect(() => {
    try {
        const saved = localStorage.getItem('dreamTeamRecentQueries');
        if (saved) setRecentQueries(JSON.parse(saved));
    } catch (e) { console.error("Could not load recent queries", e); }
  }, []);

  useEffect(() => {
    if (prompt.trim() && !isCallToActionPulsing && status === 'idle') {
      setIsCallToActionPulsing(true);
    }
  }, [prompt, isCallToActionPulsing, status]);

  const runConversation = useCallback(async () => {
    if (statusRef.current !== 'running' || team.length === 0) return;

    const processTurn = async (turnIndex: number, cycle: number, context: Message[]) => {
      const profile = team[turnIndex];
      const messageId = `${profile.id}-${Date.now()}`;
      const newMessage: Message = { id: messageId, aiId: profile.id, cycle, content: '', isStreaming: true, citations: [] };
      setConversation(prev => [...prev, newMessage]);

      const stream = generateStream(profile, prompt, context, uploadedFiles);
      
      for await (const chunk of stream) {
        if (statusRef.current !== 'running') break;
        if (chunk.error) {
          setConversation(prev => prev.map(m => m.id === messageId ? { ...m, content: `Error: ${chunk.error}`, isStreaming: false } : m));
          setStatus('paused');
          return;
        }
        setConversation(prev => prev.map(m => {
          if (m.id === messageId) {
            const updated = { ...m };
            if (chunk.text) updated.content += chunk.text;
            if (chunk.citations) updated.citations = [...(updated.citations || []), ...chunk.citations];
            return updated;
          }
          return m;
        }));
      }
       setConversation(prev => prev.map(m => m.id === messageId ? { ...m, isStreaming: false } : m));
    };

    let currentContext = [...conversationRef.current];
    await processTurn(currentTurnIndex, currentCycle, currentContext);
    
    if (statusRef.current === 'running') {
      const nextTurn = (currentTurnIndex + 1);
      if (nextTurn >= team.length) {
        const nextCycle = currentCycle + 1;
        if (nextCycle >= targetCycles) {
          setStatus('summarizing');
        } else {
          setCurrentCycle(nextCycle);
          setCurrentTurnIndex(0);
          if (mode === 'manual') setStatus('paused');
        }
      } else {
        setCurrentTurnIndex(nextTurn);
      }
    }
  }, [currentCycle, currentTurnIndex, mode, prompt, targetCycles, team, uploadedFiles]);
  
  const handleStart = useCallback(() => {
    // FIX: Check for `user` to ensure authentication, not `session`.
    if (!prompt.trim() || team.length === 0 || !user) return;
    const updatedQueries = [prompt.trim(), ...recentQueries.filter(q => q !== prompt.trim())].slice(0, 5);
    setRecentQueries(updatedQueries);
    localStorage.setItem('dreamTeamRecentQueries', JSON.stringify(updatedQueries));
    setIsCallToActionPulsing(false);
    setConversation([]);
    setCurrentCycle(0);
    setCurrentTurnIndex(0);
    setFinalSummary(null);
    setShowSummary(false);
    setStatus('running');
  // FIX: Update dependency array to use `user` instead of `session`.
  }, [prompt, team, user, recentQueries]);

  useEffect(() => {
    if (status === 'running') {
      runConversation();
    } else if (status === 'summarizing') {
      const getSummary = async () => {
        const summary = await generateSummary(prompt, conversation, team);
        setFinalSummary(summary);
        setStatus('finished');
        setShowSummary(true);
      };
      getSummary();
    }
  }, [status, currentCycle, currentTurnIndex, runConversation]);

  useEffect(() => {
      // FIX: Check for `user` to determine if the start button should be enabled.
      const canStart = prompt.trim() && team.length > 0 && user;
      setHeaderActions(
          <button
              onClick={handleStart}
              disabled={!canStart}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all text-sm animate-fade-in"
          >
              <SparklesIcon className="h-5 w-5" /> Run Dream Team
          </button>
      );
      return () => setHeaderActions(null);
  // FIX: Update dependency array to use `user` instead of `session`.
  }, [prompt, team, status, user, handleStart, setHeaderActions]);

  const handlePause = () => setStatus(status === 'running' ? 'paused' : 'running');
  const handleReset = () => {
    setStatus('idle');
    setConversation([]);
    setPrompt('');
    setUploadedFiles([]);
    setCurrentCycle(0);
    setFinalSummary(null);
    setShowSummary(false);
    setHighlightedMessageIds([]);
    setIsCallToActionPulsing(false);
  };
  const handleSummarize = () => setStatus('summarizing');
  const handleContinue = () => setStatus('running');

  const handleReorderAgents = (draggedId: string, targetId: string) => {
    setTeam(prev => {
        const currentList = [...prev];
        const draggedIndex = currentList.findIndex(p => p.id === draggedId);
        const targetIndex = currentList.findIndex(p => p.id === targetId);
        if (draggedIndex > -1 && targetIndex > -1) {
            const [draggedItem] = currentList.splice(draggedIndex, 1);
            currentList.splice(targetIndex, 0, draggedItem);
            return currentList;
        }
        return prev;
    });
  };

  const handleEditProfile = (profileId: string) => {
    const profileToEdit = team.find(p => p.id === profileId);
    if(profileToEdit) setEditingProfile(profileToEdit);
  };

  const handleSaveProfile = (updatedProfile: ConfiguredAIProfile) => {
    if (editingProfile && !team.find(p => p.id === updatedProfile.id)) {
        // ID has changed, this is an edit of an existing profile
        setTeam(prev => prev.map(p => p.id === editingProfile.id ? updatedProfile : p));
    } else {
        // This is a new agent
        setTeam(prev => [...prev, updatedProfile]);
    }
    setEditingProfile(null);
  };

  const handleAddAgent = () => {
      const newId = `new-agent-${Date.now()}`;
      const newAgent: ConfiguredAIProfile = {
          id: newId,
          name: 'New Agent',
          avatar: 'gemini',
          systemInstruction: 'You are a helpful assistant.',
          color: 'border-gray-500/50',
          provider: 'gemini',
          model: AVAILABLE_MODELS.gemini[0],
      };
      setEditingProfile(newAgent);
  };

  const handleRemoveAgent = (profileId: string) => {
      setTeam(prev => prev.filter(p => p.id !== profileId));
  };
  
  return (
    <>
      <ControlPanel
        prompt={prompt}
        setPrompt={setPrompt}
        status={status}
        mode={mode}
        setMode={setMode}
        targetCycles={targetCycles}
        setTargetCycles={setTargetCycles}
        onStart={handleStart}
        onPause={handlePause}
        onReset={handleReset}
        onSummarize={handleSummarize}
        onContinue={handleContinue}
        currentCycle={currentCycle}
        team={team}
        onReorderAgents={handleReorderAgents}
        onEditProfile={handleEditProfile}
        onAddAgent={handleAddAgent}
        onRemoveAgent={handleRemoveAgent}
        uploadedFiles={uploadedFiles}
        onAddFiles={(files) => setUploadedFiles(prev => [...prev, ...files])}
        onRemoveFile={(name) => setUploadedFiles(prev => prev.filter(f => f.name !== name))}
        recentQueries={recentQueries}
        isCallToActionPulsing={isCallToActionPulsing}
      />
      <ConversationDisplay
        conversation={conversation}
        status={status}
        prompt={prompt}
        currentCycle={currentCycle}
        targetCycles={targetCycles}
        highlightedMessageIds={highlightedMessageIds}
        team={team}
      />
      {showSummary && (
        <SummaryModal
          summary={finalSummary}
          onClose={() => setShowSummary(false)}
          isLoading={status === 'summarizing'}
          onDownloadTranscript={() => { /* Implement download */ }}
          onHighlight={setHighlightedMessageIds}
        />
      )}
      {editingProfile && (
        <AIProfileEditor
            profile={editingProfile}
            allProfiles={team}
            onSave={handleSaveProfile}
            onClose={() => setEditingProfile(null)}
        />
      )}
    </>
  );
}