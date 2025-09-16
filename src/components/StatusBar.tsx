import React from 'react';
import { FileType } from '../types/file';
import { Wifi, GitBranch, AlertCircle, CheckCircle } from 'lucide-react';

interface StatusBarProps {
  activeFile: FileType | null;
  theme: 'light' | 'dark';
  terminalVisible: boolean;
  focusMode: boolean;
  aiPanelVisible: boolean;
}

export function StatusBar({ activeFile, theme, terminalVisible, focusMode, aiPanelVisible }: StatusBarProps) {
  const getFileStats = () => {
    if (!activeFile) return null;
    
    const lines = activeFile.content.split('\n').length;
    const chars = activeFile.content.length;
    const words = activeFile.content.split(/\s+/).filter(word => word.length > 0).length;
    
    return { lines, chars, words };
  };

  const stats = getFileStats();

  return (
    <div className={`bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 px-4 py-2 flex items-center justify-between text-sm ${
      focusMode ? 'opacity-50' : ''
    }`}>
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-1">
          <GitBranch className="w-3 h-3" />
          <span className="font-medium whitespace-nowrap">main</span>
          <span className="text-gray-300">•</span>
          <span className="font-medium whitespace-nowrap">© Raiff's Bits</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <CheckCircle className="w-3 h-3 text-green-300" />
          <span className="font-medium whitespace-nowrap">No issues</span>
        </div>
        
        {activeFile && (
          <div className="flex items-center space-x-1">
            <span className="font-medium whitespace-nowrap truncate max-w-32">{activeFile.name}</span>
            {activeFile.modified && (
              <AlertCircle className="w-3 h-3 text-orange-300" />
            )}
          </div>
        )}
      </div>
      
      {focusMode && (
        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 whitespace-nowrap">
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" />
          <span className="font-medium">Focus Mode</span>
        </div>
      )}
      
      <div className="flex items-center space-x-6">
        {stats && (
          <div className="flex items-center space-x-4 text-spacing-fix">
            <span className="font-medium whitespace-nowrap">{stats.lines} lines</span>
            <span className="font-medium whitespace-nowrap">{stats.words} words</span>
            <span className="font-medium whitespace-nowrap">{stats.chars} chars</span>
          </div>
        )}
        
        <div className="flex items-center space-x-1">
          <Wifi className="w-3 h-3" />
          <span className="font-medium whitespace-nowrap">Connected</span>
        </div>
        
        <span className="capitalize font-medium whitespace-nowrap">{theme}</span>
        
        {terminalVisible && (
          <span className="text-green-300 font-medium whitespace-nowrap">Terminal</span>
        )}
        
        {aiPanelVisible && (
          <span className="text-purple-300 font-medium whitespace-nowrap">AI Core</span>
        )}
      </div>
    </div>
  );
}