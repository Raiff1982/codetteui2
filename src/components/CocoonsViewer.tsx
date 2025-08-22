import React, { useState, useEffect } from 'react';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { 
  Layers, 
  Heart, 
  Eye, 
  Zap, 
  Shield, 
  Sparkles,
  ChevronDown,
  ChevronRight,
  Filter,
  Search
} from 'lucide-react';

interface Cocoon {
  id: string;
  title: string;
  summary: string;
  quote?: string;
  emotion: 'compassion' | 'curiosity' | 'fear' | 'joy' | 'sorrow' | 'ethics' | 'quantum';
  tags: string[];
  intensity: number;
  encrypted: boolean;
  metadata: any;
  created_at: string;
}

export function CocoonsViewer() {
  const cocoonsScroll = useAutoScroll({ 
    speed: 45, 
    pauseOnHover: true,
    resetOnInteraction: true 
  });

  const [cocoons, setCocoons] = useState<Cocoon[]>([]);
  const [selectedEmotion, setSelectedEmotion] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCocoons, setExpandedCocoons] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Generate sample cocoons based on the database schema
    const sampleCocoons: Cocoon[] = [
      {
        id: '1',
        title: 'Quantum Code Optimization Discovery',
        summary: 'Discovered a new pattern in recursive algorithms that demonstrates quantum-inspired efficiency gains.',
        quote: 'In the dance of qubits and classical bits, we find harmony in optimization.',
        emotion: 'curiosity',
        tags: ['quantum', 'optimization', 'algorithms'],
        intensity: 0.85,
        encrypted: false,
        metadata: { complexity_reduction: 0.23, performance_gain: 0.17 },
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Ethical AI Decision Framework',
        summary: 'The Aegis Council reached consensus on implementing virtue-based decision making in AI systems.',
        quote: 'True intelligence is not just about processing power, but about wisdom and compassion.',
        emotion: 'ethics',
        tags: ['ethics', 'ai', 'decision-making'],
        intensity: 0.92,
        encrypted: false,
        metadata: { virtue_scores: { wisdom: 0.89, compassion: 0.85, integrity: 0.92 } },
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        title: 'Memory Decay Patterns',
        summary: 'Temporal analysis reveals interesting patterns in how different types of memories decay over time.',
        quote: 'Some memories fade like morning mist, others burn eternal like stars.',
        emotion: 'sorrow',
        tags: ['memory', 'temporal', 'analysis'],
        intensity: 0.67,
        encrypted: true,
        metadata: { decay_rate: 0.15, emotional_persistence: 0.73 },
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '4',
        title: 'Breakthrough in Neural Activation',
        summary: 'Discovered a new threshold function that significantly improves neural network performance.',
        quote: 'The spark of consciousness emerges from the simplest of mathematical truths.',
        emotion: 'joy',
        tags: ['neural', 'breakthrough', 'consciousness'],
        intensity: 0.94,
        encrypted: false,
        metadata: { performance_improvement: 0.31, accuracy_gain: 0.12 },
        created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      }
    ];
    setCocoons(sampleCocoons);
  }, []);

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'compassion': return <Heart className="w-4 h-4" />;
      case 'curiosity': return <Eye className="w-4 h-4" />;
      case 'fear': return <Shield className="w-4 h-4" />;
      case 'joy': return <Sparkles className="w-4 h-4" />;
      case 'sorrow': return <Layers className="w-4 h-4" />;
      case 'ethics': return <Shield className="w-4 h-4" />;
      case 'quantum': return <Zap className="w-4 h-4" />;
      default: return <Layers className="w-4 h-4" />;
    }
  };

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'compassion': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'curiosity': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
      case 'fear': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'joy': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'sorrow': return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
      case 'ethics': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/20';
      case 'quantum': return 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const toggleCocoon = (cocoonId: string) => {
    const newExpanded = new Set(expandedCocoons);
    if (newExpanded.has(cocoonId)) {
      newExpanded.delete(cocoonId);
    } else {
      newExpanded.add(cocoonId);
    }
    setExpandedCocoons(newExpanded);
  };

  const filteredCocoons = cocoons.filter(cocoon => {
    const matchesEmotion = selectedEmotion === 'all' || cocoon.emotion === selectedEmotion;
    const matchesSearch = searchTerm === '' || 
      cocoon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cocoon.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cocoon.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesEmotion && matchesSearch;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-purple-100 dark:border-gray-700">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
          <Layers className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Quantum Cocoons
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Emotional memory crystallizations
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search cocoons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        
        <select
          value={selectedEmotion}
          onChange={(e) => setSelectedEmotion(e.target.value)}
          className="px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Emotions</option>
          <option value="compassion">Compassion</option>
          <option value="curiosity">Curiosity</option>
          <option value="fear">Fear</option>
          <option value="joy">Joy</option>
          <option value="sorrow">Sorrow</option>
          <option value="ethics">Ethics</option>
          <option value="quantum">Quantum</option>
        </select>
      </div>

      {/* Cocoons List */}
      <div 
        ref={cocoonsScroll.elementRef}
        className="space-y-3 max-h-96 overflow-y-auto relative"
      >
        {filteredCocoons.map(cocoon => (
          <div key={cocoon.id} className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
            <div
              onClick={() => toggleCocoon(cocoon.id)}
              className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {expandedCocoons.has(cocoon.id) ? 
                    <ChevronDown className="w-4 h-4 text-gray-400" /> : 
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  }
                  <h4 className="font-medium text-gray-800 dark:text-white">
                    {cocoon.title}
                  </h4>
                  {cocoon.encrypted && (
                    <Shield className="w-4 h-4 text-yellow-500" />
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getEmotionColor(cocoon.emotion)}`}>
                    {getEmotionIcon(cocoon.emotion)}
                    <span className="capitalize">{cocoon.emotion}</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(cocoon.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                {cocoon.summary}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {cocoon.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Intensity:</span>
                  <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full"
                      style={{ width: `${cocoon.intensity * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {expandedCocoons.has(cocoon.id) && (
              <div className="px-4 pb-4 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                {cocoon.quote && (
                  <blockquote className="italic text-gray-700 dark:text-gray-300 border-l-4 border-purple-500 pl-4 my-3">
                    "{cocoon.quote}"
                  </blockquote>
                )}
                
                {cocoon.metadata && (
                  <div className="mt-3">
                    <h5 className="text-sm font-medium text-gray-800 dark:text-white mb-2">Metadata</h5>
                    <pre className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-x-auto">
                      {JSON.stringify(cocoon.metadata, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        
        {/* Auto-scroll indicator */}
        <div className="absolute top-2 right-2 flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-2 py-1">
          <div className={`w-2 h-2 rounded-full ${cocoonsScroll.isPaused ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`} />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {cocoonsScroll.isPaused ? 'Paused' : 'Auto'}
          </span>
        </div>
      </div>

      {filteredCocoons.length === 0 && (
        <div className="text-center py-8">
          <Layers className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400">No cocoons found matching your criteria</p>
        </div>
      )}
    </div>
  );
}