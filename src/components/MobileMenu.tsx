import React from 'react';
import { 
  X, 
  Brain, 
  Music, 
  Terminal, 
  Shield, 
  HelpCircle, 
  BookOpen,
  Atom,
  Heart,
  Activity,
  Eye,
  TrendingUp,
  Smartphone,
  Monitor,
  Trophy,
  Zap,
  Star,
  Globe,
  ExternalLink,
  Award,
  Sparkles,
  MessageCircle,
  Github
} from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleAI: () => void;
  onToggleMusic: () => void;
  onToggleTerminal: () => void;
  onToggleSecurity: () => void;
  onShowHelp: () => void;
  onShowHowTo: () => void;
  aiPanelVisible: boolean;
  musicPlayerVisible: boolean;
  terminalVisible: boolean;
  showSecurityPanel: boolean;
  onToggleEthicalAI: () => void;
  onToggleCodeHealth: () => void;
  onToggleQuantumVisualizer: () => void;
  onToggleCocoonsViewer: () => void;
  onTogglePerformanceMonitor: () => void;
  showEthicalAI: boolean;
  showCodeHealth: boolean;
  showQuantumVisualizer: boolean;
  showCocoonsViewer: boolean;
  showPerformanceMonitor: boolean;
  forceMobileLayout: boolean;
  onToggleMobileLayout: () => void;
  codingStreak: number;
  totalLinesCodedToday: number;
  onToggleMTVMusicPlayer: () => void;
  onToggleRevolutionaryInterface: () => void;
  showMTVMusicPlayer: boolean;
  showRevolutionaryInterface: boolean;
  onToggleAutoFix: () => void;
  showAutoFix: boolean;
  onToggleChat: () => void;
}

