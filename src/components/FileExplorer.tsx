import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Folder, 
  Plus, 
  MoreHorizontal, 
  Trash2, 
  Edit3,
  Search,
  Filter,
  ChevronRight,
  ChevronDown,
  Code,
  Image,
  Music,
  Video,
  Archive,
  Settings
} from 'lucide-react';
import { FileType } from '../types/file';

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
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [contextMenu, setContextMenu] = useState<{ fileId: string; x: number; y: number } | null>(null);

  const getFileIcon = (fileName: string, type: 'file' | 'folder') => {
    if (type === 'folder') return <Folder className="w-4 h-4 text-blue-500" />;
    
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
        return <Code className="w-4 h-4 text-yellow-500" />;
      case 'css':
      case 'scss':
      case 'sass':
        return <Palette className="w-4 h-4 text-blue-600" />;
      case 'html':
        return <Code className="w-4 h-4 text-orange-500" />;
      case 'json':
        return <Settings className="w-4 h-4 text-green-600" />;
      case 'md':
        return <FileText className="w-4 h-4 text-gray-600" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'svg':
        return <Image className="w-4 h-4 text-purple-500" />;
      case 'mp3':
      case 'wav':
      case 'ogg':
        return <Music className="w-4 h-4 text-pink-500" />;
      case 'mp4':
      case 'avi':
      case 'mov':
        return <Video className="w-4 h-4 text-red-500" />;
      case 'zip':
      case 'tar':
      case 'gz':
        return <Archive className="w-4 h-4 text-gray-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateFile = (type: 'file' | 'folder') => {
    const name = prompt(`Enter ${type} name:`);
    if (name) {
      onFileCreate(name, type);
    }
    setShowCreateMenu(false);
  };

  const handleContextMenu = (e: React.MouseEvent, fileId: string) => {
    e.preventDefault();
    setContextMenu({ fileId, x: e.clientX, y: e.clientY });
  };

  const handleDeleteFile = (fileId: string) => {
    if (confirm('Are you sure you want to delete this file?')) {
      onFileDelete(fileId);
    }
    setContextMenu(null);
  };

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 dark:text-white">Files</h3>
          <div className="relative">
            <button
              onClick={() => setShowCreateMenu(!showCreateMenu)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Create new file or folder"
            >
              <Plus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </button>
            
            {showCreateMenu && (
              <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-2 z-20 min-w-32">
                <button
                  onClick={() => handleCreateFile('file')}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">New File</span>
                </button>
                <button
                  onClick={() => handleCreateFile('folder')}
                  className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Folder className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">New Folder</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredFiles.length > 0 ? (
          <div className="space-y-1">
            {filteredFiles.map(file => (
              <div
                key={file.id}
                className={`group flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition-all ${
                  activeFile?.id === file.id
                    ? 'bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-600'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => {
                  if (file.type === 'file') {
                    onFileSelect(file);
                  } else {
                    toggleFolder(file.id);
                  }
                }}
                onContextMenu={(e) => handleContextMenu(e, file.id)}
              >
                {file.type === 'folder' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFolder(file.id);
                    }}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                  >
                    {expandedFolders.has(file.id) ? (
                      <ChevronDown className="w-3 h-3 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-3 h-3 text-gray-500" />
                    )}
                  </button>
                )}
                
                {getFileIcon(file.name, file.type)}
                
                <span className="flex-1 text-sm text-gray-700 dark:text-gray-300 truncate">
                  {file.name}
                </span>
                
                {file.modified && (
                  <div className="w-2 h-2 bg-orange-500 rounded-full" />
                )}
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleContextMenu(e, file.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-all"
                >
                  <MoreHorizontal className="w-3 h-3 text-gray-500" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Folder className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm ? 'No files match your search' : 'No files yet'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {searchTerm ? 'Try a different search term' : 'Create your first file to get started'}
            </p>
          </div>
        )}
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <div
          className="fixed bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-2 z-50"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            onClick={() => {
              const newName = prompt('Enter new name:');
              if (newName) {
                // Handle rename
              }
              setContextMenu(null);
            }}
            className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Edit3 className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Rename</span>
          </button>
          <button
            onClick={() => handleDeleteFile(contextMenu.fileId)}
            className="w-full flex items-center space-x-2 px-4 py-2 text-left hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-600 dark:text-red-400">Delete</span>
          </button>
        </div>
      )}
    </div>
  );
}