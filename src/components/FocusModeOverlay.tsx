import React from 'react';
import { Eye, EyeOff, Zap } from 'lucide-react';

interface FocusModeOverlayProps {
  isFocusMode: boolean;
  onToggleFocusMode: () => void;
}

export function FocusModeOverlay({ isFocusMode, onToggleFocusMode }: FocusModeOverlayProps) {
  if (!isFocusMode) return null;

  return (
    <>
      {/* Focus Mode Indicator */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-blue-600 text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center space-x-3">
        <Eye className="w-5 h-5" />
        <span className="font-medium">Focus Mode Active</span>
        <button
          onClick={onToggleFocusMode}
          className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          title="Exit Focus Mode (F)"
        >
          <EyeOff className="w-4 h-4" />
        </button>
      </div>

      {/* Zen Mode Breathing Animation */}
      <div className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-600/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-purple-300/30 dark:border-purple-700/30 z-50">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full animate-pulse flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" />
        </div>
      </div>
    </>
  );
}