export function MobileMenu({
  isOpen,
  onClose,
  onToggleAI,
  onToggleMusic,
  onToggleTerminal,
  onToggleSecurity,
  onShowHelp,
  onShowHowTo,
  aiPanelVisible,
  musicPlayerVisible,
  terminalVisible,
  onToggleEthicalAI,
  onToggleCodeHealth,
  onToggleQuantumVisualizer,
  onToggleCocoonsViewer,
  onTogglePerformanceMonitor,
  showEthicalAI,
  showCodeHealth,
  showQuantumVisualizer,
  showCocoonsViewer,
  showPerformanceMonitor,
  forceMobileLayout,
  onToggleMobileLayout,
  codingStreak,
  totalLinesCodedToday,
  onToggleMTVMusicPlayer,
  onToggleRevolutionaryInterface,
  showMTVMusicPlayer,
  showRevolutionaryInterface,
  onToggleAutoFix,
  showAutoFix,
  onToggleChat
}: MobileMenuProps) {
  if (!isOpen) return null;

  const menuItems = [
    {
      icon: Brain,
      label: 'AI Assistant',
      active: aiPanelVisible,
      action: onToggleAI,
      description: 'Smart code assistance'
    },
    {
      icon: Music,
      label: 'Music Player',
      active: musicPlayerVisible,
      action: onToggleMusic,
      description: 'Coding soundtrack'
    },
    {
      icon: Terminal,
      label: 'Terminal',
      active: terminalVisible,
      action: onToggleTerminal,
      description: 'Command line interface'
    },
    {
      icon: Heart,
      label: 'Ethical AI',
      active: showEthicalAI,
      action: onToggleEthicalAI,
      description: 'Virtue-driven analysis'
    },
    {
      icon: Activity,
      label: 'Code Health',
      active: showCodeHealth,
      action: onToggleCodeHealth,
      description: 'Health monitoring'
    },
    {
      icon: Atom,
      label: 'Quantum Visualizer',
      active: showQuantumVisualizer,
      action: onToggleQuantumVisualizer,
      description: 'Quantum analysis'
    },
    {
      icon: Eye,
      label: 'Cocoons Viewer',
      active: showCocoonsViewer,
      action: onToggleCocoonsViewer,
      description: 'Memory crystallizations'
    },
    {
      icon: Activity,
      label: 'Code Health',
      active: showCodeHealth,
      action: onToggleCodeHealth,
      description: 'Health monitoring'
    },
    {
      icon: Atom,
      label: 'Quantum Visualizer',
      active: showQuantumVisualizer,
      action: onToggleQuantumVisualizer,
      description: 'Quantum analysis'
    },
    {
      icon: Eye,
      label: 'Cocoons Viewer',
      active: showCocoonsViewer,
      action: onToggleCocoonsViewer,
      description: 'Memory crystallizations'
    },
    {
      icon: TrendingUp,
      label: 'Performance Monitor',
      active: showPerformanceMonitor,
      action: onTogglePerformanceMonitor,
      description: 'Performance tracking'
    },
    {
      icon: Shield,
      label: 'Security',
      active: false,
      action: onToggleSecurity,
      description: 'Security analysis'
    },
    {
      icon: Award,
      label: 'Music Awards',
      active: showMTVMusicPlayer,
      action: onToggleMTVMusicPlayer,
      description: 'MTV-style music experience'
    },
    {
      icon: Sparkles,
      label: 'Experience Mode',
      active: showRevolutionaryInterface,
      action: onToggleRevolutionaryInterface,
      description: 'Revolutionary interface'
    },
    {
      icon: Zap,
      label: 'Auto-Fix',
      active: showAutoFix,
      action: onToggleAutoFix,
      description: 'Intelligent code repair'
    },
    {
      icon: MessageCircle,
      label: 'Chat with Codette',
      active: false,
      action: onToggleChat,
      description: 'Ask Codette questions'
    }
  ];

  const helpItems = [
    {
      icon: HelpCircle,
      label: 'Beginner Help',
      action: onShowHelp,
      description: 'Get started guide'
    },
    {
      icon: BookOpen,
      label: 'How-To Guide',
      action: onShowHowTo,
      description: 'Complete tutorials'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex">
      <div className="w-80 bg-white dark:bg-gray-800 h-full shadow-2xl overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">Codette</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Mobile Menu</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Stats */}
          {(codingStreak > 0 || totalLinesCodedToday > 0) && (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg text-center">
                <Trophy className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-green-600">{codingStreak}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Day Streak</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                <Zap className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-blue-600">{totalLinesCodedToday}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Lines Today</p>
              </div>
            </div>
          )}
        </div>

        {/* Main Features */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Features</h3>
          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.action();
                  onClose();
                }}
                className={`w-full flex items-center space-x-3 p-4 rounded-xl transition-all text-left ${
                  item.active
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                <item.icon className="w-6 h-6" />
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className={`text-xs ${item.active ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                    {item.description}
                  </div>
                </div>
                {item.active && (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse ml-auto" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Help & Support</h3>
          <div className="space-y-2">
            {helpItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.action();
                  onClose();
                }}
                className="w-full flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all text-left"
              >
                <item.icon className="w-6 h-6" />
                <div>
                  <div className="font-medium">{item.label}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Settings</h3>
          <div className="space-y-3">
            <button
              onClick={() => {
                onToggleMobileLayout();
                onClose();
              }}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${
                forceMobileLayout
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
              }`}
            >
              {forceMobileLayout ? (
                <Smartphone className="w-5 h-5" />
              ) : (
                <Monitor className="w-5 h-5" />
              )}
              <span className="font-medium">
                {forceMobileLayout ? 'Mobile Layout' : 'Desktop Layout'}
              </span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              © 2025 Raiff's Bits
            </p>
            <div className="flex justify-center space-x-4">
              <a 
                href="https://www.raiffsbits.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
              >
                <Globe className="w-4 h-4" />
                <span>Website</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a 
                href="https://github.com/raiffsbits/codette" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay */}
      <div className="flex-1" onClick={onClose} />
    </div>
  );
}