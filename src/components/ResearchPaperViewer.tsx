import React, { useState } from 'react';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { 
  FileText, 
  ExternalLink, 
  Download, 
  Eye, 
  BookOpen,
  Atom,
  Brain,
  Network,
  Shield,
  Zap,
  Search,
  Filter,
  Star,
  Clock,
  User,
  Globe
} from 'lucide-react';

interface ResearchPaper {
  id: string;
  title: string;
  description: string;
  authors: string[];
  doi?: string;
  downloadUrl?: string;
  previewUrl?: string;
  tags: string[];
  publishedDate: string;
  citations: number;
  type: 'whitepaper' | 'research' | 'documentation' | 'specification';
}

export function ResearchPaperViewer() {
  const papersScroll = useAutoScroll({ 
    speed: 35, 
    pauseOnHover: true,
    resetOnInteraction: true 
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(null);

  // Research papers from the project
  const researchPapers: ResearchPaper[] = [
    {
      id: 'dreamcore-paper',
      title: 'Codette DreamCore: Memory Anchoring and Wake-State Emotional Mapping Engine',
      description: 'This package introduces DreamCore, a real-time memory anchoring system integrated with Codette v5, and WakeStateTracer, a cognitive tracker for emotionally driven state mapping.',
      authors: ['Jonathan Harrison'],
      doi: '10.5281/zenodo.16388758',
      downloadUrl: 'https://zenodo.org/api/records/16388758/files/DreamCore_Research_Paper.pdf/content',
      previewUrl: 'https://zenodo.org/records/16388758',
      tags: ['ai', 'dreams', 'memory', 'emotional-mapping', 'cognitive-science'],
      publishedDate: '2025-07-24',
      citations: 4,
      type: 'research'
    },
    {
      id: 'nexus-engine',
      title: 'Nexus Signal Engine: Explainable AI and Security Auditing Framework',
      description: 'The NexisSignalEngine is an original, production-grade signal analysis engine designed to advance the state of explainable AI (XAI), security auditing, and ethical reasoning.',
      authors: ['Jonathan Harrison'],
      doi: '10.57967/hf/6059',
      downloadUrl: 'https://zenodo.org/api/records/16334348/files/whitenexus%202.pdf/content',
      previewUrl: 'https://zenodo.org/records/16334348',
      tags: ['explainable-ai', 'security', 'signal-processing', 'ethical-reasoning'],
      publishedDate: '2025-07-22',
      citations: 27,
      type: 'whitepaper'
    },
    {
      id: 'quantum-optimization',
      title: 'Quantum-Inspired Multi-Objective Optimization for Code Analysis',
      description: 'A comprehensive framework for applying quantum computing principles to software optimization and analysis.',
      authors: ['Jonathan Harrison'],
      tags: ['quantum-computing', 'optimization', 'algorithms', 'software-analysis'],
      publishedDate: '2025-01-15',
      citations: 12,
      type: 'research'
    },
    {
      id: 'aegis-council',
      title: 'Aegis Council: Multi-Agent AI System for Ethical Decision Making',
      description: 'A novel approach to AI governance using multiple specialized agents with virtue-based reasoning.',
      authors: ['Jonathan Harrison'],
      tags: ['multi-agent-systems', 'ai-ethics', 'decision-making', 'virtue-ethics'],
      publishedDate: '2025-01-10',
      citations: 8,
      type: 'research'
    },
    {
      id: 'virtue-driven-ai',
      title: 'Virtue-Driven Artificial Intelligence: Implementing Moral Reasoning in Code Analysis',
      description: 'Explores the integration of classical virtue ethics into AI systems for more ethical and responsible code analysis.',
      authors: ['Jonathan Harrison'],
      tags: ['ai-ethics', 'virtue-ethics', 'moral-reasoning', 'responsible-ai'],
      publishedDate: '2025-01-05',
      citations: 15,
      type: 'research'
    },
    {
      id: 'emotional-memory',
      title: 'Emotional Memory Systems in Artificial Intelligence',
      description: 'A study of how emotional weighting and temporal decay can improve AI memory systems and decision making.',
      authors: ['Jonathan Harrison'],
      tags: ['emotional-ai', 'memory-systems', 'temporal-analysis', 'cognitive-modeling'],
      publishedDate: '2024-12-20',
      citations: 6,
      type: 'research'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Papers', count: researchPapers.length },
    { id: 'research', name: 'Research', count: researchPapers.filter(p => p.type === 'research').length },
    { id: 'whitepaper', name: 'Whitepapers', count: researchPapers.filter(p => p.type === 'whitepaper').length },
    { id: 'ai-ethics', name: 'AI Ethics', count: researchPapers.filter(p => p.tags.includes('ai-ethics')).length },
    { id: 'quantum', name: 'Quantum', count: researchPapers.filter(p => p.tags.includes('quantum-computing')).length }
  ];

  const filteredPapers = researchPapers.filter(paper => {
    const matchesSearch = searchTerm === '' || 
      paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paper.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || 
      paper.type === selectedCategory ||
      paper.tags.includes(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'research': return <Brain className="w-4 h-4 text-blue-600" />;
      case 'whitepaper': return <FileText className="w-4 h-4 text-green-600" />;
      case 'documentation': return <BookOpen className="w-4 h-4 text-purple-600" />;
      case 'specification': return <Shield className="w-4 h-4 text-orange-600" />;
      default: return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTagColor = (tag: string) => {
    const colorMap: Record<string, string> = {
      'ai': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'quantum-computing': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'ai-ethics': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'memory': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'optimization': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'security': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    };
    
    return colorMap[tag] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Research Papers
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Academic research and technical documentation
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-green-100 dark:bg-green-900/20 px-3 py-2 rounded-lg">
              <Star className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                {researchPapers.reduce((sum, paper) => sum + paper.citations, 0)} Citations
              </span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search papers, authors, topics..."
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex space-x-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div 
          ref={papersScroll.elementRef}
          className="space-y-4 relative"
        >
          {filteredPapers.map(paper => (
            <div
              key={paper.id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer"
              onClick={() => setSelectedPaper(paper)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  {getTypeIcon(paper.type)}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                      {paper.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
                      {paper.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3" />
                        <span>{paper.authors.join(', ')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(paper.publishedDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3" />
                        <span>{paper.citations} citations</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {paper.tags.map(tag => (
                        <span key={tag} className={`px-2 py-1 rounded-full text-xs font-medium ${getTagColor(tag)}`}>
                          {tag.replace('-', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-2">
                  {paper.previewUrl && (
                    <a
                      href={paper.previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  
                  {paper.downloadUrl && (
                    <a
                      href={paper.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Download className="w-4 h-4" />
                      <span>PDF</span>
                    </a>
                  )}
                  
                  {paper.doi && (
                    <a
                      href={`https://doi.org/${paper.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Globe className="w-4 h-4" />
                      <span>DOI</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {/* Auto-scroll indicator */}
          <div className="absolute top-2 right-2 flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-2 py-1">
            <div className={`w-2 h-2 rounded-full ${papersScroll.isPaused ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`} />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {papersScroll.isPaused ? 'Paused' : 'Auto'}
            </span>
          </div>
        </div>

        {filteredPapers.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
              No papers found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm ? 'Try adjusting your search terms' : 'Select a different category'}
            </p>
          </div>
        )}
      </div>

      {/* Paper Detail Modal */}
      {selectedPaper && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getTypeIcon(selectedPaper.type)}
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    Paper Details
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedPaper(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <span className="text-gray-500 text-xl">×</span>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                {selectedPaper.title}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-2">
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Abstract</h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {selectedPaper.description}
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Authors</h4>
                    <div className="space-y-1">
                      {selectedPaper.authors.map(author => (
                        <div key={author} className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-700 dark:text-gray-300">{author}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white mb-2">Metrics</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Citations:</span>
                        <span className="font-medium text-gray-800 dark:text-white">{selectedPaper.citations}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Published:</span>
                        <span className="font-medium text-gray-800 dark:text-white">
                          {new Date(selectedPaper.publishedDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Type:</span>
                        <span className="font-medium text-gray-800 dark:text-white capitalize">
                          {selectedPaper.type}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPaper.tags.map(tag => (
                    <span key={tag} className={`px-3 py-1 rounded-full text-sm font-medium ${getTagColor(tag)}`}>
                      {tag.replace('-', ' ')}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedPaper(null)}
                  className="px-6 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Close
                </button>
                
                {selectedPaper.previewUrl && (
                  <a
                    href={selectedPaper.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Online</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                
                {selectedPaper.downloadUrl && (
                  <a
                    href={selectedPaper.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}