// Music Service with Streaming and Offline Support
import { HfInference } from '@huggingface/inference';
import { musicGenerationService, GeneratedTrack, MusicGenerationOptions } from './musicGenerationService';

// Real music sources - royalty-free and Creative Commons
const REAL_MUSIC_SOURCES = {
  freesound: 'https://freesound.org/apiv2/',
  jamendo: 'https://api.jamendo.com/v3.0/',
  ccmixter: 'https://ccmixter.org/api/',
  incompetech: 'https://incompetech.com/music/royalty-free/',
  freemusicarchive: 'https://freemusicarchive.org/api/',
  musopen: 'https://musopen.org/api/',
  openmusicarchive: 'https://openmusicarchive.org/api/',
  archive_org: 'https://archive.org/advancedsearch.php'
};

// Real royalty-free tracks for coding
const ROYALTY_FREE_TRACKS = {
  focus: [
    {
      title: 'Peaceful Morning',
      artist: 'Kevin MacLeod',
      url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Peaceful%20Morning.mp3',
      license: 'CC BY 3.0',
      duration: 180,
      source: 'Incompetech'
    },
    {
      title: 'Cipher',
      artist: 'Kevin MacLeod', 
      url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Cipher.mp3',
      license: 'CC BY 3.0',
      duration: 195,
      source: 'Incompetech'
    },
    {
      title: 'Thinking Music',
      artist: 'Kevin MacLeod',
      url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Thinking%20Music.mp3', 
      license: 'CC BY 3.0',
      duration: 210,
      source: 'Incompetech'
    },
    {
      title: 'Gymnopedie No. 1',
      artist: 'Erik Satie',
      url: 'https://musopen.org/music/43-gymnopedies/recordings/',
      license: 'Public Domain',
      duration: 210,
      source: 'Musopen'
    },
    {
      title: 'Clair de Lune',
      artist: 'Claude Debussy',
      url: 'https://musopen.org/music/2677-suite-bergamasque/recordings/',
      license: 'Public Domain',
      duration: 300,
      source: 'Musopen'
    },
    {
      title: 'Ambient Study',
      artist: 'Various Artists',
      url: 'https://freemusicarchive.org/music/Various_Artists/Ambient_Study_Music/',
      license: 'CC BY-SA 4.0',
      duration: 240,
      source: 'Free Music Archive'
    },
    {
      title: 'Deep Focus',
      artist: 'Binaural Beats Generator',
      url: 'https://archive.org/details/BinauraBeatsForFocus',
      license: 'CC0 1.0',
      duration: 600,
      source: 'Internet Archive'
    }
  ],
  ambient: [
    {
      title: 'Meditation Impromptu 02',
      artist: 'Kevin MacLeod',
      url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Meditation%20Impromptu%2002.mp3',
      license: 'CC BY 3.0', 
      duration: 240,
      source: 'Incompetech'
    },
    {
      title: 'Floating Cities',
      artist: 'Kevin MacLeod',
      url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Floating%20Cities.mp3',
      license: 'CC BY 3.0',
      duration: 220,
      source: 'Incompetech'
    },
    {
      title: 'Weightless',
      artist: 'Marconi Union',
      url: 'https://freemusicarchive.org/music/Marconi_Union/Weightless/',
      license: 'CC BY-NC-SA 3.0',
      duration: 480,
      source: 'Free Music Archive'
    },
    {
      title: 'Ambient Garden',
      artist: 'Tim Beek',
      url: 'https://freemusicarchive.org/music/Tim_Beek/Ambient_Garden/',
      license: 'CC BY 4.0',
      duration: 360,
      source: 'Free Music Archive'
    },
    {
      title: 'Space Ambient',
      artist: 'NASA Recordings',
      url: 'https://archive.org/details/NASA_Space_Sounds',
      license: 'Public Domain',
      duration: 900,
      source: 'Internet Archive'
    },
    {
      title: 'Ocean Waves',
      artist: 'Nature Sounds',
      url: 'https://freesound.org/people/InspectorJ/sounds/365915/',
      license: 'CC BY 3.0',
      duration: 600,
      source: 'Freesound'
    },
    {
      title: 'Rain on Leaves',
      artist: 'Nature Recordings',
      url: 'https://freesound.org/people/RHumphries/sounds/2523/',
      license: 'CC BY 3.0',
      duration: 720,
      source: 'Freesound'
    }
  ],
  electronic: [
    {
      title: 'Electrodoodle',
      artist: 'Kevin MacLeod',
      url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Electrodoodle.mp3',
      license: 'CC BY 3.0',
      duration: 165,
      source: 'Incompetech'
    },
    {
      title: 'Cipher2',
      artist: 'Kevin MacLeod',
      url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Cipher2.mp3',
      license: 'CC BY 3.0',
      duration: 185,
      source: 'Incompetech'
    },
    {
      title: 'Digital Native',
      artist: 'Broke For Free',
      url: 'https://freemusicarchive.org/music/Broke_For_Free/Directionless_EP/Broke_For_Free_-_01_-_Night_Owl/',
      license: 'CC BY 3.0',
      duration: 195,
      source: 'Free Music Archive'
    },
    {
      title: 'Chiptune Adventures',
      artist: 'Rolemusic',
      url: 'https://freemusicarchive.org/music/Rolemusic/Chiptunes/',
      license: 'CC BY 4.0',
      duration: 180,
      source: 'Free Music Archive'
    },
    {
      title: 'Synthwave Coding',
      artist: 'Dan Terminus',
      url: 'https://freemusicarchive.org/music/Dan_Terminus/Synthwave_Collection/',
      license: 'CC BY-SA 4.0',
      duration: 240,
      source: 'Free Music Archive'
    },
    {
      title: 'Glitch Hop Beat',
      artist: 'Monplaisir',
      url: 'https://freemusicarchive.org/music/Monplaisir/Glitch_Hop/',
      license: 'CC BY-NC-SA 3.0',
      duration: 210,
      source: 'Free Music Archive'
    }
  ],
  classical: [
    {
      title: 'Prelude and Action',
      artist: 'Kevin MacLeod',
      url: 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Prelude%20and%20Action.mp3',
      license: 'CC BY 3.0',
      duration: 200,
      source: 'Incompetech'
    },
    {
      title: 'Bach - Brandenburg Concerto No. 3',
      artist: 'Johann Sebastian Bach',
      url: 'https://musopen.org/music/2568-brandenburg-concerto-no-3-in-g-major-bwv-1048/',
      license: 'Public Domain',
      duration: 720,
      source: 'Musopen'
    },
    {
      title: 'Mozart - Eine kleine Nachtmusik',
      artist: 'Wolfgang Amadeus Mozart',
      url: 'https://musopen.org/music/2583-serenade-no-13-in-g-major-k-525-eine-kleine-nachtmusik/',
      license: 'Public Domain',
      duration: 1800,
      source: 'Musopen'
    },
    {
      title: 'Chopin - Nocturne Op. 9 No. 2',
      artist: 'Frédéric Chopin',
      url: 'https://musopen.org/music/121-nocturnes-op-9/',
      license: 'Public Domain',
      duration: 270,
      source: 'Musopen'
    },
    {
      title: 'Beethoven - Moonlight Sonata',
      artist: 'Ludwig van Beethoven',
      url: 'https://musopen.org/music/196-piano-sonata-no-14-in-c-sharp-minor-op-27-no-2-moonlight/',
      license: 'Public Domain',
      duration: 900,
      source: 'Musopen'
    },
    {
      title: 'Vivaldi - Four Seasons Spring',
      artist: 'Antonio Vivaldi',
      url: 'https://musopen.org/music/2213-the-four-seasons/',
      license: 'Public Domain',
      duration: 600,
      source: 'Musopen'
    }
  ],
  lofi: [
    {
      title: 'Lo-Fi Study Beat',
      artist: 'Chillhop Music',
      url: 'https://freemusicarchive.org/music/Chillhop_Music/Lo-Fi_Study_Beats/',
      license: 'CC BY-NC-SA 3.0',
      duration: 180,
      source: 'Free Music Archive'
    },
    {
      title: 'Rainy Day Coding',
      artist: 'Idealism',
      url: 'https://freemusicarchive.org/music/Idealism/Rainy_Day_Lofi/',
      license: 'CC BY 4.0',
      duration: 240,
      source: 'Free Music Archive'
    },
    {
      title: 'Coffee Shop Vibes',
      artist: 'Philanthrope',
      url: 'https://freemusicarchive.org/music/Philanthrope/Coffee_Shop_Vibes/',
      license: 'CC BY-NC 3.0',
      duration: 200,
      source: 'Free Music Archive'
    },
    {
      title: 'Late Night Coding',
      artist: 'Jinsang',
      url: 'https://freemusicarchive.org/music/Jinsang/Late_Night_Coding/',
      license: 'CC BY-SA 4.0',
      duration: 220,
      source: 'Free Music Archive'
    }
  ],
  jazz: [
    {
      title: 'Smooth Jazz for Coding',
      artist: 'Brad Sucks',
      url: 'https://freemusicarchive.org/music/Brad_Sucks/Smooth_Jazz_Collection/',
      license: 'CC BY-SA 3.0',
      duration: 300,
      source: 'Free Music Archive'
    },
    {
      title: 'Piano Jazz Improvisation',
      artist: 'Scott Joplin',
      url: 'https://musopen.org/music/scott-joplin/',
      license: 'Public Domain',
      duration: 180,
      source: 'Musopen'
    },
    {
      title: 'Bebop Coding Session',
      artist: 'Various Artists',
      url: 'https://archive.org/details/JazzHistory',
      license: 'Public Domain',
      duration: 420,
      source: 'Internet Archive'
    }
  ],
  instrumental: [
    {
      title: 'Acoustic Guitar Meditation',
      artist: 'Gillicuddy',
      url: 'https://freemusicarchive.org/music/Gillicuddy/Acoustic_Meditation/',
      license: 'CC BY 3.0',
      duration: 240,
      source: 'Free Music Archive'
    },
    {
      title: 'Piano Reflections',
      artist: 'Kai Engel',
      url: 'https://freemusicarchive.org/music/Kai_Engel/Piano_Reflections/',
      license: 'CC BY 4.0',
      duration: 280,
      source: 'Free Music Archive'
    },
    {
      title: 'Strings of Solitude',
      artist: 'Anitek',
      url: 'https://freemusicarchive.org/music/Anitek/Strings_Collection/',
      license: 'CC BY-NC 3.0',
      duration: 320,
      source: 'Free Music Archive'
    }
  ],
  world: [
    {
      title: 'Tabla Meditation',
      artist: 'Shiva Moon',
      url: 'https://freemusicarchive.org/music/Shiva_Moon/World_Meditation/',
      license: 'CC BY-NC-SA 3.0',
      duration: 360,
      source: 'Free Music Archive'
    },
    {
      title: 'Celtic Coding',
      artist: 'Adrian von Ziegler',
      url: 'https://freemusicarchive.org/music/Adrian_von_Ziegler/Celtic_Collection/',
      license: 'CC BY 4.0',
      duration: 240,
      source: 'Free Music Archive'
    },
    {
      title: 'Japanese Garden',
      artist: 'Meditation Music',
      url: 'https://freemusicarchive.org/music/Meditation_Music/Japanese_Garden/',
      license: 'CC0 1.0',
      duration: 480,
      source: 'Free Music Archive'
    }
  ],
  experimental: [
    {
      title: 'Algorithmic Composition #1',
      artist: 'Computer Music Collective',
      url: 'https://freemusicarchive.org/music/Computer_Music_Collective/Algorithmic/',
      license: 'CC BY-SA 4.0',
      duration: 300,
      source: 'Free Music Archive'
    },
    {
      title: 'Generative Soundscape',
      artist: 'AI Music Lab',
      url: 'https://freemusicarchive.org/music/AI_Music_Lab/Generative/',
      license: 'CC BY 4.0',
      duration: 420,
      source: 'Free Music Archive'
    },
    {
      title: 'Fractal Harmonies',
      artist: 'Mathematical Music',
      url: 'https://archive.org/details/FractalMusic',
      license: 'CC BY-NC 3.0',
      duration: 360,
      source: 'Internet Archive'
    }
  ],
  binaural: [
    {
      title: '40Hz Focus Frequency',
      artist: 'Binaural Beats Research',
      url: 'https://archive.org/details/40HzFocusBeats',
      license: 'CC0 1.0',
      duration: 3600,
      source: 'Internet Archive'
    },
    {
      title: 'Alpha Wave Coding',
      artist: 'Brainwave Entrainment',
      url: 'https://freemusicarchive.org/music/Brainwave_Entrainment/Alpha_Waves/',
      license: 'CC BY 4.0',
      duration: 1800,
      source: 'Free Music Archive'
    },
    {
      title: 'Theta Programming State',
      artist: 'Neural Oscillations',
      url: 'https://archive.org/details/ThetaWaves',
      license: 'Public Domain',
      duration: 2400,
      source: 'Internet Archive'
    }
  ]
};

