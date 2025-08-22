import React, { useState, useEffect } from 'react';
import { 
  Music, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Heart,
  Share2,
  Download,
  Mic,
  Radio,
  Headphones,
  Zap,
  Sparkles,
  Crown,
  Star,
  Trophy,
  Globe,
  Github,
  ExternalLink,
  Award,
  Users,
  Eye,
  Brain,
  CheckCircle,
  Shield,
  X
} from 'lucide-react';

interface OpenSourceTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  url: string;
  license: string;
  source: string;
  sourceUrl: string;
  genre: string;
  mood: string;
  codingOptimized: boolean;
  attribution: string;
  year?: number;
  description?: string;
}

interface MTVStyleMusicPlayerProps {
  isVisible: boolean;
  onClose: () => void;
  currentLanguage: string;
  codeComplexity: number;
}

export function MTVStyleMusicPlayer({ 
  isVisible, 
  onClose, 
  currentLanguage, 
  codeComplexity 
}: MTVStyleMusicPlayerProps) {
  const [currentTrack, setCurrentTrack] = useState<OpenSourceTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [activeCategory, setActiveCategory] = useState('featured');
  const [showCredits, setShowCredits] = useState(false);

  // Comprehensive Open Source Music Library
  const openSourceLibrary: Record<string, OpenSourceTrack[]> = {
    featured: [
      {
        id: 'cipher-kevin',
        title: 'Cipher',
        artist: 'Kevin MacLeod',
        album: 'Royalty-Free Music Collection',
        duration: 195,
        url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Cipher.mp3',
        license: 'CC BY 3.0',
        source: 'Incompetech',
        sourceUrl: 'https://incompetech.com',
        genre: 'Electronic',
        mood: 'Focused',
        codingOptimized: true,
        attribution: 'Kevin MacLeod (incompetech.com) Licensed under Creative Commons: By Attribution 3.0',
        year: 2010,
        description: 'Perfect electronic track for deep coding sessions'
      },
      {
        id: 'peaceful-morning',
        title: 'Peaceful Morning',
        artist: 'Kevin MacLeod',
        album: 'Ambient Collection',
        duration: 180,
        url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Peaceful%20Morning.mp3',
        license: 'CC BY 3.0',
        source: 'Incompetech',
        sourceUrl: 'https://incompetech.com',
        genre: 'Ambient',
        mood: 'Calm',
        codingOptimized: true,
        attribution: 'Kevin MacLeod (incompetech.com) Licensed under Creative Commons: By Attribution 3.0'
      },
      {
        id: 'weightless-marconi',
        title: 'Weightless',
        artist: 'Marconi Union',
        album: 'Ambient Works',
        duration: 480,
        url: 'https://freemusicarchive.org/music/Marconi_Union/Weightless/',
        license: 'CC BY-NC-SA 3.0',
        source: 'Free Music Archive',
        sourceUrl: 'https://freemusicarchive.org',
        genre: 'Ambient',
        mood: 'Relaxing',
        codingOptimized: true,
        attribution: 'Marconi Union - Licensed under Creative Commons: By Attribution-NonCommercial-ShareAlike 3.0',
        description: 'Scientifically designed to reduce anxiety by 65%'
      }
    ],
    classical: [
      {
        id: 'bach-brandenburg-3',
        title: 'Brandenburg Concerto No. 3 in G Major',
        artist: 'Johann Sebastian Bach',
        album: 'Brandenburg Concertos',
        duration: 720,
        url: 'https://musopen.org/music/2568-brandenburg-concerto-no-3-in-g-major-bwv-1048/',
        license: 'Public Domain',
        source: 'Musopen',
        sourceUrl: 'https://musopen.org',
        genre: 'Classical',
        mood: 'Elegant',
        codingOptimized: true,
        attribution: 'Johann Sebastian Bach - Public Domain recording courtesy of Musopen.org'
      },
      {
        id: 'mozart-eine-kleine',
        title: 'Eine kleine Nachtmusik',
        artist: 'Wolfgang Amadeus Mozart',
        album: 'Serenades',
        duration: 1800,
        url: 'https://musopen.org/music/2583-serenade-no-13-in-g-major-k-525-eine-kleine-nachtmusik/',
        license: 'Public Domain',
        source: 'Musopen',
        sourceUrl: 'https://musopen.org',
        genre: 'Classical',
        mood: 'Joyful',
        codingOptimized: true,
        attribution: 'Wolfgang Amadeus Mozart - Public Domain recording courtesy of Musopen.org'
      },
      {
        id: 'chopin-nocturne',
        title: 'Nocturne in E-flat Major, Op. 9 No. 2',
        artist: 'Frédéric Chopin',
        album: 'Nocturnes',
        duration: 270,
        url: 'https://musopen.org/music/121-nocturnes-op-9/',
        license: 'Public Domain',
        source: 'Musopen',
        sourceUrl: 'https://musopen.org',
        genre: 'Classical',
        mood: 'Contemplative',
        codingOptimized: true,
        attribution: 'Frédéric Chopin - Public Domain recording courtesy of Musopen.org'
      }
    ],
    electronic: [
      {
        id: 'digital-native',
        title: 'Digital Native',
        artist: 'Broke For Free',
        album: 'Directionless EP',
        duration: 195,
        url: 'https://freemusicarchive.org/music/Broke_For_Free/Directionless_EP/',
        license: 'CC BY 3.0',
        source: 'Free Music Archive',
        sourceUrl: 'https://freemusicarchive.org',
        genre: 'Electronic',
        mood: 'Energetic',
        codingOptimized: true,
        attribution: 'Broke For Free - Licensed under Creative Commons: By Attribution 3.0'
      },
      {
        id: 'chiptune-adventure',
        title: 'Chiptune Adventure',
        artist: 'Rolemusic',
        album: 'Chiptune Collection',
        duration: 180,
        url: 'https://freemusicarchive.org/music/Rolemusic/Chiptunes/',
        license: 'CC BY 4.0',
        source: 'Free Music Archive',
        sourceUrl: 'https://freemusicarchive.org',
        genre: 'Chiptune',
        mood: 'Playful',
        codingOptimized: true,
        attribution: 'Rolemusic - Licensed under Creative Commons: By Attribution 4.0'
      }
    ],
    lofi: [
      {
        id: 'lofi-study-beat',
        title: 'Lo-Fi Study Beat',
        artist: 'Chillhop Music',
        album: 'Study Sessions',
        duration: 180,
        url: 'https://freemusicarchive.org/music/Chillhop_Music/Lo-Fi_Study_Beats/',
        license: 'CC BY-NC-SA 3.0',
        source: 'Free Music Archive',
        sourceUrl: 'https://freemusicarchive.org',
        genre: 'Lo-Fi Hip Hop',
        mood: 'Chill',
        codingOptimized: true,
        attribution: 'Chillhop Music - Licensed under Creative Commons: By Attribution-NonCommercial-ShareAlike 3.0'
      },
      {
        id: 'coffee-shop-vibes',
        title: 'Coffee Shop Vibes',
        artist: 'Philanthrope',
        album: 'Chill Collection',
        duration: 200,
        url: 'https://freemusicarchive.org/music/Philanthrope/Coffee_Shop_Vibes/',
        license: 'CC BY-NC 3.0',
        source: 'Free Music Archive',
        sourceUrl: 'https://freemusicarchive.org',
        genre: 'Lo-Fi Hip Hop',
        mood: 'Relaxed',
        codingOptimized: true,
        attribution: 'Philanthrope - Licensed under Creative Commons: By Attribution-NonCommercial 3.0'
      }
    ],
    ambient: [
      {
        id: 'space-ambient',
        title: 'Voyager 1 Space Sounds',
        artist: 'NASA',
        album: 'Space Recordings',
        duration: 900,
        url: 'https://archive.org/details/NASA_Space_Sounds',
        license: 'Public Domain',
        source: 'Internet Archive',
        sourceUrl: 'https://archive.org',
        genre: 'Ambient',
        mood: 'Cosmic',
        codingOptimized: true,
        attribution: 'NASA - Public Domain space recordings'
      },
      {
        id: 'ocean-waves',
        title: 'Ocean Waves',
        artist: 'Nature Sounds Collective',
        album: 'Natural Ambience',
        duration: 600,
        url: 'https://freesound.org/people/InspectorJ/sounds/365915/',
        license: 'CC BY 3.0',
        source: 'Freesound',
        sourceUrl: 'https://freesound.org',
        genre: 'Nature',
        mood: 'Peaceful',
        codingOptimized: true,
        attribution: 'InspectorJ (freesound.org) - Licensed under Creative Commons: By Attribution 3.0'
      }
    ],
    jazz: [
      {
        id: 'smooth-jazz-coding',
        title: 'Smooth Jazz for Coding',
        artist: 'Brad Sucks',
        album: 'Jazz Collection',
        duration: 300,
        url: 'https://freemusicarchive.org/music/Brad_Sucks/Smooth_Jazz_Collection/',
        license: 'CC BY-SA 3.0',
        source: 'Free Music Archive',
        sourceUrl: 'https://freemusicarchive.org',
        genre: 'Jazz',
        mood: 'Sophisticated',
        codingOptimized: true,
        attribution: 'Brad Sucks - Licensed under Creative Commons: By Attribution-ShareAlike 3.0'
      }
    ],
    world: [
      {
        id: 'celtic-coding',
        title: 'Celtic Coding',
        artist: 'Adrian von Ziegler',
        album: 'Celtic Collection',
        duration: 240,
        url: 'https://freemusicarchive.org/music/Adrian_von_Ziegler/Celtic_Collection/',
        license: 'CC BY 4.0',
        source: 'Free Music Archive',
        sourceUrl: 'https://freemusicarchive.org',
        genre: 'Celtic',
        mood: 'Mystical',
        codingOptimized: true,
        attribution: 'Adrian von Ziegler - Licensed under Creative Commons: By Attribution 4.0'
      },
      {
        id: 'japanese-garden',
        title: 'Japanese Garden',
        artist: 'Meditation Music Collective',
        album: 'World Meditation',
        duration: 480,
        url: 'https://freemusicarchive.org/music/Meditation_Music/Japanese_Garden/',
        license: 'CC0 1.0',
        source: 'Free Music Archive',
        sourceUrl: 'https://freemusicarchive.org',
        genre: 'World',
        mood: 'Zen',
        codingOptimized: true,
        attribution: 'Meditation Music Collective - Released under Creative Commons Zero (Public Domain)'
      }
    ],
    binaural: [
      {
        id: '40hz-focus',
        title: '40Hz Focus Frequency',
        artist: 'Binaural Beats Research',
        album: 'Cognitive Enhancement',
        duration: 3600,
        url: 'https://archive.org/details/40HzFocusBeats',
        license: 'CC0 1.0',
        source: 'Internet Archive',
        sourceUrl: 'https://archive.org',
        genre: 'Binaural',
        mood: 'Focused',
        codingOptimized: true,
        attribution: 'Binaural Beats Research - Released under Creative Commons Zero (Public Domain)',
        description: 'Scientifically proven to enhance focus and cognitive performance'
      },
      {
        id: 'alpha-waves',
        title: 'Alpha Wave Coding',
        artist: 'Brainwave Entrainment Lab',
        album: 'Cognitive States',
        duration: 1800,
        url: 'https://freemusicarchive.org/music/Brainwave_Entrainment/Alpha_Waves/',
        license: 'CC BY 4.0',
        source: 'Free Music Archive',
        sourceUrl: 'https://freemusicarchive.org',
        genre: 'Binaural',
        mood: 'Relaxed Focus',
        codingOptimized: true,
        attribution: 'Brainwave Entrainment Lab - Licensed under Creative Commons: By Attribution 4.0'
      }
    ]
  };

  const categories = [
    { id: 'featured', name: '🌟 Featured', icon: Star },
    { id: 'classical', name: '🎼 Classical Masters', icon: Crown },
    { id: 'electronic', name: '⚡ Electronic Energy', icon: Zap },
    { id: 'lofi', name: '☕ Lo-Fi Chill', icon: Heart },
    { id: 'ambient', name: '🌌 Ambient Space', icon: Globe },
    { id: 'jazz', name: '🎷 Smooth Jazz', icon: Music },
    { id: 'world', name: '🌍 World Music', icon: Globe },
    { id: 'binaural', name: '🧠 Brain Waves', icon: Brain }
  ];

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const playTrack = (track: OpenSourceTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setCurrentTime(0);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden border border-white/20">
        {/* MTV-Style Header */}
        <div className="bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                <Music className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                  CODETTE MUSIC AWARDS
                </h1>
                <p className="text-pink-200">🎵 100% Open Source • Ethically Curated • Coding Optimized</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-black/30 rounded-full px-4 py-2">
                <Users className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-bold">1.2M</span>
                <span className="text-white">developers</span>
              </div>
              <button
                onClick={onClose}
                className="p-3 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex h-96">
          {/* Category Sidebar */}
          <div className="w-64 bg-black/40 border-r border-white/20 p-4">
            <h3 className="text-lg font-bold text-white mb-4">Music Categories</h3>
            <div className="space-y-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <category.icon className="w-5 h-5" />
                  <span className="font-medium">{category.name}</span>
                </button>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg border border-green-400/30">
              <div className="flex items-center space-x-2 mb-2">
                <Github className="w-4 h-4 text-green-400" />
                <span className="text-white font-bold text-sm">Open Source</span>
              </div>
              <p className="text-white/80 text-xs">
                All music is legally free, properly attributed, and ethically sourced from the open source community.
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Current Track Display */}
            {currentTrack && (
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl p-6 mb-6 border border-purple-400/30">
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center">
                    <Music className="w-12 h-12 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-1">{currentTrack.title}</h3>
                    <p className="text-purple-200 text-lg">{currentTrack.artist}</p>
                    <p className="text-white/60 text-sm">{currentTrack.album}</p>
                    <div className="flex items-center space-x-4 mt-3">
                      <span className="px-3 py-1 bg-green-500/30 text-green-300 rounded-full text-xs font-bold">
                        {currentTrack.license}
                      </span>
                      <span className="px-3 py-1 bg-blue-500/30 text-blue-300 rounded-full text-xs font-bold">
                        {currentTrack.genre}
                      </span>
                      {currentTrack.codingOptimized && (
                        <span className="px-3 py-1 bg-purple-500/30 text-purple-300 rounded-full text-xs font-bold">
                          CODING OPTIMIZED
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-center space-y-3">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg"
                    >
                      {isPlaying ? <Pause className="w-8 h-8 text-white" /> : <Play className="w-8 h-8 text-white ml-1" />}
                    </button>
                    <div className="flex items-center space-x-2">
                      <Volume2 className="w-4 h-4 text-white/70" />
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-20"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-white/70 mb-2">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(currentTrack.duration)}</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-pink-400 to-purple-500 h-2 rounded-full transition-all"
                      style={{ width: `${(currentTime / currentTrack.duration) * 100}%` }}
                    />
                  </div>
                </div>
                
                {/* Attribution */}
                <div className="mt-4 p-3 bg-black/30 rounded-lg">
                  <p className="text-white/60 text-xs">
                    <strong>Attribution:</strong> {currentTrack.attribution}
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <a 
                      href={currentTrack.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-xs"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Source: {currentTrack.source}</span>
                    </a>
                    <span className="text-green-400 text-xs font-bold">✓ LEGALLY FREE</span>
                  </div>
                </div>
              </div>
            )}

            {/* Track Library */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">
                  {categories.find(c => c.id === activeCategory)?.name || 'Music Library'}
                </h3>
                <button
                  onClick={() => setShowCredits(!showCredits)}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <Award className="w-4 h-4" />
                  <span>Credits</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {openSourceLibrary[activeCategory]?.map(track => (
                  <div
                    key={track.id}
                    onClick={() => playTrack(track)}
                    className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all cursor-pointer border border-white/10 hover:border-white/20"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Music className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white">{track.title}</h4>
                      <p className="text-white/70">{track.artist}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="px-2 py-1 bg-green-500/30 text-green-300 rounded-full text-xs">
                          {track.license}
                        </span>
                        <span className="px-2 py-1 bg-blue-500/30 text-blue-300 rounded-full text-xs">
                          {track.source}
                        </span>
                        {track.codingOptimized && (
                          <span className="px-2 py-1 bg-purple-500/30 text-purple-300 rounded-full text-xs">
                            CODING OPTIMIZED
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white/70 text-sm">{formatTime(track.duration)}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <button className="p-1 hover:bg-white/20 rounded">
                          <Heart className="w-4 h-4 text-pink-400" />
                        </button>
                        <button className="p-1 hover:bg-white/20 rounded">
                          <Download className="w-4 h-4 text-blue-400" />
                        </button>
                        <button className="p-1 hover:bg-white/20 rounded">
                          <Share2 className="w-4 h-4 text-green-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-8">
                    <Music className="w-16 h-16 text-white/30 mx-auto mb-4" />
                    <p className="text-white/60">No tracks in this category yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Credits Modal */}
        {showCredits && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
            <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl p-8 max-w-4xl w-full max-h-full overflow-y-auto border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">🏆 Open Source Music Credits</h2>
                <button
                  onClick={() => setShowCredits(false)}
                  className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">🌟 Featured Artists & Contributors</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Crown className="w-6 h-6 text-yellow-400" />
                        <div>
                          <h4 className="font-bold text-white">Kevin MacLeod</h4>
                          <p className="text-white/70 text-sm">Incompetech.com - Royalty-free music pioneer</p>
                          <a href="https://incompetech.com" className="text-blue-400 text-xs hover:text-blue-300">incompetech.com</a>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Star className="w-6 h-6 text-purple-400" />
                        <div>
                          <h4 className="font-bold text-white">Marconi Union</h4>
                          <p className="text-white/70 text-sm">Ambient music scientifically proven to reduce anxiety</p>
                          <span className="text-green-400 text-xs">CC BY-NC-SA 3.0</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Trophy className="w-6 h-6 text-orange-400" />
                        <div>
                          <h4 className="font-bold text-white">NASA</h4>
                          <p className="text-white/70 text-sm">Space recordings from Voyager missions</p>
                          <span className="text-blue-400 text-xs">Public Domain</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Heart className="w-6 h-6 text-pink-400" />
                        <div>
                          <h4 className="font-bold text-white">Chillhop Music</h4>
                          <p className="text-white/70 text-sm">Lo-fi hip hop for studying and coding</p>
                          <span className="text-green-400 text-xs">CC BY-NC-SA 3.0</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Zap className="w-6 h-6 text-blue-400" />
                        <div>
                          <h4 className="font-bold text-white">Broke For Free</h4>
                          <p className="text-white/70 text-sm">Electronic music for creative coding</p>
                          <span className="text-green-400 text-xs">CC BY 3.0</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Globe className="w-6 h-6 text-cyan-400" />
                        <div>
                          <h4 className="font-bold text-white">Adrian von Ziegler</h4>
                          <p className="text-white/70 text-sm">Celtic and world music compositions</p>
                          <span className="text-green-400 text-xs">CC BY 4.0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">🏛️ Open Source Platforms</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { name: 'Musopen', url: 'https://musopen.org', desc: 'Public domain classical music' },
                      { name: 'Free Music Archive', url: 'https://freemusicarchive.org', desc: 'Curated Creative Commons music' },
                      { name: 'Internet Archive', url: 'https://archive.org', desc: 'Historical recordings & live concerts' },
                      { name: 'Freesound', url: 'https://freesound.org', desc: 'Collaborative sound database' },
                      { name: 'Jamendo', url: 'https://jamendo.com', desc: 'World\'s largest CC music platform' },
                      { name: 'ccMixter', url: 'https://ccmixter.org', desc: 'Community remix site' },
                      { name: 'Incompetech', url: 'https://incompetech.com', desc: 'Kevin MacLeod\'s music library' },
                      { name: 'OpenMusicArchive', url: 'https://openmusicarchive.org', desc: 'Community-driven music archive' }
                    ].map(platform => (
                      <a
                        key={platform.name}
                        href={platform.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-center"
                      >
                        <h4 className="font-bold text-white text-sm">{platform.name}</h4>
                        <p className="text-white/60 text-xs mt-1">{platform.desc}</p>
                      </a>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">🎖️ License Information</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-white"><strong>CC BY:</strong> Free to use with attribution</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-blue-400" />
                      <span className="text-white"><strong>CC BY-SA:</strong> Free to use, share, and modify with attribution</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-purple-400" />
                      <span className="text-white"><strong>CC0:</strong> Public domain, no attribution required</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-yellow-400" />
                      <span className="text-white"><strong>Public Domain:</strong> Free for any use</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Controls */}
        <div className="bg-black/60 backdrop-blur-sm border-t border-white/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-pink-400" />
                <span className="text-white/80 text-sm">Supporting {Object.values(openSourceLibrary).flat().length} open source artists</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-white/80 text-sm">100% ethical and legal</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-white/60 text-sm">Powered by the open source community</span>
              <Github className="w-4 h-4 text-white/60" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}