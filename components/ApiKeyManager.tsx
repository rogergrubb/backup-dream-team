
import React, { useState, useEffect } from 'react';
import { useApiKeys, type ApiKeys, type ApiProviders } from '../hooks/useApiKeys';

interface ApiKeyManagerProps {
  onClose: () => void;
}

const providers: { id: ApiProviders; name: string }[] = [
  { id: 'gemini', name: 'Google (Gemini, Imagen)' },
  { id: 'openai', name: 'OpenAI (GPT)' },
  { id: 'anthropic', name: 'Anthropic (Claude)' },
  { id: 'deepseek', name: 'DeepSeek' },
  { id: 'grok', name: 'Grok' },
  { id: 'kimi', name: 'Kimi AI' },
];

export const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ onClose }) => {
  const { keys: initialKeys, saveKeys, loading } = useApiKeys();
  const [keys, setKeys] = useState<ApiKeys>({ ...initialKeys });

  useEffect(() => {
    setKeys(initialKeys);
  }, [initialKeys]);

  const handleSave = async () => {
    try {
      await saveKeys(keys);
      onClose();
    } catch (error) {
      console.error("Failed to save keys:", error);
      alert(`Error saving keys: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleChange = (provider: ApiProviders, value: string) => {
    setKeys(prev => ({ ...prev, [provider]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-fade-in">
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col animate-scale-up">
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Manage API Keys</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-6">
          <p className="text-sm text-gray-400">
            Enter your API keys below. Keys are securely stored and encrypted in the database, associated with your account. They are only used on the server and are never exposed to the browser.
          </p>
          {loading ? <p className="text-gray-400">Loading your saved keys...</p> : (
            providers.map(provider => (
              <div key={provider.id}>
                <label htmlFor={`key-${provider.id}`} className="block text-sm font-medium text-blue-300 mb-1">{provider.name}</label>
                <input
                  type="password"
                  id={`key-${provider.id}`}
                  value={keys[provider.id]}
                  onChange={e => handleChange(provider.id, e.target.value)}
                  placeholder={initialKeys[provider.id] ? 'Key is set. Enter a new key to update.' : `Enter your ${provider.name} API key`}
                  className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-200"
                />
              </div>
            ))
          )}
        </div>
        
        <div className="p-4 border-t border-gray-800 flex justify-end gap-3">
          <button onClick={onClose} className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition">
            Cancel
          </button>
          <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition">
            Save Keys
          </button>
        </div>
      </div>
    </div>
  );
};
