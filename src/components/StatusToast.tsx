import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  X, 
  Loader,
  Brain,
  Atom,
  Shield,
  Music
} from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'loading';
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  category?: 'ai' | 'quantum' | 'ethics' | 'music' | 'general';
}

interface StatusToastProps {
  messages: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function StatusToast({ messages, onDismiss }: StatusToastProps) {
  const getIcon = (type: string, category?: string) => {
    if (type === 'loading') return <Loader className="w-5 h-5 animate-spin" />;
    
    if (category) {
      switch (category) {
        case 'ai': return <Brain className="w-5 h-5" />;
        case 'quantum': return <Atom className="w-5 h-5" />;
        case 'ethics': return <Shield className="w-5 h-5" />;
        case 'music': return <Music className="w-5 h-5" />;
      }
    }
    
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5" />;
      case 'error': return <AlertTriangle className="w-5 h-5" />;
      case 'info': return <Info className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  const getColors = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 text-green-800 dark:text-green-200';
      case 'error': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700 text-red-800 dark:text-red-200';
      case 'loading': return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200';
      default: return 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50 max-w-sm">
      {messages.map((message, index) => (
        <ToastItem
          key={message.id}
          message={message}
          onDismiss={onDismiss}
          getIcon={getIcon}
          getColors={getColors}
          index={index}
        />
      ))}
    </div>
  );
}

function ToastItem({ 
  message, 
  onDismiss, 
  getIcon, 
  getColors, 
  index 
}: { 
  message: ToastMessage;
  onDismiss: (id: string) => void;
  getIcon: (type: string, category?: string) => React.ReactNode;
  getColors: (type: string) => string;
  index: number;
}) {
  useEffect(() => {
    if (message.duration && message.type !== 'loading') {
      const timer = setTimeout(() => {
        onDismiss(message.id);
      }, message.duration);

      return () => clearTimeout(timer);
    }
  }, [message.id, message.duration, message.type, onDismiss]);

  return (
    <div 
      className={`p-4 rounded-xl border shadow-lg backdrop-blur-sm transition-all duration-300 animate-slide-in ${getColors(message.type)}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getIcon(message.type, message.category)}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm">{message.title}</h4>
          {message.description && (
            <p className="text-xs opacity-80 mt-1">{message.description}</p>
          )}
          
          {message.action && (
            <button
              onClick={message.action.onClick}
              className="mt-2 px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-medium transition-colors"
            >
              {message.action.label}
            </button>
          )}
        </div>
        
        {message.type !== 'loading' && (
          <button
            onClick={() => onDismiss(message.id)}
            className="flex-shrink-0 p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}