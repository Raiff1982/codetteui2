import React, { useState, useEffect } from 'react';
import { Heart, Brain, Zap, Activity, Sparkles, Eye, TrendingUp } from 'lucide-react';

interface EmotionalCodeMetrics {
  emotional_resonance: number;
  empathy_score: number;
  user_friendliness: number;
  accessibility_rating: number;
  emotional_intelligence: number;
  compassion_index: number;
  joy_factor: number;
  stress_level: number;
}

interface EmotionalCodeAnalyzerProps {
  currentCode: string;
  language: string;
}

export function EmotionalCodeAnalyzer({ currentCode, language }: EmotionalCodeAnalyzerProps) {
  const [metrics, setMetrics] = useState<EmotionalCodeMetrics | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [emotionalInsights, setEmotionalInsights] = useState<string[]>([]);

  useEffect(() => {
    if (currentCode.trim()) {
      analyzeEmotionalCode();
    }
  }, [currentCode]);

  const analyzeEmotionalCode = async () => {
    setIsAnalyzing(true);
    try {
      // Simulate emotional analysis
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const analysis = performEmotionalAnalysis(currentCode, language);
      setMetrics(analysis.metrics);
      setEmotionalInsights(analysis.insights);
    } catch (error) {
      console.error('Emotional analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const performEmotionalAnalysis = (code: string, lang: string) => {
    const metrics: EmotionalCodeMetrics = {
      emotional_resonance: calculateEmotionalResonance(code),
      empathy_score: calculateEmpathyScore(code),
      user_friendliness: calculateUserFriendliness(code),
      accessibility_rating: calculateAccessibilityRating(code),
      emotional_intelligence: calculateEmotionalIntelligence(code),
      compassion_index: calculateCompassionIndex(code),
      joy_factor: calculateJoyFactor(code),
      stress_level: calculateStressLevel(code)
    };

    const insights = generateEmotionalInsights(metrics, code);

    return { metrics, insights };
  };

  const calculateEmotionalResonance = (code: string): number => {
    let score = 0.5;
    
    // Positive emotional indicators
    if (code.includes('help') || code.includes('assist')) score += 0.1;
    if (code.includes('user') || code.includes('accessibility')) score += 0.1;
    if (code.includes('error') && code.includes('message')) score += 0.1;
    if (code.includes('loading') || code.includes('feedback')) score += 0.1;
    if (code.includes('success') || code.includes('complete')) score += 0.1;
    
    // Negative emotional indicators
    if (code.includes('hack') || code.includes('dirty')) score -= 0.1;
    if (code.includes('TODO') || code.includes('FIXME')) score -= 0.05;
    if (code.includes('throw') && !code.includes('catch')) score -= 0.1;
    
    return Math.max(0, Math.min(1, score));
  };

  const calculateEmpathyScore = (code: string): number => {
    let empathy = 0.5;
    
    // User-centric code patterns
    if (code.includes('aria-') || code.includes('role=')) empathy += 0.2;
    if (code.includes('placeholder') || code.includes('title=')) empathy += 0.1;
    if (code.includes('loading') || code.includes('disabled')) empathy += 0.1;
    if (code.includes('error') && code.includes('user')) empathy += 0.1;
    if (code.includes('confirm') || code.includes('alert')) empathy += 0.05;
    
    return Math.max(0, Math.min(1, empathy));
  };

  const calculateUserFriendliness = (code: string): number => {
    let friendliness = 0.5;
    
    // User experience indicators
    if (code.includes('smooth') || code.includes('transition')) friendliness += 0.1;
    if (code.includes('responsive') || code.includes('mobile')) friendliness += 0.1;
    if (code.includes('intuitive') || code.includes('easy')) friendliness += 0.1;
    if (code.includes('feedback') || code.includes('notification')) friendliness += 0.1;
    if (code.includes('animation') || code.includes('hover')) friendliness += 0.05;
    
    return Math.max(0, Math.min(1, friendliness));
  };

  const calculateAccessibilityRating = (code: string): number => {
    let accessibility = 0.3;
    
    // Accessibility features
    if (code.includes('aria-label') || code.includes('aria-describedby')) accessibility += 0.2;
    if (code.includes('alt=') || code.includes('title=')) accessibility += 0.1;
    if (code.includes('tabindex') || code.includes('focus')) accessibility += 0.1;
    if (code.includes('screen reader') || code.includes('keyboard')) accessibility += 0.15;
    if (code.includes('contrast') || code.includes('color')) accessibility += 0.05;
    if (code.includes('semantic') || code.includes('role=')) accessibility += 0.1;
    
    return Math.max(0, Math.min(1, accessibility));
  };

  const calculateEmotionalIntelligence = (code: string): number => {
    let ei = 0.4;
    
    // Emotional intelligence in code
    if (code.includes('validate') || code.includes('sanitize')) ei += 0.1;
    if (code.includes('graceful') || code.includes('fallback')) ei += 0.1;
    if (code.includes('retry') || code.includes('timeout')) ei += 0.1;
    if (code.includes('progress') || code.includes('status')) ei += 0.1;
    if (code.includes('cancel') || code.includes('abort')) ei += 0.1;
    if (code.includes('confirm') || code.includes('warning')) ei += 0.1;
    
    return Math.max(0, Math.min(1, ei));
  };

  const calculateCompassionIndex = (code: string): number => {
    let compassion = 0.4;
    
    // Compassionate coding practices
    if (code.includes('help') || code.includes('guide')) compassion += 0.15;
    if (code.includes('support') || code.includes('assist')) compassion += 0.1;
    if (code.includes('inclusive') || code.includes('diverse')) compassion += 0.1;
    if (code.includes('gentle') || code.includes('kind')) compassion += 0.1;
    if (code.includes('patient') || code.includes('understanding')) compassion += 0.1;
    if (code.includes('comfort') || code.includes('ease')) compassion += 0.05;
    
    return Math.max(0, Math.min(1, compassion));
  };

  const calculateJoyFactor = (code: string): number => {
    let joy = 0.5;
    
    // Joyful coding indicators
    if (code.includes('celebrate') || code.includes('success')) joy += 0.1;
    if (code.includes('delight') || code.includes('amazing')) joy += 0.1;
    if (code.includes('fun') || code.includes('play')) joy += 0.1;
    if (code.includes('magic') || code.includes('sparkle')) joy += 0.05;
    if (code.includes('beautiful') || code.includes('elegant')) joy += 0.05;
    if (code.includes('smooth') || code.includes('fluid')) joy += 0.05;
    
    // Reduce joy for negative patterns
    if (code.includes('hack') || code.includes('ugly')) joy -= 0.1;
    if (code.includes('broken') || code.includes('fail')) joy -= 0.05;
    
    return Math.max(0, Math.min(1, joy));
  };

  const calculateStressLevel = (code: string): number => {
    let stress = 0.3;
    
    // Stress indicators
    if (code.includes('TODO') || code.includes('FIXME')) stress += 0.1;
    if (code.includes('hack') || code.includes('workaround')) stress += 0.15;
    if (code.includes('urgent') || code.includes('critical')) stress += 0.1;
    if (code.includes('deadline') || code.includes('rush')) stress += 0.1;
    if (code.includes('complex') || code.includes('difficult')) stress += 0.05;
    
    // Stress reducers
    if (code.includes('test') || code.includes('spec')) stress -= 0.1;
    if (code.includes('document') || code.includes('comment')) stress -= 0.05;
    if (code.includes('clean') || code.includes('refactor')) stress -= 0.05;
    
    return Math.max(0, Math.min(1, stress));
  };

  const generateEmotionalInsights = (metrics: EmotionalCodeMetrics, code: string): string[] => {
    const insights: string[] = [];
    
    if (metrics.empathy_score > 0.8) {
      insights.push('Your code shows high empathy for users - excellent accessibility considerations!');
    } else if (metrics.empathy_score < 0.5) {
      insights.push('Consider adding more user-friendly features like loading states and error messages.');
    }
    
    if (metrics.joy_factor > 0.7) {
      insights.push('Your code radiates joy and positivity - users will love the experience!');
    } else if (metrics.joy_factor < 0.4) {
      insights.push('Try adding delightful interactions and positive feedback to increase user joy.');
    }
    
    if (metrics.stress_level > 0.7) {
      insights.push('High stress detected in code patterns. Consider refactoring for clarity and peace of mind.');
    } else if (metrics.stress_level < 0.3) {
      insights.push('Your code promotes a calm, stress-free development experience.');
    }
    
    if (metrics.compassion_index > 0.8) {
      insights.push('Your code demonstrates deep compassion for users and fellow developers.');
    }
    
    if (metrics.accessibility_rating > 0.8) {
      insights.push('Excellent accessibility implementation - truly inclusive design!');
    } else if (metrics.accessibility_rating < 0.5) {
      insights.push('Consider improving accessibility with ARIA labels, semantic HTML, and keyboard navigation.');
    }
    
    return insights;
  };

  const getEmotionalColor = (score: number, type: 'positive' | 'negative' = 'positive') => {
    if (type === 'negative') {
      if (score < 0.3) return 'text-green-600';
      if (score < 0.6) return 'text-yellow-600';
      return 'text-red-600';
    } else {
      if (score > 0.8) return 'text-green-600';
      if (score > 0.6) return 'text-yellow-600';
      return 'text-red-600';
    }
  };

  const getEmotionalBg = (score: number, type: 'positive' | 'negative' = 'positive') => {
    if (type === 'negative') {
      if (score < 0.3) return 'bg-green-100 dark:bg-green-900/20';
      if (score < 0.6) return 'bg-yellow-100 dark:bg-yellow-900/20';
      return 'bg-red-100 dark:bg-red-900/20';
    } else {
      if (score > 0.8) return 'bg-green-100 dark:bg-green-900/20';
      if (score > 0.6) return 'bg-yellow-100 dark:bg-yellow-900/20';
      return 'bg-red-100 dark:bg-red-900/20';
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-pink-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-red-600 rounded-xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-gray-50" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-50">
              Emotional Code Analyzer
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              How does your code make users feel?
            </p>
          </div>
        </div>
        <button
          onClick={analyzeEmotionalCode}
          disabled={isAnalyzing}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-red-600 text-gray-50 rounded-lg hover:from-pink-600 hover:to-red-700 disabled:opacity-50 transition-all"
        >
          <Heart className="w-4 h-4" />
          <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Emotions'}</span>
        </button>
      </div>

      {metrics && (
        <div className="space-y-6">
          {/* Emotional Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className={`p-4 rounded-lg ${getEmotionalBg(metrics.empathy_score)}`}>
              <div className="flex items-center space-x-2 mb-2">
                <Heart className={`w-5 h-5 ${getEmotionalColor(metrics.empathy_score)}`} />
                <span className="font-medium text-gray-800 dark:text-gray-50">Empathy</span>
              </div>
              <p className={`text-2xl font-bold ${getEmotionalColor(metrics.empathy_score)}`}>
                {(metrics.empathy_score * 100).toFixed(0)}%
              </p>
            </div>
            
            <div className={`p-4 rounded-lg ${getEmotionalBg(metrics.joy_factor)}`}>
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className={`w-5 h-5 ${getEmotionalColor(metrics.joy_factor)}`} />
                <span className="font-medium text-gray-800 dark:text-gray-50">Joy</span>
              </div>
              <p className={`text-2xl font-bold ${getEmotionalColor(metrics.joy_factor)}`}>
                {(metrics.joy_factor * 100).toFixed(0)}%
              </p>
            </div>
            
            <div className={`p-4 rounded-lg ${getEmotionalBg(metrics.accessibility_rating)}`}>
              <div className="flex items-center space-x-2 mb-2">
                <Eye className={`w-5 h-5 ${getEmotionalColor(metrics.accessibility_rating)}`} />
                <span className="font-medium text-gray-800 dark:text-gray-50">Accessibility</span>
              </div>
              <p className={`text-2xl font-bold ${getEmotionalColor(metrics.accessibility_rating)}`}>
                {(metrics.accessibility_rating * 100).toFixed(0)}%
              </p>
            </div>
            
            <div className={`p-4 rounded-lg ${getEmotionalBg(metrics.stress_level, 'negative')}`}>
              <div className="flex items-center space-x-2 mb-2">
                <Activity className={`w-5 h-5 ${getEmotionalColor(metrics.stress_level, 'negative')}`} />
                <span className="font-medium text-gray-800 dark:text-gray-50">Stress</span>
              </div>
              <p className={`text-2xl font-bold ${getEmotionalColor(metrics.stress_level, 'negative')}`}>
                {(metrics.stress_level * 100).toFixed(0)}%
              </p>
            </div>
          </div>

          {/* Emotional Intelligence Breakdown */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 p-4 rounded-lg">
            <h4 className="font-medium text-gray-800 dark:text-gray-50 mb-3">Emotional Intelligence Breakdown</h4>
            <div className="space-y-3">
              {[
                { label: 'User Friendliness', score: metrics.user_friendliness, icon: Heart },
                { label: 'Compassion Index', score: metrics.compassion_index, icon: Sparkles },
                { label: 'Emotional Resonance', score: metrics.emotional_resonance, icon: Activity },
                { label: 'Overall EQ', score: metrics.emotional_intelligence, icon: Brain }
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <item.icon className="w-4 h-4 text-purple-600" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{item.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full"
                        style={{ width: `${item.score * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-50 w-10">
                      {(item.score * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Emotional Insights */}
          {emotionalInsights.length > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 dark:text-gray-50 mb-3">Emotional Insights</h4>
              <div className="space-y-2">
                {emotionalInsights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <Heart className="w-4 h-4 text-pink-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-gray-700 dark:text-gray-300">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!metrics && !isAnalyzing && (
        <div className="text-center py-8">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-800 dark:text-gray-50 mb-2">
            Emotional Analysis Ready
          </h4>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Discover how your code affects users emotionally and improve user experience through empathy.
          </p>
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 p-4 rounded-lg">
            <h5 className="font-medium text-gray-800 dark:text-gray-50 mb-2">What Emotional Analysis Provides:</h5>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1 text-left">
              <li>• User empathy and accessibility scoring</li>
              <li>• Joy and delight factor analysis</li>
              <li>• Stress level assessment for developers and users</li>
              <li>• Compassionate coding recommendations</li>
              <li>• Emotional intelligence insights</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}