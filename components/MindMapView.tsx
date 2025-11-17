
import React, { useMemo, useRef, useState, useEffect } from 'react';
import type { Conversation, Message, ConfiguredAIProfile } from '../types';
import { SparklesIcon } from './icons/UIIcons';
import { AVATAR_MAP } from './icons/AvatarRegistry';

interface MindMapViewProps {
  conversation: Conversation;
  prompt: string;
  team: ConfiguredAIProfile[];
}

interface Node {
  id: string;
  x: number;
  y: number;
  content: string;
  profile: ConfiguredAIProfile | null;
  message?: Message;
}

interface Edge {
  id: string;
  source: string;
  target: string;
}

const VIEWBOX_WIDTH = 1200;
const VIEWBOX_HEIGHT = 1000;
const NODE_WIDTH = 180;
const NODE_HEIGHT = 120;

const truncateText = (text: string, length = 100) => {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
};

export const MindMapView: React.FC<MindMapViewProps> = ({ conversation, prompt, team }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: VIEWBOX_WIDTH, height: VIEWBOX_HEIGHT });

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      if (entries[0]) {
        const { width, height } = entries[0].contentRect;
        setContainerSize({ width, height });
      }
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const { nodes, edges } = useMemo(() => {
    if (conversation.length === 0) return { nodes: [], edges: [] };

    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    const centerX = containerSize.width / 2;
    const centerY = containerSize.height / 2;
    const level1Radius = Math.min(containerSize.width, containerSize.height) / 4;
    const levelGap = 90;

    newNodes.push({ id: 'prompt', x: centerX, y: centerY, content: prompt, profile: null });
    
    const agentMessages = new Map<string, Message[]>();
    conversation.forEach(msg => {
      if (!agentMessages.has(msg.aiId)) agentMessages.set(msg.aiId, []);
      agentMessages.get(msg.aiId)!.push(msg);
    });
    agentMessages.forEach(msgs => msgs.sort((a, b) => a.cycle - b.cycle));
    
    const agents = Array.from(agentMessages.keys());
    const angleStep = (2 * Math.PI) / agents.length;

    agents.forEach((aiId, agentIndex) => {
      const messages = agentMessages.get(aiId)!;
      let baseAngle = agentIndex * angleStep;

      messages.forEach((msg, cycleIndex) => {
        const radius = level1Radius + cycleIndex * levelGap;
        const x = centerX + radius * Math.cos(baseAngle);
        const y = centerY + radius * Math.sin(baseAngle);
        
        const node: Node = {
          id: msg.id, x, y,
          content: msg.content,
          profile: team.find(p => p.id === msg.aiId) || null,
          message: msg,
        };
        newNodes.push(node);
        
        const targetId = msg.id;
        const sourceId = cycleIndex === 0 ? 'prompt' : messages[cycleIndex - 1].id;
        newEdges.push({ id: `${sourceId}-${targetId}`, source: sourceId, target: targetId });
      });
    });

    return { nodes: newNodes, edges: newEdges };
  }, [conversation, prompt, containerSize, team]);

  const nodeMap = useMemo(() => new Map(nodes.map(n => [n.id, n])), [nodes]);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[60vh] bg-gray-900/50 rounded-lg p-2 overflow-hidden">
      <svg width="100%" height="100%" viewBox={`0 0 ${containerSize.width} ${containerSize.height}`}>
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#4a5568" />
          </marker>
        </defs>
        
        {edges.map(edge => {
          const sourceNode = nodeMap.get(edge.source);
          const targetNode = nodeMap.get(edge.target);
          if (!sourceNode || !targetNode) return null;
          return (
            <line
              key={edge.id}
              x1={sourceNode.x} y1={sourceNode.y}
              x2={targetNode.x} y2={targetNode.y}
              stroke="#4a5568" strokeWidth="2"
              markerEnd="url(#arrow)"
            />
          );
        })}

        {nodes.map(node => {
          const isPrompt = node.id === 'prompt';
          const Avatar = node.profile ? AVATAR_MAP[node.profile.avatar] : null;
          const borderColor = isPrompt ? 'border-purple-500' : node.profile?.color || 'border-gray-600';

          return (
            <foreignObject
              key={node.id}
              x={node.x - NODE_WIDTH / 2} y={node.y - NODE_HEIGHT / 2}
              width={NODE_WIDTH} height={NODE_HEIGHT}
              className="transition-transform duration-300 hover:scale-110"
            >
              <div className={`w-full h-full p-2.5 rounded-xl bg-gray-900 border-2 shadow-lg flex flex-col gap-1 overflow-hidden ${borderColor}`}>
                <div className="flex items-center gap-2">
                  {isPrompt ? (
                    <div className="w-7 h-7 bg-purple-500/20 rounded-full flex items-center justify-center shrink-0">
                        <SparklesIcon className="w-5 h-5 text-purple-400" />
                    </div>
                  ) : Avatar && node.profile ? <Avatar className="w-7 h-7 shrink-0" /> : null}
                  <div className="font-bold text-sm text-white truncate">{isPrompt ? 'Initial Prompt' : node.profile?.name}</div>
                </div>
                <div className="text-xs text-gray-300 overflow-y-auto text-ellipsis">
                  {truncateText(node.content)}
                </div>
              </div>
            </foreignObject>
          );
        })}
      </svg>
    </div>
  );
};
