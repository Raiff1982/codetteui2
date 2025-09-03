import React, { useState, useEffect } from 'react';
import { LanguageSelector } from './LanguageSelector';
import { 
  Menu, 
  X, 
  Save, 
  Play, 
  Pause, 
  MessageSquare, 
  Bot, 
  Terminal as TerminalIcon, 
  Sun, 
  Moon, 
  HelpCircle, 
  Settings, 
  Music, 
  Zap, 
  Users, 
  Eye, 
  BookOpen, 
  Shield, 
  Activity, 
  TrendingUp, 
  Palette, 
  Code, 
  FileText, 
  Folder, 
  Brain, 
  Atom 
} from 'lucide-react';
import { FileType } from '../types/file';

interface HeaderProps {
  theme: string;
  onToggleTheme: () => void;
  onToggleSidebar: () => void;
  onToggleTerminal: () => void;
  activeFile?: FileType;
  onSave: () => void;
  onCloseFile: () => void;
  onToggleAI: () => void;
  selectedLanguage?: any;
  onLanguageChange: (language: any) => void;
  showBeginnerTips: boolean;
  onToggleBeginnerTips: () => void;
  onShowHelp: () => void;
  onToggleMusic: () => void;
  musicPlayerVisible: boolean;
  onToggleUltimateAI: () => void;
  showUltimateAI: boolean;
  onShowHowTo: () => void;
  onShowSecurity: () => void;
  forceMobileLayout: boolean;
  onToggleMobileLayout: () => void;
  onToggleAutoFix: () => void;
  showAutoFix: boolean;
  onToggleChat: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  onToggleSidebar,
  onToggleTerminal,
  activeFile,
  onSave,
  onCloseFile,
  onToggleAI,
  selectedLanguage,
  onLanguageChange,
  showBeginnerTips,
  onToggleBeginnerTips,
  onShowHelp,
  onToggleMusic,
  musicPlayerVisible,
  onToggleUltimateAI,
  showUltimateAI,
  onShowHowTo,
  onShowSecurity,
  forceMobileLayout,
  onToggleMobileLayout,
  onToggleAutoFix,
  showAutoFix,
  onToggleChat
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="h-14 bg-gradient-to-r from-white via-purple-50/30 to-blue-50/30 dark:from-gray-900 dark:via-purple-950/30 dark:to-blue-950/30 backdrop-blur-xl border-b border-purple-200/50 dark:border-purple-700/50 flex items-center justify-between px-4 shadow-lg">
      {/* Left side - Menu and File info */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-purple-100/50 dark:hover:bg-purple-800/50 rounded-lg transition-all duration-200 hover:scale-105"
          title="Toggle Sidebar"
        >
          <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>

        {activeFile && (
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {activeFile.name}
            </span>
            {activeFile.isDirty && (
              <div className="w-2 h-2 bg-orange-500 rounded-full" title="Unsaved changes" />
            )}
          </div>
        )}
      </div>

      {/* Center - Main action buttons */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onToggleChat}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
          title="Open Chat"
        >
          <MessageSquare className="w-4 h-4" />
          <span className="font-medium">Chat</span>
        </button>

        <button
          onClick={onToggleAI}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl ${
            showUltimateAI 
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white'
              : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white'
          }`}
          title="Toggle AI Assistant"
        >
          <Bot className="w-4 h-4" />
          <span className="font-medium">AI</span>
        </button>

        <button
          onClick={onToggleTerminal}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white rounded-full transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
          title="Toggle Terminal"
        >
          <TerminalIcon className="w-4 h-4" />
          <span className="font-medium">Terminal</span>
        </button>
      </div>

      {/* Right side - Settings and theme */}
      <div className="flex items-center space-x-2">
        {selectedLanguage && (
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageChange={onLanguageChange}
          />
        )}

        <button
          onClick={onToggleTheme}
          className="p-2 hover:bg-purple-100/50 dark:hover:bg-purple-800/50 rounded-lg transition-all duration-200 hover:scale-105"
          title="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 text-purple-600" />
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2 hover:bg-purple-100/50 dark:hover:bg-purple-800/50 rounded-lg transition-all duration-200 hover:scale-105"
            title="More Options"
          >
            <Settings className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
              <button
                onClick={() => {
                  onToggleMusic();
                  setShowDropdown(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
              >
                <Music className="w-4 h-4" />
                <span>Music Player</span>
              </button>
              
              <button
                onClick={() => {
                  onShowSecurity();
                  setShowDropdown(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
              >
                <Shield className="w-4 h-4" />
                <span>Security</span>
              </button>
              
              <button
                onClick={() => {
                  onShowHelp();
                  setShowDropdown(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Help</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};