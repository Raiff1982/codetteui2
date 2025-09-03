import { useState, useEffect, useCallback } from 'react';

export function useFocusMode() {
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [previousState, setPreviousState] = useState<{
    sidebarCollapsed: boolean;
    terminalVisible: boolean;
    aiPanelVisible: boolean;
  } | null>(null);

  const enterFocusMode = useCallback((currentState: {
    sidebarCollapsed: boolean;
    terminalVisible: boolean;
    aiPanelVisible: boolean;
  }) => {
    setPreviousState(currentState);
    setIsFocusMode(true);
  }, []);

  const exitFocusMode = useCallback(() => {
    setIsFocusMode(false);
    return previousState;
  }, [previousState]);

  const toggleFocusMode = useCallback((currentState: {
    sidebarCollapsed: boolean;
    terminalVisible: boolean;
    aiPanelVisible: boolean;
  }) => {
    if (isFocusMode) {
      return { action: 'exit', previousState: exitFocusMode() };
    } else {
      enterFocusMode(currentState);
      return { action: 'enter', previousState: null };
    }
  }, [isFocusMode, enterFocusMode, exitFocusMode]);

  return {
    isFocusMode,
    toggleFocusMode,
    enterFocusMode,
    exitFocusMode
  };
}