// Music Generation Service - AI Music Creation
export interface GeneratedTrack {
  id: string;
  title: string;
  artist: string;
  duration: number;
  audioUrl: string;
  genre: string;
  mood: string;
  tempo: number;
  key: string;
  generatedAt: Date;
  seedPrompt?: string;
}

export interface MusicGenerationOptions {
  genre: 'ambient' | 'classical' | 'electronic' | 'jazz' | 'lofi';
  mood: 'focused' | 'energetic' | 'calm' | 'creative';
  duration: number;
  tempo: number;
  complexity: number;
  codingContext?: {
    language: string;
    taskType: string;
    timeOfDay: string;
  };
}

class MusicGenerationService {
  private audioContext: AudioContext | null = null;
  private sampleRate = 44100;

  constructor() {
    this.initializeAudioContext();
  }

  private initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  async generateMusic(options: MusicGenerationOptions): Promise<GeneratedTrack> {
    if (!this.audioContext) {
      throw new Error('Audio context not available');
    }

    const audioData = await this.synthesizeAudio(options);
    const audioBlob = this.createAudioBlob(audioData);
    const audioUrl = URL.createObjectURL(audioBlob);

    const track: GeneratedTrack = {
      id: `ai_generated_${Date.now()}`,
      title: this.generateTitle(options),
      artist: 'Codette AI Composer',
      duration: options.duration,
      audioUrl,
      genre: options.genre,
      mood: options.mood,
      tempo: options.tempo,
      key: this.selectKey(options.mood),
      generatedAt: new Date(),
      seedPrompt: `${options.genre} ${options.mood} music for coding`
    };

    return track;
  }

  async generateAdaptiveTrack(currentCode: string, language: string, complexity: number): Promise<GeneratedTrack> {
    const options: MusicGenerationOptions = {
      genre: complexity > 0.7 ? 'ambient' : 'electronic',
      mood: complexity > 0.5 ? 'focused' : 'energetic',
      duration: 300,
      tempo: Math.floor(60 + (1 - complexity) * 60),
      complexity,
      codingContext: {
        language,
        taskType: this.inferTaskType(currentCode),
        timeOfDay: this.getTimeOfDay()
      }
    };

    return this.generateMusic(options);
  }

  async generateCodingPlaylist(scenario: 'deep-focus' | 'debugging' | 'creative' | 'learning'): Promise<GeneratedTrack[]> {
    const trackConfigs = this.getPlaylistConfigs(scenario);
    const tracks: GeneratedTrack[] = [];

    for (const config of trackConfigs) {
      const track = await this.generateMusic(config);
      tracks.push(track);
    }

    return tracks;
  }

  private async synthesizeAudio(options: MusicGenerationOptions): Promise<Float32Array> {
    const samples = options.duration * this.sampleRate;
    const audioData = new Float32Array(samples);
    
    // Generate basic waveforms based on genre
    for (let i = 0; i < samples; i++) {
      const time = i / this.sampleRate;
      let sample = 0;

      if (options.genre === 'ambient') {
        sample = this.generateAmbientSample(time, options);
      } else if (options.genre === 'electronic') {
        sample = this.generateElectronicSample(time, options);
      } else if (options.genre === 'classical') {
        sample = this.generateClassicalSample(time, options);
      } else {
        sample = this.generateDefaultSample(time, options);
      }

      audioData[i] = sample * 0.3; // Normalize volume
    }

    return audioData;
  }

  private generateAmbientSample(time: number, options: MusicGenerationOptions): number {
    const freq1 = 220; // A3
    const freq2 = 330; // E4
    const freq3 = 440; // A4
    
    return (
      Math.sin(2 * Math.PI * freq1 * time) * 0.3 +
      Math.sin(2 * Math.PI * freq2 * time) * 0.2 +
      Math.sin(2 * Math.PI * freq3 * time) * 0.1 +
      Math.sin(2 * Math.PI * freq1 * 0.5 * time) * 0.1 // Sub-harmonic
    );
  }

  private generateElectronicSample(time: number, options: MusicGenerationOptions): number {
    const baseFreq = 130; // C3
    const beatFreq = options.tempo / 60;
    
    const kick = Math.sin(2 * Math.PI * beatFreq * time) > 0.8 ? 0.5 : 0;
    const bass = Math.sin(2 * Math.PI * baseFreq * time) * 0.3;
    const lead = Math.sin(2 * Math.PI * baseFreq * 2 * time) * 0.2;
    
    return kick + bass + lead;
  }

