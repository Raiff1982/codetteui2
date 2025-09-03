import { useEffect } from 'react';

interface KeyboardShortcuts {
  onToggleCommandPalette: () => void;
  onToggleFocusMode: () => void;
  onToggleAIDrawer: () => void;
  onSave?: () => void;
  onToggleTerminal?: () => void;
  onToggleTheme?: () => void;
}

export function useKeyboardShortcuts({
  onToggleCommandPalette,
  onToggleFocusMode,
  onToggleAIDrawer,
  onSave,
  onToggleTerminal,
  onToggleTheme
}: KeyboardShortcuts) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcuts when user is typing in inputs
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
        return;
      }

      // Command Palette - Ctrl/Cmd + K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        onToggleCommandPalette();
      }

      // Focus Mode - Ctrl/Cmd + Shift + F
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        onToggleFocusMode();
      }

      // AI Drawer - Ctrl/Cmd + Shift + A
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        onToggleAIDrawer();
      }

      // Save - Ctrl/Cmd + S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        onSave?.();
      }

      // Terminal - Ctrl/Cmd + `
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault();
        onToggleTerminal?.();
      }

      // Theme - Ctrl/Cmd + T
      if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        onToggleTheme?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    onToggleCommandPalette,
    onToggleFocusMode,
    onToggleAIDrawer,
    onSave,
    onToggleTerminal,
    onToggleTheme
  ]);
}