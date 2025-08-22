import React from 'react';
import { HelpCircle, GraduationCap, Sparkles, X } from 'lucide-react';

interface BeginnerModeToggleProps {
  showBeginnerTips: boolean;
  onToggle: () => void;
  onShowHelp: () => void;
}

export function BeginnerModeToggle({ showBeginnerTips, onToggle, onShowHelp }: BeginnerModeToggleProps) {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={onShowHelp}
        className="flex items-center space-x-2 px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-all duration-200 transform hover:scale-105"
        title="Open Beginner's Guide"
      >
        <GraduationCap className="w-4 h-4" />
        <span className="text-sm font-medium">Help</span>
      </button>
      
      <button
        onClick={onToggle}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 ${
          showBeginnerTips
            ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 shadow-lg'
            : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
        }`}
        title={showBeginnerTips ? 'Disable beginner tips' : 'Enable beginner tips'}
      >
        {showBeginnerTips ? (
          <>
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Tips On</span>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          </>
        ) : (
          <>
            <HelpCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Tips Off</span>
          </>
        )}
      </button>
    </div>
  );
}