
import React, { useEffect, useRef, useState, useMemo } from 'react';
import type { Conversation, AppStatus, Message, AIProfileId, ConfiguredAIProfile } from '../types';
import { marked } from 'marked';
import { MindMapView } from './MindMapView';
import { ChatIcon, MindMapIcon, SearchIcon, XCircleIcon } from './icons/UIIcons';
import { AVATAR_MAP } from './icons/AvatarRegistry';

// --- MessageBubble Component ---
interface MessageBubbleProps {
  message: Message;
  isHighlighted: boolean;
  profile: ConfiguredAIProfile | undefined;
  searchQuery: string;
}

const LoadingIndicator: React.FC = () => (
  <div className="flex items-center gap-2 text-gray-400">
    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse-fast"></div>
    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse-fast animation-delay-200ms"></div>
    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse-fast animation-delay-400ms"></div>
  </div>
);

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isHighlighted, profile, searchQuery }) => {
  if (!profile) {
    return (
        <div className="p-4 rounded-xl bg-gray-900 border border-red-500/50">
            <p className='text-red-400'>Error: AI Profile for ID '{message.aiId}' not found.</p>
        </div>
    );
  }
  const Avatar = AVATAR_MAP[profile.avatar];

  const isThinking = message.isStreaming && !message.content;
  const isStreamingContent = message.isStreaming && message.content;
  const isImage = message.content.startsWith('data:image/');
  
  const handleImageClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    try {
      const dataURI = message.content;
      const parts = dataURI.split(',');
      const mimeTypePart = parts[0];
      const base64Part = parts[1];
      
      if (!mimeTypePart || !base64Part) {
        window.open(dataURI, '_blank');
        return;
      }

      const mimeType = mimeTypePart.match(/:(.*?);/)?.[1];
      const byteCharacters = atob(base64Part);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      const imageUrl = URL.createObjectURL(blob);
      
      window.open(imageUrl, '_blank');
    } catch (error) {
      console.error("Failed to open image in new tab via blob, falling back to direct open:", error);
      window.open(message.content, '_blank');
    }
  };

  const highlightHTML = (htmlString: string, query: string): string => {
    if (!query.trim() || typeof window === 'undefined') return htmlString;
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${htmlString}</div>`, 'text/html');
    const walker = document.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
    const textNodes: Text[] = [];
    let currentNode: Node | null;
    while ((currentNode = walker.nextNode())) {
        if (currentNode instanceof Text) {
            textNodes.push(currentNode);
        }
    }
    const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
    textNodes.forEach(node => {
        if (node.parentElement?.tagName.toLowerCase() === 'script' || node.parentElement?.tagName.toLowerCase() === 'style') {
            return;
        }
        const text = node.textContent;
        if (text && regex.test(text)) {
            const fragment = document.createDocumentFragment();
            text.split(regex).forEach((part, index) => {
                if (index % 2 === 1) {
                    const mark = document.createElement('mark');
                    mark.className = 'bg-yellow-500/30 text-yellow-100 rounded px-0.5';
                    mark.textContent = part;
                    fragment.appendChild(mark);
                } else if (part) {
                    fragment.appendChild(document.createTextNode(part));
                }
            });
            node.parentNode?.replaceChild(fragment, node);
        }
    });
    return doc.body.innerHTML;
  };

  const parsedContent = isImage ? '' : marked.parse(message.content) as string;
  const renderedContent = highlightHTML(parsedContent, searchQuery);

  return (
    <div className="flex items-start gap-4">
      <Avatar className="h-10 w-10 rounded-full p-1 bg-gray-800 mt-1 shrink-0" />
      <div className={`flex-1 p-4 rounded-xl bg-gray-900 border ${isHighlighted ? 'border-blue-400' : profile.color} transition-all duration-300 transform ${isHighlighted ? 'shadow-lg shadow-blue-500/20 scale-[1.01]' : 'scale-100'}`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg text-white">{profile.name}</h3>
          <span className="text-xs font-semibold text-blue-400/80">Round {message.cycle + 1}</span>
        </div>
        {isImage ? (
          <a href={message.content} onClick={handleImageClick} title="Click to view full image" className="block">
            <img 
              src={message.content} 
              alt="Generated by AI" 
              className="rounded-lg max-h-80 w-auto object-contain cursor-pointer transition-transform hover:scale-105" 
            />
          </a>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none prose-p:text-gray-300 prose-li:text-gray-300 prose-headings:text-gray-100 prose-strong:text-white prose-code:text-purple-300 prose-code:bg-gray-800 prose-code:p-1 prose-code:rounded">
            {isThinking ? (
              <LoadingIndicator />
            ) : (
              <div dangerouslySetInnerHTML={{ __html: renderedContent }} />
            )}
            {isStreamingContent && <span className="inline-block w-2 h-4 bg-gray-200 ml-1 animate-pulse" />}
          </div>
        )}
        {message.citations && message.citations.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-700/50">
            <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase">Sources</h4>
            <ul className="space-y-1">
              {message.citations.map((citation, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <span className='text-blue-400 mt-1'>&#8227;</span>
                  <a href={citation.web.uri} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline break-all">
                    {citation.web.title || citation.web.uri}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

// --- ConversationDisplay Component ---
interface ConversationDisplayProps {
  conversation: Conversation;
  status: AppStatus;
  prompt: string;
  currentCycle: number;
  targetCycles: number;
  highlightedMessageIds: string[];
  team: ConfiguredAIProfile[];
}

export const ConversationDisplay: React.FC<ConversationDisplayProps> = ({ conversation, status, prompt, currentCycle, targetCycles, highlightedMessageIds, team }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<'chat' | 'mindmap'>('chat');
  const [searchQuery, setSearchQuery] = useState('');
  
  const aiProfilesMap = useMemo(() => new Map(team.map(p => [p.id, p])), [team]);

  const sortedConversation = useMemo(() => {
      const teamOrder = team.map(p => p.id);
      return [...conversation].sort((a, b) => {
          if (a.cycle !== b.cycle) return a.cycle - b.cycle;
          const aIndex = teamOrder.indexOf(a.aiId);
          const bIndex = teamOrder.indexOf(b.aiId);
          if (aIndex > -1 && bIndex > -1) return aIndex - bIndex;
          return 0; // Fallback
      });
  }, [conversation, team]);
  
  const filteredConversation = useMemo(() => {
    if (!searchQuery.trim()) return sortedConversation;
    const lowerCaseQuery = searchQuery.toLowerCase();
    return sortedConversation.filter(message =>
      !message.content.startsWith('data:image/') && message.content.toLowerCase().includes(lowerCaseQuery)
    );
  }, [sortedConversation, searchQuery]);

  useEffect(() => {
    if (view === 'chat') {
      endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [filteredConversation, view]);

  const renderWelcome = () => (
    <div className="flex flex-col items-center justify-center text-center p-8 text-gray-500 h-full">
        <div className="flex -space-x-4 mb-6">
            {team.slice(0, 5).map(profile => {
                const Avatar = AVATAR_MAP[profile.avatar];
                return <Avatar key={profile.id} className={`h-16 w-16 rounded-full bg-gray-800 p-2 border-2 ${profile.color} shadow-lg`}/>
            })}
        </div>
        <h2 className="text-2xl font-bold text-gray-300">Welcome to the Dream Team</h2>
        <p className="max-w-md mt-2">
            Ask a complex question and watch as a team of AI minds collaborate to find the best solution.
            Start by typing your prompt and configuring your team in the panel on the left.
        </p>
    </div>
  );
  
  const renderNoResults = () => (
    <div className="flex flex-col items-center justify-center text-center p-8 text-gray-500 h-full">
        <SearchIcon className="h-16 w-16 text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-300">No Results Found</h2>
        <p className="max-w-md mt-2">
            Your search for "{searchQuery}" did not match any messages. Try a different keyword.
        </p>
    </div>
  );

  const displayCycle = status === 'idle' ? 1 : Math.max(1, currentCycle);

  return (
    <section className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col bg-gray-950/40">
        {status !== 'idle' && (
          <div className="mb-4 flex items-center justify-between gap-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-center py-3 rounded-lg shadow-lg flex-grow">
              Round {displayCycle} of {targetCycles}
            </div>
            <div className="flex items-center p-1 bg-gray-800 rounded-lg">
                <button 
                    onClick={() => setView('chat')}
                    className={`px-3 py-1.5 text-sm font-semibold flex items-center gap-2 rounded-md transition-colors ${view === 'chat' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                >
                    <ChatIcon className="h-5 w-5" />
                    Chat View
                </button>
                <button
                    onClick={() => setView('mindmap')}
                    className={`px-3 py-1.5 text-sm font-semibold flex items-center gap-2 rounded-md transition-colors ${view === 'mindmap' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                >
                    <MindMapIcon className="h-5 w-5" />
                    Mind Map
                </button>
            </div>
            <div className="flex-1 max-w-xs">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search conversation..."
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-10 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            aria-label="Clear search"
                        >
                            <XCircleIcon className="h-5 w-5 text-gray-500 hover:text-white" />
                        </button>
                    )}
                </div>
            </div>
          </div>
        )}
        <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-6">
            {conversation.length === 0 ? renderWelcome() : (
                view === 'chat' ? (
                    filteredConversation.length === 0 ? renderNoResults() : (
                      <>
                        {filteredConversation.map(message => (
                            <MessageBubble 
                                key={message.id} 
                                message={message} 
                                isHighlighted={highlightedMessageIds.includes(message.id)}
                                profile={aiProfilesMap.get(message.aiId)}
                                searchQuery={searchQuery}
                            />
                        ))}
                        <div ref={endOfMessagesRef} />
                      </>
                    )
                ) : (
                    <MindMapView conversation={sortedConversation} prompt={prompt} team={team} />
                )
            )}
            
        </div>
    </section>
  );
};
