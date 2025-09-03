            // File Explorer Component - Clean implementation
import React, { useState } from 'react';
import { FileType } from '../types/file';
import { 
  Folder, 
  File, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Download,
  Upload,
  Search,
  Filter,
  Trash2
} from 'lucide-react';

interface FileExplorerProps {
  files: FileType[];
  activeFile: FileType | null;
  onFileSelect: (file: FileType) => void;
  onFileCreate: (name: string, type: 'file' | 'folder') => void;
  onFileDelete: (fileId: string) => void;
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
  const [newFileName, setNewFileName] = useState('');
  const [createType, setCreateType] = useState<'file' | 'folder'>('file');

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    if (newFileName.trim()) {
      onFileCreate(newFileName.trim(), createType);
      setNewFileName('');
      setShowCreateMenu(false);
    }
  };

  const getFileIcon = (file: FileType) => {
    const iconClass = "w-4 h-4";
    
    if (file.type === 'folder') {
      return <Folder className="w-4 h-4 text-blue-500" />;
    }
    
    const extension = file.name.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'js':
      case 'jsx':
        return <File className={`${iconClass} text-yellow-500`} />;
      case 'ts':
      case 'tsx':
        return <File className={`${iconClass} text-blue-500`} />;
      case 'py':
        return <File className={`${iconClass} text-green-500`} />;
      case 'css':
      case 'scss':
        return <File className={`${iconClass} text-blue-600`} />;
      case 'html':
        return <File className={`${iconClass} text-orange-500`} />;
      case 'json':
        return <File className={`${iconClass} text-green-600`} />;
      default:
        return <File className={`${iconClass} text-gray-500`} />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-transparent via-white/50 to-blue-50/30 dark:from-transparent dark:via-gray-800/50 dark:to-purple-950/30">
      {/* Header */}
      <div className="p-4 border-b border-blue-200/50 dark:border-purple-700/50 bg-gradient-to-r from-white/80 to-blue-50/80 dark:from-gray-800/80 dark:to-purple-950/80 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Files</h3>
          <button
            onClick={() => setShowCreateMenu(!showCreateMenu)}
            className="p-1 hover:bg-white/60 dark:hover:bg-gray-700/60 backdrop-blur-sm rounded-lg transition-all duration-200 hover:scale-110 hover:shadow-lg"
          >
            <Plus className="w-4 h-4 text-blue-600 dark:text-purple-400" />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 dark:text-purple-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search files..."
            className="w-full pl-10 pr-4 py-2 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-blue-200/50 dark:border-purple-600/50 rounded-xl text-sm text-gray-800 dark:text-white placeholder-blue-400 dark:placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-lg transition-all duration-200"
          />
        </div>
      </div>
      {/* Create Menu */}
      {showCreateMenu && (
        <div className="p-4 border-b border-blue-200/50 dark:border-purple-700/50 bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-950/80 dark:to-purple-950/80 backdrop-blur-sm">
          <div className="space-y-3">
            <div className="flex space-x-2">
              <button
                onClick={() => setCreateType('file')}
                className={`px-3 py-1 rounded-lg text-sm transition-all duration-200 ${
                  createType === 'file' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                    : 'bg-white/60 dark:bg-gray-600/60 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-600'
                }`}
              >
                File
              </button>
              <button
                onClick={() => setCreateType('folder')}
                className={`px-3 py-1 rounded-lg text-sm transition-all duration-200 ${
                  createType === 'folder' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                    : 'bg-white/60 dark:bg-gray-600/60 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-600'
                }`}
              >
                Folder
              </button>
            </div>
            
            <div className="flex space-x-2">
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                placeholder={`${createType} name...`}
                className="flex-1 px-3 py-2 bg-white/80 dark:bg-gray-600/80 backdrop-blur-sm border border-blue-200/50 dark:border-purple-500/50 rounded-lg text-sm text-gray-800 dark:text-white placeholder-blue-400 dark:placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-lg transition-all duration-200"
                autoFocus
              />
              <button
                onClick={handleCreate}
                disabled={!newFileName.trim()}
                className="px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg text-sm hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
      {/* File List */}
      <div className="flex-1 overflow-y-auto p-2">
        <div className="space-y-1">
          {filteredFiles.map(file => (
            <div
              key={file.id}
              onClick={() => onFileSelect(file)}
              className={`flex items-center space-x-3 p-2 rounded-xl cursor-pointer transition-all duration-200 group hover:scale-[1.02] ${
                activeFile?.id === file.id
                  ? 'bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 text-blue-800 dark:text-blue-200 shadow-lg border border-blue-200/50 dark:border-purple-600/50'
                  : 'hover:bg-gradient-to-r hover:from-white/80 hover:to-blue-50/80 dark:hover:from-gray-700/80 dark:hover:to-purple-950/80 text-gray-700 dark:text-gray-300 hover:shadow-lg backdrop-blur-sm'
              }`}
            >
              {getFileIcon(file)}
              <span className="flex-1 text-sm font-medium truncate">{file.name}</span>
              {file.modified && (
                <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-pulse shadow-lg" />
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFileDelete(file.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200 hover:scale-110"
              >
                <Trash2 className="w-3 h-3 text-red-500" />
              </button>
            </div>
          ))}
        </div>
        
        {filteredFiles.length === 0 && (
          <div className="text-center py-8">
            <File className="w-12 h-12 text-blue-400 dark:text-purple-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400 font-medium">No files found</p>
            <p className="text-sm text-blue-500 dark:text-purple-400">
              {searchTerm ? 'Try a different search' : 'Create your first file'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}