  private generateClassicalSample(time: number, options: MusicGenerationOptions): number {
    // Simple classical harmony
    const c = Math.sin(2 * Math.PI * 261.63 * time); // C4
    const e = Math.sin(2 * Math.PI * 329.63 * time); // E4
    const g = Math.sin(2 * Math.PI * 392.00 * time); // G4
    
    return (c + e + g) / 3 * 0.4;
  }

  private generateDefaultSample(time: number, options: MusicGenerationOptions): number {
    return Math.sin(2 * Math.PI * 440 * time) * 0.3;
  }

  private createAudioBlob(audioData: Float32Array): Blob {
    // Convert Float32Array to WAV format
    const buffer = new ArrayBuffer(44 + audioData.length * 2);
    const view = new DataView(buffer);
    
    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + audioData.length * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, this.sampleRate, true);
    view.setUint32(28, this.sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, audioData.length * 2, true);
    
    // Convert float samples to 16-bit PCM
    let offset = 44;
    for (let i = 0; i < audioData.length; i++) {
      const sample = Math.max(-1, Math.min(1, audioData[i]));
      view.setInt16(offset, sample * 0x7FFF, true);
      offset += 2;
    }
    
    return new Blob([buffer], { type: 'audio/wav' });
  }

  private generateTitle(options: MusicGenerationOptions): string {
    const titles = {
      ambient: ['Floating Through Code', 'Digital Meditation', 'Algorithmic Dreams'],
      classical: ['Sonata for Algorithms', 'Code Concerto', 'Programming Prelude'],
      electronic: ['Compile Time Energy', 'Runtime Pulse', 'Binary Beats'],
      jazz: ['Smooth Code Jazz', 'Improvised Algorithms', 'Blue Note Debugging'],
      lofi: ['Lo-Fi Coding Session', 'Chill Development', 'Study Loop']
    };
    
    const genreTitles = titles[options.genre] || titles.ambient;
    return genreTitles[Math.floor(Math.random() * genreTitles.length)];
  }

  private selectKey(mood: string): string {
    const keys = {
      focused: ['C', 'Am', 'Em'],
      energetic: ['D', 'A', 'E'],
      calm: ['F', 'Bb', 'Dm'],
      creative: ['G', 'C', 'F']
    };
    
    const moodKeys = keys[mood as keyof typeof keys] || keys.focused;
    return moodKeys[Math.floor(Math.random() * moodKeys.length)];
  }

  private inferTaskType(code: string): string {
    if (code.includes('test') || code.includes('spec')) return 'testing';
    if (code.includes('debug') || code.includes('console.log')) return 'debugging';
    if (code.includes('class') || code.includes('interface')) return 'architecture';
    if (code.includes('style') || code.includes('css')) return 'styling';
    return 'general';
  }

  private getTimeOfDay(): string {
    const hour = new Date().getHours();
    if (hour < 6) return 'night';
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  }

  private getPlaylistConfigs(scenario: string): MusicGenerationOptions[] {
    const configs = {
      'deep-focus': [
        { genre: 'ambient' as const, mood: 'focused' as const, duration: 600, tempo: 60, complexity: 0.3 },
        { genre: 'classical' as const, mood: 'calm' as const, duration: 480, tempo: 70, complexity: 0.4 }
      ],
      'debugging': [
        { genre: 'lofi' as const, mood: 'calm' as const, duration: 300, tempo: 80, complexity: 0.5 },
        { genre: 'ambient' as const, mood: 'focused' as const, duration: 420, tempo: 65, complexity: 0.3 }
      ],
      'creative': [
        { genre: 'electronic' as const, mood: 'energetic' as const, duration: 240, tempo: 120, complexity: 0.7 },
        { genre: 'jazz' as const, mood: 'creative' as const, duration: 360, tempo: 100, complexity: 0.6 }
      ],
      'learning': [
        { genre: 'classical' as const, mood: 'focused' as const, duration: 300, tempo: 75, complexity: 0.4 },
        { genre: 'ambient' as const, mood: 'calm' as const, duration: 480, tempo: 60, complexity: 0.3 }
      ]
    };

    return configs[scenario as keyof typeof configs] || configs['deep-focus'];
  }
}

export const musicGenerationService = new MusicGenerationService();