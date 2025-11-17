
import React from 'react';
import { DownloadIcon, ClockIcon } from './icons/UIIcons';
import type { InteractiveSummary } from '../types';

interface SummaryModalProps {
  summary: InteractiveSummary | null;
  onClose: () => void;
  isLoading: boolean;
  onDownloadTranscript: () => void;
  onHighlight: (messageIds: string[]) => void;
}

export const SummaryModal: React.FC<SummaryModalProps> = ({ summary, onClose, isLoading, onDownloadTranscript, onHighlight }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">{isLoading ? 'Final Summary' : summary?.title || 'Summary'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
                <ClockIcon className="h-16 w-16 text-blue-400 animate-spin-slow" />
                <p className="mt-4 text-lg text-gray-300">Generating Final Summary...</p>
                <p className="mt-2 text-sm text-gray-500">Please wait patiently, this can take a moment.</p>
            </div>
          ) : summary ? (
            <div>
              <p className="text-gray-300 mb-6 prose prose-invert">{summary.overview}</p>
              <div
                onMouseLeave={() => onHighlight([])} // Clear highlights when mouse leaves the list container
                className="space-y-4"
              >
                {summary.points.map((item, index) => (
                  <div
                    key={index}
                    onMouseEnter={() => onHighlight(item.sourceMessageIds)}
                    className="p-3 rounded-lg bg-gray-800/50 hover:bg-blue-500/10 border border-transparent hover:border-blue-500/50 transition-all duration-200 cursor-pointer"
                  >
                    <p className="m-0 text-gray-200 prose prose-invert max-w-none">{item.point}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p>No summary information is available.</p>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-800 flex justify-between items-center">
          <button
              onClick={onDownloadTranscript}
              disabled={isLoading}
              className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition"
          >
              <DownloadIcon className="h-5 w-5" />
              Download Transcript
          </button>
          <button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};