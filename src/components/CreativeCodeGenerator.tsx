import React, { useState } from 'react';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { 
  Atom, 
  Heart, 
  Target, 
  Sparkles, 
  Eye, 
  Zap,
  Code,
  Play,
  Download,
  Share,
  Star
} from 'lucide-react';

interface CreativePrompt {
  id: string;
  title: string;
  description: string;
  approach: 'quantum-inspired' | 'biomimetic' | 'mathematical' | 'artistic' | 'philosophical';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

const creativePrompts: CreativePrompt[] = [
  {
    id: 'quantum-sort',
    title: 'Quantum-Inspired Sorting Algorithm',
    description: 'Create a sorting algorithm that uses quantum superposition principles',
    approach: 'quantum-inspired',
    difficulty: 'advanced',
    tags: ['algorithms', 'quantum', 'performance']
  },
  {
    id: 'neural-ui',
    title: 'Neural Network UI Component',
    description: 'Build a UI component that adapts based on user behavior patterns',
    approach: 'biomimetic',
    difficulty: 'intermediate',
    tags: ['ui', 'adaptive', 'machine-learning']
  },
  {
    id: 'fractal-layout',
    title: 'Fractal-Based Layout System',
    description: 'Design a layout system using fractal mathematics for infinite scalability',
    approach: 'mathematical',
    difficulty: 'advanced',
    tags: ['css', 'mathematics', 'responsive']
  },
  {
    id: 'emotion-api',
    title: 'Emotion-Driven API Design',
    description: 'Create an API that responds differently based on emotional context',
    approach: 'artistic',
    difficulty: 'intermediate',
    tags: ['api', 'emotion', 'creativity']
  },
  {
    id: 'virtue-validator',
    title: 'Virtue-Based Code Validator',
    description: 'Build a code validator that checks for ethical programming practices',
    approach: 'philosophical',
    difficulty: 'advanced',
    tags: ['ethics', 'validation', 'philosophy']
  }
];

interface CreativeCodeGeneratorProps {
  onCodeGenerated: (code: string, title: string) => void;
}

export function CreativeCodeGenerator({ onCodeGenerated }: CreativeCodeGeneratorProps) {
  const promptsScroll = useAutoScroll({ 
    speed: 30, 
    pauseOnHover: true,
    resetOnInteraction: true 
  });

  const [selectedPrompt, setSelectedPrompt] = useState<CreativePrompt | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [customPrompt, setCustomPrompt] = useState('');

  const getApproachIcon = (approach: CreativePrompt['approach']) => {
    switch (approach) {
      case 'quantum-inspired': return <Atom className="w-4 h-4 text-purple-600" />;
      case 'biomimetic': return <Heart className="w-4 h-4 text-green-600" />;
      case 'mathematical': return <Target className="w-4 h-4 text-blue-600" />;
      case 'artistic': return <Sparkles className="w-4 h-4 text-pink-600" />;
      case 'philosophical': return <Eye className="w-4 h-4 text-indigo-600" />;
    }
  };

  const getDifficultyColor = (difficulty: CreativePrompt['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
  };

  const generateCreativeCode = async (prompt: CreativePrompt | string) => {
    setIsGenerating(true);
    try {
      // Simulate creative code generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const promptObj = typeof prompt === 'string' ? null : prompt;
      const code = promptObj ? generateCodeForPrompt(promptObj) : generateCodeForCustomPrompt(prompt as string);
      
      setGeneratedCode(code);
      if (promptObj) {
        onCodeGenerated(code, promptObj.title);
      } else {
        onCodeGenerated(code, 'Custom Creative Solution');
      }
    } catch (error) {
      console.error('Creative code generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateCodeForPrompt = (prompt: CreativePrompt): string => {
    switch (prompt.id) {
      case 'quantum-sort':
        return `// Quantum-inspired sorting with superposition states
class QuantumSort {
  static sort<T>(array: T[], compareFn?: (a: T, b: T) => number): T[] {
    if (array.length <= 1) return [...array];
    
    // Create quantum superposition of all possible arrangements
    const superposition = this.createSuperposition(array);
    
    // Measure the most probable sorted state
    return this.collapse(superposition, compareFn);
  }
  
  private static createSuperposition<T>(array: T[]): Array<{state: T[], probability: number}> {
    const states: Array<{state: T[], probability: number}> = [];
    
    // Generate multiple quantum states through entanglement
    for (let i = 0; i < Math.min(array.length * 2, 16); i++) {
      const state = [...array];
      const probability = Math.random();
      
      // Apply quantum tunneling (random swaps)
      for (let j = 0; j < state.length; j++) {
        if (Math.random() < 0.3) { // Tunneling probability
          const swapIndex = Math.floor(Math.random() * state.length);
          [state[j], state[swapIndex]] = [state[swapIndex], state[j]];
        }
      }
      
      states.push({ state, probability });
    }
    
    return states;
  }
  
  private static collapse<T>(
    superposition: Array<{state: T[], probability: number}>, 
    compareFn?: (a: T, b: T) => number
  ): T[] {
    // Evaluate each quantum state
    const evaluated = superposition.map(({state, probability}) => ({
      state,
      fitness: this.calculateFitness(state, compareFn) * probability
    }));
    
    // Return the state with highest fitness
    return evaluated.reduce((best, current) => 
      current.fitness > best.fitness ? current : best
    ).state;
  }
  
  private static calculateFitness<T>(state: T[], compareFn?: (a: T, b: T) => number): number {
    let fitness = 1.0;
    for (let i = 0; i < state.length - 1; i++) {
      const comparison = compareFn ? compareFn(state[i], state[i + 1]) : 
        (state[i] <= state[i + 1] ? -1 : 1);
      if (comparison > 0) fitness *= 0.9; // Penalty for wrong order
    }
    return fitness;
  }
}`;

      case 'neural-ui':
        return `// Adaptive UI component with neural behavior patterns
interface UserBehavior {
  clickPatterns: number[];
  hoverDuration: number;
  scrollVelocity: number;
  interactionFrequency: number;
}

class NeuralUIComponent extends React.Component {
  private behaviorHistory: UserBehavior[] = [];
  private adaptationWeights = {
    responsiveness: 0.3,
    accessibility: 0.4,
    aesthetics: 0.3
  };

  state = {
    adaptiveStyles: {},
    interactionLevel: 'normal' as 'minimal' | 'normal' | 'enhanced'
  };

  componentDidMount() {
    this.startBehaviorTracking();
  }

  private startBehaviorTracking() {
    let clickTimes: number[] = [];
    let hoverStart = 0;
    
    const element = this.elementRef.current;
    if (!element) return;

    element.addEventListener('click', () => {
      clickTimes.push(Date.now());
      this.analyzeBehavior();
    });

    element.addEventListener('mouseenter', () => {
      hoverStart = Date.now();
    });

    element.addEventListener('mouseleave', () => {
      const hoverDuration = Date.now() - hoverStart;
      this.updateBehaviorProfile({ hoverDuration });
    });
  }

  private analyzeBehavior() {
    const recentBehavior = this.behaviorHistory.slice(-10);
    if (recentBehavior.length < 3) return;

    const avgHover = recentBehavior.reduce((sum, b) => sum + b.hoverDuration, 0) / recentBehavior.length;
    const avgFrequency = recentBehavior.reduce((sum, b) => sum + b.interactionFrequency, 0) / recentBehavior.length;

    // Adapt based on user behavior
    if (avgHover < 500 && avgFrequency > 0.8) {
      // Fast user - minimize animations, maximize efficiency
      this.setState({
        interactionLevel: 'minimal',
        adaptiveStyles: {
          transition: 'all 0.1s ease',
          animation: 'none'
        }
      });
    } else if (avgHover > 2000 && avgFrequency < 0.3) {
      // Deliberate user - enhance visual feedback
      this.setState({
        interactionLevel: 'enhanced',
        adaptiveStyles: {
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: 'scale(1.02)',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
        }
      });
    }
  }

  render() {
    return (
      <div 
        ref={this.elementRef}
        style={this.state.adaptiveStyles}
        className="neural-ui-component"
      >
        {/* Component content adapts based on user behavior */}
        {this.state.interactionLevel === 'enhanced' && (
          <div className="enhanced-feedback">
            <div className="pulse-indicator" />
          </div>
        )}
        {this.props.children}
      </div>
    );
  }
}`;

      default:
        return `// Creative solution generated for: ${prompt.title}
// This is a placeholder - implement your creative solution here
console.log('Creative solution for: ${prompt.title}');`;
    }
  };

  const generateCodeForCustomPrompt = (prompt: string): string => {
    return `// AI-generated creative solution for: "${prompt}"
// Approach: Multi-dimensional creative synthesis

class CreativeSolutionEngine {
  private creativityMatrix = {
    innovation: 0.9,
    practicality: 0.8,
    elegance: 0.85,
    uniqueness: 0.92
  };

  generateSolution(problem: string): any {
    // Analyze the problem from multiple creative dimensions
    const dimensions = this.analyzeCreativeDimensions(problem);
    
    // Apply creative transformation
    const solution = this.synthesizeCreativeSolution(dimensions);
    
    return {
      problem,
      solution,
      creativityScore: this.calculateCreativityScore(solution),
      implementation: this.generateImplementation(solution)
    };
  }

  private analyzeCreativeDimensions(problem: string) {
    return {
      complexity: problem.length / 100,
      abstractness: problem.split(' ').filter(word => word.length > 6).length / problem.split(' ').length,
      emotionalResonance: this.calculateEmotionalResonance(problem),
      technicalDepth: this.assessTechnicalDepth(problem)
    };
  }

  private synthesizeCreativeSolution(dimensions: any) {
    // Creative synthesis algorithm
    const creativeFactor = Object.values(dimensions).reduce((sum: number, val: any) => sum + val, 0) / Object.keys(dimensions).length;
    
    return {
      approach: creativeFactor > 0.7 ? 'revolutionary' : 'evolutionary',
      methodology: this.selectMethodology(creativeFactor),
      uniquenessLevel: creativeFactor * this.creativityMatrix.uniqueness
    };
  }

  private calculateCreativityScore(solution: any): number {
    return solution.uniquenessLevel * 0.4 + 
           (solution.approach === 'revolutionary' ? 0.6 : 0.3);
  }

  private generateImplementation(solution: any): string {
    return \`
// Implementation for \${solution.approach} approach
// Methodology: \${solution.methodology}
// Creativity Score: \${solution.uniquenessLevel.toFixed(2)}

// Your creative implementation goes here...
\`;
  }

  private calculateEmotionalResonance(text: string): number {
    const emotionalWords = ['love', 'hope', 'dream', 'create', 'inspire', 'beautiful', 'amazing'];
    const matches = emotionalWords.filter(word => text.toLowerCase().includes(word)).length;
    return matches / emotionalWords.length;
  }

  private assessTechnicalDepth(text: string): number {
    const technicalWords = ['algorithm', 'optimization', 'performance', 'architecture', 'system'];
    const matches = technicalWords.filter(word => text.toLowerCase().includes(word)).length;
    return matches / technicalWords.length;
  }

  private selectMethodology(factor: number): string {
    if (factor > 0.8) return 'paradigm-shifting';
    if (factor > 0.6) return 'innovative';
    if (factor > 0.4) return 'adaptive';
    return 'incremental';
  }
}

// Usage example
const engine = new CreativeSolutionEngine();
const result = engine.generateSolution("${prompt}");
console.log('Creative solution generated:', result);`;
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="p-6 border-b border-purple-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Creative Code Generator
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI-powered unique solution synthesis
            </p>
          </div>
        </div>

        {/* Custom Prompt Input */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Describe your creative challenge:
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="e.g., Create a music visualizer that responds to code complexity..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && customPrompt.trim()) {
                  generateCreativeCode(customPrompt);
                }
              }}
            />
            <button
              onClick={() => generateCreativeCode(customPrompt)}
              disabled={!customPrompt.trim() || isGenerating}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 transition-all"
            >
              <Zap className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Creative Prompts */}
      <div className="flex-1 overflow-y-auto p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Creative Challenges
        </h3>
        
        <div 
          ref={promptsScroll.elementRef}
          className="grid grid-cols-1 gap-4 mb-6 max-h-96 overflow-y-auto relative"
        >
          {creativePrompts.map(prompt => (
            <div
              key={prompt.id}
              onClick={() => setSelectedPrompt(prompt)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg ${
                selectedPrompt?.id === prompt.id
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getApproachIcon(prompt.approach)}
                  <h4 className="font-medium text-gray-800 dark:text-white">{prompt.title}</h4>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(prompt.difficulty)}`}>
                  {prompt.difficulty}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                {prompt.description}
              </p>
              
              <div className="flex flex-wrap gap-1">
                {prompt.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
          
          {/* Auto-scroll indicator */}
          <div className="absolute top-2 right-2 flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-2 py-1">
            <div className={`w-2 h-2 rounded-full ${promptsScroll.isPaused ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`} />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {promptsScroll.isPaused ? 'Paused' : 'Auto'}
            </span>
          </div>
        </div>

        {selectedPrompt && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-purple-200 dark:border-gray-600">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {getApproachIcon(selectedPrompt.approach)}
                <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {selectedPrompt.title}
                </h4>
              </div>
              <button
                onClick={() => generateCreativeCode(selectedPrompt)}
                disabled={isGenerating}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 transition-all"
              >
                <Play className="w-4 h-4" />
                <span>{isGenerating ? 'Generating...' : 'Generate Code'}</span>
              </button>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {selectedPrompt.description}
            </p>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="capitalize">Approach: {selectedPrompt.approach.replace('-', ' ')}</span>
              <span className="capitalize">Difficulty: {selectedPrompt.difficulty}</span>
              <span>Tags: {selectedPrompt.tags.join(', ')}</span>
            </div>
          </div>
        )}

        {/* Generated Code Preview */}
        {generatedCode && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-green-200 dark:border-gray-600">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white">
                Generated Solution
              </h4>
              <div className="flex space-x-2">
                <button
                  onClick={() => navigator.clipboard.writeText(generatedCode)}
                  className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  title="Copy to clipboard"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onCodeGenerated(generatedCode, selectedPrompt?.title || 'Creative Solution')}
                  className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Use Code
                </button>
              </div>
            </div>
            
            <pre className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg overflow-x-auto max-h-64">
              {generatedCode}
            </pre>
          </div>
        )}
      </div>

      {/* Generation Status */}
      {isGenerating && (
        <div className="p-4 border-t border-purple-200 dark:border-gray-700 bg-purple-50 dark:bg-purple-900/20">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-purple-700 dark:text-purple-300 font-medium">
              Synthesizing creative solution using {selectedPrompt?.approach || 'multi-dimensional'} approach...
            </span>
          </div>
        </div>
      )}
    </div>
  );
}