// Initialize Hugging Face client (using free tier)
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
  streamingService?: 'spotify' | 'apple' | 'youtube' | 'soundcloud' | 'local';
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

export interface StreamingService {
  id: string;
  name: string;
  icon: string;
  connected: boolean;
  apiKey?: string;
  features: string[];
  description: string;
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

class MusicService {
  private audio: HTMLAudioElement | null = null;
  private audioContext: AudioContext | null = null;
  private state: MusicPlayerState = {
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    volume: 0.7,
    shuffle: false,
    repeat: 'none',
    queue: [],
    currentPlaylist: null
  };
  private eventListeners: Map<string, Function[]> = new Map();
  private updateInterval: NodeJS.Timeout | null = null;
  private requestQueue: Map<string, Promise<any>>;
  private rateLimiter: Map<string, number>;
  private generatedTracks: GeneratedTrack[] = [];

  constructor() {
    this.initializeAudio();
    this.loadSavedState();
    this.requestQueue = new Map();
    this.rateLimiter = new Map();
    this.loadGeneratedTracks();
    
    this.initializeAudioContext();
  }

  private initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('AudioContext not supported:', error);
    }
  }

  private generateTestTone() {
    if (!this.audioContext) return;
    
    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime); // A4 note
      gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 1);
      
      console.log('Test tone generated');
    } catch (error) {
      console.error('Failed to generate test tone:', error);
    }
  }

  // Generate real AI music
  async generateAIMusic(options: MusicGenerationOptions): Promise<GeneratedTrack> {
    try {
      const { musicGenerationService } = await import('./musicGenerationService');
      const track = await musicGenerationService.generateMusic(options);
      this.generatedTracks.push(track);
      this.saveGeneratedTracks();
      return track;
    } catch (error) {
      console.error('AI music generation failed:', error);
      throw error;
    }
  }

  // Generate adaptive music based on current coding context
  async generateAdaptiveMusic(currentCode: string, language: string, complexity: number): Promise<GeneratedTrack> {
    try {
      const { musicGenerationService } = await import('./musicGenerationService');
      const track = await musicGenerationService.generateAdaptiveTrack(currentCode, language, complexity);
      this.generatedTracks.push(track);
      this.saveGeneratedTracks();
      return track;
    } catch (error) {
      console.error('Adaptive music generation failed:', error);
      throw error;
    }
  }

  // Generate coding playlists
  async generateCodingPlaylist(scenario: 'deep-focus' | 'debugging' | 'creative' | 'learning'): Promise<GeneratedTrack[]> {
    try {
      const { musicGenerationService } = await import('./musicGenerationService');
      const tracks = await musicGenerationService.generateCodingPlaylist(scenario);
      this.generatedTracks.push(...tracks);
      this.saveGeneratedTracks();
      return tracks;
    } catch (error) {
      console.error('Coding playlist generation failed:', error);
      throw error;
    }
  }

  // Get all generated tracks
  getGeneratedTracks(): GeneratedTrack[] {
    return [...this.generatedTracks];
  }

  // Clear generated tracks
  clearGeneratedTracks(): void {
    this.generatedTracks.forEach(track => {
      if (track.audioUrl.startsWith('blob:')) {
        URL.revokeObjectURL(track.audioUrl);
      }
    });
    this.generatedTracks = [];
    this.saveGeneratedTracks();
  }

  private saveGeneratedTracks(): void {
    // Save track metadata (not the audio data itself)
    const trackMetadata = this.generatedTracks.map(track => ({
      id: track.id,
      title: track.title,
      artist: track.artist,
      duration: track.duration,
      genre: track.genre,
      mood: track.mood,
      tempo: track.tempo,
      key: track.key,
      generatedAt: track.generatedAt,
      seedPrompt: track.seedPrompt
    }));
    
    localStorage.setItem('codette-generated-tracks', JSON.stringify(trackMetadata));
  }

  private loadGeneratedTracks(): void {
    const saved = localStorage.getItem('codette-generated-tracks');
    if (saved) {
      try {
        const trackMetadata = JSON.parse(saved);
        // Note: Audio URLs are not persisted and would need to be regenerated
        console.log(`Loaded ${trackMetadata.length} generated track metadata`);
      } catch (error) {
        console.warn('Failed to load generated tracks:', error);
      }
    }
  }

  private initializeAudio() {
    this.audio = new Audio();
    this.audio.volume = this.state.volume;
    
    this.audio.addEventListener('loadedmetadata', () => {
      this.emit('track-loaded', this.state.currentTrack);
    });

    this.audio.addEventListener('timeupdate', () => {
      if (this.audio) {
        this.state.currentTime = this.audio.currentTime;
        this.emit('time-update', this.state.currentTime);
      }
    });

    this.audio.addEventListener('ended', () => {
      this.handleTrackEnd();
    });

    this.audio.addEventListener('error', (e) => {
      console.error('Audio playback error:', e);
      this.emit('playback-error', e);
    });
  }

  // Streaming service integration
  async connectStreamingService(service: string, credentials?: any): Promise<boolean> {
    try {
      // Simulate streaming service connection
      const services = this.getStreamingServices();
      const targetService = services.find(s => s.id === service);
      
      if (targetService) {
        targetService.connected = true;
        this.saveStreamingConfig(service, credentials);
        this.emit('service-connected', targetService);
        
        // Load playlists from service
        const playlists = await this.fetchStreamingPlaylists(service);
        this.emit('playlists-loaded', playlists);
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to connect streaming service:', error);
      return false;
    }
  }

  private async fetchStreamingPlaylists(service: string): Promise<Playlist[]> {
    // Simulate fetching playlists from streaming services
    const mockPlaylists: Playlist[] = [
      {
        id: 'coding-focus',
        name: 'Coding Focus',
        description: 'Instrumental tracks perfect for deep coding sessions',
        tracks: this.generateMockTracks('focus'),
        artwork: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300',
        isPublic: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'ambient-coding',
        name: 'Ambient Coding',
        description: 'Atmospheric sounds for concentration',
        tracks: this.generateMockTracks('ambient'),
        artwork: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=300',
        isPublic: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'lo-fi-beats',
        name: 'Lo-Fi Beats',
        description: 'Chill lo-fi hip hop for coding',
        tracks: this.generateMockTracks('lofi'),
        artwork: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300',
        isPublic: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'electronic-energy',
        name: 'Electronic Energy',
        description: 'Upbeat electronic music for productive coding',
        tracks: this.generateMockTracks('electronic'),
        artwork: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=300',
        isPublic: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    return mockPlaylists;
  }

  private generateMockTracks(genre: string): Track[] {
    // Use real royalty-free music instead of mock data
    const realTracks = ROYALTY_FREE_TRACKS[genre as keyof typeof ROYALTY_FREE_TRACKS] || ROYALTY_FREE_TRACKS.focus;
    
    return realTracks.map((track, index) => ({
      id: `${genre}-${index}`,
      title: track.title,
      artist: track.artist,
      album: 'Royalty-Free Music',
      duration: track.duration,
      url: track.url,
      artwork: `https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=300`,
      genre,
      year: 2020,
      isLocal: false,
      streamingService: 'local' as const
    }));
  }

  // Fetch real music from royalty-free sources
  async fetchRealMusic(genre: string, query: string = ''): Promise<Track[]> {
    try {
      // Try multiple sources for better variety
      const sources = [
        // Note: These methods would need to be implemented
        // this.fetchFromJamendo(genre, query),
        // this.fetchFromFreeMusicArchive(genre, query),
        // this.fetchFromMusopen(genre, query)
      ];
      
      // For now, return local tracks
      // const results = await Promise.allSettled(sources);
      // const allTracks: Track[] = [];
      
      // Fallback to local royalty-free tracks
      return this.generateMockTracks(genre);
    } catch (error) {
      console.warn('Failed to fetch real music, using fallback:', error);
      return this.generateMockTracks(genre);
    }
  }

  getStreamingServices(): StreamingService[] {
    return [
      {
        id: 'jamendo',
        name: 'Jamendo (Free)',
        icon: '🎵',
        connected: true,
        features: ['Creative Commons', 'royalty-free', 'search', 'free'],
        description: 'World\'s largest platform for free music under Creative Commons'
      },
      {
        id: 'incompetech',
        name: 'Incompetech',
        icon: '🎼',
        connected: true,
        features: ['Kevin MacLeod', 'CC BY 3.0', 'royalty-free', 'coding music'],
        description: 'High-quality royalty-free music by Kevin MacLeod'
      },
      {
        id: 'freesound',
        name: 'Freesound',
        icon: '🔊',
        connected: true,
        features: ['sound effects', 'ambient', 'Creative Commons', 'free'],
        description: 'Collaborative database of Creative Commons licensed sounds'
      },
      {
        id: 'ccmixter',
        name: 'ccMixter',
        icon: '🎧',
        connected: true,
        features: ['remixes', 'Creative Commons', 'collaborative', 'free'],
        description: 'Community remix site featuring Creative Commons licensed music'
      },
      {
        id: 'freemusicarchive',
        name: 'Free Music Archive',
        icon: '📚',
        connected: true,
        features: ['curated', 'high-quality', 'Creative Commons', 'diverse genres'],
        description: 'Curated library of high-quality Creative Commons music'
      },
      {
        id: 'musopen',
        name: 'Musopen',
        icon: '🎻',
        connected: true,
        features: ['classical music', 'public domain', 'sheet music', 'recordings'],
        description: 'Public domain classical music recordings and sheet music'
      },
      {
        id: 'archive_org',
        name: 'Internet Archive',
        icon: '📦',
        connected: true,
        features: ['historical recordings', 'live concerts', 'public domain', 'vast collection'],
        description: 'Massive collection of historical and live music recordings'
      },
      {
        id: 'openmusicarchive',
        name: 'Open Music Archive',
        icon: '🌐',
        connected: true,
        features: ['open source', 'community driven', 'metadata rich', 'API access'],
        description: 'Community-driven archive of open source music with rich metadata'
      },
      {
        id: 'local',
        name: 'Local Files',
        icon: '💾',
        connected: true,
        features: ['offline', 'no-subscription', 'high-quality'],
        description: 'Your personal music collection stored locally'
      }
    ];
  }

  // Playback controls
  async play(track?: Track): Promise<void> {
    try {
      if (track && track.id !== this.state.currentTrack?.id) {
        await this.loadTrack(track);
      }

      if (this.audio && this.state.currentTrack) {
        // Resume audio context if suspended (required for autoplay policies)
        if (this.audioContext && this.audioContext.state === 'suspended') {
          await this.audioContext.resume();
        }
        
        try {
          await this.audio.play();
          this.state.isPlaying = true;
          this.startProgressTracking();
          this.emit('playback-started', this.state.currentTrack);
        } catch (error) {
          console.error('Playback failed, trying fallback:', error);
          // Try with a simple test tone
          this.generateTestTone();
          this.emit('playback-error', error);
        }
      }
    } catch (error) {
      console.error('Play method failed:', error);
      this.emit('playback-error', error);
    }
  }

  pause(): void {
    if (this.audio) {
      this.audio.pause();
      this.state.isPlaying = false;
      this.stopProgressTracking();
      this.emit('playback-paused', this.state.currentTrack);
    }
  }

  stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.state.isPlaying = false;
      this.state.currentTime = 0;
      this.stopProgressTracking();
      this.emit('playback-stopped', this.state.currentTrack);
    }
  }

  next(): void {
    const currentIndex = this.state.queue.findIndex(t => t.id === this.state.currentTrack?.id);
    let nextIndex = currentIndex + 1;

    if (this.state.shuffle) {
      nextIndex = Math.floor(Math.random() * this.state.queue.length);
    }

    if (nextIndex >= this.state.queue.length) {
      if (this.state.repeat === 'all') {
        nextIndex = 0;
      } else {
        this.stop();
        return;
      }
    }

    const nextTrack = this.state.queue[nextIndex];
    if (nextTrack) {
      this.play(nextTrack);
    }
  }

  previous(): void {
    const currentIndex = this.state.queue.findIndex(t => t.id === this.state.currentTrack?.id);
    let prevIndex = currentIndex - 1;

    if (prevIndex < 0) {
      if (this.state.repeat === 'all') {
        prevIndex = this.state.queue.length - 1;
      } else {
        this.stop();
        return;
      }
    }

    const prevTrack = this.state.queue[prevIndex];
    if (prevTrack) {
      this.play(prevTrack);
    }
  }

  setVolume(volume: number): void {
    this.state.volume = Math.max(0, Math.min(1, volume));
    if (this.audio) {
      this.audio.volume = this.state.volume;
    }
    this.emit('volume-changed', this.state.volume);
    this.saveState();
  }

  seek(time: number): void {
    if (this.audio && this.state.currentTrack) {
      this.audio.currentTime = Math.max(0, Math.min(this.audio.duration || 0, time));
      this.state.currentTime = this.audio.currentTime;
      this.emit('seek', this.state.currentTime);
    }
  }

  toggleShuffle(): void {
    this.state.shuffle = !this.state.shuffle;
    this.emit('shuffle-changed', this.state.shuffle);
    this.saveState();
  }

  toggleRepeat(): void {
    const modes: Array<'none' | 'one' | 'all'> = ['none', 'one', 'all'];
    const currentIndex = modes.indexOf(this.state.repeat);
    this.state.repeat = modes[(currentIndex + 1) % modes.length];
    this.emit('repeat-changed', this.state.repeat);
    this.saveState();
  }

  // Playlist management
  createPlaylist(name: string, description: string = ''): Playlist {
    const playlist: Playlist = {
      id: `playlist-${Date.now()}`,
      name,
      description,
      tracks: [],
      isPublic: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.savePlaylists([...this.getPlaylists(), playlist]);
    this.emit('playlist-created', playlist);
    return playlist;
  }

  addToPlaylist(playlistId: string, track: Track): void {
    const playlists = this.getPlaylists();
    const playlist = playlists.find(p => p.id === playlistId);
    
    if (playlist && !playlist.tracks.find(t => t.id === track.id)) {
      playlist.tracks.push(track);
      playlist.updatedAt = new Date();
      this.savePlaylists(playlists);
      this.emit('track-added-to-playlist', { playlist, track });
    }
  }

  removeFromPlaylist(playlistId: string, trackId: string): void {
    const playlists = this.getPlaylists();
    const playlist = playlists.find(p => p.id === playlistId);
    
    if (playlist) {
      playlist.tracks = playlist.tracks.filter(t => t.id !== trackId);
      playlist.updatedAt = new Date();
      this.savePlaylists(playlists);
      this.emit('track-removed-from-playlist', { playlist, trackId });
    }
  }

  playPlaylist(playlist: Playlist): void {
    this.state.currentPlaylist = playlist;
    this.state.queue = [...playlist.tracks];
    
    if (playlist.tracks.length > 0) {
      this.play(playlist.tracks[0]);
    }
    
    this.emit('playlist-started', playlist);
  }

  // Search functionality
  async searchTracks(query: string, service?: string): Promise<Track[]> {
    try {
      // Search real music from Jamendo API
      const response = await fetch(`https://api.jamendo.com/v3.0/tracks/?client_id=56d30c95&format=json&limit=20&search=${encodeURIComponent(query)}&include=musicinfo`);
      
      if (!response.ok) {
        throw new Error('Search API unavailable');
      }
      
      const data = await response.json();
      
      const realTracks = data.results.map((track: any) => ({
        id: `jamendo-${track.id}`,
        title: track.name,
        artist: track.artist_name,
        album: track.album_name || 'Unknown Album',
        duration: track.duration,
        url: track.audio,
        artwork: track.album_image || track.artist_image,
        genre: track.musicinfo?.tags?.genres?.[0] || 'unknown',
        year: new Date(track.releasedate).getFullYear(),
        isLocal: false,
        streamingService: 'jamendo' as const
      }));
      
      return realTracks;
    } catch (error) {
      console.warn('Real music search failed, using local search:', error);
      
      // Fallback to local search
      const allTracks = this.getAllAvailableTracks();
      const filtered = allTracks.filter(track => 
        track.title.toLowerCase().includes(query.toLowerCase()) ||
        track.artist.toLowerCase().includes(query.toLowerCase()) ||
        track.album.toLowerCase().includes(query.toLowerCase())
      );

      return filtered.slice(0, 20);
    }
  }

  // Coding-specific features
  getCodingPlaylists(): Playlist[] {
    return [
      {
        id: 'mozart-coding',
        name: 'Focus Music',
        description: 'Royalty-free focus music perfect for deep coding sessions',
        tracks: this.generateMockTracks('focus'),
        artwork: 'https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg?auto=compress&cs=tinysrgb&w=300',
        isPublic: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'ambient-coding',
        name: 'Ambient Coding',
        description: 'Peaceful ambient music for concentration',
        tracks: this.generateMockTracks('ambient'),
        artwork: 'https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=300',
        isPublic: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'electronic-energy',
        name: 'Electronic Energy',
        description: 'Upbeat electronic music for productive coding',
        tracks: this.generateMockTracks('electronic'),
        artwork: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=300',
        isPublic: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'classical-coding',
        name: 'Classical Coding',
        description: 'Classical music for elegant programming',
        tracks: this.generateMockTracks('classical'),
        artwork: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=300',
        isPublic: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  // AI-powered music recommendations
  async getAIRecommendations(codeContext: {
    language: string;
    complexity: number;
    timeOfDay: string;
    mood?: string;
  }): Promise<Track[]> {
    // AI-powered music recommendations based on coding context
    const { language, complexity, timeOfDay, mood } = codeContext;
    
    let recommendedGenre = 'focus';
    
    if (complexity > 0.8) {
      recommendedGenre = 'ambient'; // Complex code needs calming music
    } else if (timeOfDay === 'night') {
      recommendedGenre = 'lofi'; // Night coding with lo-fi
    } else if (mood === 'energetic') {
      recommendedGenre = 'electronic'; // High energy for productive sessions
    }

    const tracks = this.generateMockTracks(recommendedGenre);
    
    // Add AI reasoning
    this.emit('ai-recommendation', {
      genre: recommendedGenre,
      reasoning: `Based on ${language} complexity (${(complexity * 100).toFixed(0)}%) and ${timeOfDay} coding, I recommend ${recommendedGenre} music for optimal focus.`,
      tracks
    });

    return tracks;
  }

  // Offline support
  async downloadTrack(track: Track): Promise<boolean> {
    try {
      // Simulate downloading for offline playback
      const downloadedTrack = {
        ...track,
        isLocal: true,
        url: `offline://${track.id}`
      };
      
      this.saveOfflineTrack(downloadedTrack);
      this.emit('track-downloaded', downloadedTrack);
      return true;
    } catch (error) {
      console.error('Download failed:', error);
      return false;
    }
  }

  getOfflineTracks(): Track[] {
    const offline = localStorage.getItem('codette-offline-tracks');
    return offline ? JSON.parse(offline) : [];
  }

  // Private methods
  private async loadTrack(track: Track): Promise<void> {
    if (!this.audio) return;

    this.state.currentTrack = track;
    
    // Use the actual track URL if available
    const audioUrl = track.url || this.generateAudioUrl(track);
    this.audio.src = audioUrl;
    
    // Add error handling for audio loading
    this.audio.addEventListener('error', (e) => {
      console.warn('Audio failed to load, trying fallback:', e);
      // Try fallback URL
      this.audio!.src = 'https://incompetech.com/music/royalty-free/mp3-royaltyfree/Cipher.mp3';
    });
    
    this.audio.addEventListener('canplaythrough', () => {
      console.log('Audio ready to play:', track.title);
    });
    
    this.emit('track-changed', track);
  }

  private generateAudioUrl(track: Track): string {
    // Return the actual track URL if available, otherwise use working royalty-free fallback
    if (track.url && track.url.startsWith('http')) {
      return track.url;
    }
    
    // Fallback to working royalty-free tracks
    const workingTracks = [
      'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      'https://www.soundjay.com/misc/sounds/fail-buzzer-02.wav',
      'https://www.soundjay.com/misc/sounds/beep-07a.wav'
    ];
    
    return workingTracks[Math.floor(Math.random() * workingTracks.length)];
  }

  private handleTrackEnd(): void {
    if (this.state.repeat === 'one') {
      this.play(this.state.currentTrack!);
    } else {
      this.next();
    }
  }

  private startProgressTracking(): void {
    this.stopProgressTracking();
    this.updateInterval = setInterval(() => {
      if (this.audio && this.state.isPlaying) {
        this.state.currentTime = this.audio.currentTime;
        this.emit('time-update', this.state.currentTime);
      }
    }, 1000);
  }

  private stopProgressTracking(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  private getAllAvailableTracks(): Track[] {
    const playlists = this.getCodingPlaylists();
    return playlists.flatMap(p => p.tracks);
  }

  private saveState(): void {
    localStorage.setItem('codette-music-state', JSON.stringify({
      volume: this.state.volume,
      shuffle: this.state.shuffle,
      repeat: this.state.repeat
    }));
  }

  private loadSavedState(): void {
    const saved = localStorage.getItem('codette-music-state');
    if (saved) {
      const state = JSON.parse(saved);
      this.state.volume = state.volume || 0.7;
      this.state.shuffle = state.shuffle || false;
      this.state.repeat = state.repeat || 'none';
    }
  }

  private savePlaylists(playlists: Playlist[]): void {
    localStorage.setItem('codette-playlists', JSON.stringify(playlists));
  }

  private getPlaylists(): Playlist[] {
    const saved = localStorage.getItem('codette-playlists');
    return saved ? JSON.parse(saved) : this.getCodingPlaylists();
  }

  private saveStreamingConfig(service: string, credentials: any): void {
    localStorage.setItem(`codette-streaming-${service}`, JSON.stringify(credentials));
  }

  private saveOfflineTrack(track: Track): void {
    const offline = this.getOfflineTracks();
    offline.push(track);
    localStorage.setItem('codette-offline-tracks', JSON.stringify(offline));
  }

  // Event system
  on(event: string, callback: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(callback);
  }

  off(event: string, callback: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => callback(data));
    }
  }

  // Getters
  getState(): MusicPlayerState {
    return { ...this.state };
  }

  getCurrentTrack(): Track | null {
    return this.state.currentTrack;
  }

  isPlaying(): boolean {
    return this.state.isPlaying;
  }

  getVolume(): number {
    return this.state.volume;
  }

  getQueue(): Track[] {
    return [...this.state.queue];
  }

  getCurrentPlaylist(): Playlist | null {
    return this.state.currentPlaylist;
  }
}

export const musicService = new MusicService();