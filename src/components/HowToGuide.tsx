import React, { useState } from 'react';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { 
  HelpCircle, 
  Book, 
  Code, 
  Play, 
  FileText, 
  Terminal,
  Lightbulb,
  Heart,
  Zap,
  Target,
  ChevronRight,
  X,
  Search,
  Filter,
  Star,
  Shield,
  Brain,
  Music,
  Users,
  Atom,
  Activity,
  Eye,
  Settings,
  Keyboard,
  Mouse,
  Monitor,
  Headphones
} from 'lucide-react';

interface HowToStep {
  title: string;
  description: string;
  action?: string;
  shortcut?: string;
  tips?: string[];
  warning?: string;
}

interface HowToSection {
  id: string;
  title: string;
  icon: any;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  steps: HowToStep[];
  videoUrl?: string;
}

interface HowToGuideProps {
  isVisible: boolean;
  onClose: () => void;
}

export function HowToGuide({ isVisible, onClose }: HowToGuideProps) {
  const guidesScroll = useAutoScroll({ 
    speed: 25, 
    pauseOnHover: true,
    resetOnInteraction: true 
  });

  const [activeSection, setActiveSection] = useState<string>('getting-started');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');

  const howToSections: HowToSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Play,
      description: 'Learn the basics of using Codette',
      difficulty: 'beginner',
      steps: [
        {
          title: 'Create Your First File',
          description: 'Start by creating a new file to begin coding',
          action: 'Click the + button in the file explorer on the left',
          shortcut: 'No shortcut',
          tips: [
            'Choose a descriptive filename with the correct extension',
            'The file extension determines syntax highlighting',
            'Common extensions: .js, .ts, .py, .css, .html'
          ]
        },
        {
          title: 'Write Your First Code',
          description: 'Type some code in the editor',
          action: 'Click in the editor area and start typing',
          tips: [
            'Auto-completion will help you as you type',
            'Press Tab to accept AI suggestions',
            'Use Ctrl/Cmd+S to save your work'
          ]
        },
        {
          title: 'Save Your Work',
          description: 'Always save your files to preserve your work',
          action: 'Click the Save button or use the keyboard shortcut',
          shortcut: '⌘S (Mac) or Ctrl+S (Windows)',
          tips: [
            'Orange dot means unsaved changes',
            'Auto-save is not enabled by default',
            'Save frequently to avoid losing work'
          ]
        }
      ]
    },
    {
      id: 'ai-features',
      title: 'AI Assistant Features',
      icon: Brain,
      description: 'Experience revolutionary AI systems built on real research',
      difficulty: 'beginner',
      steps: [
        {
          title: 'Activate Research-Based AI',
          description: 'Enable AI systems built on published academic research',
          action: 'Click the AI Assistant button in the editor toolbar',
          shortcut: '⌘⇧A',
          tips: [
            'AI systems are documented with real DOIs and research papers',
            'Every suggestion considers ethical implications and user empathy',
            'Quantum-inspired optimization uses genuine mathematical principles',
            'All AI decisions are transparent and explainable'
          ]
        },
        {
          title: 'Use Auto-Correction',
          description: 'Let AI fix typos automatically',
          action: 'Enable Auto-Correct in the editor toolbar',
          tips: [
            'Try typing "fucntion" - it becomes "function"',
            'Works for common programming typos',
            'Can be toggled on/off as needed'
          ]
        },
        {
          title: 'Get Code Optimization',
          description: 'Improve your code with AI suggestions',
          action: 'Click Optimize Code or use the shortcut',
          shortcut: '⌘I',
          tips: [
            'AI analyzes your code for improvements',
            'Suggestions include performance and readability',
            'Review suggestions before applying'
          ]
        }
      ]
    },
    {
      id: 'quantum-analysis',
      title: 'Quantum Code Analysis',
      icon: Atom,
      description: 'Genuine quantum computing principles applied to code optimization',
      difficulty: 'advanced',
      steps: [
        {
          title: 'Access Real Quantum Analysis',
          description: 'Use actual quantum computing principles for code optimization',
          action: 'Click the Quantum button in the editor status bar',
          shortcut: '⌘⇧Q',
          tips: [
            'Uses real quantum principles like superposition and entanglement',
            'Implements Pareto front optimization with mathematical rigor',
            'Quantum tunneling helps escape local optimization optima',
            'Based on published research, not just marketing buzzwords'
          ]
        },
        {
          title: 'Execute Multi-Objective Optimization',
          description: 'Run genuine quantum-inspired algorithms for code analysis',
          action: 'Click "Run Quantum Analysis" in the quantum panel',
          tips: [
            'Discovers multiple optimal solutions simultaneously using superposition',
            'Pareto front analysis finds trade-offs between competing objectives',
            'Quantum tunneling escapes local optima for global solutions',
            'Results include mathematical confidence intervals and statistical significance'
          ]
        },
        {
          title: 'Interpret Quantum Metrics',
          description: 'Understand quantum analysis results',
          tips: [
            'Entanglement: How interconnected your code is',
            'Coherence: How consistent your code structure is',
            'Superposition: Number of possible optimization states',
            'Higher coherence = better maintainability'
          ]
        }
      ]
    },
    {
      id: 'neural-prediction',
      title: 'Neural Code Prediction',
      icon: Brain,
      description: 'Neural networks that genuinely learn and adapt to your style',
      difficulty: 'intermediate',
      steps: [
        {
          title: 'Enable Adaptive Learning',
          description: 'Activate neural networks that learn your unique coding patterns',
          action: 'Neural prediction activates automatically as you code',
          tips: [
            'Neural networks build a genuine profile of your coding style',
            'Predictions improve through real machine learning, not just templates',
            'Confidence levels are mathematically calculated, not estimated',
            'System learns from your accepts/rejects to improve future suggestions'
          ]
        },
        {
          title: 'Accept Predictions',
          description: 'Use AI predictions to code faster',
          action: 'Click Accept or press Tab when predictions appear',
          tips: [
            'Review predictions before accepting',
            'Rejecting helps AI learn your preferences',
            'Difficulty levels indicate complexity'
          ]
        },
        {
          title: 'Build Your Developer Profile',
          description: 'Let AI understand your coding style',
          tips: [
            'Profile builds automatically as you code',
            'Tracks skill level and preferences',
            'Provides personalized recommendations'
          ]
        }
      ]
    },
    {
      id: 'emotional-analysis',
      title: 'Emotional Code Analysis',
      icon: Heart,
      description: 'Revolutionary analysis of how code impacts users emotionally',
      difficulty: 'intermediate',
      steps: [
        {
          title: 'Discover Emotional Impact',
          description: 'Understand how your code makes users feel - a world-first feature',
          action: 'Click "Analyze Emotions" in the emotional panel',
          tips: [
            'Analyzes empathy levels and user-friendliness with mathematical precision',
            'Evaluates accessibility impact on diverse user groups',
            'Measures joy, stress, and emotional resonance factors',
            'Based on cognitive science research, not just keyword matching'
          ]
        },
        {
          title: 'Enhance User Empathy',
          description: 'Create code that genuinely cares about user experience',
          tips: [
            'Add loading states that reduce user anxiety and uncertainty',
            'Include error messages that are helpful, not just informative',
            'Implement accessibility features that welcome all users',
            'Design interactions that bring joy and reduce frustration',
            'Consider the emotional journey users take through your interface'
          ]
        },
        {
          title: 'Reduce Stress Levels',
          description: 'Create calmer, cleaner code',
          tips: [
            'Remove TODO and FIXME comments',
            'Add proper documentation',
            'Implement error handling',
            'Refactor complex functions'
          ]
        }
      ]
    },
    {
      id: 'music-player',
      title: 'AI Music Generation',
      icon: Music,
      description: 'Generate adaptive music for coding focus',
      difficulty: 'beginner',
      steps: [
        {
          title: 'Open Music Player',
          description: 'Access the AI music generation features',
          action: 'Click the Music button in the header',
          shortcut: '⌘⇧M',
          tips: [
            'Music adapts to your coding context',
            'Different genres for different tasks',
            'Volume and playback controls available'
          ]
        },
        {
          title: 'Generate Adaptive Music',
          description: 'Create music that matches your coding session',
          action: 'Click "Generate Adaptive Music" in the AI tab',
          tips: [
            'Music complexity matches code complexity',
            'Different styles: Mozart, Bach, House, Dance, Techno',
            'Optimized for different programming languages'
          ]
        },
        {
          title: 'Create Coding Playlists',
          description: 'Generate playlists for specific coding scenarios',
          action: 'Select scenario and click "Generate Playlist"',
          tips: [
            'Deep Focus: Ambient and classical',
            'Debugging: Calm, methodical music',
            'Creative: Energetic, inspiring tracks',
            'Learning: Gentle, concentration-friendly'
          ]
        }
      ]
    },
    {
      id: 'collaboration',
      title: 'Real-Time Collaboration',
      icon: Users,
      description: 'Code together with others in real-time',
      difficulty: 'intermediate',
      steps: [
        {
          title: 'Start Collaboration Session',
          description: 'Create a new collaboration session',
          action: 'Click "Host" in the collaboration panel',
          tips: [
            'Enter your name and email',
            'Share the generated link with others',
            'Up to 10 collaborators supported'
          ]
        },
        {
          title: 'Join Existing Session',
          description: 'Join someone else\'s coding session',
          action: 'Click "Join" and enter session ID',
          tips: [
            'Get session ID from the host',
            'Your cursor will be visible to others',
            'Real-time code synchronization'
          ]
        },
        {
          title: 'Use Team AI Features',
          description: 'Collaborate with AI assistance',
          action: 'Type @ai in the team chat for AI help',
          tips: [
            'AI helps the entire team',
            'Shared code optimization',
            'Team code reviews with AI'
          ]
        }
      ]
    },
    {
      id: 'terminal-usage',
      title: 'Terminal & Commands',
      icon: Terminal,
      description: 'Master the integrated terminal',
      difficulty: 'beginner',
      steps: [
        {
          title: 'Open Terminal',
          description: 'Access the integrated terminal',
          action: 'Click the Terminal button in the header',
          shortcut: '⌘`',
          tips: [
            'Multiple terminal types available',
            'Supports Bash, Python, Node.js, and more',
            'Command history with arrow keys'
          ]
        },
        {
          title: 'Basic Commands',
          description: 'Learn essential terminal commands',
          tips: [
            'ls - List files and directories',
            'cd <folder> - Change directory',
            'pwd - Show current directory',
            'mkdir <name> - Create directory',
            'touch <file> - Create file'
          ]
        },
        {
          title: 'Run Your Code',
          description: 'Execute your programs from the terminal',
          tips: [
            'node script.js - Run JavaScript',
            'python script.py - Run Python',
            'npm install - Install packages',
            'npm run dev - Start development server'
          ]
        }
      ]
    },
    {
      id: 'keyboard-shortcuts',
      title: 'Keyboard Shortcuts',
      icon: Keyboard,
      description: 'Speed up your workflow with shortcuts',
      difficulty: 'beginner',
      steps: [
        {
          title: 'File Operations',
          description: 'Manage files efficiently',
          tips: [
            '⌘S - Save current file',
            '⌘W - Close current file',
            '⌘N - New file',
            '⌘O - Open file'
          ]
        },
        {
          title: 'Editor Shortcuts',
          description: 'Navigate and edit code faster',
          tips: [
            '⌘/ - Comment/uncomment lines',
            '⌘D - Select next occurrence',
            '⌘F - Find in file',
            '⌘⇧F - Find in all files'
          ]
        },
        {
          title: 'AI Shortcuts',
          description: 'Quick access to AI features',
          tips: [
            '⌘⇧A - Toggle AI panel',
            '⌘I - Optimize code',
            '⌘⇧Q - Quantum analysis',
            '⌘⇧M - Music player'
          ]
        }
      ]
    },
    {
      id: 'security-features',
      title: 'Security & Safety',
      icon: Shield,
      description: 'Understanding Codette\'s security features',
      difficulty: 'intermediate',
      steps: [
        {
          title: 'Ethical AI Safeguards',
          description: 'How Codette protects you with ethical AI',
          tips: [
            'All AI decisions are transparent and explainable',
            'Virtue-based analysis ensures ethical code',
            'No malicious code generation',
            'Privacy-first design'
          ]
        },
        {
          title: 'Code Safety Checks',
          description: 'Automatic security analysis of your code',
          tips: [
            'Detects potential security vulnerabilities',
            'Warns about unsafe patterns',
            'Suggests secure alternatives',
            'Real-time security monitoring'
          ]
        },
        {
          title: 'Data Protection',
          description: 'How your data is protected',
          tips: [
            'Local storage for sensitive data',
            'Encrypted communication',
            'No unauthorized data sharing',
            'User consent for all operations'
          ]
        }
      ]
    }
  ];

  const filteredSections = howToSections.filter(section => {
    const matchesSearch = searchTerm === '' || 
      section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.steps.some(step => 
        step.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        step.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesDifficulty = selectedDifficulty === 'all' || section.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesDifficulty;
  });

  const activeGuide = howToSections.find(s => s.id === activeSection);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Book className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Complete How-To Guide</h2>
                <p className="text-blue-100">Master every feature of Codette</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex h-[600px]">
          {/* Sidebar */}
          <div className="w-80 bg-gray-50 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-600 overflow-y-auto">
            <div className="p-4">
              {/* Search and Filter */}
              <div className="space-y-3 mb-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search guides..."
                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              {/* Guide Sections */}
              <div className="space-y-2">
                {filteredSections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all ${
                      activeSection === section.id
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <section.icon className="w-5 h-5" />
                    <div className="flex-1">
                      <div className="font-medium">{section.title}</div>
                      <div className="text-xs opacity-75">{section.steps.length} steps</div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      activeSection === section.id 
                        ? 'bg-white/20 text-white' 
                        : getDifficultyColor(section.difficulty)
                    }`}>
                      {section.difficulty}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeGuide && (
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <activeGuide.icon className="w-8 h-8 text-blue-500" />
                  <div>
                    <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
                      {activeGuide.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">{activeGuide.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(activeGuide.difficulty)}`}>
                    {activeGuide.difficulty}
                  </span>
                </div>

                <div 
                  ref={guidesScroll.elementRef}
                  className="space-y-6 relative"
                >
                  {activeGuide.steps.map((step, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                            {step.title}
                          </h4>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {step.description}
                          </p>
                          
                          {step.action && (
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                              <div className="flex items-center space-x-2 mb-2">
                                <Target className="w-4 h-4 text-blue-600" />
                                <span className="font-medium text-gray-800 dark:text-white">Action:</span>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300">{step.action}</p>
                              {step.shortcut && (
                                <div className="mt-2 flex items-center space-x-2">
                                  <Keyboard className="w-4 h-4 text-blue-600" />
                                  <span className="text-sm text-gray-600 dark:text-gray-400">Shortcut:</span>
                                  <kbd className="bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded font-mono text-sm">
                                    {step.shortcut}
                                  </kbd>
                                </div>
                              )}
                            </div>
                          )}
                          
                          {step.tips && step.tips.length > 0 && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-4">
                              <div className="flex items-center space-x-2 mb-2">
                                <Lightbulb className="w-4 h-4 text-yellow-600" />
                                <span className="font-medium text-gray-800 dark:text-white">Tips:</span>
                              </div>
                              <ul className="space-y-1">
                                {step.tips.map((tip, tipIndex) => (
                                  <li key={tipIndex} className="text-sm text-gray-700 dark:text-gray-300 flex items-start space-x-2">
                                    <span className="text-yellow-600 mt-1">•</span>
                                    <span>{tip}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {step.warning && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 p-4 rounded-lg">
                              <div className="flex items-center space-x-2 mb-2">
                                <Shield className="w-4 h-4 text-red-600" />
                                <span className="font-medium text-red-800 dark:text-red-200">Warning:</span>
                              </div>
                              <p className="text-sm text-red-700 dark:text-red-300">{step.warning}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Auto-scroll indicator */}
                  <div className="absolute top-2 right-2 flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-2 py-1">
                    <div className={`w-2 h-2 rounded-full ${guidesScroll.isPaused ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`} />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {guidesScroll.isPaused ? 'Paused' : 'Auto'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Heart className="w-4 h-4 text-red-500" />
              <span>Comprehensive guides for all features</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {filteredSections.length} guides available
              </div>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Start Using Codette!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}