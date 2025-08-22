import React from 'react';
import { 
  Music, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack,
  Volume2,
  VolumeX,
  ChevronUp,
  X,
  Disc3
} from 'lucide-react';
import { useMusic } from '../hooks/useMusic';

interface MusicPlayerMiniProps {
  onExpand: () => void;
  onClose: () => void;
}

export function MusicPlayerMini({ onExpand, onClose }: MusicPlayerMiniProps) {
  const {
    playerState,
    play,
    pause,
    next,
    previous,
    setVolume,
    formatTime
  } = useMusic();

  if (!playerState.currentTrack) {
    return (
      <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3 z-50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <Music className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-800 dark:text-white">No music playing</span>
          <button
            onClick={onExpand}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <ChevronUp className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 z-50 min-w-80">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            {playerState.currentTrack.artwork ? (
              <img 
                src={playerState.currentTrack.artwork} 
                alt="Album artwork"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Disc3 className="w-6 h-6 text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-800 dark:text-white truncate">
              {playerState.currentTrack.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {playerState.currentTrack.artist}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onExpand}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <ChevronUp className="w-4 h-4 text-gray-500" />
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Mini Controls */}
      <div className="flex items-center justify-center space-x-4 mb-3">
        <button
          onClick={previous}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <SkipBack className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
        
        <button
          onClick={playerState.isPlaying ? pause : () => play()}
          className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg"
        >
          {playerState.isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
        </button>
        
        <button
          onClick={next}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <SkipForward className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Mini Progress Bar */}
      <div className="space-y-1">
        <div 
          className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1 cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            const newTime = percent * playerState.currentTrack!.duration;
            // seek(newTime); // Would need to expose seek function
          }}
        >
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-600 h-1 rounded-full transition-all"
            style={{ 
              width: `${(playerState.currentTime / playerState.currentTrack.duration) * 100}%` 
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>{formatTime(playerState.currentTime)}</span>
          <span>{formatTime(playerState.currentTrack.duration)}</span>
        </div>
      </div>

      {/* Volume Control */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setVolume(playerState.volume === 0 ? 0.7 : 0)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            {playerState.volume === 0 ? (
              <VolumeX className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            ) : (
              <Volume2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={playerState.volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-16 h-1 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        
        <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
          <Music className="w-3 h-3" />
          <span>Codette Music</span>
        </div>
      </div>
    </div>
  );
}