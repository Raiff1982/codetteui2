import React, { useEffect, useRef, useState } from 'react';
import { 
  Search, 
  Command as CommandIcon,
  FileText,
  Brain,
  Eye,
  Settings,
  HelpCircle,
  Zap,
  Music,
  Shield,
  Terminal,
  Palette,
  Code,
  Atom,
  Heart,
  Activity,
  TrendingUp,
  Users,
  BookOpen,
  ChevronRight
} from 'lucide-react';
import { Command } from '../hooks/useCommandPalette';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  commands: Command[];
  onExecuteCommand: (commandId: string) => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  searchTerm,
  onSearchChange,
  commands,
  onExecuteCommand
}: CommandPaletteProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchTerm, commands]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % commands.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + commands.length) % commands.length);
        break;
      case 'Enter':
        e.preventDefault();
        if (commands[selectedIndex]) {
          onExecuteCommand(commands[selectedIndex].id);
        }
        break;
      case 'Escape':
        e.preventDefault();
        onClose();
        break;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'file': return <FileText className="w-4 h-4" />;
      case 'ai': return <Brain className="w-4 h-4" />;
      case 'view': return <Eye className="w-4 h-4" />;
      case 'settings': return <Settings className="w-4 h-4" />;
      case 'help': return <HelpCircle className="w-4 h-4" />;
      default: return <CommandIcon className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'file': return 'text-blue-600';
      case 'ai': return 'text-purple-600';
      case 'view': return 'text-green-600';
      case 'settings': return 'text-orange-600';
      case 'help': return 'text-pink-600';
      default: return 'text-gray-600';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-32 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-2xl mx-4 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <CommandIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white">Command Palette</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400">Type to search commands</p>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search commands..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Commands List */}
        <div className="max-h-96 overflow-y-auto">
          {commands.length > 0 ? (
            <div className="p-2">
              {commands.map((command, index) => (
                <button
                  key={command.id}
                  onClick={() => onExecuteCommand(command.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all ${
                    index === selectedIndex
                      ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getCategoryColor(command.category)} bg-gray-100 dark:bg-gray-700`}>
                    {getCategoryIcon(command.category)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800 dark:text-white">
                        {command.title}
                      </span>
                      {command.shortcut && (
                        <kbd className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded text-xs font-mono text-gray-600 dark:text-gray-400">
                          {command.shortcut}
                        </kbd>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {command.description}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">No commands found</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">Try a different search term</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <span>↑↓ Navigate</span>
              <span>↵ Execute</span>
              <span>Esc Close</span>
            </div>
            <span>{commands.length} commands available</span>
          </div>
        </div>
      </div>
    </div>
  );
}