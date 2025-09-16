import { useEffect, useCallback } from 'react';

interface KeyboardShortcutsConfig {
  onCommandPalette: () => void;
  onFocusMode: () => void;
  onAIDrawer: () => void;
  onTerminal: () => void;
  onSave: () => void;
}

export function useKeyboardShortcuts({
  onCommandPalette,
  onFocusMode,
  onAIDrawer,
  onTerminal,
  onSave
}: KeyboardShortcutsConfig) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ignore if user is typing in an input field
    const target = e.target as HTMLElement;
    const isInputFocused = target.tagName === 'INPUT' || 
                          target.tagName === 'TEXTAREA' || 
                          target.contentEditable === 'true' ||
                          target.closest('[contenteditable="true"]');

    if (isInputFocused) return;

    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

    // Ctrl/Cmd + K for command palette
    if (cmdOrCtrl && e.key === 'k') {
      e.preventDefault();
      onCommandPalette();
      return;
    }

    // Ctrl/Cmd + Shift + F for focus mode
    if (cmdOrCtrl && e.shiftKey && e.key === 'F') {
      e.preventDefault();
      onFocusMode();
      return;
    }

    // Ctrl/Cmd + Shift + A for AI drawer
    if (cmdOrCtrl && e.shiftKey && e.key === 'A') {
      e.preventDefault();
      onAIDrawer();
      return;
    }

    // Ctrl/Cmd + ` for terminal
    if (cmdOrCtrl && e.key === '`') {
      e.preventDefault();
      onTerminal();
      return;
    }

    // Ctrl/Cmd + S for save
    if (cmdOrCtrl && e.key === 's') {
      e.preventDefault();
      onSave();
      return;
    }
  }, [onCommandPalette, onFocusMode, onAIDrawer, onTerminal, onSave]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}