
import React, { useState, useCallback, useRef } from 'react';
import type { UploadedFile } from '../types';
import { UploadIcon, FileIcon, XCircleIcon } from './icons/UIIcons';

interface FileUploadProps {
  files: UploadedFile[];
  onAddFiles: (files: UploadedFile[]) => void;
  onRemoveFile: (fileName: string) => void;
  disabled: boolean;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const result = reader.result as string;
        // The API expects just the base64 string, not the data URL prefix
        resolve(result.split(',')[1]);
    };
    reader.onerror = error => reject(error);
  });
};

export const FileUpload: React.FC<FileUploadProps> = ({ files, onAddFiles, onRemoveFile, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleFiles = useCallback(async (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: UploadedFile[] = [];
    for (const file of Array.from(selectedFiles)) {
        const base64Data = await fileToBase64(file);
        newFiles.push({ name: file.name, type: file.type, base64Data });
    }
    if (newFiles.length > 0) {
        onAddFiles(newFiles);
    }
  }, [onAddFiles]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;
    
    const droppedFiles = e.dataTransfer.files;
    handleFiles(droppedFiles);
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    // Reset file input to allow selecting the same file again
    if (e.target) e.target.value = '';
  };
  
  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <label className="block text-sm font-medium text-blue-300 mb-2">Attachments</label>
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={triggerFileSelect}
        className={`flex justify-center items-center w-full px-6 py-4 border-2 border-dashed rounded-md cursor-pointer transition
          ${disabled ? 'bg-gray-800/50 border-gray-700/50 cursor-not-allowed' : 'border-gray-800 hover:border-blue-500 bg-gray-800'}
          ${isDragging ? 'border-blue-500 bg-blue-500/10' : ''}`}
      >
        <div className="text-center">
            <UploadIcon className="mx-auto h-8 w-8 text-gray-500" />
            <p className="mt-1 text-sm text-gray-400">
                <span className="font-semibold text-blue-400">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">Images, Docs, TXT, CSV, etc.</p>
        </div>
        <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled}
        />
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
            {files.map(file => (
                <div key={file.name} className="flex items-center justify-between bg-gray-800 p-2 rounded-md">
                    <div className="flex items-center gap-2 overflow-hidden">
                        {file.type.startsWith('image/') ? (
                            <img src={`data:${file.type};base64,${file.base64Data}`} alt={file.name} className="h-8 w-8 rounded object-cover shrink-0" />
                        ) : (
                            <FileIcon className="h-8 w-8 text-gray-400 shrink-0" />
                        )}
                        <span className="text-sm text-gray-300 truncate">{file.name}</span>
                    </div>
                    {!disabled && (
                        <button onClick={() => onRemoveFile(file.name)} className="text-gray-500 hover:text-red-400 p-1 rounded-full">
                            <XCircleIcon className="h-5 w-5"/>
                        </button>
                    )}
                </div>
            ))}
        </div>
      )}
    </div>
  );
};