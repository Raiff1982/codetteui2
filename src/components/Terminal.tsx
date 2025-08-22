import React from 'react';
import { MultiTerminal } from './MultiTerminal';

interface TerminalProps {
  onClose: () => void;
  height: number;
  onHeightChange: (height: number) => void;
}

export function Terminal({ onClose, height, onHeightChange }: TerminalProps) {
  return (
    <MultiTerminal 
      onClose={onClose}
      height={height}
      onHeightChange={onHeightChange}
    />
  );
}