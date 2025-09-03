import React from 'react';
import { X, CheckCircle, AlertCircle, Info, Brain, Atom, Shield, Activity, Undo } from 'lucide-react';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'loading';
  category?: 'ai' | 'quantum' | 'ethics' | 'performance' | 'general';
  title: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  undoAction?: () => void;
  duration?: number;
}

interface StatusToastsProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

const typeIcons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  loading: Activity
};

const categoryIcons = {
  ai: Brain,
  quantum: Atom,
  ethics: Shield,
  performance: Activity,
  general: Info
};

const typeColors = {
  success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
  error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
  info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
  loading: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-200'
};

export function StatusToasts({ toasts, onDismiss }: StatusToastsProps) {
  if (toasts.length === 0) return null;

  return (
    <div 
      className="fixed top-4 right-4 z-50 space-y-2 max-w-sm"
      aria-live="polite"
      aria-label="Status notifications"
    >
      {toasts.map((toast) => {
        const TypeIcon = typeIcons[toast.type];
        const CategoryIcon = toast.category ? categoryIcons[toast.category] : null;
        
        return (
          <div
            key={toast.id}
            className={`p-4 rounded-lg border shadow-lg backdrop-blur-sm transition-all duration-300 ${typeColors[toast.type]}`}
            role="alert"
          >
            <div className="flex items-start gap-3">
              <div className="flex items-center gap-2 flex-shrink-0">
                {CategoryIcon && <CategoryIcon className="w-4 h-4" />}
                <TypeIcon className={`w-4 h-4 ${toast.type === 'loading' ? 'animate-spin' : ''}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm">{toast.title}</h4>
                {toast.message && (
                  <p className="text-sm opacity-90 mt-1">{toast.message}</p>
                )}
                
                {(toast.action || toast.undoAction) && (
                  <div className="flex items-center gap-2 mt-2">
                    {toast.action && (
                      <button
                        onClick={toast.action.onClick}
                        className="text-xs font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-current rounded"
                      >
                        {toast.action.label}
                      </button>
                    )}
                    {toast.undoAction && (
                      <button
                        onClick={toast.undoAction}
                        className="flex items-center gap-1 text-xs font-medium underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-current rounded"
                      >
                        <Undo className="w-3 h-3" />
                        Undo
                      </button>
                    )}
                  </div>
                )}
              </div>
              
              <button
                onClick={() => onDismiss(toast.id)}
                className="flex-shrink-0 p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-current"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}