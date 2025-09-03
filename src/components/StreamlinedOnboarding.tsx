import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Brain, 
  Sparkles, 
  Code, 
  Music,
  Shield,
  Atom,
  Play,
  ChevronRight,
  Star,
  Zap,
  Eye,
  Target,
  CheckCircle,
  ArrowRight,
  Lightbulb,
  Trophy,
  Crown,
  Award
} from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: any;
  action: () => void;
  completed: boolean;
  category: 'essential' | 'ai' | 'creative' | 'advanced';
}

interface StreamlinedOnboardingProps {
  isVisible: boolean;
  onComplete: () => void;
  onCreateFile: (name: string, type: 'file' | 'folder') => void;
  onToggleAI: () => void;
  onToggleMusic: () => void;
  onShowEthicalAI: () => void;
}

export function StreamlinedOnboarding({ 
  isVisible, 
  onComplete, 
  onCreateFile, 
  onToggleAI, 
  onToggleMusic,
  onShowEthicalAI 
}: StreamlinedOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [showCelebration, setShowCelebration] = useState(false);

  const onboardingSteps: OnboardingStep[] = [
    {
      id: 'create-first-file',
      title: 'Create Your First File',
      description: 'Start your coding journey by creating a simple JavaScript file',
      icon: Code,
      action: () => {
        onCreateFile('hello-world.js', 'file');
        markStepCompleted('create-first-file');
      },
      completed: false,
      category: 'essential'
    },
    {
      id: 'meet-ai-assistant',
      title: 'Meet Your AI Assistant',
      description: 'Discover Codette\'s revolutionary AI systems built on real research',
      icon: Brain,
      action: () => {
        onToggleAI();
        markStepCompleted('meet-ai-assistant');
      },
      completed: false,
      category: 'ai'
    },
    {
      id: 'try-music-player',
      title: 'Experience AI Music',
      description: 'Generate adaptive music that enhances your coding flow',
      icon: Music,
      action: () => {
        onToggleMusic();
        markStepCompleted('try-music-player');
      },
      completed: false,
      category: 'creative'
    },
    {
      id: 'explore-ethical-ai',
      title: 'Explore Ethical AI',
      description: 'See how virtue-driven AI ensures responsible development',
      icon: Shield,
      action: () => {
        onShowEthicalAI();
        markStepCompleted('explore-ethical-ai');
      },
      completed: false,
      category: 'ai'
    }
  ];

  const markStepCompleted = (stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
    
    if (completedSteps.size + 1 >= onboardingSteps.length) {
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        onComplete();
      }, 3000);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'essential': return 'from-blue-500 to-cyan-600';
      case 'ai': return 'from-purple-500 to-pink-600';
      case 'creative': return 'from-green-500 to-emerald-600';
      case 'advanced': return 'from-orange-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'essential': return <Code className="w-4 h-4" />;
      case 'ai': return <Brain className="w-4 h-4" />;
      case 'creative': return <Sparkles className="w-4 h-4" />;
      case 'advanced': return <Atom className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-900/90 via-blue-900/90 to-indigo-900/90 backdrop-blur-xl flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-white/95 via-purple-50/80 to-blue-50/80 dark:from-gray-800/95 dark:via-purple-950/80 dark:to-blue-950/80 backdrop-blur-xl rounded-3xl shadow-2xl max-w-4xl w-full border border-purple-200/50 dark:border-purple-700/50">
        {/* Header */}
        <div className="p-8 text-center border-b border-purple-200/50 dark:border-purple-700/50">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-pink-600 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl animate-pulse">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Welcome to the Future of Coding! 🚀
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            You're about to experience the world's first <span className="font-bold text-purple-600">virtue-driven</span>, 
            <span className="font-bold text-blue-600"> emotionally intelligent</span> development environment. 
            Let's get you started with a quick tour of the revolutionary features!
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="p-6 border-b border-purple-200/50 dark:border-purple-700/50">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Progress: {completedSteps.size} of {onboardingSteps.length} steps
            </span>
            <span className="text-sm font-bold text-purple-600">
              {Math.round((completedSteps.size / onboardingSteps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(completedSteps.size / onboardingSteps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Onboarding Steps */}
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {onboardingSteps.map((step, index) => {
              const isCompleted = completedSteps.has(step.id);
              const isCurrent = index === currentStep;
              
              return (
                <div
                  key={step.id}
                  className={`relative p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer hover:scale-105 ${
                    isCompleted
                      ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-300 dark:border-green-600 shadow-lg shadow-green-500/20'
                      : isCurrent
                      ? `bg-gradient-to-br ${getCategoryColor(step.category)}/10 border-purple-300 dark:border-purple-600 shadow-xl shadow-purple-500/20`
                      : 'bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-950/20 border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-600'
                  }`}
                  onClick={step.action}
                >
                  {/* Category Badge */}
                  <div className={`absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br ${getCategoryColor(step.category)} rounded-full flex items-center justify-center shadow-lg`}>
                    {getCategoryIcon(step.category)}
                  </div>

                  {/* Completion Badge */}
                  {isCompleted && (
                    <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  )}

                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
                      isCompleted
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                        : `bg-gradient-to-br ${getCategoryColor(step.category)}`
                    }`}>
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                        {step.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          isCompleted
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                        }`}>
                          {isCompleted ? 'Completed!' : step.category}
                        </span>
                        
                        {!isCompleted && (
                          <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400">
                            <span className="text-sm font-medium">Try it!</span>
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Special Features Highlight */}
          <div className="mt-8 bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-red-900/20 p-6 rounded-2xl border border-yellow-200/50 dark:border-yellow-700/50">
            <div className="flex items-center space-x-3 mb-4">
              <Crown className="w-8 h-8 text-yellow-600" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                What Makes Codette Revolutionary
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                <Atom className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-bold text-gray-800 dark:text-white mb-1">Real Quantum AI</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Genuine quantum-inspired algorithms with published research (DOI: 10.5281/zenodo.16388758)
                </p>
              </div>
              <div className="text-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                <Heart className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                <h4 className="font-bold text-gray-800 dark:text-white mb-1">Emotional Intelligence</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  World-first analysis of how your code affects users emotionally
                </p>
              </div>
              <div className="text-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl">
                <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-bold text-gray-800 dark:text-white mb-1">Virtue-Driven AI</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Every AI decision considers compassion, integrity, wisdom, and courage
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mt-8">
            <button
              onClick={() => {
                setCompletedSteps(new Set(onboardingSteps.map(s => s.id)));
                onComplete();
              }}
              className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-medium"
            >
              Skip Tour
            </button>
            <button
              onClick={() => {
                if (completedSteps.size >= onboardingSteps.length) {
                  onComplete();
                } else {
                  // Guide to next uncompleted step
                  const nextStep = onboardingSteps.find(s => !completedSteps.has(s.id));
                  if (nextStep) {
                    setCurrentStep(onboardingSteps.indexOf(nextStep));
                  }
                }
              }}
              className="px-8 py-3 bg-gradient-to-r from-purple-500 via-pink-600 to-blue-600 text-white rounded-xl hover:from-purple-600 hover:via-pink-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 font-bold"
            >
              {completedSteps.size >= onboardingSteps.length ? 'Start Coding!' : 'Continue Tour'}
            </button>
          </div>
        </div>

        {/* Celebration Overlay */}
        {showCelebration && (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20 backdrop-blur-sm rounded-3xl flex items-center justify-center">
            <div className="text-center animate-bounce">
              <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
                Congratulations! 🎉
              </h2>
              <p className="text-xl text-gray-800 dark:text-white">
                You're ready to experience the future of coding!
              </p>
            </div>
            
            {/* Confetti Effect */}
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="absolute animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${1 + Math.random()}s`
                }}
              >
                {['🎉', '⭐', '🚀', '💎', '🔥'][Math.floor(Math.random() * 5)]}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}