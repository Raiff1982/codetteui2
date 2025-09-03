import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  category?: 'file' | 'ai' | 'research' | 'database' | 'general';
}

export function EmptyState({ icon: Icon, title, description, action, category }: EmptyStateProps) {
  const getCategoryGradient = (cat?: string) => {
    switch (cat) {
      case 'ai': return 'from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20';
      case 'research': return 'from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20';
      case 'database': return 'from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20';
      case 'file': return 'from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20';
      default: return 'from-gray-100 to-slate-100 dark:from-gray-700 dark:to-slate-700';
    }
  };

  return (
    <div className="flex items-center justify-center h-full p-8">
      <div className="text-center max-w-md">
        <div className={`w-16 h-16 bg-gradient-to-br ${getCategoryGradient(category)} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
          <Icon className="w-8 h-8 text-gray-600 dark:text-gray-400" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
          {title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
          {description}
        </p>
        
        {action && (
          <button
            onClick={action.onClick}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 font-medium"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}