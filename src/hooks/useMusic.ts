import { useState, useCallback, useRef, useEffect } from 'react';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  url: string;
  genre: string;
  artwork?: string;
  isLocal?: boolean;
  aiGenerated?: boolean;
  complexity?: number;
  mood?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  tracks: Track[];
  artwork?: string;
  category: 'ai-generated' | 'curated' | 'user-created';
  scenario?: string;
}

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  shuffle: boolean;
  repeat: 'none' | 'one' | 'all';
  queue: Track[];
  isLoading: boolean;
}

export interface StreamingService {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  features: string[];
}

export function useMusic() {
  const [playerState, setPlayerState] = useState<PlayerState>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    volume: 0.7,
    shuffle: false,
    repeat: 'none',
    queue: [],
    isLoading: false
  });

  const [playlists, setPlaylists] = useState<Playlist[]>([
    {
      id: 'deep-focus',
      name: 'Deep Focus Coding',
      description: 'Ambient and minimal music for deep concentration',
      category: 'curated',
      scenario: 'deep-focus',
      tracks: [
        {
          id: 'ambient-1',
          title: 'Floating Point',
          artist: 'Codette AI',
          album: 'Algorithmic Ambience',
          duration: 240,
          url: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjuR2e/AciMFl',
          genre: 'ambient',
          aiGenerated: true,
          complexity: 0.2,
          mood: 'calm'
        },
        {
          id: 'minimal-1',
          title: 'Binary Dreams',
          artist: 'Codette AI',
          album: 'Minimal Code',
          duration: 300,
          url: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjuR2e/AciMFl',
          genre: 'minimal',
          aiGenerated: true,
          complexity: 0.3,
          mood: 'focused'
        }
      ]
    },
    {
      id: 'debugging',
      name: 'Debug Mode',
      description: 'Calm, methodical music for debugging sessions',
      category: 'curated',
      scenario: 'debugging',
      tracks: [
        {
          id: 'debug-1',
          title: 'Stack Trace Serenity',
          artist: 'Codette AI',
          album: 'Debug Sessions',
          duration: 280,
          url: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjuR2e/AciMFl',
          genre: 'ambient',
          aiGenerated: true,
          complexity: 0.1,
          mood: 'methodical'
        }
      ]
    },
    {
      id: 'creative',
      name: 'Creative Flow',
      description: 'Inspiring music for creative coding sessions',
      category: 'curated',
      scenario: 'creative',
      tracks: [
        {
          id: 'creative-1',
          title: 'Innovation Pulse',
          artist: 'Codette AI',
          album: 'Creative Code',
          duration: 320,
          url: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjuR2e/AciMFl',
          genre: 'electronic',
          aiGenerated: true,
          complexity: 0.7,
          mood: 'inspiring'
        }
      ]
    }
  ]);

  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<Track[]>([]);
  const [generatedTracks, setGeneratedTracks] = useState<Track[]>([]);
  const [lastGeneratedPlaylist, setLastGeneratedPlaylist] = useState<Playlist | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [streamingServices] = useState<StreamingService[]>([
    {
      id: 'spotify',
      name: 'Spotify',
      icon: '🎵',
      connected: false,
      features: ['Streaming', 'Playlists', 'Discovery']
    },
    {
      id: 'youtube',
      name: 'YouTube Music',
      icon: '📺',
      connected: false,
      features: ['Videos', 'Music', 'Live']
    },
    {
      id: 'soundcloud',
      name: 'SoundCloud',
      icon: '☁️',
      connected: false,
      features: ['Independent', 'Podcasts', 'Community']
    },
    {
      id: 'local',
      name: 'Local Files',
      icon: '💾',
      connected: true,
      features: ['Offline', 'AI Generated', 'Custom']
    }
  ]);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    audioRef.current.addEventListener('ended', handleTrackEnd);
    audioRef.current.addEventListener('loadstart', () => setPlayerState(prev => ({ ...prev, isLoading: true })));
    audioRef.current.addEventListener('canplay', () => setPlayerState(prev => ({ ...prev, isLoading: false })));

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('ended', handleTrackEnd);
        audioRef.current.pause();
      }
    };
  }, []);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setPlayerState(prev => ({
        ...prev,
        currentTime: audioRef.current!.currentTime
      }));
    }
  };

  const handleTrackEnd = () => {
    next();
  };

  const play = useCallback(async (track?: Track) => {
    try {
      if (track) {
        setPlayerState(prev => ({ ...prev, currentTrack: track, isLoading: true }));
        
        if (audioRef.current) {
          audioRef.current.src = track.url;
          audioRef.current.volume = playerState.volume;
          await audioRef.current.play();
          setPlayerState(prev => ({ ...prev, isPlaying: true, isLoading: false }));
        }
      } else if (audioRef.current && playerState.currentTrack) {
        await audioRef.current.play();
        setPlayerState(prev => ({ ...prev, isPlaying: true }));
      }
    } catch (error) {
      console.error('Playback failed:', error);
      setPlayerState(prev => ({ ...prev, isPlaying: false, isLoading: false }));
      
      // Create a simple beep sound as fallback
      createBeepSound();
    }
  }, [playerState.volume, playerState.currentTrack]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayerState(prev => ({ ...prev, isPlaying: false }));
    }
  }, []);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setPlayerState(prev => ({ 
        ...prev, 
        isPlaying: false, 
        currentTime: 0 
      }));
    }
  }, []);

  const next = useCallback(() => {
    const currentIndex = playerState.queue.findIndex(t => t.id === playerState.currentTrack?.id);
    const nextIndex = (currentIndex + 1) % playerState.queue.length;
    
    if (playerState.queue[nextIndex]) {
      play(playerState.queue[nextIndex]);
    }
  }, [playerState.queue, playerState.currentTrack, play]);

  const previous = useCallback(() => {
    const currentIndex = playerState.queue.findIndex(t => t.id === playerState.currentTrack?.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : playerState.queue.length - 1;
    
    if (playerState.queue[prevIndex]) {
      play(playerState.queue[prevIndex]);
    }
  }, [playerState.queue, playerState.currentTrack, play]);

  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    setPlayerState(prev => ({ ...prev, volume: clampedVolume }));
    
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current && playerState.currentTrack) {
      const clampedTime = Math.max(0, Math.min(playerState.currentTrack.duration, time));
      audioRef.current.currentTime = clampedTime;
      setPlayerState(prev => ({ ...prev, currentTime: clampedTime }));
    }
  }, [playerState.currentTrack]);

  const toggleShuffle = useCallback(() => {
    setPlayerState(prev => ({ ...prev, shuffle: !prev.shuffle }));
  }, []);

  const toggleRepeat = useCallback(() => {
    setPlayerState(prev => ({
      ...prev,
      repeat: prev.repeat === 'none' ? 'all' : prev.repeat === 'all' ? 'one' : 'none'
    }));
  }, []);

  const playPlaylist = useCallback((playlist: Playlist) => {
    setPlayerState(prev => ({ 
      ...prev, 
      queue: playlist.tracks,
      currentTrack: playlist.tracks[0] || null
    }));
    
    if (playlist.tracks.length > 0) {
      play(playlist.tracks[0]);
    }
  }, [play]);

  const searchTracks = useCallback(async (query: string, service: string) => {
    setIsLoading(true);
    try {
      // Simulate search results
      const mockResults: Track[] = [
        {
          id: `search-${Date.now()}-1`,
          title: `${query} - Coding Mix`,
          artist: 'Various Artists',
          album: 'Search Results',
          duration: 180,
          url: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjuR2e/AciMFl',
          genre: 'electronic',
          isLocal: false
        },
        {
          id: `search-${Date.now()}-2`,
          title: `Focus ${query}`,
          artist: 'AI Composer',
          album: 'Generated Music',
          duration: 220,
          url: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjuR2e/AciMFl',
          genre: 'ambient',
          aiGenerated: true
        }
      ];
      
      setSearchResults(mockResults);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAIRecommendations = useCallback(async (context: {
    language: string;
    complexity: number;
    timeOfDay: string;
    mood?: string;
  }) => {
    setIsLoading(true);
    try {
      // Generate AI recommendations based on context
      const recommendations: Track[] = [
        {
          id: `ai-rec-${Date.now()}-1`,
          title: `${context.language} Flow State`,
          artist: 'Codette AI Composer',
          album: 'Adaptive Coding Music',
          duration: 300,
          url: createSynthesizedAudio(context.complexity, 'focused'),
          genre: 'adaptive',
          aiGenerated: true,
          complexity: context.complexity,
          mood: context.mood || 'focused'
        },
        {
          id: `ai-rec-${Date.now()}-2`,
          title: `${context.timeOfDay} Coding Session`,
          artist: 'Codette AI',
          album: 'Time-Adaptive Music',
          duration: 250,
          url: createSynthesizedAudio(context.complexity * 0.8, context.timeOfDay),
          genre: 'ambient',
          aiGenerated: true,
          complexity: context.complexity * 0.8,
          mood: context.timeOfDay
        }
      ];
      
      setAiRecommendations(recommendations);
      return recommendations;
    } catch (error) {
      console.error('AI recommendations failed:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const generateAdaptiveMusic = useCallback(async (context: {
    language: string;
    complexity: number;
    codeLength: number;
    timeOfDay: string;
  }) => {
    setIsLoading(true);
    try {
      // Generate adaptive music based on coding context
      const adaptiveTrack: Track = {
        id: `adaptive-${Date.now()}`,
        title: `Adaptive ${context.language} Symphony`,
        artist: 'Codette AI Composer',
        album: 'Real-Time Generated',
        duration: Math.max(180, Math.min(600, context.codeLength / 10)), // Duration based on code length
        url: createSynthesizedAudio(context.complexity, 'adaptive'),
        genre: 'adaptive',
        aiGenerated: true,
        complexity: context.complexity,
        mood: 'adaptive'
      };

      setGeneratedTracks(prev => [adaptiveTrack, ...prev.slice(0, 9)]); // Keep last 10
      
      // Auto-play the generated track
      await play(adaptiveTrack);
      
      return adaptiveTrack;
    } catch (error) {
      console.error('Adaptive music generation failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [play]);

  const generateCodingPlaylist = useCallback(async (scenario: string, language?: string) => {
    setIsLoading(true);
    try {
      const tracks: Track[] = [];
      const trackCount = 5 + Math.floor(Math.random() * 5); // 5-10 tracks
      
      for (let i = 0; i < trackCount; i++) {
        const complexity = Math.random();
        tracks.push({
          id: `playlist-${scenario}-${Date.now()}-${i}`,
          title: `${scenario} Track ${i + 1}${language ? ` (${language})` : ''}`,
          artist: 'Codette AI Composer',
          album: `${scenario} Coding Playlist`,
          duration: 180 + Math.floor(Math.random() * 240), // 3-7 minutes
          url: createSynthesizedAudio(complexity, scenario),
          genre: getGenreForScenario(scenario),
          aiGenerated: true,
          complexity,
          mood: scenario
        });
      }

      const playlist: Playlist = {
        id: `generated-${scenario}-${Date.now()}`,
        name: `${scenario.replace('-', ' ')} Coding Playlist`,
        description: `AI-generated playlist optimized for ${scenario.replace('-', ' ')} coding sessions${language ? ` in ${language}` : ''}`,
        tracks,
        category: 'ai-generated',
        scenario
      };

      setPlaylists(prev => [playlist, ...prev]);
      setLastGeneratedPlaylist(playlist);
      
      // Auto-play the playlist
      playPlaylist(playlist);
      
      return playlist;
    } catch (error) {
      console.error('Playlist generation failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [playPlaylist]);

  const connectStreamingService = useCallback(async (serviceId: string) => {
    // Simulate connection process
    console.log(`Connecting to ${serviceId}...`);
    return true;
  }, []);

  const downloadTrack = useCallback(async (track: Track) => {
    console.log(`Downloading ${track.title}...`);
    // Simulate download
    return true;
  }, []);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const getOfflineTracks = useCallback(() => {
    return generatedTracks.filter(track => track.isLocal);
  }, [generatedTracks]);

  return {
    playerState,
    playlists,
    searchResults,
    isLoading,
    aiRecommendations,
    streamingServices,
    generatedTracks,
    lastGeneratedPlaylist,
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
    generateAdaptiveMusic,
    generateCodingPlaylist,
    connectStreamingService,
    downloadTrack,
    formatTime,
    getOfflineTracks
  };
}

// Helper functions for audio generation
function createSynthesizedAudio(complexity: number, mood: string): string {
  // Create a simple synthesized audio data URL
  // This is a placeholder - in a real implementation, you'd generate actual audio
  const sampleRate = 44100;
  const duration = 2; // 2 seconds sample
  const samples = sampleRate * duration;
  const buffer = new ArrayBuffer(samples * 2);
  const view = new DataView(buffer);
  
  // Generate simple sine wave based on complexity and mood
  const frequency = getFrequencyForMood(mood, complexity);
  
  for (let i = 0; i < samples; i++) {
    const sample = Math.sin(2 * Math.PI * frequency * i / sampleRate) * 0.3;
    const intSample = Math.max(-32768, Math.min(32767, sample * 32767));
    view.setInt16(i * 2, intSample, true);
  }
  
  // Convert to base64 (simplified)
  return 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjuR2e/AciMFl';
}

function getFrequencyForMood(mood: string, complexity: number): number {
  const baseFrequencies = {
    'calm': 220,
    'focused': 261.63, // C4
    'energetic': 329.63, // E4
    'creative': 392, // G4
    'debugging': 196, // G3
    'adaptive': 261.63 + (complexity * 100),
    'morning': 293.66, // D4
    'afternoon': 349.23, // F4
    'night': 196 // G3
  };
  
  return baseFrequencies[mood as keyof typeof baseFrequencies] || 261.63;
}

function getGenreForScenario(scenario: string): string {
  const genreMap = {
    'deep-focus': 'ambient',
    'debugging': 'minimal',
    'creative': 'electronic',
    'learning': 'classical',
    'energetic': 'house',
    'calm': 'ambient'
  };
  
  return genreMap[scenario as keyof typeof genreMap] || 'ambient';
}

function createBeepSound() {
  // Create a simple beep sound using Web Audio API
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (error) {
    console.warn('Web Audio API not available:', error);
  }
}