import { useState, useEffect, useCallback } from 'react';

export interface Command {
  id: string;
  title: string;
  description: string;
  category: 'file' | 'ai' | 'view' | 'settings' | 'help';
  shortcut?: string;
  action: () => void;
  icon?: string;
}

export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [commands, setCommands] = useState<Command[]>([]);

  const registerCommands = useCallback((newCommands: Command[]) => {
    setCommands(prev => {
      const existingIds = new Set(prev.map(cmd => cmd.id));
      const uniqueNewCommands = newCommands.filter(cmd => !existingIds.has(cmd.id));
      return [...prev, ...uniqueNewCommands];
    });
  }, []);

  const executeCommand = useCallback((commandId: string) => {
    const command = commands.find(cmd => cmd.id === commandId);
    if (command) {
      command.action();
      setIsOpen(false);
      setSearchTerm('');
    }
  }, [commands]);

  const filteredCommands = commands.filter(cmd =>
    cmd.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cmd.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cmd.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return {
    isOpen,
    setIsOpen,
    searchTerm,
    setSearchTerm,
    commands: filteredCommands,
    registerCommands,
    executeCommand
  };
}