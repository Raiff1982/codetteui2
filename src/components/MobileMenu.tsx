import React from 'react';
import { 
  X, 
  Brain, 
  Music, 
  Terminal, 
  Shield, 
  HelpCircle, 
  BookOpen,
  Zap,
  MessageCircle,
  Users,
  Atom,
  Heart,
  Activity,
  TrendingUp,
  Eye,
  Settings,
  Smartphone,
  Monitor,
  Trophy,
  Crown,
  Sparkles,
  Code,
  Github,
  Globe
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
  onTogglePerformanceOptimizer: () => void;
  onToggleCommunityBuilder: () => void;
  onToggleAccessibility: () => void;
  onToggleDocumentation: () => void;
  showPerformanceOptimizer: boolean;
  showCommunityBuilder: boolean;
  showAccessibilityEnhancer: boolean;
  showDocumentationMaker: boolean;
  isMobile: boolean;
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
  showSecurityPanel,
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
  onToggleChat,
  onTogglePerformanceOptimizer,
  onToggleCommunityBuilder,
  onToggleAccessibility,
  onToggleDocumentation,
  showPerformanceOptimizer,
  showCommunityBuilder,
  showAccessibilityEnhancer,
  showDocumentationMaker,
  isMobile
}: MobileMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
      <div className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-2xl transform transition-transform duration-300">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">Menu</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Menu Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Stats */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Today's Progress</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-gray-800 dark:text-white">Streak</span>
                </div>
                <p className="text-xl font-bold text-blue-600">{codingStreak}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Code className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-800 dark:text-white">Lines</span>
                </div>
                <p className="text-xl font-bold text-green-600">{totalLinesCodedToday}</p>
              </div>
            </div>
          </div>

          {/* Core Features */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Core Features</h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  onToggleAI();
                  onClose();
                }}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  aiPanelVisible ? 'bg-purple-100 dark:bg-purple-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Brain className="w-5 h-5 text-purple-600" />
                <span className="text-gray-700 dark:text-gray-300">AI Assistant</span>
                {aiPanelVisible && <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse ml-auto" />}
              </button>

              <button
                onClick={() => {
                  onToggleMusic();
                  onClose();
                }}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  musicPlayerVisible ? 'bg-pink-100 dark:bg-pink-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Music className="w-5 h-5 text-pink-600" />
                <span className="text-gray-700 dark:text-gray-300">Music Player</span>
                {musicPlayerVisible && <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse ml-auto" />}
              </button>

              <button
                onClick={() => {
                  onToggleTerminal();
                  onClose();
                }}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  terminalVisible ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Terminal className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700 dark:text-gray-300">Terminal</span>
                {terminalVisible && <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse ml-auto" />}
              </button>
            </div>
          </div>

          {/* AI Features */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">AI Features</h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  onToggleEthicalAI();
                  onClose();
                }}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  showEthicalAI ? 'bg-green-100 dark:bg-green-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-gray-700 dark:text-gray-300">Ethical AI</span>
              </button>

              <button
                onClick={() => {
                  onToggleQuantumVisualizer();
                  onClose();
                }}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  showQuantumVisualizer ? 'bg-purple-100 dark:bg-purple-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Atom className="w-5 h-5 text-purple-600" />
                <span className="text-gray-700 dark:text-gray-300">Quantum Visualizer</span>
              </button>

              <button
                onClick={() => {
                  onToggleAutoFix();
                  onClose();
                }}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  showAutoFix ? 'bg-blue-100 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Zap className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700 dark:text-gray-300">Auto-Fix</span>
              </button>

              <button
                onClick={() => {
                  onToggleChat();
                  onClose();
                }}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700 dark:text-gray-300">Chat</span>
              </button>
            </div>
          </div>

          {/* Tools */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Tools</h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  onTogglePerformanceOptimizer();
                  onClose();
                }}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  showPerformanceOptimizer ? 'bg-orange-100 dark:bg-orange-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <TrendingUp className="w-5 h-5 text-orange-600" />
                <span className="text-gray-700 dark:text-gray-300">Performance</span>
              </button>

              <button
                onClick={() => {
                  onToggleCommunityBuilder();
                  onClose();
                }}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  showCommunityBuilder ? 'bg-purple-100 dark:bg-purple-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Users className="w-5 h-5 text-purple-600" />
                <span className="text-gray-700 dark:text-gray-300">Community</span>
              </button>

              <button
                onClick={() => {
                  onToggleAccessibility();
                  onClose();
                }}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  showAccessibilityEnhancer ? 'bg-blue-100 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Eye className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700 dark:text-gray-300">Accessibility</span>
              </button>

              <button
                onClick={() => {
                  onToggleDocumentation();
                  onClose();
                }}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  showDocumentationMaker ? 'bg-green-100 dark:bg-green-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <BookOpen className="w-5 h-5 text-green-600" />
                <span className="text-gray-700 dark:text-gray-300">Documentation</span>
              </button>
            </div>
          </div>

          {/* Help & Support */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Help & Support</h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  onShowHelp();
                  onClose();
                }}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <HelpCircle className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700 dark:text-gray-300">Beginner Help</span>
              </button>

              <button
                onClick={() => {
                  onShowHowTo();
                  onClose();
                }}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <BookOpen className="w-5 h-5 text-green-600" />
                <span className="text-gray-700 dark:text-gray-300">How-To Guide</span>
              </button>
            </div>
          </div>

          {/* Settings */}
          <div>
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">Settings</h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  onToggleMobileLayout();
                  onClose();
                }}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  forceMobileLayout ? 'bg-blue-100 dark:bg-blue-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {forceMobileLayout ? <Smartphone className="w-5 h-5 text-blue-600" /> : <Monitor className="w-5 h-5 text-gray-600" />}
                <span className="text-gray-700 dark:text-gray-300">
                  {forceMobileLayout ? 'Mobile Layout' : 'Desktop Layout'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Crown className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-bold text-gray-800 dark:text-white">Codette</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              AI-Powered Development Environment
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              © 2025 Raiff's Bits
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}