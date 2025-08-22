import { useState, useEffect, useCallback } from 'react';

export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  url?: string;
  artwork?: string;
  genre?: string;
  year?: number;
  isLocal: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  tracks: Track[];
  artwork?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MusicPlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  shuffle: boolean;
  repeat: 'none' | 'one' | 'all';
  queue: Track[];
  currentPlaylist: Playlist | null;
}

// Mock music service for frontend-only mode
const mockMusicService = {
  getState: (): MusicPlayerState => ({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    volume: 0.7,
    shuffle: false,
    repeat: 'none' as const,
    queue: [],
    currentPlaylist: null
  }),
  
  getCodingPlaylists: (): Playlist[] => [
    {
      id: 'focus',
      name: 'Focus Music',
      description: 'Concentration tracks for deep coding',
      tracks: [],
      isPublic: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  
  getStreamingServices: () => [],
  
  on: () => {},
  off: () => {},
  
  play: async () => {},
  pause: () => {},
  stop: () => {},
  next: () => {},
  previous: () => {},
  setVolume: () => {},
  seek: () => {},
  toggleShuffle: () => {},
  toggleRepeat: () => {},
  playPlaylist: () => {},
  searchTracks: async () => [],
  connectStreamingService: async () => false,
  getAIRecommendations: async () => [],
  createPlaylist: () => ({ id: '', name: '', description: '', tracks: [], isPublic: false, createdAt: new Date(), updatedAt: new Date() }),
  addToPlaylist: () => {},
  downloadTrack: async () => false
};

export function useMusic() {
  const [playerState, setPlayerState] = useState<MusicPlayerState>(mockMusicService.getState());
  const [playlists, setPlaylists] = useState<Playlist[]>(mockMusicService.getCodingPlaylists());
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<Track[]>([]);
  const [streamingServices, setStreamingServices] = useState(mockMusicService.getStreamingServices());
  const [generatedTracks, setGeneratedTracks] = useState<any[]>([]);
  const [isGeneratingMusic, setIsGeneratingMusic] = useState(false);

  const play = useCallback(async () => {
    await mockMusicService.play();
  }, []);

  const pause = useCallback(() => {
    mockMusicService.pause();
  }, []);

  const stop = useCallback(() => {
    mockMusicService.stop();
  }, []);

  const next = useCallback(() => {
    mockMusicService.next();
  }, []);

  const previous = useCallback(() => {
    mockMusicService.previous();
  }, []);

  const setVolume = useCallback((volume: number) => {
    mockMusicService.setVolume(volume);
  }, []);

  const seek = useCallback((time: number) => {
    mockMusicService.seek(time);
  }, []);

  const toggleShuffle = useCallback(() => {
    mockMusicService.toggleShuffle();
  }, []);

  const toggleRepeat = useCallback(() => {
    mockMusicService.toggleRepeat();
  }, []);

  const generateAIMusic = useCallback(async (options: any) => {
    setIsGeneratingMusic(true);
    try {
      // Mock AI music generation
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockTrack = {
        id: `ai-${Date.now()}`,
        title: 'AI Generated Track',
        artist: 'Codette AI',
        duration: 180
      };
      setGeneratedTracks(prev => [...prev, mockTrack]);
    } catch (error) {
      console.error('AI music generation failed:', error);
      throw error;
    } finally {
      setIsGeneratingMusic(false);
    }
  }, []);

  const generateAdaptiveMusic = useCallback(async (currentCode: string, language: string, complexity: number) => {
    setIsGeneratingMusic(true);
    try {
      // Mock adaptive music generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockTrack = {
        id: `adaptive-${Date.now()}`,
        title: `Adaptive ${language} Music`,
        artist: 'Codette AI',
        duration: 300
      };
      setGeneratedTracks(prev => [...prev, mockTrack]);
      return mockTrack;
    } catch (error) {
      console.error('Adaptive music generation failed:', error);
      throw error;
    } finally {
      setIsGeneratingMusic(false);
    }
  }, [play]);

  const generateCodingPlaylist = useCallback(async (scenario: 'deep-focus' | 'debugging' | 'creative' | 'learning') => {
    setIsGeneratingMusic(true);
    try {
      // Mock coding playlist generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockTracks = Array.from({ length: 5 }, (_, i) => ({
        id: `${scenario}-${i}`,
        title: `${scenario} Track ${i + 1}`,
        artist: 'Codette AI',
        duration: 180 + i * 30
      }));
      setGeneratedTracks(prev => [...prev, ...mockTracks]);
      return mockTracks;
    } catch (error) {
      console.error('Coding playlist generation failed:', error);
      throw error;
    } finally {
      setIsGeneratingMusic(false);
    }
  }, []);

  const clearGeneratedMusic = useCallback(() => {
    setGeneratedTracks([]);
  }, []);

  const playPlaylist = useCallback((playlist: Playlist) => {
    mockMusicService.playPlaylist(playlist);
  }, []);

  const searchTracks = useCallback(async (query: string, service?: string) => {
    setIsLoading(true);
    try {
      const results = await mockMusicService.searchTracks(query, service);
      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const connectStreamingService = useCallback(async (service: string, credentials?: any) => {
    setIsLoading(true);
    try {
      const success = await mockMusicService.connectStreamingService(service, credentials);
      return success;
    } catch (error) {
      console.error('Service connection failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAIRecommendations = useCallback(async (codeContext: {
    language: string;
    complexity: number;
    timeOfDay: string;
    mood?: string;
  }) => {
    setIsLoading(true);
    try {
      const recommendations = await mockMusicService.getAIRecommendations(codeContext);
      setAiRecommendations(recommendations);
      return recommendations;
    } catch (error) {
      console.error('AI recommendations failed:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPlaylist = useCallback((name: string, description: string = '') => {
    return mockMusicService.createPlaylist(name, description);
  }, []);

  const addToPlaylist = useCallback((playlistId: string, track: Track) => {
    mockMusicService.addToPlaylist(playlistId, track);
  }, []);

  const downloadTrack = useCallback(async (track: Track) => {
    setIsLoading(true);
    try {
      const success = await mockMusicService.downloadTrack(track);
      return success;
    } catch (error) {
      console.error('Download failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const formatTime = useCallback((seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    // State
    playerState,
    playlists,
    searchResults,
    isLoading,
    aiRecommendations,
    streamingServices,
    generatedTracks,
    isGeneratingMusic,
    
    // Playback controls
    play,
    pause,
    stop,
    next,
    previous,
    setVolume,
    seek,
    toggleShuffle,
    toggleRepeat,
    
    // Playlist management
    playPlaylist,
    createPlaylist,
    addToPlaylist,
    
    // Search and discovery
    searchTracks,
    getAIRecommendations,
    generateAIMusic,
    generateAdaptiveMusic,
    generateCodingPlaylist,
    clearGeneratedMusic,
    
    // Streaming services
    connectStreamingService,
    
    // Offline support
    downloadTrack,
    
    // Utilities
    formatTime
  };
}
