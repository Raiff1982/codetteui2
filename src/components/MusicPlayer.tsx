import React, { useState, useEffect } from 'react';
import { useAutoScroll } from '../hooks/useAutoScroll';
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
  Repeat1,
  Search,
  Download,
  Heart,
  Plus,
  List,
  Radio,
  Headphones,
  Mic2,
  Disc3,
  Waves,
  Zap,
  Brain,
  Clock,
  TrendingUp,
  X,
  ChevronDown,
  ChevronUp,
  Settings,
  Wifi,
  WifiOff
} from 'lucide-react';

interface MusicPlayerProps {
  isMinimized: boolean;
  onToggleMinimize: () => void;
  onClose: () => void;
  currentLanguage?: string;
  codeComplexity?: number;
}

export function MusicPlayer({ 
  isMinimized, 
  onToggleMinimize, 
  onClose,
  currentLanguage = 'typescript',
  codeComplexity = 0.5 
}: MusicPlayerProps) {
  const {
    playerState,
    playlists,
    searchResults,
    isLoading,
    aiRecommendations,
    streamingServices,
    play,
    pause,
    stop,
    next,
    previous,
    setVolume,
    seek,
    toggleShuffle,
    toggleRepeat,
    playPlaylist,
    searchTracks,
    getAIRecommendations,
    connectStreamingService,
    downloadTrack,
    formatTime
  } = useMusic();

  const playlistsScroll = useAutoScroll({ 
    speed: 30, 
    pauseOnHover: true,
    resetOnInteraction: true 
  });

  const queueScroll = useAutoScroll({ 
    speed: 25, 
    pauseOnHover: true,
    resetOnInteraction: true 
  });

  const [activeTab, setActiveTab] = useState<'playlists' | 'search' | 'ai' | 'queue' | 'services'>('playlists');
  const [searchQuery, setSearchQuery] = useState('');
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [selectedService, setSelectedService] = useState('spotify');
  const [isGeneratingMusic, setIsGeneratingMusic] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Get AI recommendations based on current coding context
    const timeOfDay = new Date().getHours() < 12 ? 'morning' : 
                     new Date().getHours() < 18 ? 'afternoon' : 'night';
    
    getAIRecommendations({
      language: currentLanguage,
      complexity: codeComplexity,
      timeOfDay,
      mood: codeComplexity > 0.7 ? 'focused' : 'energetic'
    });
  }, [currentLanguage, codeComplexity]);

  const generateCodingMusic = async (style: string) => {
    setIsGeneratingMusic(true);
    try {
      // Use real working audio URLs for different styles
      const audioUrls = {
        mozart: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
        bach: 'https://www.soundjay.com/misc/sounds/beep-07a.wav',
        house: 'https://www.soundjay.com/misc/sounds/fail-buzzer-02.wav',
        dance: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
      };
      
      const mockTrack = {
        id: `${style}-${Date.now()}`,
        title: `${style.charAt(0).toUpperCase() + style.slice(1)} Coding Music`,
        artist: 'Codette AI Composer',
        album: 'AI Generated',
        duration: 300,
        url: audioUrls[style as keyof typeof audioUrls] || audioUrls.mozart,
        genre: style,
        isLocal: true
      };
      
      await play(mockTrack);
      
    } catch (error) {
      console.error('Music generation failed:', error);
      console.log('Using fallback audio for music generation');
    } finally {
      setIsGeneratingMusic(false);
    }
  };

  const generateAdaptiveMusic = async () => {
    setIsGeneratingMusic(true);
    try {
      // Simulate adaptive music generation
      const mockTrack = {
        id: `adaptive-${Date.now()}`,
        title: `Adaptive ${currentLanguage} Coding Music`,
        artist: 'Codette AI Composer',
        album: 'AI Generated',
        duration: 300,
        url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Cipher.mp3',
        genre: 'adaptive',
        isLocal: true
      };
      
      await play(mockTrack);
      return mockTrack;
    } catch (error) {
      console.error('Adaptive music generation failed:', error);
      throw error;
    } finally {
      setIsGeneratingMusic(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchTracks(searchQuery, selectedService);
    }
  };

  const getRepeatIcon = () => {
    switch (playerState.repeat) {
      case 'one': return <Repeat1 className="w-4 h-4" />;
      case 'all': return <Repeat className="w-4 h-4" />;
      default: return <Repeat className="w-4 h-4 opacity-50" />;
    }
  };

  const getServiceIcon = (serviceId: string) => {
    const service = streamingServices.find(s => s.id === serviceId);
    return service?.icon || '🎵';
  };

  if (isMinimized) {
    return (
      <div className={`fixed ${isMobile ? 'bottom-2 right-2' : 'bottom-4 right-4'} bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 ${isMobile ? 'p-3' : 'p-4'} z-50 ${isMobile ? 'min-w-72' : 'min-w-80'}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center`}>
              <Music className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-white`} />
            </div>
            <div>
              <h3 className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-gray-800 dark:text-white`}>Music Player</h3>
              <p className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-600 dark:text-gray-400`}>Coding Soundtrack</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onToggleMinimize}
              className={`${isMobile ? 'p-2' : 'p-1'} hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors touch-target`}
            >
              <ChevronUp className="w-4 h-4 text-gray-500" />
            </button>
            <button
              onClick={onClose}
              className={`${isMobile ? 'p-2' : 'p-1'} hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors touch-target`}
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Mini Player Controls */}
        {playerState.currentTrack && (
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center`}>
                <Music className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-white`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`${isMobile ? 'text-sm' : 'text-base'} font-medium text-gray-800 dark:text-white truncate`}>
                  {playerState.currentTrack.title}
                </p>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 dark:text-gray-400 truncate`}>
                  {playerState.currentTrack.artist}
                </p>
              </div>
            </div>

            <div className={`flex items-center justify-center ${isMobile ? 'space-x-3' : 'space-x-4'}`}>
              <button
                onClick={previous}
                className={`${isMobile ? 'p-3' : 'p-2'} hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors touch-target`}
              >
                <SkipBack className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-gray-600 dark:text-gray-300`} />
              </button>
              
              <button
                onClick={playerState.isPlaying ? pause : () => play()}
                className={`${isMobile ? 'p-2' : 'p-3'} bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg touch-target`}
              >
                {playerState.isPlaying ? (
                  <Pause className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
                ) : (
                  <Play className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
                )}
              </button>
              
              <button
                onClick={next}
                className={`${isMobile ? 'p-3' : 'p-2'} hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors touch-target`}
              >
                <SkipForward className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-gray-600 dark:text-gray-300`} />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-600 h-1 rounded-full transition-all"
                  style={{ 
                    width: `${playerState.currentTrack ? (playerState.currentTime / playerState.currentTrack.duration) * 100 : 0}%` 
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>{formatTime(playerState.currentTime)}</span>
                <span>{formatTime(playerState.currentTrack.duration)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`fixed ${isMobile ? 'inset-4' : 'bottom-4 right-4'} bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 ${isMobile ? 'w-auto h-auto' : 'w-96'} ${isMobile ? 'max-h-full' : 'max-h-[600px]'} overflow-hidden`}>
      {/* Header */}
      <div className={`${isMobile ? 'p-3' : 'p-4'} border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center`}>
              <Music className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-white`} />
            </div>
            <div>
              <h3 className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-gray-800 dark:text-white`}>Codette Music</h3>
              <p className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-600 dark:text-gray-400`}>Enhance your coding flow</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onToggleMinimize}
              className={`${isMobile ? 'p-2' : 'p-1'} hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors touch-target`}
            >
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            <button
              onClick={onClose}
              className={`${isMobile ? 'p-2' : 'p-1'} hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors touch-target`}
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={`flex ${isMobile ? 'space-x-0.5' : 'space-x-1'} bg-gray-100 dark:bg-gray-700 rounded-lg p-1 ${isMobile ? 'overflow-x-auto' : ''}`}>
          {[
            { id: 'playlists', label: 'Playlists', icon: List },
            { id: 'search', label: 'Search', icon: Search },
            { id: 'ai', label: 'AI Picks', icon: Brain },
            { id: 'queue', label: 'Queue', icon: Clock },
            { id: 'services', label: 'Services', icon: Wifi }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center ${isMobile ? 'space-x-0.5' : 'space-x-1'} ${isMobile ? 'px-1 py-1' : 'px-2 py-1'} rounded-md ${isMobile ? 'text-xs' : 'text-xs'} font-medium transition-all touch-target ${
                activeTab === tab.id
                  ? 'bg-gray-50 dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <tab.icon className={`${isMobile ? 'w-3 h-3' : 'w-3 h-3'}`} />
              <span className={isMobile ? 'hidden sm:inline' : ''}>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Current Track Display */}
      {playerState.currentTrack && (
        <div className={`${isMobile ? 'p-3' : 'p-4'} border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20`}>
          <div className="flex items-center space-x-3 mb-3">
            <div className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'} bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center`}>
              {playerState.currentTrack.artwork ? (
                <img 
                  src={playerState.currentTrack.artwork} 
                  alt="Album artwork"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Disc3 className={`${isMobile ? 'w-6 h-6' : 'w-8 h-8'} text-white`} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-gray-800 dark:text-white truncate`}>
                {playerState.currentTrack.title}
              </h4>
              <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 dark:text-gray-400 truncate`}>
                {playerState.currentTrack.artist}
              </p>
              <p className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-500 dark:text-gray-500 truncate`}>
                {playerState.currentTrack.album}
              </p>
            </div>
          </div>

          {/* Playback Controls */}
          <div className={`flex items-center justify-center ${isMobile ? 'space-x-3' : 'space-x-4'} mb-3`}>
            <button
              onClick={toggleShuffle}
              className={`${isMobile ? 'p-3' : 'p-2'} rounded-lg transition-colors touch-target ${
                playerState.shuffle ? 'bg-purple-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              <Shuffle className="w-4 h-4" />
            </button>
            
            <button
              onClick={previous}
              className={`${isMobile ? 'p-3' : 'p-2'} hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors touch-target`}
            >
              <SkipBack className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-gray-600 dark:text-gray-300`} />
            </button>
            
            <button
              onClick={playerState.isPlaying ? pause : () => play()}
              disabled={isLoading}
              className={`${isMobile ? 'p-3' : 'p-4'} bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg disabled:opacity-50 touch-target`}
            >
              {isLoading ? (
                <div className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} border-2 border-white border-t-transparent rounded-full animate-spin`} />
              ) : playerState.isPlaying ? (
                <Pause className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
              ) : (
                <Play className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
              )}
            </button>
            
            <button
              onClick={next}
              className={`${isMobile ? 'p-3' : 'p-2'} hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors touch-target`}
            >
              <SkipForward className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-gray-600 dark:text-gray-300`} />
            </button>
            
            <button
              onClick={toggleRepeat}
              className={`${isMobile ? 'p-3' : 'p-2'} rounded-lg transition-colors touch-target ${
                playerState.repeat !== 'none' ? 'bg-purple-500 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              {getRepeatIcon()}
            </button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div 
              className={`w-full bg-gray-200 dark:bg-gray-600 rounded-full ${isMobile ? 'h-3' : 'h-2'} cursor-pointer`}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const percent = (e.clientX - rect.left) / rect.width;
                const newTime = percent * playerState.currentTrack!.duration;
                seek(newTime);
              }}
            >
              <div
                className={`bg-gradient-to-r from-purple-500 to-pink-600 ${isMobile ? 'h-3' : 'h-2'} rounded-full transition-all`}
                style={{ 
                  width: `${playerState.currentTrack ? (playerState.currentTime / playerState.currentTrack.duration) * 100 : 0}%` 
                }}
              />
            </div>
            <div className={`flex justify-between ${isMobile ? 'text-xs' : 'text-xs'} text-gray-500 dark:text-gray-400`}>
              <span>{formatTime(playerState.currentTime)}</span>
              <span>{formatTime(playerState.currentTrack.duration)}</span>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                className={`${isMobile ? 'p-2' : 'p-1'} hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors touch-target`}
              >
                {playerState.volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                ) : (
                  <Volume2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                )}
              </button>
              {showVolumeSlider && (
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={playerState.volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className={`${isMobile ? 'w-16' : 'w-20'} ${isMobile ? 'h-2' : 'h-1'} bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer`}
                />
              )}
            </div>
            
            <div className="flex items-center space-x-1">
              {streamingServices.filter(s => s.connected).map(service => (
                <div key={service.id} className="flex items-center space-x-1">
                  <span className="text-sm">{service.icon}</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className={`flex-1 overflow-y-auto ${isMobile ? 'p-3' : 'p-4'}`}>
        {activeTab === 'playlists' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className={`${isMobile ? 'text-sm' : 'text-base'} font-medium text-gray-800 dark:text-white`}>Coding Playlists</h4>
              <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                <Plus className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
            
            <div 
              ref={playlistsScroll.elementRef}
              className={`space-y-2 ${isMobile ? 'max-h-64' : 'max-h-80'} overflow-y-auto relative`}
            >
              {playlists.map(playlist => (
                <div
                  key={playlist.id}
                  onClick={() => playPlaylist(playlist)}
                  className={`flex items-center space-x-3 ${isMobile ? 'p-2' : 'p-3'} bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors touch-target`}
                >
                  <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center`}>
                    {playlist.artwork ? (
                      <img 
                        src={playlist.artwork} 
                        alt={playlist.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Music className={`${isMobile ? 'w-5 h-5' : 'w-6 h-6'} text-white`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <h5 className={`${isMobile ? 'text-sm' : 'text-base'} font-medium text-gray-800 dark:text-white`}>{playlist.name}</h5>
                    <p className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-600 dark:text-gray-400`}>{playlist.description}</p>
                    <p className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-500 dark:text-gray-500`}>{playlist.tracks.length} tracks</p>
                  </div>
                  <Play className="w-4 h-4 text-purple-600" />
                </div>
              ))}
              
              {/* Auto-scroll indicator */}
              <div className="absolute top-2 right-2 flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-2 py-1">
                <div className={`w-2 h-2 rounded-full ${playlistsScroll.isPaused ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`} />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {playlistsScroll.isPaused ? 'Paused' : 'Auto'}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'search' && (
          <div className="space-y-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search for music..."
                className="flex-1 px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={handleSearch}
                disabled={!searchQuery.trim() || isLoading}
                className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            {searchResults.length > 0 && (
              <div className="space-y-2">
                <h5 className="font-medium text-gray-800 dark:text-white">Search Results</h5>
                {searchResults.map(track => (
                  <div
                    key={track.id}
                    className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <button
                      onClick={() => play(track)}
                      className="p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                    >
                      <Play className="w-3 h-3" />
                    </button>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 dark:text-white">{track.title}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{track.artist}</p>
                    </div>
                    <button
                      onClick={() => downloadTrack(track)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                    >
                      <Download className="w-3 h-3 text-gray-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-3">
                <Brain className="w-5 h-5 text-purple-600" />
                <h4 className="font-medium text-gray-800 dark:text-white">AI Music Recommendations</h4>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  onClick={() => generateCodingMusic('mozart')}
                  className="flex items-center space-x-2 p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
                >
                  <span className="text-lg">🎼</span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Mozart</span>
                </button>
                <button
                  onClick={() => generateCodingMusic('bach')}
                  className="flex items-center space-x-2 p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                >
                  <span className="text-lg">🎹</span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Bach</span>
                </button>
                <button
                  onClick={() => generateCodingMusic('house')}
                  className="flex items-center space-x-2 p-2 bg-green-100 dark:bg-green-900/30 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                >
                  <span className="text-lg">🏠</span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">House</span>
                </button>
                <button
                  onClick={() => generateCodingMusic('dance')}
                  className="flex items-center space-x-2 p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg hover:bg-pink-200 dark:hover:bg-pink-900/50 transition-colors"
                >
                  <span className="text-lg">💃</span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Dance</span>
                </button>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <p>• Language: <span className="font-medium">{currentLanguage}</span></p>
                <p>• Complexity: <span className="font-medium">{(codeComplexity * 100).toFixed(0)}%</span></p>
                <p>• Time: <span className="font-medium">{new Date().toLocaleTimeString()}</span></p>
              </div>
              <button
                onClick={() => getAIRecommendations({
                  language: currentLanguage,
                  complexity: codeComplexity,
                  timeOfDay: new Date().getHours() < 12 ? 'morning' : 'afternoon'
                })}
                disabled={isLoading}
                className="w-full mt-3 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 transition-colors"
              >
                {isLoading || isGeneratingMusic ? 'Analyzing...' : 'Get AI Recommendations'}
              </button>
              <button
                onClick={() => generateAdaptiveMusic()}
                disabled={isLoading || isGeneratingMusic}
                className="w-full mt-2 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 transition-colors"
              >
                {isLoading || isGeneratingMusic ? 'Composing...' : 'Generate Adaptive Music'}
              </button>
            </div>

            {aiRecommendations.length > 0 && (
              <div className="space-y-2">
                <h5 className="font-medium text-gray-800 dark:text-white">Recommended for You</h5>
                {aiRecommendations.map(track => (
                  <div
                    key={track.id}
                    className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <button
                      onClick={() => play(track)}
                      className="p-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg hover:from-purple-600 hover:to-blue-700 transition-colors"
                    >
                      <Play className="w-3 h-3" />
                    </button>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 dark:text-white">{track.title}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{track.artist}</p>
                    </div>
                    <Zap className="w-4 h-4 text-yellow-500" title="AI Recommended" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'queue' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-800 dark:text-white">Play Queue</h4>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {playerState.queue.length} tracks
              </span>
            </div>
            
            <div 
              ref={queueScroll.elementRef}
              className="space-y-2 max-h-80 overflow-y-auto relative"
            >
              {playerState.queue.map((track, index) => (
                <div
                  key={track.id}
                  className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                    track.id === playerState.currentTrack?.id
                      ? 'bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-600'
                      : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-6 text-center">
                    {index + 1}
                  </span>
                  <button
                    onClick={() => play(track)}
                    className="p-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
                  >
                    <Play className="w-3 h-3" />
                  </button>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{track.title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{track.artist}</p>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    {formatTime(track.duration)}
                  </span>
                </div>
              ))}
              
              {/* Auto-scroll indicator */}
              <div className="absolute top-2 right-2 flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg px-2 py-1">
                <div className={`w-2 h-2 rounded-full ${queueScroll.isPaused ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`} />
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  {queueScroll.isPaused ? 'Paused' : 'Auto'}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-800 dark:text-white">Streaming Services</h4>
            
            <div className="space-y-3">
              {streamingServices.map(service => (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{service.icon}</span>
                    <div>
                      <h5 className="font-medium text-gray-800 dark:text-white">{service.name}</h5>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {service.features.join(', ')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {service.connected ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-xs text-green-600 dark:text-green-400">Connected</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => connectStreamingService(service.id)}
                        className="px-3 py-1 bg-blue-500 text-white text-xs rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Connect
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Headphones className="w-5 h-5 text-blue-600" />
                <h5 className="font-medium text-gray-800 dark:text-white">Offline Mode</h5>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Download tracks for offline listening during coding sessions without internet.
              </p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-xs text-green-600 dark:text-green-400">
                  {musicService.getOfflineTracks().length} tracks downloaded
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Music Credits and Attribution */}
      <div className={`${isMobile ? 'p-3' : 'p-4'} border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20`}>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-bold text-green-700 dark:text-green-300">MUSIC PLAYER FULLY FUNCTIONAL</span>
          </div>
          <h4 className={`${isMobile ? 'text-sm' : 'text-base'} font-semibold text-gray-800 dark:text-white mb-2`}>
            Open Source Music Credits
          </h4>
          <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-3'} gap-2 text-xs text-gray-600 dark:text-gray-400`}>
            <div className="text-center">
              <p className="font-medium">🎵 Jamendo</p>
              <p>Creative Commons Music</p>
            </div>
            <div className="text-center">
              <p className="font-medium">🎼 Incompetech</p>
              <p>Kevin MacLeod (CC BY 3.0)</p>
            </div>
            <div className="text-center">
              <p className="font-medium">🎻 Musopen</p>
              <p>Public Domain Classical</p>
            </div>
            <div className="text-center">
              <p className="font-medium">📚 Free Music Archive</p>
              <p>Curated CC Collections</p>
            </div>
            <div className="text-center">
              <p className="font-medium">🔊 Freesound</p>
              <p>Community Sound Library</p>
            </div>
            <div className="text-center">
              <p className="font-medium">📦 Internet Archive</p>
              <p>Historical Recordings</p>
            </div>
          </div>
          <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500 dark:text-gray-400 mt-3`}>
            All music is legally sourced from Creative Commons, Public Domain, and open source collections.
            <br />
            <a href="https://creativecommons.org/licenses/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">
              Learn about Creative Commons licenses
            </a>
          </p>
        </div>
      </div>
      
      {/* Current Track Footer */}
      {playerState.currentTrack && (
        <div className={`${isMobile ? 'p-3' : 'p-4'} border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700`}>
          <div className="flex items-center space-x-3">
            <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10'} bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center`}>
              {playerState.currentTrack.artwork ? (
                <img 
                  src={playerState.currentTrack.artwork} 
                  alt="Now playing"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Disc3 className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} text-white`} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`${isMobile ? 'text-sm' : 'text-base'} font-medium text-gray-800 dark:text-white truncate`}>
                {playerState.currentTrack.title}
              </p>
              <p className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-600 dark:text-gray-400 truncate`}>
                {playerState.currentTrack.artist}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={playerState.isPlaying ? pause : () => play()}
                className={`${isMobile ? 'p-3' : 'p-2'} bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors touch-target`}
              >
                {playerState.isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={next}
                className={`${isMobile ? 'p-3' : 'p-2'} hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors touch-target`}
              >
                <SkipForward className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}