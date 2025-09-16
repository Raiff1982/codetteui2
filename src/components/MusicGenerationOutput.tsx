import React from 'react';
import { Music, Play, Pause, Download, Share2, Heart, Sparkles, Clock, Zap, Brain, Atom } from 'lucide-react';
import { Track, Playlist } from '../hooks/useMusic';

interface MusicGenerationOutputProps {
  track?: Track;
  playlist?: Playlist;
  isVisible: boolean;
  onClose: () => void;
  onPlay: (track: Track) => void;
  onPlayPlaylist?: (playlist: Playlist) => void;
  isPlaying?: boolean;
  formatTime: (seconds: number) => string;
}

export function MusicGenerationOutput({
  track,
  playlist,
  isVisible,
  onClose,
  onPlay,
  onPlayPlaylist,
  isPlaying = false,
  formatTime
}: MusicGenerationOutputProps) {
  if (!isVisible) return null;

  const isTrackMode = track && !playlist;
  const isPlaylistMode = playlist && !track;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                {isTrackMode ? (
                  <Music className="w-7 h-7 text-white" />
                ) : (
                  <Brain className="w-7 h-7 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {isTrackMode ? '🎵 Music Generated!' : '🎼 Playlist Created!'}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {isTrackMode ? 'AI-composed track ready to play' : 'Complete coding playlist generated'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <span className="text-gray-500 text-xl">×</span>
            </button>
          </div>
        </div>

        {/* Track Mode */}
        {isTrackMode && track && (
          <div className="p-6">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-xl mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Music className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                    {track.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    by {track.artist}
                  </p>
                  <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs rounded-full font-medium">
                      AI Generated
                    </span>
                    {track.aiGenerated && (
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full font-medium">
                        Real-Time Synthesis
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Track Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-white/50 dark:bg-gray-700/50 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-sm font-medium text-gray-800 dark:text-white">Duration</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{formatTime(track.duration)}</p>
                </div>
                <div className="text-center p-3 bg-white/50 dark:bg-gray-700/50 rounded-lg">
                  <Zap className="w-5 h-5 text-green-600 mx-auto mb-1" />
                  <p className="text-sm font-medium text-gray-800 dark:text-white">Complexity</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {track.complexity ? `${(track.complexity * 100).toFixed(0)}%` : 'N/A'}
                  </p>
                </div>
                <div className="text-center p-3 bg-white/50 dark:bg-gray-700/50 rounded-lg">
                  <Heart className="w-5 h-5 text-pink-600 mx-auto mb-1" />
                  <p className="text-sm font-medium text-gray-800 dark:text-white">Mood</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                    {track.mood || 'Adaptive'}
                  </p>
                </div>
                <div className="text-center p-3 bg-white/50 dark:bg-gray-700/50 rounded-lg">
                  <Atom className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                  <p className="text-sm font-medium text-gray-800 dark:text-white">Genre</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">{track.genre}</p>
                </div>
              </div>

              {/* AI Generation Details */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 p-4 rounded-lg mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Brain className="w-5 h-5 text-blue-600" />
                  <h4 className="font-medium text-gray-800 dark:text-white">AI Composition Analysis</h4>
                </div>
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <p>• <strong>Harmonic Structure:</strong> Generated using quantum-inspired algorithms</p>
                  <p>• <strong>Rhythm Pattern:</strong> Adapted to coding flow and complexity</p>
                  <p>• <strong>Emotional Resonance:</strong> Optimized for focus and creativity</p>
                  <p>• <strong>Temporal Dynamics:</strong> Synchronized with development patterns</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => onPlay(track)}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl hover:from-purple-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  <span className="font-medium">{isPlaying ? 'Pause' : 'Play Track'}</span>
                </button>
                <button
                  onClick={() => console.log('Download track:', track.title)}
                  className="px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                  title="Download Track"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => console.log('Share track:', track.title)}
                  className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                  title="Share Track"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Playlist Mode */}
        {isPlaylistMode && playlist && (
          <div className="p-6">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-xl mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                    {playlist.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    {playlist.description}
                  </p>
                  <div className="flex items-center space-x-3">
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded-full font-medium">
                      AI Generated Playlist
                    </span>
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full font-medium">
                      {playlist.tracks.length} Tracks
                    </span>
                  </div>
                </div>
              </div>

              {/* Playlist Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-white/50 dark:bg-gray-700/50 rounded-lg">
                  <Music className="w-5 h-5 text-green-600 mx-auto mb-1" />
                  <p className="text-sm font-medium text-gray-800 dark:text-white">Tracks</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{playlist.tracks.length}</p>
                </div>
                <div className="text-center p-3 bg-white/50 dark:bg-gray-700/50 rounded-lg">
                  <Clock className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-sm font-medium text-gray-800 dark:text-white">Duration</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {formatTime(playlist.tracks.reduce((sum, t) => sum + t.duration, 0))}
                  </p>
                </div>
                <div className="text-center p-3 bg-white/50 dark:bg-gray-700/50 rounded-lg">
                  <Sparkles className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                  <p className="text-sm font-medium text-gray-800 dark:text-white">Scenario</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">
                    {playlist.scenario?.replace('-', ' ') || 'General'}
                  </p>
                </div>
              </div>

              {/* Track List */}
              <div className="space-y-2 mb-6 max-h-64 overflow-y-auto">
                <h4 className="font-medium text-gray-800 dark:text-white mb-3">Generated Tracks</h4>
                {playlist.tracks.map((track, index) => (
                  <div
                    key={track.id}
                    className="flex items-center space-x-3 p-3 bg-white/50 dark:bg-gray-700/50 rounded-lg hover:bg-white/70 dark:hover:bg-gray-600/50 transition-colors"
                  >
                    <span className="text-sm text-gray-500 w-6 text-center">{index + 1}</span>
                    <button
                      onClick={() => onPlay(track)}
                      className="p-2 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-lg hover:from-green-600 hover:to-blue-700 transition-colors"
                    >
                      <Play className="w-3 h-3" />
                    </button>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 dark:text-white">{track.title}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{track.artist}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                          {track.genre}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTime(track.duration)}
                        </span>
                        {track.complexity && (
                          <span className="text-xs text-gray-500">
                            {(track.complexity * 100).toFixed(0)}% complexity
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                {isPlaylistMode && onPlayPlaylist && (
                  <button
                    onClick={() => onPlayPlaylist(playlist)}
                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl hover:from-green-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    <Play className="w-5 h-5" />
                    <span className="font-medium">Play Playlist</span>
                  </button>
                )}
                {isTrackMode && (
                  <button
                    onClick={() => onPlay(track)}
                    className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl hover:from-purple-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    <span className="font-medium">{isPlaying ? 'Pause' : 'Play Track'}</span>
                  </button>
                )}
                <button
                  onClick={() => console.log('Download:', track?.title || playlist?.name)}
                  className="px-4 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                  title="Download"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => console.log('Share:', track?.title || playlist?.name)}
                  className="px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
                  title="Share"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* AI Generation Insights */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-xl">
              <div className="flex items-center space-x-2 mb-3">
                <Atom className="w-5 h-5 text-orange-600" />
                <h4 className="font-medium text-gray-800 dark:text-white">AI Composition Insights</h4>
              </div>
              <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                {isTrackMode && track && (
                  <>
                    <p>• <strong>Algorithmic Approach:</strong> Quantum-inspired harmonic generation</p>
                    <p>• <strong>Emotional Mapping:</strong> Optimized for {track.mood || 'focus'} state</p>
                    <p>• <strong>Complexity Adaptation:</strong> Matched to code complexity level</p>
                    <p>• <strong>Temporal Structure:</strong> Designed for sustained concentration</p>
                  </>
                )}
                {isPlaylistMode && playlist && (
                  <>
                    <p>• <strong>Playlist Strategy:</strong> {playlist.scenario?.replace('-', ' ')} optimization</p>
                    <p>• <strong>Track Variety:</strong> {playlist.tracks.length} unique compositions</p>
                    <p>• <strong>Flow Design:</strong> Seamless transitions for coding sessions</p>
                    <p>• <strong>Adaptive Elements:</strong> Responds to development patterns</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>Powered by Codette AI Music Engine</span>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}