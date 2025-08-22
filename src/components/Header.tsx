import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Save, 
  Terminal, 
  Brain,
  Music,
  HelpCircle,
  Settings,
  Shield,
  Zap,
  Code,
  Smartphone,
  Monitor,
  Palette,
  Globe,
  Github,
  ExternalLink,
  Wand2,
  MessageCircle
} from 'lucide-react';
import { FileType } from '../types/file';
import { LanguageSelector } from './LanguageSelector';
import { BeginnerModeToggle } from './BeginnerModeToggle';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onToggleSidebar: () => void;
  onToggleTerminal: () => void;
  activeFile: FileType | null;
  onSave: () => void;
  onCloseFile: () => void;
  onToggleAI: () => void;
  selectedLanguage: any;
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

export function Header({
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
}: HeaderProps) {
  const [showAbout, setShowAbout] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);

  useEffect(() => {
    // Check if backend is available
    fetch('/api/health')
      .then(response => response.ok ? setBackendConnected(true) : setBackendConnected(false))
      .catch(() => setBackendConnected(false));
  }, []);

  return (
    <header className="h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between px-6 relative z-30">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 hover:scale-105 md:hidden"
          title="Toggle Sidebar"
        >
          <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        
        <button
          onClick={onToggleSidebar}
          className="hidden md:block p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 hover:scale-105"
          title="Toggle Sidebar"
        >
          <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Code className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">Codette</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">AI Development Environment</p>
          </div>
        </div>
      </div>

      {/* Center Section */}
      <div className="flex items-center space-x-4">
        {/* Backend Status Indicator */}
        <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full ${
          backendConnected 
            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
            : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
        }`}>
          <div className={`w-2 h-2 rounded-full ${backendConnected ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`} />
          <span className="text-xs font-medium">
            {backendConnected ? 'AI Systems Online' : 'Frontend Demo Mode'}
          </span>
        </div>

        {activeFile && (
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {activeFile.name}
            </span>
            {activeFile.modified && (
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            )}
            <button
              onClick={onSave}
              disabled={!activeFile.modified}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium shadow-sm hover:shadow-md"
              title="Save File (⌘S)"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        )}

        <LanguageSelector
          currentLanguage={selectedLanguage}
          onLanguageChange={onLanguageChange}
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleChat}
          className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
          title="Chat with Codette AI"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Chat</span>
        </button>

        <button
          onClick={() => {
            if (!backendConnected) {
              alert('AI features require Python backend connection. This is a frontend-only demo.');
              return;
            }
            onToggleAI();
          }}
          className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-200 ${
            backendConnected 
              ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-md'
              : 'bg-gray-400 text-white cursor-not-allowed opacity-60'
          }`}
          title="Toggle AI Panel (⌘⇧A)"
        >
          <Brain className="w-4 h-4" />
          <span className="text-sm font-medium">
            {backendConnected ? 'AI' : 'AI (Demo)'}
          </span>
        </button>

        <button
          onClick={onToggleTerminal}
          className="flex items-center space-x-2 px-3 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-900 transition-all duration-200 shadow-sm hover:shadow-md"
          title="Toggle Terminal (⌘`)"
        >
          <Terminal className="w-4 h-4" />
          <span className="text-sm font-medium">Terminal</span>
        </button>

        <button
          onClick={onToggleTheme}
          className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 hover:scale-105"
          title="Toggle Theme"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          ) : (
            <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          )}
        </button>
      </div>
    </header>
  );
}