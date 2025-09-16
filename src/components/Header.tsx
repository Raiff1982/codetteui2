import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  Save, 
  Play, 
  Terminal as TerminalIcon, 
  Brain, 
  Sun, 
  Moon, 
  Settings,
  Music,
  Shield,
  HelpCircle,
  BookOpen,
  Zap,
  MessageCircle,
  Palette
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
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="h-14 bg-gradient-to-r from-white/95 via-blue-50/80 to-purple-50/80 dark:from-gray-900/95 dark:via-blue-950/80 dark:to-purple-950/80 backdrop-blur-xl border-b border-blue-200/50 dark:border-purple-700/50 shadow-lg relative z-50">
      <div className="h-full flex items-center justify-between px-6">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-purple-100/50 dark:hover:bg-purple-800/50 rounded-lg transition-all duration-200 hover:scale-105"
            title="Toggle Sidebar"
          >
            <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Codette
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400 -mt-1">AI Development Environment</p>
            </div>
          </div>
        </div>

        {/* Center Section - File Info */}
        {activeFile && (
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg px-3 py-2 border border-blue-200/50 dark:border-purple-600/50">
              <span className="text-sm font-medium text-gray-800 dark:text-white">
                {activeFile.name}
              </span>
              {activeFile.modified && (
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              )}
            </div>
            
            <button
              onClick={onSave}
              disabled={!activeFile.modified}
              className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:from-emerald-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              title="Save File (⌘S)"
            >
              <Save className="w-4 h-4" />
              <span className="text-sm font-medium">Save</span>
            </button>
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          <LanguageSelector
            currentLanguage={selectedLanguage}
            onLanguageChange={onLanguageChange}
          />
          
          <BeginnerModeToggle
            showBeginnerTips={showBeginnerTips}
            onToggle={onToggleBeginnerTips}
            onShowHelp={onShowHelp}
          />
          
          <button
            onClick={onToggleAI}
            className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg hover:from-purple-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 ai-panel-toggle"
            title="Toggle AI Panel (⌘⇧A)"
          >
            <Brain className="w-4 h-4" />
            <span className="text-sm font-medium">AI</span>
          </button>
          
          <button
            onClick={onToggleTerminal}
            className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 terminal-toggle"
            title="Toggle Terminal (⌘`)"
          >
            <TerminalIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Terminal</span>
          </button>
          
          <button
            onClick={onToggleTheme}
            className="p-2 hover:bg-purple-100/50 dark:hover:bg-purple-800/50 rounded-lg transition-all duration-200 hover:scale-105"
            title="Toggle Theme"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            ) : (
              <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            )}
          </button>
          
          {/* Settings Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2 hover:bg-purple-100/50 dark:hover:bg-purple-800/50 rounded-lg transition-all duration-200 hover:scale-105 relative z-10"
              title="More Options"
            >
              <Settings className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>

            {showDropdown && (
              <div className="fixed right-6 top-16 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-[999999] backdrop-blur-xl">
                <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Quick Actions</h3>
                </div>
                
                <button
                  onClick={() => {
                    onToggleAI();
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors"
                >
                  <Brain className="w-4 h-4 text-purple-600" />
                  <span className="text-gray-700 dark:text-gray-300">AI Assistant</span>
                </button>
                
                <button
                  onClick={() => {
                    onToggleTerminal();
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors"
                >
                  <TerminalIcon className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700 dark:text-gray-300">Terminal</span>
                </button>
                
                <button
                  onClick={() => {
                    onToggleMusic();
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors"
                >
                  <Music className="w-4 h-4 text-pink-600" />
                  <span className="text-gray-700 dark:text-gray-300">Music Player</span>
                </button>
                
                <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                
                <button
                  onClick={() => {
                    onToggleAutoFix();
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors"
                >
                  <Zap className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700 dark:text-gray-300">Auto-Fix</span>
                </button>
                
                <button
                  onClick={() => {
                    onToggleChat();
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700 dark:text-gray-300">Chat</span>
                </button>
                
                <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                
                <button
                  onClick={() => {
                    onToggleTheme();
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors"
                >
                  {theme === 'light' ? (
                    <>
                      <Moon className="w-4 h-4 text-indigo-600" />
                      <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
                    </>
                  ) : (
                    <>
                      <Sun className="w-4 h-4 text-yellow-600" />
                      <span className="text-gray-700 dark:text-gray-300">Light Mode</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => {
                    onShowSecurity();
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors"
                >
                  <Shield className="w-4 h-4 text-red-600" />
                  <span className="text-gray-700 dark:text-gray-300">Security</span>
                </button>
                
                <button
                  onClick={() => {
                    onShowHelp();
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700 dark:text-gray-300">Help</span>
                </button>
                
                <button
                  onClick={() => {
                    onShowHowTo();
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3 transition-colors"
                >
                  <BookOpen className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700 dark:text-gray-300">How-To Guide</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}