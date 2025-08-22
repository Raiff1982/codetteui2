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
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800 dark:text-white">Files</h3>
          <button
            onClick={() => setShowCreateMenu(!showCreateMenu)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <Plus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search files..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      {/* Create Menu */}
      {showCreateMenu && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="space-y-3">
            <div className="flex space-x-2">
              <button
                onClick={() => setCreateType('file')}
                className={`px-3 py-1 rounded text-sm ${
                  createType === 'file' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                }`}
              >
                File
              </button>
              <button
                onClick={() => setCreateType('folder')}
                className={`px-3 py-1 rounded text-sm ${
                  createType === 'folder' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
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
                className="flex-1 px-3 py-2 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded text-sm text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <button
                onClick={handleCreate}
                disabled={!newFileName.trim()}
                className="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:opacity-50 transition-colors"
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
              className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors group ${
                activeFile?.id === file.id
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {getFileIcon(file)}
              <span className="flex-1 text-sm font-medium truncate">{file.name}</span>
              {file.modified && (
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onFileDelete(file.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-all"
              >
                <Trash2 className="w-3 h-3 text-red-500" />
              </button>
            </div>
          ))}
        </div>
        
        {filteredFiles.length === 0 && (
          <div className="text-center py-8">
            <File className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">No files found</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {searchTerm ? 'Try a different search' : 'Create your first file'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}