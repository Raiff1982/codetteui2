import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Heart, 
  Star, 
  MessageCircle, 
  Share2,
  Github,
  Globe,
  Award,
  Trophy,
  Crown,
  Sparkles,
  Code,
  Music,
  Shield,
  Brain,
  ExternalLink,
  UserPlus,
  Coffee,
  Handshake
} from 'lucide-react';

interface CommunityMember {
  id: string;
  name: string;
  avatar: string;
  role: 'developer' | 'researcher' | 'contributor' | 'mentor';
  contributions: number;
  specialties: string[];
  online: boolean;
}

interface CommunityProject {
  id: string;
  title: string;
  description: string;
  contributors: number;
  stars: number;
  category: 'ai' | 'ethics' | 'music' | 'quantum' | 'education';
  status: 'active' | 'completed' | 'seeking-help';
}

export function CommunityBuilder() {
  const [activeTab, setActiveTab] = useState<'members' | 'projects' | 'contribute' | 'events'>('members');
  const [communityMembers, setCommunityMembers] = useState<CommunityMember[]>([]);
  const [communityProjects, setCommunityProjects] = useState<CommunityProject[]>([]);

  useEffect(() => {
    // Initialize community data
    setCommunityMembers([
      {
        id: '1',
        name: 'Jonathan Harrison',
        avatar: '👨‍💻',
        role: 'researcher',
        contributions: 247,
        specialties: ['Quantum AI', 'Virtue Ethics', 'Music Generation'],
        online: true
      },
      {
        id: '2',
        name: 'Sarah Chen',
        avatar: '👩‍🔬',
        role: 'developer',
        contributions: 89,
        specialties: ['React', 'TypeScript', 'Accessibility'],
        online: true
      },
      {
        id: '3',
        name: 'Alex Rodriguez',
        avatar: '🧑‍🎨',
        role: 'contributor',
        contributions: 156,
        specialties: ['UI/UX', 'Creative Coding', 'Music Theory'],
        online: false
      },
      {
        id: '4',
        name: 'Dr. Emily Watson',
        avatar: '👩‍🏫',
        role: 'mentor',
        contributions: 203,
        specialties: ['AI Ethics', 'Education', 'Research'],
        online: true
      }
    ]);

    setCommunityProjects([
      {
        id: '1',
        title: 'Ethical AI Guidelines',
        description: 'Developing comprehensive guidelines for virtue-driven AI development',
        contributors: 12,
        stars: 89,
        category: 'ethics',
        status: 'active'
      },
      {
        id: '2',
        title: 'Quantum Algorithm Library',
        description: 'Open source quantum-inspired algorithms for code optimization',
        contributors: 8,
        stars: 156,
        category: 'quantum',
        status: 'seeking-help'
      },
      {
        id: '3',
        title: 'Adaptive Music Engine',
        description: 'AI music generation system that adapts to coding context',
        contributors: 15,
        stars: 234,
        category: 'music',
        status: 'active'
      },
      {
        id: '4',
        title: 'Beginner Coding Curriculum',
        description: 'Comprehensive learning path for new developers',
        contributors: 23,
        stars: 445,
        category: 'education',
        status: 'completed'
      }
    ]);
  }, []);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'researcher': return <Brain className="w-4 h-4 text-purple-600" />;
      case 'developer': return <Code className="w-4 h-4 text-blue-600" />;
      case 'contributor': return <Heart className="w-4 h-4 text-pink-600" />;
      case 'mentor': return <Award className="w-4 h-4 text-yellow-600" />;
      default: return <Users className="w-4 h-4 text-gray-600" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ai': return <Brain className="w-4 h-4 text-purple-600" />;
      case 'ethics': return <Shield className="w-4 h-4 text-green-600" />;
      case 'music': return <Music className="w-4 h-4 text-pink-600" />;
      case 'quantum': return <Sparkles className="w-4 h-4 text-blue-600" />;
      case 'education': return <Award className="w-4 h-4 text-orange-600" />;
      default: return <Star className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200';
      case 'seeking-help': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
    }
  };

  return (
    <div className="bg-gradient-to-br from-white/95 via-purple-50/80 to-pink-50/80 dark:from-gray-800/95 dark:via-purple-950/80 dark:to-pink-950/80 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-purple-200/50 dark:border-purple-700/50">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
          <Users className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">
            Community Hub
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Connect with ethical developers worldwide
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl p-1 mb-6">
        {[
          { id: 'members', label: 'Members', icon: Users },
          { id: 'projects', label: 'Projects', icon: Code },
          { id: 'contribute', label: 'Contribute', icon: Heart },
          { id: 'events', label: 'Events', icon: Coffee }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'members' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-gray-800 dark:text-white">Community Members</h4>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {communityMembers.filter(m => m.online).length} online
              </span>
            </div>
            
            {communityMembers.map(member => (
              <div key={member.id} className="bg-gradient-to-r from-white/80 to-purple-50/80 dark:from-gray-700/80 dark:to-purple-950/80 backdrop-blur-sm rounded-xl p-4 border border-purple-200/50 dark:border-purple-700/50 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-xl shadow-lg">
                      {member.avatar}
                    </div>
                    {member.online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h5 className="font-bold text-gray-800 dark:text-white">{member.name}</h5>
                      {getRoleIcon(member.role)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {member.contributions} contributions • {member.specialties.join(', ')}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {member.specialties.map(specialty => (
                        <span key={specialty} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-3">
            <h4 className="font-bold text-gray-800 dark:text-white">Community Projects</h4>
            
            {communityProjects.map(project => (
              <div key={project.id} className="bg-gradient-to-r from-white/80 to-blue-50/80 dark:from-gray-700/80 dark:to-blue-950/80 backdrop-blur-sm rounded-xl p-4 border border-blue-200/50 dark:border-blue-700/50 hover:shadow-lg transition-all duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getCategoryIcon(project.category)}
                    <h5 className="font-bold text-gray-800 dark:text-white">{project.title}</h5>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status.replace('-', ' ')}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  {project.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>{project.contributors} contributors</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3" />
                      <span>{project.stars} stars</span>
                    </div>
                  </div>
                  
                  <button className="px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 text-sm font-medium shadow-lg hover:shadow-xl hover:scale-105">
                    Join Project
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'contribute' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200/50 dark:border-green-700/50">
              <div className="flex items-center space-x-3 mb-4">
                <Heart className="w-6 h-6 text-green-600" />
                <h4 className="font-bold text-gray-800 dark:text-white">How to Contribute</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Code className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-gray-800 dark:text-white">Code Contributions</span>
                  </div>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 ml-7">
                    <li>• Bug fixes and improvements</li>
                    <li>• New AI algorithms</li>
                    <li>• Performance optimizations</li>
                    <li>• Accessibility enhancements</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Brain className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-gray-800 dark:text-white">Research Contributions</span>
                  </div>
                  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 ml-7">
                    <li>• AI ethics research</li>
                    <li>• Quantum computing papers</li>
                    <li>• User experience studies</li>
                    <li>• Music cognition research</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <a
                  href="https://github.com/raiffsbits/codette"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg hover:from-gray-900 hover:to-black transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                
                <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
                  <UserPlus className="w-4 h-4" />
                  <span>Join Community</span>
                </button>
              </div>
            </div>

            {/* Contribution Guidelines */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200/50 dark:border-blue-700/50">
              <h4 className="font-bold text-gray-800 dark:text-white mb-4">Contribution Guidelines</h4>
              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-gray-800 dark:text-white">Ethical Standards</h5>
                    <p>All contributions must consider user impact and follow virtue-driven principles</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Eye className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-gray-800 dark:text-white">Transparency</h5>
                    <p>Code must be well-documented with clear explanations of AI decisions</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Heart className="w-5 h-5 text-pink-600 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-gray-800 dark:text-white">Accessibility</h5>
                    <p>Ensure all features are accessible to developers of all abilities</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-4">
            <h4 className="font-bold text-gray-800 dark:text-white">Community Events</h4>
            
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-4 border border-yellow-200/50 dark:border-yellow-700/50">
                <div className="flex items-center space-x-3 mb-2">
                  <Coffee className="w-5 h-5 text-orange-600" />
                  <h5 className="font-bold text-gray-800 dark:text-white">Weekly AI Ethics Discussion</h5>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Join our weekly discussion on ethical AI development and virtue-driven programming
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Every Friday, 3 PM UTC</span>
                  <button className="px-3 py-1 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-xs">
                    Join Discussion
                  </button>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-4 border border-purple-200/50 dark:border-purple-700/50">
                <div className="flex items-center space-x-3 mb-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  <h5 className="font-bold text-gray-800 dark:text-white">Quantum Computing Workshop</h5>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Learn how to implement quantum-inspired algorithms in your own projects
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Next Saturday, 2 PM UTC</span>
                  <button className="px-3 py-1 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-xs">
                    Register
                  </button>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200/50 dark:border-green-700/50">
                <div className="flex items-center space-x-3 mb-2">
                  <Handshake className="w-5 h-5 text-green-600" />
                  <h5 className="font-bold text-gray-800 dark:text-white">Mentorship Program</h5>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Connect with experienced developers for guidance and support
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">Ongoing program</span>
                  <button className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-xs">
                    Find Mentor
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Community Stats */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-700/50">
        <h4 className="font-bold text-gray-800 dark:text-white mb-3">Community Impact</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          <div>
            <p className="text-2xl font-bold text-blue-600">1,247</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Active Developers</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-600">89</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Open Source Projects</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">156</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Research Papers</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-pink-600">2.3k</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Lines of Ethical Code</p>
          </div>
        </div>
      </div>
    </div>
  );
}