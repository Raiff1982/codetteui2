import React, { useState, useEffect, useRef } from 'react';
import { Lightbulb, X, HelpCircle, Sparkles, Brain } from 'lucide-react';

interface Tooltip {
  id: string;
  target: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  trigger: 'hover' | 'click' | 'auto';
  category: 'beginner' | 'feature' | 'shortcut' | 'ai';
  delay?: number;
}

const beginnerTooltips: Tooltip[] = [
  {
    id: 'file-explorer-help',
    target: '.file-explorer',
    title: 'File Explorer',
    content: 'Create, organize, and manage your project files here. Click the + button to add new files or folders.',
    position: 'right',
    trigger: 'hover',
    category: 'beginner'
  },
  {
    id: 'save-button-help',
    target: '[title="Save File (⌘S)"]',
    title: 'Save Your Work',
    content: 'Always save your files! The orange dot means you have unsaved changes. Click here or press ⌘S (Ctrl+S on Windows).',
    position: 'bottom',
    trigger: 'hover',
    category: 'beginner'
  },
  {
    id: 'ai-assistant-help',
    target: '.ai-panel-toggle',
    title: 'AI Assistant',
    content: 'Your coding buddy! Get smart suggestions, auto-corrections, and code optimization. Perfect for learning!',
    position: 'bottom',
    trigger: 'hover',
    category: 'ai'
  },
  {
    id: 'terminal-help',
    target: '.terminal-toggle',
    title: 'Terminal',
    content: 'Run commands, install packages, and execute your programs. Don\'t worry - we\'ll help you learn the commands!',
    position: 'bottom',
    trigger: 'hover',
    category: 'beginner'
  },
  {
    id: 'language-badge-help',
    target: '.language-badges',
    title: 'Language Features',
    content: 'These badges show what features are available for your current programming language. Green means active!',
    position: 'bottom',
    trigger: 'hover',
    category: 'feature'
  },
  {
    id: 'auto-correct-help',
    target: '[title="Toggle Auto-Correct"]',
    title: 'Auto-Correct Magic',
    content: 'Fixes common typos automatically! Great for beginners. Try typing "fucntion" and watch it become "function".',
    position: 'bottom',
    trigger: 'hover',
    category: 'ai'
  }
];

interface TooltipProviderProps {
  showBeginnerTips: boolean;
  children: React.ReactNode;
}

function calculateTooltipPosition(
  targetRect: DOMRect,
  tooltipWidth: number,
  tooltipHeight: number,
  preferredPosition: string
): { x: number; y: number; position: string } {
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  
  const margin = 16; // Margin from viewport edges
  let x = 0;
  let y = 0;
  let finalPosition = preferredPosition;
  
  // Calculate positions for each direction
  const positions = {
    top: {
      x: targetRect.left + targetRect.width / 2 - tooltipWidth / 2,
      y: targetRect.top - tooltipHeight - 12
    },
    bottom: {
      x: targetRect.left + targetRect.width / 2 - tooltipWidth / 2,
      y: targetRect.bottom + 12
    },
    left: {
      x: targetRect.left - tooltipWidth - 12,
      y: targetRect.top + targetRect.height / 2 - tooltipHeight / 2
    },
    right: {
      x: targetRect.right + 12,
      y: targetRect.top + targetRect.height / 2 - tooltipHeight / 2
    }
  };
  
  // Check if preferred position fits
  const preferred = positions[preferredPosition as keyof typeof positions];
  if (
    preferred.x >= margin &&
    preferred.x + tooltipWidth <= viewport.width - margin &&
    preferred.y >= margin &&
    preferred.y + tooltipHeight <= viewport.height - margin
  ) {
    return { x: preferred.x, y: preferred.y, position: preferredPosition };
  }
  
  // Try other positions if preferred doesn't fit
  const fallbackOrder = ['bottom', 'top', 'right', 'left'];
  for (const pos of fallbackOrder) {
    if (pos === preferredPosition) continue;
    
    const candidate = positions[pos as keyof typeof positions];
    if (
      candidate.x >= margin &&
      candidate.x + tooltipWidth <= viewport.width - margin &&
      candidate.y >= margin &&
      candidate.y + tooltipHeight <= viewport.height - margin
    ) {
      return { x: candidate.x, y: candidate.y, position: pos };
    }
  }
  
  // If nothing fits perfectly, constrain to viewport
  const constrained = positions[preferredPosition as keyof typeof positions];
  return {
    x: Math.max(margin, Math.min(constrained.x, viewport.width - tooltipWidth - margin)),
    y: Math.max(margin, Math.min(constrained.y, viewport.height - tooltipHeight - margin)),
    position: preferredPosition
  };
}

