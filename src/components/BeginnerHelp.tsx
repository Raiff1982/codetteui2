import React, { useState } from 'react';
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
  Shield,
  Music,
  Users,
  Atom,
  Brain,
  Activity,
  Eye,
  Settings,
  Keyboard
} from 'lucide-react';

interface BeginnerHelpProps {
  isVisible: boolean;
  onClose: () => void;
}

export function BeginnerHelp({ isVisible, onClose }: BeginnerHelpProps) {
  const [activeSection, setActiveSection] = useState<'basics' | 'first-code' | 'shortcuts' | 'ai-help' | 'security' | 'advanced'>('basics');

  if (!isVisible) return null;

  const sections = {
    basics: {
      title: 'Coding Basics',
      icon: Book,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl">
            <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span>What is Programming?</span>
            </h4>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              Programming is like giving instructions to a computer. Just like you might write a recipe 
              for cooking, you write code to tell the computer what to do step by step. But with Codette, 
              you're not alone - you have an intelligent, ethical AI companion that genuinely cares about 
              helping you learn and grow.
            </p>
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <p className="text-sm text-purple-800 dark:text-purple-200">
                <strong>What makes Codette special:</strong> Unlike other tools that just check syntax, 
                Codette's AI considers how your code affects users emotionally, follows ethical principles, 
                and helps you become not just a better programmer, but a more thoughtful developer.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h5 className="font-medium text-gray-800 dark:text-white mb-2">Variables</h5>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Think of variables as labeled boxes that store information.
              </p>
              <code className="text-xs bg-green-100 dark:bg-green-800 p-2 rounded block">
                let name = "Alice";<br/>
                let age = 25;
              </code>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h5 className="font-medium text-gray-800 dark:text-white mb-2">Functions</h5>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Functions are like mini-programs that do specific tasks.
              </p>
              <code className="text-xs bg-blue-100 dark:bg-blue-800 p-2 rounded block">
                function sayHello() {`{`}<br/>
                &nbsp;&nbsp;console.log("Hello!");<br/>
                {`}`}
              </code>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <h5 className="font-medium text-gray-800 dark:text-white mb-2">Conditions</h5>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Make decisions in your code with if statements.
              </p>
              <code className="text-xs bg-purple-100 dark:bg-purple-800 p-2 rounded block">
                if (age &gt;= 18) {`{`}<br/>
                &nbsp;&nbsp;console.log("Adult");<br/>
                {`}`}
              </code>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              <h5 className="font-medium text-gray-800 dark:text-white mb-2">Loops</h5>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Repeat actions multiple times automatically.
              </p>
              <code className="text-xs bg-orange-100 dark:bg-orange-800 p-2 rounded block">
                for (let i = 0; i &lt; 5; i++) {`{`}<br/>
                &nbsp;&nbsp;console.log(i);<br/>
                {`}`}
              </code>
            </div>
          </div>
        </div>
      )
    },
    'first-code': {
      title: 'Your First Program',
      icon: Code,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl">
            <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center space-x-2">
              <Play className="w-5 h-5 text-green-500" />
              <span>Let's Write Your First Program!</span>
            </h4>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Follow these steps to create your first "Hello World" program:
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">Create a new file</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Click the + button in the file explorer and name it "hello.js"</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">Type this code</p>
                  <div className="bg-gray-800 text-green-400 p-3 rounded-lg mt-2 font-mono text-sm">
                    console.log("Hello, World!");
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <p className="font-medium text-gray-800 dark:text-white">Save and run</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Press ⌘S to save, then open the terminal and type "node hello.js"</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              <h5 className="font-medium text-gray-800 dark:text-white">What does this do?</h5>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <code>console.log()</code> is like the computer's way of talking to you. 
              It prints messages that you can see, which is perfect for learning and debugging!
            </p>
          </div>
        </div>
      )
    },
    shortcuts: {
      title: 'Keyboard Shortcuts',
      icon: Zap,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Learn these shortcuts to code faster and more efficiently:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { keys: '⌘S', desc: 'Save current file', category: 'essential' },
              { keys: '⌘`', desc: 'Toggle terminal', category: 'essential' },
              { keys: '⌘⇧A', desc: 'Toggle AI panel', category: 'ai' },
              { keys: '⌘I', desc: 'AI code optimization', category: 'ai' },
              { keys: '⌘K', desc: 'Search files', category: 'navigation' },
              { keys: '⌘T', desc: 'Toggle theme', category: 'interface' },
              { keys: '⌘⇧L', desc: 'Language selector', category: 'coding' },
              { keys: '⌘/', desc: 'Comment/uncomment', category: 'coding' }
            ].map((shortcut, index) => (
              <div key={index} className={`p-3 rounded-lg ${
                shortcut.category === 'essential' ? 'bg-red-50 dark:bg-red-900/20' :
                shortcut.category === 'ai' ? 'bg-purple-50 dark:bg-purple-900/20' :
                shortcut.category === 'navigation' ? 'bg-blue-50 dark:bg-blue-900/20' :
                shortcut.category === 'coding' ? 'bg-green-50 dark:bg-green-900/20' :
                'bg-gray-50 dark:bg-gray-700'
              }`}>
                <div className="flex items-center justify-between">
                  <kbd className="bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded font-mono text-sm">
                    {shortcut.keys}
                  </kbd>
                  <span className="text-sm text-gray-600 dark:text-gray-300 ml-3">
                    {shortcut.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    'ai-help': {
      title: 'AI Features',
      icon: Target,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-xl">
            <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center space-x-2">
              <Target className="w-5 h-5 text-purple-500" />
              <span>Revolutionary AI Partnership!</span>
            </h4>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              This isn't just autocomplete or syntax checking - Codette's AI systems are built on genuine research 
              and designed to be your intelligent, ethical coding partner. Every suggestion considers not just 
              correctness, but empathy, accessibility, and user impact.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <p className="text-xs text-blue-800 dark:text-blue-200">
                <strong>Research-Backed:</strong> Our AI systems are documented in real academic papers with DOIs, 
                not just marketing claims. You're experiencing genuine innovation in AI-assisted development.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h5 className="font-medium text-gray-800 dark:text-white mb-2 flex items-center space-x-2">
                <Lightbulb className="w-4 h-4 text-blue-500" />
                <span>Smart Suggestions</span>
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                As you type, the AI suggests what you might want to write next. Just press Tab to accept!
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h5 className="font-medium text-gray-800 dark:text-white mb-2 flex items-center space-x-2">
                <Zap className="w-4 h-4 text-green-500" />
                <span>Auto-Correction</span>
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Typos are automatically fixed! Try typing "fucntion" and watch it become "function".
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <h5 className="font-medium text-gray-800 dark:text-white mb-2 flex items-center space-x-2">
                <Target className="w-4 h-4 text-purple-500" />
                <span>Code Optimization</span>
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                The AI can make your code faster and cleaner. Press ⌘I to optimize your code!
              </p>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
              <h5 className="font-medium text-gray-800 dark:text-white mb-2 flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-orange-500" />
                <span>Explanations</span>
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Hover over any code element to get explanations of what it does. Perfect for learning!
              </p>
            </div>
          </div>
        </div>
      )
    },
    security: {
      title: 'Safety & Security',
      icon: Shield,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-6 rounded-xl">
            <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center space-x-2">
              <Shield className="w-5 h-5 text-red-500" />
              <span>Your Safety is Our Priority!</span>
            </h4>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Codette has built-in security features to protect you while coding. We scan your code 
              for security issues and help you write safe, secure programs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h5 className="font-medium text-gray-800 dark:text-white mb-2">Automatic Protection</h5>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Codette automatically scans your code for security problems.
              </p>
              <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                <li>• Detects unsafe code patterns</li>
                <li>• Blocks malicious operations</li>
                <li>• Protects your personal data</li>
                <li>• Auto-fixes common issues</li>
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h5 className="font-medium text-gray-800 dark:text-white mb-2">What We Protect</h5>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                We keep you safe from common security risks.
              </p>
              <ul className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                <li>• XSS (Cross-site scripting)</li>
                <li>• Code injection attacks</li>
                <li>• Data leaks and exposure</li>
                <li>• Malicious code execution</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              <h5 className="font-medium text-gray-800 dark:text-white">Security Tips for Beginners</h5>
            </div>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
              <li>• Never put passwords or secrets directly in your code</li>
              <li>• Always validate user input before using it</li>
              <li>• Use HTTPS for all web requests</li>
              <li>• Keep your dependencies updated</li>
              <li>• Let Codette's AI help you write secure code</li>
            </ul>
          </div>
        </div>
      )
    },
    advanced: {
      title: 'Advanced Features',
      icon: Brain,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-xl">
            <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center space-x-2">
              <Brain className="w-5 h-5 text-purple-500" />
              <span>Revolutionary AI Features!</span>
            </h4>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Codette includes world-first AI technologies that make coding more intelligent, 
              ethical, and enjoyable. These features are unique to Codette!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <h5 className="font-medium text-gray-800 dark:text-white mb-2 flex items-center space-x-2">
                <Atom className="w-4 h-4 text-purple-600" />
                <span>Quantum Analysis</span>
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Uses quantum computing principles to analyze your code.
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Press ⌘⇧Q to open quantum analyzer
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h5 className="font-medium text-gray-800 dark:text-white mb-2 flex items-center space-x-2">
                <Brain className="w-4 h-4 text-blue-600" />
                <span>Neural Prediction</span>
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                AI learns your coding style and predicts what you'll type next.
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Automatically active while coding
              </p>
            </div>

            <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-lg">
              <h5 className="font-medium text-gray-800 dark:text-white mb-2 flex items-center space-x-2">
                <Heart className="w-4 h-4 text-pink-600" />
                <span>Emotional Analysis</span>
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Analyzes how your code makes users feel emotionally.
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Available in Ultimate AI panel
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h5 className="font-medium text-gray-800 dark:text-white mb-2 flex items-center space-x-2">
                <Music className="w-4 h-4 text-green-600" />
                <span>AI Music Generation</span>
              </h5>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Generates adaptive music that matches your coding session.
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Press ⌘⇧M to open music player
              </p>
            </div>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Beginner's Guide</h2>
                <p className="text-blue-100">Learn to code with Codette</p>
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

        <div className="flex h-96">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 dark:bg-gray-700 border-r border-gray-200 dark:border-gray-600">
            <div className="p-4 space-y-2">
              {Object.entries(sections).map(([key, section]) => (
                <button
                  key={key}
                  onClick={() => setActiveSection(key as any)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all ${
                    activeSection === key
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <section.icon className="w-5 h-5" />
                  <span className="font-medium">{section.title}</span>
                  {activeSection === key && <ChevronRight className="w-4 h-4 ml-auto" />}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="flex items-center space-x-3 mb-6">
              {React.createElement(sections[activeSection].icon, { 
                className: "w-6 h-6 text-blue-500" 
              })}
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                {sections[activeSection].title}
              </h3>
            </div>
            {sections[activeSection].content}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Heart className="w-4 h-4 text-red-500" />
              <span>Made with love for new coders</span>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Start Coding!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}