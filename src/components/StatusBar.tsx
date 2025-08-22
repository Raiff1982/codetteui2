import React from 'react';
import { FileType } from '../types/file';
import { Wifi, GitBranch, AlertCircle, CheckCircle } from 'lucide-react';

interface StatusBarProps {
  activeFile: FileType | null;
  theme: 'light' | 'dark';
  terminalVisible: boolean;
  aiPanelVisible: boolean;
}

export function StatusBar({ activeFile, theme, terminalVisible, aiPanelVisible }: StatusBarProps) {
  const getFileStats = () => {
    if (!activeFile) return null;
    
    const lines = activeFile.content.split('\n').length;
    const chars = activeFile.content.length;
    const words = activeFile.content.split(/\s+/).filter(word => word.length > 0).length;
    
    return { lines, chars, words };
  };

  const stats = getFileStats();

  return (
    <div className="h-7 bg-blue-600 dark:bg-blue-700 text-white text-xs flex items-center justify-between px-6 relative z-10">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-1">
          <GitBranch className="w-3 h-3" />
          <span className="font-medium">main</span>
          <span className="text-gray-300">•</span>
          <span className="font-medium">© Raiff's Bits</span>
        </div>
        
        <div className="flex items-center space-x-1">
          <CheckCircle className="w-3 h-3 text-green-300" />
          <span className="font-medium">No issues</span>
        </div>
        
        {activeFile && (
          <div className="flex items-center space-x-1">
            <span className="font-medium">{activeFile.name}</span>
            {activeFile.modified && (
              <AlertCircle className="w-3 h-3 text-orange-300" />
            )}
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-6">
        {stats && (
          <div className="flex items-center space-x-4">
            <span className="font-medium">{stats.lines} lines</span>
            <span className="font-medium">{stats.words} words</span>
            <span className="font-medium">{stats.chars} characters</span>
          </div>
        )}
        
        <div className="flex items-center space-x-1">
          <Wifi className="w-3 h-3" />
          <span className="font-medium">Connected</span>
        </div>
        
        <span className="capitalize font-medium">{theme}</span>
        
        {terminalVisible && (
          <span className="text-green-300 font-medium">Terminal</span>
        )}
        
        {aiPanelVisible && (
          <span className="text-purple-300 font-medium">AI Core</span>
        )}
      </div>
    </div>
  );
}