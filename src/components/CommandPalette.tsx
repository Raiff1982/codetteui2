import React, { useState, useEffect, useRef } from 'react';
import { Search, FileText, Folder, Code, Palette, TerminalIcon, HelpCircle, BookOpen, TrendingUp, Users, Eye, Settings, Brain, Atom, Shield, Music, Crown, Sparkles, Activity } from 'lucide-react';

interface Command {
  id: string;
  title: string;
  description: string;
  category: 'file' | 'ai' | 'view' | 'settings' | 'help';
  shortcut?: string;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  commands: Command[];
}

const categoryIcons = {
  file: FileText,
  ai: Brain,
  view: Eye,
  settings: Settings,
  help: HelpCircle
};

const categoryColors = {
  file: 'text-blue-600 dark:text-blue-400',
  ai: 'text-purple-600 dark:text-purple-400',
  view: 'text-green-600 dark:text-green-400',
  settings: 'text-orange-600 dark:text-orange-400',
  help: 'text-pink-600 dark:text-pink-400'
};

export function CommandPalette({ isOpen, onClose, commands }: CommandPaletteProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filteredCommands = commands.filter(command =>
    command.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    command.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    command.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setSearchTerm('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchTerm]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredCommands.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredCommands.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
            onClose();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, filteredCommands, selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-[20vh]">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-2xl mx-4 max-h-[60vh] flex flex-col">
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 text-lg"
            aria-label="Command search input"
            role="combobox"
            aria-expanded={filteredCommands.length > 0}
            aria-autocomplete="list"
          />
          <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded">
            ESC
          </kbd>
        </div>

        {/* Commands List */}
        <div ref={listRef} className="flex-1 overflow-y-auto" role="listbox" aria-label="Available commands">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No commands found for "{searchTerm}"</p>
            </div>
          ) : (
            <div className="p-2">
              {filteredCommands.map((command, index) => {
                const Icon = categoryIcons[command.category];
                const isSelected = index === selectedIndex;
                
                return (
                  <div
                    key={command.id}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      command.action();
                      onClose();
                    }}
                  >
                    <Icon className={`w-5 h-5 ${categoryColors[command.category]}`} />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {command.title}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {command.description}
                      </div>
                    </div>
                    {command.shortcut && (
                      <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded">
                        {command.shortcut}
                      </kbd>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded">↵</kbd>
              Select
            </span>
          </div>
          <span>{filteredCommands.length} commands</span>
        </div>
      </div>
    </div>
  );
}