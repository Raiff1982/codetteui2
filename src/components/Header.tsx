import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Save, 
  Play, 
  Sun, 
  Moon, 
  Brain, 
  Terminal as TerminalIcon,
  MessageCircle,
  HelpCircle,
  Settings,
  Music,
  Zap,
  Shield,
  Eye,
  Code,
  FileText,
  Folder,
  Search,
  Command
} from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { FileType } from '../types/file';

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
  onToggleUltimateAI?: () => void;
  showUltimateAI?: boolean;
  onShowHowTo: () => void;
  onShowSecurity: () => void;
  forceMobileLayout?: boolean;
  onToggleMobileLayout?: () => void;
  onToggleAutoFix?: () => void;
  showAutoFix?: boolean;
  onToggleChat: () => void;
  onTogglePerformanceOptimizer?: () => void;
  onToggleCommunityBuilder?: () => void;
  onToggleAccessibility?: () => void;
  onToggleDocumentation?: () => void;
  aiDrawerOpen?: boolean;
  focusMode?: boolean;
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
  onShowHowTo,
  onShowSecurity,
  onToggleChat,
  aiDrawerOpen = false,
  focusMode = false
}: HeaderProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <header className="h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 relative z-10">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="Toggle Sidebar"
        >
          <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Code className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800 dark:text-white">Codette</h1>
            {activeFile && (
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {activeFile.name}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Center Section - File Actions */}
      {activeFile && (
        <div className="flex items-center space-x-2">
          <button
            onClick={onSave}
            disabled={!activeFile.modified}
            className="flex items-center space-x-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Save File (⌘S)"
          >
            <Save className="w-4 h-4" />
            <span className="text-sm font-medium">Save</span>
            {activeFile.modified && (
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            )}
          </button>

          <button
            onClick={onCloseFile}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Close File"
          >
            <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      )}

      {/* Right Section */}
      <div className="flex items-center space-x-2">
        {/* Language Selector */}
        {selectedLanguage && (
          <LanguageSelector
            currentLanguage={selectedLanguage}
            onLanguageChange={onLanguageChange}
          />
        )}

        {/* Main Action Buttons */}
        <button
          onClick={onToggleChat}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg"
          title="Chat with Codette"
        >
          <MessageCircle className="w-4 h-4" />
          <span className="font-medium">Chat</span>
        </button>

        <button
          onClick={onToggleAI}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all shadow-lg ${
            aiDrawerOpen
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
              : 'bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 text-gray-700 dark:text-gray-300 hover:from-blue-500 hover:to-purple-600 hover:text-white'
          }`}
          title="Toggle AI Assistant"
        >
          <Brain className="w-4 h-4" />
          <span className="font-medium">AI</span>
          {aiDrawerOpen && (
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          )}
        </button>

        <button
          onClick={onToggleTerminal}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-all shadow-lg"
          title="Toggle Terminal"
        >
          <TerminalIcon className="w-4 h-4" />
          <span className="font-medium">Terminal</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="Toggle Theme"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          ) : (
            <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          )}
        </button>

        {/* Help Button */}
        <button
          onClick={onShowHelp}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          title="Help & Support"
        >
          <HelpCircle className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>
    </header>
  );
}