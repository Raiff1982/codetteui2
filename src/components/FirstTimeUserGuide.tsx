import React, { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { 
  Lightbulb, 
  X, 
  ChevronRight, 
  ChevronLeft,
  Play,
  BookOpen,
  Code,
  Terminal,
  Brain,
  Sparkles,
  Heart,
  Zap
} from 'lucide-react';

interface FirstTimeUserGuideProps {
  isFirstTime: boolean;
  onComplete: () => void;
}

export function FirstTimeUserGuide({ isFirstTime, onComplete }: FirstTimeUserGuideProps) {
  const [runTour, setRunTour] = useState(false);
  const [showWelcome, setShowWelcome] = useState(isFirstTime);
  const [currentStep, setCurrentStep] = useState(0);

  const tourSteps: Step[] = [
    {
      target: '.file-explorer',
      content: (
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <BookOpen className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-gray-800">File Explorer</h3>
          </div>
          <p className="text-gray-600 mb-3">
            This is where you manage your files and folders. Click the + button to create new files, 
            or right-click for more options.
          </p>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Tip:</strong> You can drag and drop files to organize them!
            </p>
          </div>
        </div>
      ),
      placement: 'right',
      disableBeacon: true
    },
    {
      target: '.editor-area',
      content: (
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Code className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold text-gray-800">Code Editor</h3>
          </div>
          <p className="text-gray-600 mb-3">
            This is your main coding area with syntax highlighting, auto-completion, and AI assistance.
          </p>
          <div className="space-y-2">
            <div className="bg-green-50 p-2 rounded text-sm text-green-800">
              <strong>⌘S</strong> - Save your file
            </div>
            <div className="bg-green-50 p-2 rounded text-sm text-green-800">
              <strong>⌘I</strong> - AI code optimization
            </div>
          </div>
        </div>
      ),
      placement: 'left'
    },
    {
      target: '.language-badges',
      content: (
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <h3 className="font-semibold text-gray-800">Language Features</h3>
          </div>
          <p className="text-gray-600 mb-3">
            These badges show your current language and available features:
          </p>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm">Language detection and syntax highlighting</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm">LSP - Intelligent code completion</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm">AI - Smart assistance and optimization</span>
            </div>
          </div>
        </div>
      ),
      placement: 'bottom'
    },
    {
      target: '.ai-panel-toggle',
      content: (
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Brain className="w-5 h-5 text-purple-500" />
            <h3 className="font-semibold text-gray-800">AI Assistant</h3>
          </div>
          <p className="text-gray-600 mb-3">
            Click here to open the AI panel with quantum optimization, code analysis, and intelligent suggestions.
          </p>
          <div className="bg-purple-50 p-3 rounded-lg">
            <p className="text-sm text-purple-800">
              🧠 <strong>Pro Tip:</strong> Use <kbd className="bg-purple-200 px-2 py-1 rounded">⌘⇧A</kbd> to quickly toggle the AI panel!
            </p>
          </div>
        </div>
      ),
      placement: 'bottom'
    },
    {
      target: '.terminal-toggle',
      content: (
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Terminal className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold text-gray-800">Integrated Terminal</h3>
          </div>
          <p className="text-gray-600 mb-3">
            Access a full terminal right in your editor. Run commands, install packages, and manage your project.
          </p>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm text-green-800">
              ⚡ <strong>Quick Access:</strong> Press <kbd className="bg-green-200 px-2 py-1 rounded">⌘`</kbd> to toggle the terminal!
            </p>
          </div>
        </div>
      ),
      placement: 'bottom'
    }
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type, index } = data;
    
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRunTour(false);
      onComplete();
    }
    
    if (type === 'step:after') {
      setCurrentStep(index + 1);
    }
  };

  const startTour = () => {
    setShowWelcome(false);
    setRunTour(true);
  };

  const skipTour = () => {
    setShowWelcome(false);
    setRunTour(false);
    onComplete();
  };

  return (
    <>
      {/* Welcome Modal */}
      {showWelcome && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-2xl w-full shadow-2xl animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                Welcome to Codette! 🎉
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Your AI-powered coding companion designed to make programming 
                <span className="text-purple-600 font-semibold"> fun, intuitive, and accessible</span> for everyone.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl">
                <div className="flex items-center space-x-3 mb-3">
                  <Brain className="w-6 h-6 text-blue-600" />
                  <h3 className="font-semibold text-gray-800 dark:text-white">AI-Powered</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Smart code completion, auto-correction, and optimization powered by advanced AI models.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl">
                <div className="flex items-center space-x-3 mb-3">
                  <Code className="w-6 h-6 text-green-600" />
                  <h3 className="font-semibold text-gray-800 dark:text-white">40+ Languages</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Full support for JavaScript, Python, Java, C++, Rust, and many more programming languages.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl">
                <div className="flex items-center space-x-3 mb-3">
                  <Zap className="w-6 h-6 text-purple-600" />
                  <h3 className="font-semibold text-gray-800 dark:text-white">Beginner Friendly</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Built-in tutorials, helpful tooltips, and gentle guidance for coding newcomers.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-xl">
                <div className="flex items-center space-x-3 mb-3">
                  <Terminal className="w-6 h-6 text-orange-600" />
                  <h3 className="font-semibold text-gray-800 dark:text-white">Professional Tools</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Integrated terminal, file management, and all the tools you need for serious development.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl mb-8">
              <div className="flex items-center space-x-3 mb-3">
                <Lightbulb className="w-6 h-6 text-yellow-500" />
                <h3 className="font-semibold text-gray-800 dark:text-white">New to Coding?</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Don't worry! Codette is designed to help you learn. We'll guide you through the interface 
                and show you how to write your first program.
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-300">Auto-correction for typos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-300">Smart code suggestions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-300">Helpful explanations</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={skipTour}
                className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors font-medium"
              >
                Skip Tour
              </button>
              <button
                onClick={startTour}
                className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
              >
                <Play className="w-5 h-5" />
                <span>Start Interactive Tour</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Tour */}
      <Joyride
        steps={tourSteps}
        run={runTour}
        continuous={true}
        showProgress={true}
        showSkipButton={true}
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: '#8b5cf6',
            backgroundColor: '#ffffff',
            textColor: '#374151',
            overlayColor: 'rgba(0, 0, 0, 0.4)',
            spotlightShadow: '0 0 15px rgba(0, 0, 0, 0.5)',
            beaconSize: 36,
            zIndex: 1000
          },
          tooltip: {
            borderRadius: 12,
            fontSize: 14,
            padding: 0
          },
          tooltipContainer: {
            textAlign: 'left'
          },
          tooltipTitle: {
            fontSize: 18,
            fontWeight: 600,
            color: '#1f2937'
          },
          tooltipContent: {
            padding: '12px 0'
          },
          buttonNext: {
            backgroundColor: '#8b5cf6',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 600,
            padding: '12px 24px'
          },
          buttonBack: {
            color: '#6b7280',
            fontSize: 14,
            fontWeight: 600,
            padding: '12px 24px'
          },
          buttonSkip: {
            color: '#6b7280',
            fontSize: 14,
            fontWeight: 600
          },
          beacon: {
            backgroundColor: '#8b5cf6'
          }
        }}
        locale={{
          back: 'Previous',
          close: 'Close',
          last: 'Finish Tour',
          next: 'Next',
          skip: 'Skip Tour'
        }}
      />
    </>
  );
}