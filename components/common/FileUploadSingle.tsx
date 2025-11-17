
import React, { useState, useCallback, useRef } from 'react';
import type { UploadedFile } from '../../types';
import { UploadIcon, XCircleIcon } from '../icons/UIIcons';

interface FileUploadSingleProps {
  file: UploadedFile | null;
  onFileChange: (file: UploadedFile | null) => void;
  disabled: boolean;
}

const fileToUploadedFile = (file: File): Promise<UploadedFile> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve({
        name: file.name,
        type: file.type,
        base64Data: result.split(',')[1],
      });
    };
    reader.onerror = error => reject(error);
  });
};

export const FileUploadSingle: React.FC<FileUploadSingleProps> = ({ file, onFileChange, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (selectedFile: File | null) => {
    if (!selectedFile) return;
    if (selectedFile.type.startsWith('image/')) {
        const uploadedFile = await fileToUploadedFile(selectedFile);
        onFileChange(uploadedFile);
    }
  }, [onFileChange]);
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled) return;
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) handleFile(droppedFile);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) handleFile(selectedFile);
    if (e.target) e.target.value = '';
  };

  if (file) {
    return (
        <div>
            <label className="block text-sm font-medium text-blue-300 mb-2">Attachment</label>
            <div className="flex items-center justify-between bg-gray-800 p-2 rounded-md">
                <div className="flex items-center gap-2 overflow-hidden">
                    <img src={`data:${file.type};base64,${file.base64Data}`} alt={file.name} className="h-8 w-8 rounded object-cover shrink-0" />
                    <span className="text-sm text-gray-300 truncate">{file.name}</span>
                </div>
                {!disabled && (
                    <button onClick={() => onFileChange(null)} className="text-gray-500 hover:text-red-400 p-1 rounded-full">
                        <XCircleIcon className="h-5 w-5"/>
                    </button>
                )}
            </div>
        </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-blue-300 mb-2">Upload Image</label>
      <div
        onDragEnter={(e) => { e.preventDefault(); if (!disabled) setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`flex justify-center items-center w-full px-6 py-10 border-2 border-dashed rounded-md cursor-pointer transition
          ${disabled ? 'bg-gray-800/50 border-gray-700/50 cursor-not-allowed' : 'border-gray-600 hover:border-blue-500 bg-gray-800'}
          ${isDragging ? 'border-blue-500 bg-blue-500/10' : ''}`}
      >
        <div className="text-center">
            <UploadIcon className="mx-auto h-8 w-8 text-gray-500" />
            <p className="mt-1 text-sm text-gray-400">
                <span className="font-semibold text-blue-400">Click to upload</span> or drag and drop
            </p>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" disabled={disabled} />
      </div>
    </div>
  );
};