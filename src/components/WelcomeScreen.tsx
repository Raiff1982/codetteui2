import React from 'react';
import { useState, useEffect, useRef } from 'react';
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
  Eye,
  ChevronDown,
  Server,
  Database,
  Wifi,
  CheckCircle2,
  Play,
  Settings
} from 'lucide-react';

interface WelcomeScreenProps {
  onCreateFile: (name: string, type: 'file' | 'folder') => void;
  onOpenMusic?: () => void;
  onOpenCommandPalette?: () => void;
}

export function WelcomeScreen({ onCreateFile, onOpenMusic, onOpenCommandPalette }: WelcomeScreenProps) {
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
  const [showQuickActionsMenu, setShowQuickActionsMenu] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const menuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    // Check backend connectivity
    checkBackendStatus();
    
    // Check every 30 seconds
    const interval = setInterval(checkBackendStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Close menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowQuickActionsMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const checkBackendStatus = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/health', {
        method: 'GET',
        timeout: 5000
      } as any);
      
      if (response.ok) {
        setBackendStatus('connected');
      } else {
        setBackendStatus('disconnected');
      }
    } catch (error) {
      setBackendStatus('disconnected');
    }
  };

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
      title: 'AI Music Experience',
      description: 'Revolutionary adaptive music that responds to your code',
      action: () => onOpenMusic?.()
    },
    {
      icon: Brain,
      title: 'Quantum AI Analysis',
      description: 'Real quantum-inspired optimization with mathematical foundations',
      action: () => onCreateFile('example-ai.ts', 'file')
    },
    {
      icon: Heart,
      title: 'Ethical AI Demo',
      description: 'Virtue-driven AI with compassion, integrity, wisdom, and courage',
      action: () => onCreateFile('ethical-example.ts', 'file')
    },
    {
      icon: Shield,
      title: 'Security Analysis',
      description: 'Multi-layer security with ethical AI governance',
      action: () => onCreateFile('secure-code.ts', 'file')
    },
    {
      icon: Server,
      title: 'Backend AI Systems',
      description: 'Access all 6 production AI systems via Python backend',
      action: () => window.open('http://localhost:8000/docs', '_blank')
    },
    {
      icon: Database,
      title: 'Real-time Collaboration',
      description: 'WebSocket-powered live coding with other developers',
      action: () => onCreateFile('collaboration-demo.ts', 'file')
    },
    {
      icon: Activity,
      title: 'Performance Monitoring',
      description: 'Real-time metrics and optimization suggestions',
      action: () => onCreateFile('performance-demo.ts', 'file')
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
      description: 'Six production AI systems with real research backing'
    },
    {
      icon: Atom,
      title: 'Quantum Inspired',
      description: 'Real quantum computing principles, not just buzzwords'
    },
    {
      icon: Shield,
      title: 'Ethical AI',
      description: 'Virtue-driven AI with transparent decision making'
    },
    {
      icon: Keyboard,
      title: 'Keyboard Shortcuts',
      description: 'Powerful shortcuts for productivity'
    },
    {
      icon: Network,
      title: 'Collaborative Intelligence',
      description: 'Real-time collaboration with WebSocket technology'
    },
    {
      icon: TerminalIcon,
      title: 'Integrated Terminal',
      description: 'Built-in terminal for command execution'
    },
    {
      icon: Heart,
      title: 'Virtue-Driven',
      description: 'Emotional intelligence and genuine care for users'
    },
    {
      icon: Server,
      title: 'Production Backend',
      description: 'Complete Python backend with FastAPI and SQLite'
    }
  ];

  return (
    <div className={`h-full overflow-y-auto bg-gradient-to-br from-slate-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent ${isMobile ? 'px-4' : ''}`}>
      <div className={`min-h-full flex items-center justify-center ${isMobile ? 'py-6' : 'py-12'}`}>
        <div className={`${isMobile ? 'max-w-full' : 'max-w-4xl'} mx-auto ${isMobile ? 'px-4' : 'px-8'} text-center w-full`}>
          {/* Logo and Title */}
          <div className={`${isMobile ? 'mb-8' : 'mb-12'}`}>
            {/* Backend Status Indicator */}
            <div className={`${isMobile ? 'mb-4' : 'mb-6'} flex justify-center`}>
              <div className={`flex items-center space-x-3 px-4 py-2 rounded-full border ${
                backendStatus === 'connected' 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                  : backendStatus === 'disconnected'
                  ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
                  : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
              }`}>
                <div className={`w-3 h-3 rounded-full ${
                  backendStatus === 'connected' 
                    ? 'bg-green-500 animate-pulse' 
                    : backendStatus === 'disconnected'
                    ? 'bg-orange-500'
                    : 'bg-blue-500 animate-spin border-2 border-blue-300 border-t-transparent'
                }`} />
                <span className={`text-sm font-medium ${
                  backendStatus === 'connected' 
                    ? 'text-green-700 dark:text-green-300' 
                    : backendStatus === 'disconnected'
                    ? 'text-orange-700 dark:text-orange-300'
                    : 'text-blue-700 dark:text-blue-300'
                }`}>
                  {backendStatus === 'connected' 
                    ? '🚀 Full AI Backend Connected' 
                    : backendStatus === 'disconnected'
                    ? '🎨 Frontend Demo Mode'
                    : '🔍 Checking Backend Status'
                  }
                </span>
                {backendStatus === 'connected' && (
                  <a 
                    href="http://localhost:8000/docs" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-600 hover:text-green-700 text-xs underline"
                  >
                    API Docs
                  </a>
                )}
              </div>
            </div>

            <div className={`${isMobile ? 'w-20 h-20' : 'w-24 h-24'} bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto ${isMobile ? 'mb-6' : 'mb-8'} shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}>
              <span className={`text-white ${isMobile ? 'text-2xl' : 'text-4xl'} font-bold tracking-tight`}>C</span>
            </div>
            <h1 className={`${isMobile ? 'text-4xl' : 'text-6xl'} font-bold text-gray-900 dark:text-white mb-6 tracking-tight`}>
              Welcome to Codette
            </h1>
            <p className={`${isMobile ? 'text-lg' : 'text-xl'} text-gray-600 dark:text-gray-400 ${isMobile ? 'max-w-full' : 'max-w-3xl'} mx-auto leading-relaxed font-medium`}>
              The world's first AI development environment built on genuine research with published DOIs. 
              Codette combines revolutionary AI systems, ethical governance, and emotional intelligence to create 
              a development experience that's not just intelligent, but genuinely caring about developers and users alike.
            </p>
            <div className={`${isMobile ? 'mt-3' : 'mt-4'} text-center`}>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500 dark:text-gray-500 font-medium`}>
                Built on real academic research by <a href="https://www.raiffsbits.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-medium transition-colors underline">Raiff's Bits</a> • 
                <a href="https://codette.online" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700 font-medium transition-colors underline ml-1">
                  Live Demo
                </a>
              </p>
            </div>
            
            {/* Backend Status Card */}
            <div className={`${isMobile ? 'mt-6' : 'mt-8'} ${
              backendStatus === 'connected' 
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200/50 dark:border-green-800/50' 
                : 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200/50 dark:border-blue-800/50'
            } ${isMobile ? 'p-4' : 'p-6'} rounded-2xl ${isMobile ? 'max-w-full' : 'max-w-2xl'} mx-auto border shadow-lg`}>
              <div className="flex items-center justify-center space-x-2 mb-2">
                {backendStatus === 'connected' ? (
                  <>
                    <Server className="w-5 h-5 text-green-500" />
                    <span className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-gray-900 dark:text-white`}>Complete AI Backend Active!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-blue-500" />
                    <span className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-gray-900 dark:text-white`}>Frontend Experience Mode</span>
                  </>
                )}
              </div>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-700 dark:text-gray-300 text-center font-medium`}>
                {backendStatus === 'connected' 
                  ? 'All 6 AI systems are running! Experience quantum optimization, ethical governance, neural prediction, and real-time collaboration.'
                  : 'Explore the revolutionary interface and see how AI development should work. Deploy the backend for complete functionality!'
                }
              </p>
              {backendStatus === 'connected' && (
                <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                  <div className="flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                    <span className="text-green-700 dark:text-green-300">DreamCore Memory</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                    <span className="text-green-700 dark:text-green-300">Nexus Engine</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                    <span className="text-green-700 dark:text-green-300">Aegis Council</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                    <span className="text-green-700 dark:text-green-300">Quantum Optimizer</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                    <span className="text-green-700 dark:text-green-300">Ethical Governance</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                    <span className="text-green-700 dark:text-green-300">Neural Predictor</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className={`${isMobile ? 'mb-8' : 'mb-16'}`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-semibold text-gray-900 dark:text-white tracking-tight`}>
                Quick Start
              </h2>
              
              {/* Popdown Menu Button */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowQuickActionsMenu(!showQuickActionsMenu)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl hover:from-purple-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">Quick Actions</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showQuickActionsMenu ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Popdown Menu */}
                {showQuickActionsMenu && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-semibold text-gray-800 dark:text-white">Quick Actions Menu</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Choose an action to get started</p>
                    </div>
                    
                    <div className="p-2 space-y-1">
                      {quickActions.map((action, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            action.action();
                            setShowQuickActionsMenu(false);
                          }}
                          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                            <action.icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-800 dark:text-white text-sm">
                              {action.title}
                            </h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                              {action.description}
                            </p>
                          </div>
                          <Play className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        </button>
                      ))}
                    </div>
                    
                    <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                      <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                        <span>{quickActions.length} actions available</span>
                        <button
                          onClick={() => setShowQuickActionsMenu(false)}
                          className="text-purple-600 hover:text-purple-700 font-medium"
                        >
                          Close Menu
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Traditional Grid for Mobile/Tablet */}
            {(isMobile || isTablet) && (
              <div 
                ref={quickActionsScroll.elementRef}
                className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-6 pb-4 overflow-y-auto ${isMobile ? 'max-h-64' : 'max-h-96'} relative`}
              >
                {quickActions.slice(0, 4).map((action, index) => (
                  <button
                    key={index}
                    onClick={action.action}
                    className={`${isMobile ? 'p-5' : 'p-6'} bg-gradient-to-br from-white/90 via-blue-50/60 to-purple-50/60 dark:from-gray-800/90 dark:via-blue-950/60 dark:to-purple-950/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-blue-200/50 dark:border-purple-700/50 group cursor-pointer touch-target hover-lift focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  >
                    <action.icon className={`${isMobile ? 'w-7 h-7' : 'w-8 h-8'} text-blue-600 dark:text-purple-400 mx-auto ${isMobile ? 'mb-3' : 'mb-4'} group-hover:text-purple-600 dark:group-hover:text-pink-400 transition-all duration-200 group-hover:scale-110`} />
                    <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-gray-900 dark:text-white mb-2 tracking-tight`}>
                      {action.title}
                    </h3>
                    <p className={`${isMobile ? 'text-sm' : 'text-sm'} text-gray-600 dark:text-gray-400 font-medium group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors`}>
                      {action.description}
                    </p>
                  </button>
                ))}
                
                {/* Auto-scroll indicator */}
                <div className="absolute top-2 right-2 flex items-center space-x-2 bg-gradient-to-r from-white/80 to-blue-50/80 dark:from-gray-800/80 dark:to-purple-950/80 backdrop-blur-xl rounded-full px-3 py-1.5 shadow-lg border border-blue-200/50 dark:border-purple-700/50">
                  <div className={`w-2 h-2 rounded-full ${quickActionsScroll.isPaused ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`} />
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                    {quickActionsScroll.isPaused ? 'Paused' : 'Auto-scrolling'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Command Palette Tip */}
          {onOpenCommandPalette && (
            <div className="mb-8 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">
                💡 Pro Tip: Use the Command Palette
              </h3>
              <p className="text-purple-700 dark:text-purple-300 mb-3">
                Press <kbd className="px-2 py-1 bg-purple-200 dark:bg-purple-800 rounded text-sm font-mono">⌘K</kbd> to open the command palette and quickly access all features.
              </p>
              <button
                onClick={onOpenCommandPalette}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Try Command Palette
              </button>
            </div>
          )}

          {/* Backend Setup Instructions */}
          {backendStatus === 'disconnected' && (
            <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800 shadow-lg">
              <div className="flex items-center space-x-3 mb-4">
                <Server className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                  🚀 Unlock Full AI Power
                </h3>
              </div>
              <p className="text-blue-700 dark:text-blue-300 mb-4 text-sm leading-relaxed">
                Deploy