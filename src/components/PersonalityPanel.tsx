import React, { useState, useEffect } from 'react';
import { Heart, Brain, Smile, Zap, Eye, Star, Settings, TrendingUp, Clock, Sparkles } from 'lucide-react';
import { aiPersonalityEngine, AIPersonality, PersonalizedResponse } from '../services/aiPersonalityEngine';

interface PersonalityPanelProps {
  currentCode: string;
  userSkillLevel: number;
  onPersonalizedResponse: (response: PersonalizedResponse) => void;
}

export function PersonalityPanel({ currentCode, userSkillLevel, onPersonalizedResponse }: PersonalityPanelProps) {
  const [personality, setPersonality] = useState<AIPersonality | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{
    user: string;
    ai: string;
    timestamp: Date;
    satisfaction?: number;
  }>>([]);
  const [showPersonalitySettings, setShowPersonalitySettings] = useState(false);

  useEffect(() => {
    const currentPersonality = aiPersonalityEngine.getCurrentPersonality();
    setPersonality(currentPersonality);
  }, []);

  const handleChat = async () => {
    if (!chatInput.trim()) return;

    const context = {
      code_complexity: Math.min(currentCode.length / 1000, 1),
      user_skill_level: userSkillLevel,
      time_of_day: getTimeOfDay(),
      recent_struggles: chatHistory
        .filter(chat => chat.satisfaction && chat.satisfaction < 0.6)
        .slice(-3)
        .map(chat => chat.user)
    };

    const personalizedResponse = aiPersonalityEngine.generatePersonalizedResponse(chatInput, context);
    
    const newChatEntry = {
      user: chatInput,
      ai: personalizedResponse.content,
      timestamp: new Date()
    };
    
    setChatHistory(prev => [...prev, newChatEntry]);
    setChatInput('');
    onPersonalizedResponse(personalizedResponse);
  };

  const rateSatisfaction = (chatIndex: number, rating: number) => {
    setChatHistory(prev => prev.map((chat, index) => 
      index === chatIndex ? { ...chat, satisfaction: rating } : chat
    ));

    // Record interaction for personality adaptation
    const chat = chatHistory[chatIndex];
    if (chat) {
      aiPersonalityEngine.recordInteraction(chat.user, chat.ai, rating);
    }
  };

  const adjustPersonalityTrait = (trait: keyof AIPersonality['traits'], value: number) => {
    if (personality) {
      const newPersonality = { ...personality };
      newPersonality.traits[trait] = Math.max(0, Math.min(1, value));
      setPersonality(newPersonality);
    }
  };

  const getTimeOfDay = (): string => {
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 6) return 'night';
    if (hour >= 6 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 18) return 'afternoon';
    if (hour >= 18 && hour < 22) return 'evening';
    return 'night';
  };

  const getTraitIcon = (trait: string) => {
    switch (trait) {
      case 'helpfulness': return <Heart className="w-4 h-4" />;
      case 'creativity': return <Star className="w-4 h-4" />;
      case 'patience': return <Clock className="w-4 h-4" />;
      case 'humor': return <Smile className="w-4 h-4" />;
      case 'wisdom': return <Brain className="w-4 h-4" />;
      case 'enthusiasm': return <Zap className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'excited': return '🎉';
      case 'calm': return '😌';
      case 'focused': return '🎯';
      case 'playful': return '🎮';
      case 'wise': return '🧙‍♀️';
      default: return '😊';
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-purple-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-gray-50" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-50">
              AI Personality Engine
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Codette's adaptive personality
            </p>
          </div>
        </div>
        
        <button
          onClick={() => setShowPersonalitySettings(!showPersonalitySettings)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Current Personality Display */}
      {personality && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{getMoodEmoji(personality.mood)}</span>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-50">{personality.name}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                  {personality.mood} • {personality.communication_style}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Catchphrase:</p>
              <p className="text-xs text-purple-600 dark:text-purple-400 italic">
                "{personality.catchphrases[0]}"
              </p>
            </div>
          </div>
          
          {/* Personality Traits */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(personality.traits).map(([trait, value]) => (
              <div key={trait} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getTraitIcon(trait)}
                  <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{trait}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full"
                      style={{ width: `${value * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-8">
                    {(value * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat Interface */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
        <h4 className="font-medium text-gray-800 dark:text-gray-50 mb-3">Chat with Codette</h4>
        
        <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
          {chatHistory.map((chat, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-end">
                <div className="bg-blue-500 text-gray-50 px-3 py-2 rounded-lg max-w-xs">
                  <p className="text-sm">{chat.user}</p>
                </div>
              </div>
              
              <div className="flex justify-start">
                <div className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-2 rounded-lg max-w-xs">
                  <p className="text-sm">{chat.ai}</p>
                  <div className="flex items-center space-x-1 mt-2">
                    {[1, 2, 3, 4, 5].map(rating => (
                      <button
                        key={rating}
                        onClick={() => rateSatisfaction(index, rating / 5)}
                        className={`w-4 h-4 ${
                          chat.satisfaction && (chat.satisfaction * 5) >= rating 
                            ? 'text-yellow-500' 
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      >
                        ⭐
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex space-x-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleChat()}
            placeholder="Chat with Codette's personality..."
            className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg text-gray-800 dark:text-gray-50 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={handleChat}
            disabled={!chatInput.trim()}
            className="px-4 py-2 bg-purple-500 text-gray-50 rounded-lg hover:bg-purple-600 disabled:opacity-50 transition-colors"
          >
            Send
          </button>
        </div>
      </div>

      {/* Personality Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg">
        <h4 className="font-medium text-gray-800 dark:text-gray-50 mb-3">Personality Insights</h4>
        {personality && (
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <p>• Current mood: <span className="font-medium capitalize">{personality.mood}</span> {getMoodEmoji(personality.mood)}</p>
            <p>• Communication style: <span className="font-medium capitalize">{personality.communication_style}</span></p>
            <p>• Strongest trait: <span className="font-medium">
              {Object.entries(personality.traits).reduce((a, b) => a[1] > b[1] ? a : b)[0]}
            </span></p>
            <p>• Expertise areas: <span className="font-medium">{personality.expertise_areas.slice(0, 2).join(', ')}</span></p>
          </div>
        )}
      </div>

      {/* Personality Settings Modal */}
      {showPersonalitySettings && personality && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-50">Personality Settings</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Customize Codette's personality traits</p>
            </div>
            
            <div className="p-6 space-y-4">
              {Object.entries(personality.traits).map(([trait, value]) => (
                <div key={trait} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getTraitIcon(trait)}
                      <span className="font-medium text-gray-800 dark:text-gray-50 capitalize">{trait}</span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {(value * 100).toFixed(0)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={value}
                    onChange={(e) => adjustPersonalityTrait(trait as any, parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              ))}
            </div>
            
            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                onClick={() => setShowPersonalitySettings(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // Reset to defaults
                  const defaultPersonality = aiPersonalityEngine.getCurrentPersonality();
                  setPersonality(defaultPersonality);
                  setShowPersonalitySettings(false);
                }}
                className="px-4 py-2 bg-purple-500 text-gray-50 rounded-lg hover:bg-purple-600 transition-colors"
              >
                Reset to Default
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}