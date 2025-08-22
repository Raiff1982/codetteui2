import React from 'react';
import { useState, useEffect } from 'react';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { 
  FileText, 
  Folder, 
  Code, 
  Zap, 
  Palette,
  Terminal as TerminalIcon,
  Keyboard,
  Heart,
  Brain,
  Atom,
  Network,
  Shield,
  Sparkles,
  AlertTriangle,
  Activity,
  Music,
  Eye
} from 'lucide-react';

interface WelcomeScreenProps {
  onCreateFile: (name: string, type: 'file' | 'folder') => void;
  onOpenMusic?: () => void;
}

export function WelcomeScreen({ onCreateFile, onOpenMusic }: WelcomeScreenProps) {
  const quickActionsScroll = useAutoScroll({ 
    speed: 30, 
    direction: 'vertical',
    pauseOnHover: true,
    resetOnInteraction: true,
    enableBidirectional: true
  });
  
  const featuresScroll = useAutoScroll({ 
    speed: 25, 
    direction: 'horizontal',
    pauseOnHover: true,
    resetOnInteraction: true,
    enableBidirectional: true
  });
  
  const shortcutsScroll = useAutoScroll({ 
    speed: 20, 
    direction: 'vertical',
    pauseOnHover: true,
    resetOnInteraction: true,
    enableBidirectional: false
  });

  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    
    checkDeviceType();
    window.addEventListener('resize', checkDeviceType);
    return () => window.removeEventListener('resize', checkDeviceType);
  }, []);

  const quickActions = [
    {
      icon: FileText,
      title: 'New File',
      description: 'Create a new file',
      action: () => onCreateFile('untitled.txt', 'file')
    },
    {
      icon: Code,
      title: 'New JavaScript File',
      description: 'Create a JavaScript file',
      action: () => onCreateFile('script.js', 'file')
    },
    {
      icon: Palette,
      title: 'New CSS File',
      description: 'Create a stylesheet',
      action: () => onCreateFile('styles.css', 'file')
    },
    {
      icon: Folder,
      title: 'New Folder',
      description: 'Create a new folder',
      action: () => onCreateFile('new-folder', 'folder')
    },
    {
      icon: Sparkles,
      title: 'Generate Music',
      description: 'AI-generated music for coding focus',
      action: () => onOpenMusic?.()
    },
    {
      icon: Brain,
      title: 'Ultimate AI Suite',
      description: 'Revolutionary quantum, neural, and emotional AI analysis',
      action: () => onCreateFile('example-ai.ts', 'file')
    }
  ];

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized for speed and performance'
    },
    {
      icon: Brain,
      title: 'AI-Powered',
      description: 'Advanced AI analysis and optimization'
    },
    {
      icon: Atom,
      title: 'Quantum Inspired',
      description: 'Quantum algorithms for complex optimization'
    },
    {
      icon: Shield,
      title: 'Ethical AI',
      description: 'Built-in ethical governance and safety'
    },
    {
      icon: Keyboard,
      title: 'Keyboard Shortcuts',
      description: 'Powerful shortcuts for productivity'
    },
    {
      icon: Network,
      title: 'Collaborative Intelligence',
      description: 'Multi-agent AI council for decision making'
    },
    {
      icon: TerminalIcon,
      title: 'Integrated Terminal',
      description: 'Built-in terminal for command execution'
    },
    {
      icon: Heart,
      title: 'Virtue-Driven',
      description: 'Guided by compassion, wisdom, and integrity with emotional intelligence'
    }
  ];

  return (
    <div className={`h-full overflow-y-auto bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent ${isMobile ? 'px-4' : ''}`}>
      <div className={`min-h-full flex items-center justify-center ${isMobile ? 'py-6' : 'py-12'}`}>
        <div className={`${isMobile ? 'max-w-full' : 'max-w-4xl'} mx-auto ${isMobile ? 'px-4' : 'px-8'} text-center w-full`}>
          {/* Logo and Title */}
          <div className={`${isMobile ? 'mb-8' : 'mb-12'}`}>
            <div className={`${isMobile ? 'w-20 h-20' : 'w-24 h-24'} bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto ${isMobile ? 'mb-6' : 'mb-8'} shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
              <span className={`text-white ${isMobile ? 'text-2xl' : 'text-4xl'} font-bold tracking-tight`}>C</span>
            </div>
            <h1 className={`${isMobile ? 'text-4xl' : 'text-6xl'} font-bold text-gray-900 dark:text-white mb-6 tracking-tight`}>
              Welcome to Codette
            </h1>
            <p className={`${isMobile ? 'text-lg' : 'text-xl'} text-gray-600 dark:text-gray-400 ${isMobile ? 'max-w-full' : 'max-w-3xl'} mx-auto leading-relaxed font-medium`}>
              Far more than a typical code editor - Codette is a comprehensive AI-powered development environment 
              built on genuine research and innovation. This represents a fundamentally different approach to developer tools: 
              not just helping you write code faster, but creating a more empathetic, ethical, and intelligent development experience.
            </p>
            <div className={`${isMobile ? 'mt-3' : 'mt-4'} text-center`}>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500 dark:text-gray-500 font-medium`}>
                Built on real academic research by <a href="https://www.raiffsbits.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-medium transition-colors underline">Raiff's Bits</a>
              </p>
            </div>
            <div className={`${isMobile ? 'mt-6' : 'mt-8'} bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 ${isMobile ? 'p-4' : 'p-6'} rounded-2xl ${isMobile ? 'max-w-full' : 'max-w-2xl'} mx-auto border border-emerald-200/50 dark:border-emerald-800/50 shadow-lg`}>
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                <span className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-gray-900 dark:text-white`}>New to Coding?</span>
              </div>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-700 dark:text-gray-300 text-center font-medium`}>
                Don't worry! Codette is designed to help you learn. Look for the helpful tooltips, use the beginner mode toggle, try the music player for focus, and explore the revolutionary AI features!
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className={`${isMobile ? 'mb-8' : 'mb-16'}`}>
            <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-semibold text-gray-900 dark:text-white ${isMobile ? 'mb-6' : 'mb-10'} tracking-tight`}>
              Quick Start
            </h2>
            <div 
              ref={quickActionsScroll.elementRef}
              className={`grid ${isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-6 pb-4 overflow-y-auto ${isMobile ? 'max-h-64' : 'max-h-96'} relative`}
            >
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className={`${isMobile ? 'p-5' : 'p-8'} bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 ${isMobile ? '' : 'hover:scale-[1.02]'} border border-gray-200/50 dark:border-gray-700/50 group cursor-pointer touch-target hover-lift`}
                >
                  <action.icon className={`${isMobile ? 'w-7 h-7' : 'w-10 h-10'} text-blue-600 mx-auto ${isMobile ? 'mb-3' : 'mb-4'} group-hover:text-blue-700 transition-colors`} />
                  <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-gray-900 dark:text-white mb-2 tracking-tight`}>
                    {action.title}
                  </h3>
                  <p className={`${isMobile ? 'text-sm' : 'text-sm'} text-gray-600 dark:text-gray-400 font-medium`}>
                    {action.description}
                  </p>
                </button>
              ))}
              
              {/* Auto-scroll indicator */}
              <div className="absolute top-2 right-2 flex items-center space-x-2 glass rounded-full px-3 py-1.5">
                <div className={`w-2 h-2 rounded-full ${quickActionsScroll.isPaused ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`} />
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  {quickActionsScroll.isPaused ? 'Paused' : 'Auto-scrolling'}
                </span>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className={`${isMobile ? 'mb-8' : 'mb-12'}`}>
            <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-semibold text-gray-900 dark:text-white ${isMobile ? 'mb-6' : 'mb-10'} tracking-tight`}>
              Why Choose Codette?
            </h2>
            <div 
              ref={featuresScroll.elementRef}
              className={`grid ${isMobile ? 'grid-cols-2' : isTablet ? 'grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'} ${isMobile ? 'gap-4' : 'gap-8'} pb-4 overflow-y-auto ${isMobile ? 'max-h-64' : 'max-h-80'} relative`}
            >
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <div className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl flex items-center justify-center mx-auto ${isMobile ? 'mb-3' : 'mb-4'} shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 border border-blue-200/50 dark:border-blue-800/50`}>
                    <feature.icon className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-blue-600 dark:text-blue-400`} />
                  </div>
                  <h3 className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-gray-900 dark:text-white mb-2 tracking-tight`}>
                    {feature.title}
                  </h3>
                  <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 dark:text-gray-400 font-medium`}>
                    {feature.description}
                  </p>
                </div>
              ))}
              
              {/* Auto-scroll indicator */}
              <div className="absolute top-2 right-2 flex items-center space-x-2 glass rounded-full px-3 py-1.5">
                <div className={`w-2 h-2 rounded-full ${featuresScroll.isPaused ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`} />
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  {featuresScroll.isPaused ? 'Paused' : 'Auto-scrolling'}
                </span>
              </div>
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className={`bg-white dark:bg-gray-800 rounded-2xl ${isMobile ? 'p-5' : 'p-8'} shadow-lg border border-gray-200/50 dark:border-gray-700/50 relative ${isMobile ? 'mb-6' : 'mb-10'} ${isMobile ? 'mobile-hidden' : ''}`}>
            <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-gray-900 dark:text-white mb-6 tracking-tight`}>
              Keyboard Shortcuts
            </h3>
            <div 
              ref={shortcutsScroll.elementRef}
              className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-4 ${isMobile ? 'text-sm' : 'text-sm'} pb-2 ${isMobile ? 'max-h-48' : 'max-h-64'} overflow-y-auto`}
            >
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300 font-medium">Save File</span>
                <kbd className={`bg-gray-100 dark:bg-gray-700 ${isMobile ? 'px-2 py-1' : 'px-3 py-1'} rounded-lg text-gray-800 dark:text-gray-200 font-mono text-xs border border-gray-200 dark:border-gray-600`}>
                  ⌘S
                </kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300 font-medium">Toggle Terminal</span>
                <kbd className={`bg-gray-100 dark:bg-gray-700 ${isMobile ? 'px-2 py-1' : 'px-3 py-1'} rounded-lg text-gray-800 dark:text-gray-200 font-mono text-xs border border-gray-200 dark:border-gray-600`}>
                  ⌘`
                </kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300 font-medium">Toggle AI Panel</span>
                <kbd className={`bg-gray-100 dark:bg-gray-700 ${isMobile ? 'px-2 py-1' : 'px-3 py-1'} rounded-lg text-gray-800 dark:text-gray-200 font-mono text-xs border border-gray-200 dark:border-gray-600`}>
                  ⌘⇧A
                </kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300 font-medium">Search</span>
                <kbd className={`bg-gray-100 dark:bg-gray-700 ${isMobile ? 'px-2 py-1' : 'px-3 py-1'} rounded-lg text-gray-800 dark:text-gray-200 font-mono text-xs border border-gray-200 dark:border-gray-600`}>
                  ⌘K
                </kbd>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 dark:text-gray-300 font-medium">Toggle Theme</span>
                <kbd className={`bg-gray-100 dark:bg-gray-700 ${isMobile ? 'px-2 py-1' : 'px-3 py-1'} rounded-lg text-gray-800 dark:text-gray-200 font-mono text-xs border border-gray-200 dark:border-gray-600`}>
                  ⌘T
                </kbd>
              </div>
            </div>
            
            {/* Auto-scroll indicator */}
            <div className="absolute top-4 right-4 flex items-center space-x-2 glass rounded-full px-3 py-1.5">
              <div className={`w-2 h-2 rounded-full ${shortcutsScroll.isPaused ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`} />
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                {shortcutsScroll.isPaused ? 'Paused' : 'Auto-scrolling'}
              </span>
            </div>
          </div>
          
          {/* Mobile-specific help */}
          {isMobile && (
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-2xl mb-6 border border-purple-200/50 dark:border-purple-800/50 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 tracking-tight">📱 Frontend Demo Mode</h3>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300 text-left font-medium">
                <p>• 🎯 <strong>Interface:</strong> Full UI experience available</p>
                <p>• 🎵 <strong>Music:</strong> Open source music player works</p>
                <p>• 🧠 <strong>AI Systems:</strong> Require Python backend (see GitHub)</p>
                <p>• 🛡️ <strong>Security:</strong> Frontend scanning only</p>
                <p>• 📊 <strong>Database:</strong> Requires Supabase connection</p>
                <p>• 📚 <strong>Research:</strong> Papers are real and accessible</p>
                <p>• ⚡ <strong>Full Power:</strong> Deploy backend for complete experience</p>
              </div>
            </div>
          )}
          
          {/* Codette Integration Showcase */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-8 rounded-2xl border border-amber-200/50 dark:border-amber-800/50 shadow-lg">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">⚡ Frontend Demo Mode</h3>
            </div>
            <p className="text-amber-800 dark:text-amber-200 mb-6 text-sm leading-relaxed font-medium">
              You're experiencing the frontend interface of Codette. The revolutionary AI systems (quantum optimization, 
              Aegis Council, DreamCore memory) require the Python backend to function. The research and innovation are 
              real - you're just seeing the UI layer right now.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-amber-800 dark:text-amber-200 font-medium">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Atom className="w-4 h-4 text-amber-600" />
                  <span><strong>Quantum Optimizer:</strong> Backend required for real quantum analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-amber-600" />
                  <span><strong>DreamCore Memory:</strong> Python implementation needed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-amber-600" />
                  <span><strong>Nexus Engine:</strong> Signal processing requires backend</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-amber-600" />
                  <span><strong>Virtue Ethics:</strong> Full analysis needs Python systems</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Music className="w-4 h-4 text-amber-600" />
                  <span><strong>Music Player:</strong> Open source tracks work now!</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-amber-600" />
                  <span><strong>Interface:</strong> Full UI experience available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span><strong>Research Papers:</strong> Real DOIs and documentation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-amber-600" />
                  <span><strong>GitHub:</strong> Full source code available</span>
                </div>
              </div>
            </div>
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200/50 dark:border-blue-800/50">
              <p className="text-xs text-blue-800 dark:text-blue-200 font-medium">
                <strong>Want the full experience?</strong> Check out the GitHub repository for backend setup instructions. 
                The Python systems implement the actual quantum algorithms, neural networks, and ethical AI described in the research papers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}