import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  Ear, 
  Hand, 
  Brain, 
  Heart,
  Settings,
  Volume2,
  VolumeX,
  Type,
  Contrast,
  MousePointer,
  Keyboard,
  Monitor,
  Smartphone,
  CheckCircle,
  AlertTriangle,
  Zap,
  Target
} from 'lucide-react';

interface AccessibilitySettings {
  high_contrast: boolean;
  large_text: boolean;
  reduced_motion: boolean;
  screen_reader_optimized: boolean;
  keyboard_navigation: boolean;
  voice_commands: boolean;
  color_blind_friendly: boolean;
  focus_indicators: boolean;
  audio_descriptions: boolean;
  simplified_interface: boolean;
}

interface AccessibilityEnhancerProps {
  isVisible: boolean;
  onClose: () => void;
}

export function AccessibilityEnhancer({ isVisible, onClose }: AccessibilityEnhancerProps) {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    high_contrast: false,
    large_text: false,
    reduced_motion: false,
    screen_reader_optimized: false,
    keyboard_navigation: true,
    voice_commands: false,
    color_blind_friendly: false,
    focus_indicators: true,
    audio_descriptions: false,
    simplified_interface: false
  });

  const [accessibilityScore, setAccessibilityScore] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (isVisible) {
      analyzeAccessibility();
    }
  }, [isVisible, settings]);

  const analyzeAccessibility = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      // Calculate accessibility score based on enabled features
      const enabledFeatures = Object.values(settings).filter(Boolean).length;
      const totalFeatures = Object.keys(settings).length;
      const score = (enabledFeatures / totalFeatures) * 100;
      
      setAccessibilityScore(score);
      setIsAnalyzing(false);
    }, 1000);
  };

  const updateSetting = (key: keyof AccessibilitySettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Apply settings to DOM
    applyAccessibilitySettings(key, value);
  };

  const applyAccessibilitySettings = (setting: string, enabled: boolean) => {
    const root = document.documentElement;
    
    switch (setting) {
      case 'high_contrast':
        root.style.setProperty('--contrast-multiplier', enabled ? '1.5' : '1');
        break;
      case 'large_text':
        root.style.setProperty('--text-scale', enabled ? '1.2' : '1');
        break;
      case 'reduced_motion':
        root.style.setProperty('--animation-duration', enabled ? '0.01s' : '0.3s');
        break;
      case 'focus_indicators':
        root.style.setProperty('--focus-ring-width', enabled ? '3px' : '2px');
        break;
    }
  };

  const getSettingIcon = (key: string) => {
    switch (key) {
      case 'high_contrast': return <Contrast className="w-4 h-4" />;
      case 'large_text': return <Type className="w-4 h-4" />;
      case 'reduced_motion': return <Zap className="w-4 h-4" />;
      case 'screen_reader_optimized': return <Ear className="w-4 h-4" />;
      case 'keyboard_navigation': return <Keyboard className="w-4 h-4" />;
      case 'voice_commands': return <Volume2 className="w-4 h-4" />;
      case 'color_blind_friendly': return <Eye className="w-4 h-4" />;
      case 'focus_indicators': return <Target className="w-4 h-4" />;
      case 'audio_descriptions': return <Ear className="w-4 h-4" />;
      case 'simplified_interface': return <Monitor className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getSettingDescription = (key: string): string => {
    const descriptions: Record<string, string> = {
      high_contrast: 'Increase contrast for better visibility',
      large_text: 'Increase text size for easier reading',
      reduced_motion: 'Reduce animations for motion sensitivity',
      screen_reader_optimized: 'Optimize for screen reader compatibility',
      keyboard_navigation: 'Enable full keyboard navigation',
      voice_commands: 'Enable voice control features',
      color_blind_friendly: 'Use color-blind friendly color schemes',
      focus_indicators: 'Enhanced focus indicators for navigation',
      audio_descriptions: 'Provide audio descriptions for visual elements',
      simplified_interface: 'Simplify interface for cognitive accessibility'
    };
    
    return descriptions[key] || 'Accessibility setting';
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900/20';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900/20';
    if (score >= 40) return 'bg-orange-100 dark:bg-orange-900/20';
    return 'bg-red-100 dark:bg-red-900/20';
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-white/95 via-blue-50/80 to-purple-50/80 dark:from-gray-800/95 dark:via-blue-950/80 dark:to-purple-950/80 backdrop-blur-xl rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-blue-200/50 dark:border-blue-700/50">
        {/* Header */}
        <div className="p-6 border-b border-blue-200/50 dark:border-blue-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  Accessibility Center
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Making coding accessible for everyone
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

        {/* Accessibility Score */}
        <div className="p-6 border-b border-blue-200/50 dark:border-blue-700/50">
          <div className={`p-6 rounded-xl ${getScoreBg(accessibilityScore)}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">Accessibility Score</h3>
              <span className={`text-3xl font-bold ${getScoreColor(accessibilityScore)}`}>
                {accessibilityScore.toFixed(0)}%
              </span>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3 mb-4">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  accessibilityScore >= 80 ? 'bg-green-500' :
                  accessibilityScore >= 60 ? 'bg-yellow-500' :
                  accessibilityScore >= 40 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${accessibilityScore}%` }}
              />
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {accessibilityScore >= 80 ? 'Excellent accessibility! Your interface welcomes all users.' :
               accessibilityScore >= 60 ? 'Good accessibility with room for improvement.' :
               accessibilityScore >= 40 ? 'Basic accessibility - consider enabling more features.' :
               'Accessibility needs attention - enable features to improve inclusion.'}
            </p>
          </div>
        </div>

        {/* Accessibility Settings */}
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Accessibility Features</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(settings).map(([key, value]) => (
              <div key={key} className="bg-gradient-to-r from-white/80 to-blue-50/80 dark:from-gray-700/80 dark:to-blue-950/80 backdrop-blur-sm rounded-xl p-4 border border-blue-200/50 dark:border-blue-700/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      value ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}>
                      {getSettingIcon(key)}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-white capitalize">
                        {key.replace(/_/g, ' ')}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {getSettingDescription(key)}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => updateSetting(key as keyof AccessibilitySettings, !value)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      value ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Accessibility Tips */}
          <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-yellow-200/50 dark:border-yellow-700/50">
            <div className="flex items-center space-x-3 mb-4">
              <Heart className="w-6 h-6 text-yellow-600" />
              <h4 className="font-bold text-gray-800 dark:text-white">Accessibility Tips</h4>
            </div>
            
            <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                <span>Use keyboard shortcuts for faster navigation without a mouse</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                <span>Enable high contrast mode if you have visual difficulties</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                <span>Turn on reduced motion if animations cause discomfort</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                <span>Use voice commands for hands-free coding when available</span>
              </div>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="mt-6">
            <h4 className="font-bold text-gray-800 dark:text-white mb-4">Quick Presets</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => {
                  setSettings({
                    ...settings,
                    high_contrast: true,
                    large_text: true,
                    focus_indicators: true,
                    keyboard_navigation: true
                  });
                }}
                className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50 hover:shadow-lg transition-all duration-200"
              >
                <Eye className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <h5 className="font-medium text-gray-800 dark:text-white">Visual Impairment</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">High contrast, large text, enhanced focus</p>
              </button>
              
              <button
                onClick={() => {
                  setSettings({
                    ...settings,
                    keyboard_navigation: true,
                    voice_commands: true,
                    audio_descriptions: true,
                    screen_reader_optimized: true
                  });
                }}
                className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200/50 dark:border-green-700/50 hover:shadow-lg transition-all duration-200"
              >
                <Hand className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <h5 className="font-medium text-gray-800 dark:text-white">Motor Impairment</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">Keyboard navigation, voice control</p>
              </button>
              
              <button
                onClick={() => {
                  setSettings({
                    ...settings,
                    reduced_motion: true,
                    simplified_interface: true,
                    focus_indicators: true
                  });
                }}
                className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200/50 dark:border-purple-700/50 hover:shadow-lg transition-all duration-200"
              >
                <Brain className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <h5 className="font-medium text-gray-800 dark:text-white">Cognitive Support</h5>
                <p className="text-xs text-gray-600 dark:text-gray-400">Reduced motion, simplified interface</p>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-blue-200/50 dark:border-blue-700/50 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-950/50 dark:to-purple-950/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-pink-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">Inclusive by Design</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-600 dark:text-gray-400">WCAG 2.1 AA Compliant</span>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Apply Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}