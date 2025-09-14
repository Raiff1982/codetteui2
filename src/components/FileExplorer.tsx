import React, { useState } from 'react';
import { FileText, Folder, Plus, Search, X } from 'lucide-react';
import type { FileItem } from '../types/file';

interface FileExplorerProps {
  files: FileItem[];
  activeFile: FileItem | null;
  onFileSelect: (file: FileItem) => void;
  onFileCreate: (name: string, type: 'file' | 'folder') => void;
  onFileDelete: (id: string) => void;
}

export function FileExplorer({
  files,
  activeFile,
  onFileSelect,
  onFileCreate,
  onFileDelete
}: FileExplorerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateMenu, setShowCreateMenu] = useState(false);

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-r border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Files
          </h2>
          <div className="relative">
            <button
              onClick={() => setShowCreateMenu(!showCreateMenu)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Create new file or folder"
            >
              <Plus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              onClick={() => onFileSelect(file)}
              className={`group flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-white/60 dark:hover:bg-gray-600/60 backdrop-blur-sm ${
                activeFile?.id === file.id 
                  ? 'bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 shadow-lg' 
                  : ''
              }`}
            >
              {file.type === 'folder' ? (
                <Folder className="w-4 h-4 text-blue-600 dark:text-purple-400" />
              ) : (
                <FileText className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              )}
              <span className="text-sm font-medium text-gray-800 dark:text-white flex-1">
                {file.name}
              </span>
              {file.modified && (
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFileDelete(file.id);
                }}
                className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors opacity-0 group-hover:opacity-100"
                title="Delete file"
              >
                <X className="w-3 h-3 text-red-500" />
              </button>
            </div>
          ))}
        </div>
        
        {filteredFiles.length === 0 && searchTerm && (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500 dark:text-gray-400">
            <Search className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm">No files match your search</p>
          </div>
        )}
      </div>
      
      {/* Create Menu */}
      {showCreateMenu && (
        <div className="absolute top-16 right-4 w-48 bg-white dark:bg-gray-800 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-2">
            <button
              onClick={() => {
                onFileCreate('new-file.txt', 'file');
                setShowCreateMenu(false);
              }}
              className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 text-left"
            >
              <FileText className="w-4 h-4 text-blue-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-gray-800 dark:text-white">New File</span>
            </button>
            <button
              onClick={() => {
                onFileCreate('new-folder', 'folder');
                setShowCreateMenu(false);
              }}
              className="w-full flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 text-left"
            >
              <Folder className="w-4 h-4 text-blue-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-gray-800 dark:text-white">New Folder</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}