export function TooltipProvider({ showBeginnerTips, children }: TooltipProviderProps) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0, position: 'bottom' });
  const [dismissedTooltips, setDismissedTooltips] = useState<Set<string>>(new Set());
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showBeginnerTips) return;

    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement;
     if (!(target instanceof Element)) return;
     
      const tooltip = beginnerTooltips.find(t => 
        target.closest(t.target) && !dismissedTooltips.has(t.id)
      );
      
      if (tooltip && tooltip.trigger === 'hover') {
        const rect = target.getBoundingClientRect();
        
        // Calculate tooltip dimensions (estimate)
        const tooltipWidth = 320; // max-w-sm is roughly 320px
        const tooltipHeight = 150; // estimated height
        
        const position = calculateTooltipPosition(rect, tooltipWidth, tooltipHeight, tooltip.position);
        setTooltipPosition(position);
        setActiveTooltip(tooltip.id);
      }
    };

    const handleMouseLeave = (e: Event) => {
      const target = e.target as HTMLElement;
     if (!(target instanceof Element)) return;
     
      const tooltip = beginnerTooltips.find(t => target.closest(t.target));
      
      if (tooltip && tooltip.trigger === 'hover') {
        setTimeout(() => {
          if (tooltipRef.current && !tooltipRef.current.matches(':hover')) {
            setActiveTooltip(null);
          }
        }, 100);
      }
    };

    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);

    return () => {
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
    };
  }, [showBeginnerTips, dismissedTooltips]);

  const dismissTooltip = (tooltipId: string) => {
    setDismissedTooltips(prev => new Set([...prev, tooltipId]));
    setActiveTooltip(null);
  };

  const activeTooltipData = beginnerTooltips.find(t => t.id === activeTooltip);

  const getArrowClasses = (position: string) => {
    switch (position) {
      case 'top':
        return 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-50 dark:border-t-gray-800';
      case 'bottom':
        return 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-50 dark:border-b-gray-800';
      case 'left':
        return 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-50 dark:border-l-gray-800';
      case 'right':
        return 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-50 dark:border-r-gray-800';
      default:
        return 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-50 dark:border-b-gray-800';
    }
  };

  return (
    <>
      {children}
      
      {/* Floating Tooltip */}
      {activeTooltipData && showBeginnerTips && (
        <div
          ref={tooltipRef}
          className="fixed z-50 pointer-events-auto"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y
          }}
        >
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-4 max-w-sm animate-fade-in">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                {activeTooltipData.category === 'ai' && <Brain className="w-5 h-5 text-purple-500" />}
                {activeTooltipData.category === 'beginner' && <HelpCircle className="w-5 h-5 text-blue-500" />}
                {activeTooltipData.category === 'feature' && <Sparkles className="w-5 h-5 text-green-500" />}
                {activeTooltipData.category === 'shortcut' && <Lightbulb className="w-5 h-5 text-yellow-500" />}
                <h4 className="font-semibold text-gray-800 dark:text-white">
                  {activeTooltipData.title}
                </h4>
              </div>
              <button
                onClick={() => dismissTooltip(activeTooltipData.id)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
              {activeTooltipData.content}
            </p>
            
            <div className="flex justify-between items-center">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                activeTooltipData.category === 'ai' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' :
                activeTooltipData.category === 'beginner' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                activeTooltipData.category === 'feature' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
              }`}>
                {activeTooltipData.category}
              </span>
              
              <button
                onClick={() => dismissTooltip(activeTooltipData.id)}
                className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                Got it!
              </button>
            </div>
            
            {/* Tooltip Arrow */}
            <div className={`absolute w-3 h-3 border-4 border-gray-50 dark:border-gray-800 ${getArrowClasses(tooltipPosition.position)}`} />
          </div>
        </div>
      )}
    </>
  );
}