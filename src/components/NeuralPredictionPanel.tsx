import React, { useState, useEffect } from 'react';
import { Brain, Zap, TrendingUp, Clock, Target, User, Lightbulb, Play } from 'lucide-react';
import { neuralCodePredictor, CodePrediction, DeveloperProfile } from '../services/neuralCodePredictor';

interface NeuralPredictionPanelProps {
  currentCode: string;
  cursorPosition: number;
  language: string;
  onPredictionAccepted: (prediction: string) => void;
}

export function NeuralPredictionPanel({ 
  currentCode, 
  cursorPosition, 
  language, 
  onPredictionAccepted 
}: NeuralPredictionPanelProps) {
  const [prediction, setPrediction] = useState<CodePrediction | null>(null);
  const [userProfile, setUserProfile] = useState<DeveloperProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [predictionHistory, setPredictionHistory] = useState<CodePrediction[]>([]);

  useEffect(() => {
    if (currentCode.trim()) {
      generatePrediction();
    }
  }, [currentCode, cursorPosition, language]);

  useEffect(() => {
    // Build user profile from coding history
    const history = [currentCode]; // In real app, this would be persistent
    const profile = neuralCodePredictor.buildDeveloperProfile(history);
    setUserProfile(profile);
  }, [currentCode]);

  const generatePrediction = async () => {
    setIsLoading(true);
    try {
      const newPrediction = await neuralCodePredictor.predictNextLine(
        currentCode, 
        cursorPosition, 
        language
      );
      
      setPrediction(newPrediction);
      setPredictionHistory(prev => [newPrediction, ...prev].slice(0, 10));
    } catch (error) {
      console.error('Neural prediction failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const acceptPrediction = (predictionText: string) => {
    onPredictionAccepted(predictionText);
    
    if (prediction) {
      neuralCodePredictor.learnFromUserBehavior(prediction, predictionText, true);
    }
  };

  const rejectPrediction = () => {
    if (prediction) {
      neuralCodePredictor.learnFromUserBehavior(prediction, '', false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'hard': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-blue-100 dark:border-gray-700">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
          <Brain className="w-6 h-6 text-gray-50" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-50">
            Neural Code Predictor
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            AI that learns your coding style
          </p>
        </div>
      </div>

      {/* Current Prediction */}
      {prediction && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-800 dark:text-gray-50">Next Line Prediction</h4>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(prediction.difficulty_level)}`}>
                {prediction.difficulty_level}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {(prediction.confidence * 100).toFixed(0)}% confidence
              </span>
            </div>
          </div>
          
          <div className="bg-gray-800 text-green-400 p-3 rounded-lg font-mono text-sm mb-3">
            {prediction.next_line || 'No prediction available'}
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            <strong>Reasoning:</strong> {prediction.reasoning}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Est. {prediction.completion_time_estimate}s to complete
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={rejectPrediction}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Reject
              </button>
              <button
                onClick={() => acceptPrediction(prediction.next_line)}
                className="px-3 py-1 bg-blue-500 text-gray-50 rounded text-sm hover:bg-blue-600 transition-colors"
              >
                Accept
              </button>
            </div>
          </div>
          
          {/* Alternatives */}
          {prediction.alternatives.length > 0 && (
            <div className="mt-4">
              <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Alternatives:</h5>
              <div className="space-y-1">
                {prediction.alternatives.map((alt, index) => (
                  <button
                    key={index}
                    onClick={() => acceptPrediction(alt)}
                    className="block w-full text-left p-2 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors font-mono"
                  >
                    {alt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Developer Profile */}
      {userProfile && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg mb-4">
          <h4 className="font-medium text-gray-800 dark:text-gray-50 mb-3">Your Developer Profile</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Style:</span>
              <p className="font-medium text-gray-800 dark:text-gray-50 capitalize">
                {userProfile.coding_style.replace('-', ' ')}
              </p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Skill Level:</span>
              <p className="font-bold text-blue-600">{(userProfile.skill_level * 100).toFixed(0)}%</p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Productivity:</span>
              <p className="font-bold text-green-600">{(userProfile.productivity_score * 100).toFixed(0)}%</p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Creativity:</span>
              <p className="font-bold text-purple-600">{(userProfile.creativity_index * 100).toFixed(0)}%</p>
            </div>
          </div>
          
          {userProfile.focus_areas.length > 0 && (
            <div className="mt-3">
              <span className="text-gray-600 dark:text-gray-400 text-sm">Focus Areas:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {userProfile.focus_areas.map(area => (
                  <span key={area} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Lightbulb className="w-5 h-5 text-yellow-600" />
          <h4 className="font-medium text-gray-800 dark:text-gray-50">AI Insights</h4>
        </div>
        {userProfile ? (
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            {neuralCodePredictor.getUserInsights()?.recommendations.map((rec: string, index: number) => (
              <div key={index} className="flex items-start space-x-2">
                <span className="text-yellow-600">•</span>
                <span>{rec}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Keep coding to build your developer profile and get personalized insights!
          </p>
        )}
      </div>
    </div>
  );
}