import React, { useState } from 'react';
import { Code, ChevronDown, Search, Star } from 'lucide-react';
import { supportedLanguages, LanguageSupport } from '../services/aiCodeService';

interface LanguageSelectorProps {
  currentLanguage: LanguageSupport | null;
  onLanguageChange: (language: LanguageSupport) => void;
}

export function LanguageSelector({ currentLanguage, onLanguageChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLanguages = supportedLanguages.filter(lang =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.extensions.some(ext => ext.includes(searchTerm.toLowerCase()))
  );

  const popularLanguages = supportedLanguages.filter(lang =>
    ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'Rust', 'Go', 'HTML', 'CSS'].includes(lang.name)
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
      >
        <Code className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {currentLanguage?.name || 'Select Language'}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50">
          {/* Search */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search languages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
          </div>

          {/* Popular Languages */}
          {!searchTerm && (
            <div className="p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Popular</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {popularLanguages.map(lang => (
                  <button
                    key={lang.name}
                    onClick={() => {
                      onLanguageChange(lang);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className="p-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-center"
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* All Languages */}
          <div className="max-h-64 overflow-y-auto">
            {filteredLanguages.map(lang => (
              <button
                key={lang.name}
                onClick={() => {
                  onLanguageChange(lang);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
                className="w-full px-4 py-3 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-800 dark:text-white">
                      {lang.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      .{lang.extensions.join(', .')}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {lang.hasLSP && (
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded-full">
                        LSP
                      </span>
                    )}
                    {lang.aiSupported && (
                      <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                        AI
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}