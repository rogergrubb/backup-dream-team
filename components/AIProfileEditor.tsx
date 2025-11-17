
import React, { useState, useEffect } from 'react';
import type { ConfiguredAIProfile } from '../types';
import { AVATAR_MAP, AVATAR_OPTIONS } from './icons/AvatarRegistry';
import { COLOR_OPTIONS, AVAILABLE_MODELS } from '../constants';

interface AIProfileEditorProps {
  profile: ConfiguredAIProfile;
  allProfiles: ConfiguredAIProfile[];
  onSave: (updatedProfile: ConfiguredAIProfile) => void;
  onClose: () => void;
}

export const AIProfileEditor: React.FC<AIProfileEditorProps> = ({ profile, allProfiles, onSave, onClose }) => {
  const [editedProfile, setEditedProfile] = useState<ConfiguredAIProfile>(profile);
  const [idError, setIdError] = useState('');

  useEffect(() => {
    const isIdUnique = !allProfiles.some(p => p.id === editedProfile.id && p.id !== profile.id);
    const isIdValid = /^[a-z0-9-]+$/.test(editedProfile.id);

    if (!isIdValid) setIdError('ID can only contain lowercase letters, numbers, and hyphens.');
    else if (!isIdUnique) setIdError('This ID is already in use.');
    else setIdError('');
  }, [editedProfile.id, allProfiles, profile.id]);
  
  const handleSave = () => {
    if (!idError && editedProfile.id && editedProfile.name && editedProfile.model) {
      onSave(editedProfile);
    }
  };

  const handleProviderChange = (provider: string) => {
    const newModel = AVAILABLE_MODELS[provider][0];
    setEditedProfile(p => ({ ...p, provider, model: newModel }));
  };

  const isSaveDisabled = !!idError || !editedProfile.id || !editedProfile.name || !editedProfile.model;
  const currentProviderModels = AVAILABLE_MODELS[editedProfile.provider] || [];

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-fade-in">
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-scale-up">
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Edit Agent: {profile.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="agent-id" className="block text-sm font-medium text-blue-300 mb-1">Agent ID</label>
                <input type="text" id="agent-id" value={editedProfile.id} onChange={e => setEditedProfile({ ...editedProfile, id: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-200" />
                {idError && <p className="text-xs text-red-400 mt-1">{idError}</p>}
            </div>
            <div>
                <label htmlFor="agent-name" className="block text-sm font-medium text-blue-300 mb-1">Agent Name</label>
                <input type="text" id="agent-name" value={editedProfile.name} onChange={e => setEditedProfile({ ...editedProfile, name: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-200" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="agent-provider" className="block text-sm font-medium text-blue-300 mb-1">Provider</label>
                <select id="agent-provider" value={editedProfile.provider} onChange={e => handleProviderChange(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-200">
                    {Object.keys(AVAILABLE_MODELS).map(provider => <option key={provider} value={provider}>{provider}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="agent-model" className="block text-sm font-medium text-blue-300 mb-1">Model</label>
                <select id="agent-model" value={editedProfile.model} onChange={e => setEditedProfile({ ...editedProfile, model: e.target.value })} className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-200">
                    {currentProviderModels.map(model => <option key={model} value={model}>{model}</option>)}
                </select>
            </div>
          </div>

          <div>
            <label htmlFor="agent-instruction" className="block text-sm font-medium text-blue-300 mb-1">System Instruction</label>
            <textarea id="agent-instruction" value={editedProfile.systemInstruction} onChange={e => setEditedProfile({ ...editedProfile, systemInstruction: e.target.value })} rows={5} className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-200" />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-300 mb-2">Avatar</label>
            <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9 gap-2">
                {AVATAR_OPTIONS.map(avatarKey => {
                    const AvatarComponent = AVATAR_MAP[avatarKey];
                    const isSelected = editedProfile.avatar === avatarKey;
                    return (
                        <button key={avatarKey} onClick={() => setEditedProfile({ ...editedProfile, avatar: avatarKey })} className={`p-2 rounded-lg border-2 flex items-center justify-center transition ${isSelected ? 'border-blue-500 bg-blue-500/10' : 'border-gray-700 hover:border-gray-600'}`}>
                            <AvatarComponent className="w-10 h-10" />
                        </button>
                    )
                })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-300 mb-2">Color</label>
            <div className="flex flex-wrap gap-2">
                {COLOR_OPTIONS.map(colorClass => {
                    const isSelected = editedProfile.color === colorClass;
                    const bgColor = colorClass.replace('border-', 'bg-').replace('/50', '/30');
                    return (
                        <button key={colorClass} onClick={() => setEditedProfile({ ...editedProfile, color: colorClass })} className={`w-10 h-10 rounded-full border-2 transition ${colorClass} ${isSelected ? 'ring-2 ring-offset-2 ring-offset-gray-900 ring-white' : ''} ${bgColor}`} />
                    )
                })}
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t border-gray-800 flex justify-end gap-3">
          <button onClick={onClose} className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition">Cancel</button>
          <button onClick={handleSave} disabled={isSaveDisabled} className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition">Save Changes</button>
        </div>
      </div>
    </div>
  );
};
