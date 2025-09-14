import { useState, useEffect, useCallback } from 'react';
import { musicService } from '../services/musicService';

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

export function useMusic() {
  const [playerState, setPlayerState] = useState<MusicPlayerState>(() => musicService.getState());
  const [playlists, setPlaylists] = useState<Playlist[]>(() => musicService.getCodingPlaylists());
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<Track[]>([]);
  const [streamingServices, setStreamingServices] = useState(() => musicService.getStreamingServices());
  const [generatedTracks, setGeneratedTracks] = useState<any[]>([]);
  const [isGeneratingMusic, setIsGeneratingMusic] = useState(false);

  // Set up event listeners for music service
  useEffect(() => {
    const handleStateChange = (newState: MusicPlayerState) => {
      setPlayerState(newState);
    };

    const handlePlaylistsChange = (newPlaylists: Playlist[]) => {
      setPlaylists(newPlaylists);
    };

    musicService.on('state-changed', handleStateChange);
    musicService.on('playlists-changed', handlePlaylistsChange);

    return () => {
      musicService.off('state-changed', handleStateChange);
      musicService.off('playlists-changed', handlePlaylistsChange);
    };
  }, []);

  const play = useCallback(async () => {
    await musicService.play();
    setPlayerState(musicService.getState());
  }, []);

  const pause = useCallback(() => {
    musicService.pause();
    setPlayerState(musicService.getState());
  }, []);

  const stop = useCallback(() => {
    musicService.stop();
    setPlayerState(musicService.getState());
  }, []);

  const next = useCallback(() => {
    musicService.next();
    setPlayerState(musicService.getState());
  }, []);

  const previous = useCallback(() => {
    musicService.previous();
    setPlayerState(musicService.getState());
  }, []);

  const setVolume = useCallback((volume: number) => {
    musicService.setVolume(volume);
    setPlayerState(musicService.getState());
  }, []);

  const seek = useCallback((time: number) => {
    musicService.seek(time);
    setPlayerState(musicService.getState());
  }, []);

  const toggleShuffle = useCallback(() => {
    musicService.toggleShuffle();
    setPlayerState(musicService.getState());
  }, []);

  const toggleRepeat = useCallback(() => {
    musicService.toggleRepeat();
    setPlayerState(musicService.getState());
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
      const track = await musicService.generateAdaptiveMusic(currentCode, language, complexity);
      setGeneratedTracks(prev => [...prev, track]);
      return track;
    } catch (error) {
      console.error('Adaptive music generation failed:', error);
      throw error;
    } finally {
      setIsGeneratingMusic(false);
    }
  }, []);

  const generateCodingPlaylist = useCallback(async (scenario: 'deep-focus' | 'debugging' | 'creative' | 'learning') => {
    setIsGeneratingMusic(true);
    try {
      const tracks = await musicService.generateCodingPlaylist(scenario);
      setGeneratedTracks(prev => [...prev, ...tracks]);
      return tracks;
    } catch (error) {
      console.error('Coding playlist generation failed:', error);
      throw error;
    } finally {
      setIsGeneratingMusic(false);
    }
  }, []);

  const clearGeneratedMusic = useCallback(() => {
    musicService.clearGeneratedTracks();
    setGeneratedTracks([]);
  }, []);

  const playPlaylist = useCallback((playlist: Playlist) => {
    musicService.playPlaylist(playlist);
    setPlayerState(musicService.getState());
  }, []);

  const searchTracks = useCallback(async (query: string, service?: string) => {
    setIsLoading(true);
    try {
      const results = await musicService.searchTracks(query, service);
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
      const success = await musicService.connectStreamingService(service, credentials);
      if (success) {
        setStreamingServices(musicService.getStreamingServices());
      }
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
      const recommendations = await musicService.getAIRecommendations(codeContext);
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
    const playlist = musicService.createPlaylist(name, description);
    setPlaylists(musicService.getCodingPlaylists());
    return playlist;
  }, []);

  const addToPlaylist = useCallback((playlistId: string, track: Track) => {
    musicService.addToPlaylist(playlistId, track);
    setPlaylists(musicService.getCodingPlaylists());
  }, []);

  const downloadTrack = useCallback(async (track: Track) => {
    setIsLoading(true);
    try {
      const success = await musicService.downloadTrack(track);
      return success;
    } catch (error) {
      console.error('Download failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const formatTime = useCallback((seconds: number = 0): string => {
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
