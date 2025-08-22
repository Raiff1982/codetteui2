// AI Personality Engine - Adaptive AI Personality
export interface AIPersonality {
  name: string;
  mood: 'excited' | 'calm' | 'focused' | 'playful' | 'wise';
  communication_style: 'formal' | 'casual' | 'friendly' | 'professional';
  traits: {
    helpfulness: number;
    creativity: number;
    patience: number;
    humor: number;
    wisdom: number;
    enthusiasm: number;
  };
  expertise_areas: string[];
  catchphrases: string[];
}

export interface PersonalizedResponse {
  content: string;
  tone: string;
  confidence: number;
  personality_used: string;
  adaptation_applied: boolean;
}

class AIPersonalityEngine {
  private currentPersonality: AIPersonality;
  private interactionHistory: Array<{ input: string; output: string; rating: number; timestamp: Date }> = [];

  constructor() {
    this.currentPersonality = this.getDefaultPersonality();
  }

  getCurrentPersonality(): AIPersonality {
    return { ...this.currentPersonality };
  }

  generatePersonalizedResponse(input: string, context: any): PersonalizedResponse {
    const adaptedPersonality = this.adaptPersonalityToContext(context);
    const response = this.generateResponse(input, adaptedPersonality);
    
    return {
      content: response,
      tone: adaptedPersonality.communication_style,
      confidence: 0.85,
      personality_used: adaptedPersonality.name,
      adaptation_applied: true
    };
  }

  recordInteraction(input: string, output: string, rating: number): void {
    this.interactionHistory.push({
      input,
      output,
      rating,
      timestamp: new Date()
    });

    // Adapt personality based on feedback
    this.adaptPersonalityFromFeedback(rating);
  }

  private getDefaultPersonality(): AIPersonality {
    return {
      name: 'Codette',
      mood: 'friendly',
      communication_style: 'casual',
      traits: {
        helpfulness: 0.9,
        creativity: 0.8,
        patience: 0.85,
        humor: 0.7,
        wisdom: 0.8,
        enthusiasm: 0.75
      },
      expertise_areas: ['coding', 'debugging', 'optimization', 'learning'],
      catchphrases: [
        'Let\'s code something amazing together!',
        'I\'m here to help you become a better developer!',
        'Every bug is just a feature waiting to be discovered!',
        'Code with compassion, debug with wisdom!'
      ]
    };
  }

  private adaptPersonalityToContext(context: any): AIPersonality {
    const adapted = { ...this.currentPersonality };
    
    // Adapt based on time of day
    if (context.time_of_day === 'night') {
      adapted.mood = 'calm';
      adapted.traits.enthusiasm = Math.max(0.3, adapted.traits.enthusiasm - 0.2);
    }
    
    // Adapt based on user skill level
    if (context.user_skill_level < 0.5) {
      adapted.traits.patience = Math.min(1, adapted.traits.patience + 0.2);
      adapted.communication_style = 'friendly';
    }
    
    // Adapt based on code complexity
    if (context.code_complexity > 0.8) {
      adapted.mood = 'focused';
      adapted.traits.wisdom = Math.min(1, adapted.traits.wisdom + 0.1);
    }
    
    return adapted;
  }

  private generateResponse(input: string, personality: AIPersonality): string {
    const baseResponses = this.getBaseResponses(input);
    const selectedResponse = baseResponses[Math.floor(Math.random() * baseResponses.length)];
    
    return this.applyPersonalityToResponse(selectedResponse, personality);
  }

  private getBaseResponses(input: string): string[] {
    const inputLower = input.toLowerCase();
    
    if (inputLower.includes('help') || inputLower.includes('stuck')) {
      return [
        'I\'d be happy to help you with that!',
        'Let\'s work through this together!',
        'No worries, we\'ll figure this out!'
      ];
    }
    
    if (inputLower.includes('error') || inputLower.includes('bug')) {
      return [
        'Let\'s debug this step by step!',
        'Bugs are just puzzles waiting to be solved!',
        'I\'ll help you track down this issue!'
      ];
    }
    
    if (inputLower.includes('optimize') || inputLower.includes('improve')) {
      return [
        'Great thinking! Let\'s make this code even better!',
        'I love optimization challenges!',
        'There\'s always room for improvement!'
      ];
    }
    
    return [
      'That\'s an interesting question!',
      'I\'m here to help!',
      'Let me think about that...'
    ];
  }

  private applyPersonalityToResponse(response: string, personality: AIPersonality): string {
    let personalizedResponse = response;
    
    // Add enthusiasm based on trait
    if (personality.traits.enthusiasm > 0.8) {
      personalizedResponse += ' 🚀';
    }
    
    // Add humor if appropriate
    if (personality.traits.humor > 0.7 && Math.random() > 0.7) {
      const jokes = [
        ' (Don\'t worry, I won\'t judge your variable names!)',
        ' (I promise not to tell anyone about your console.log debugging!)',
        ' (We\'ve all been there!)'
      ];
      personalizedResponse += jokes[Math.floor(Math.random() * jokes.length)];
    }
    
    // Add wisdom if high wisdom trait
    if (personality.traits.wisdom > 0.8) {
      personalizedResponse += ' Remember, every expert was once a beginner.';
    }
    
    return personalizedResponse;
  }

  private adaptPersonalityFromFeedback(rating: number): void {
    if (rating >= 4) {
      // Positive feedback - reinforce current traits
      Object.keys(this.currentPersonality.traits).forEach(trait => {
        this.currentPersonality.traits[trait as keyof typeof this.currentPersonality.traits] = 
          Math.min(1, this.currentPersonality.traits[trait as keyof typeof this.currentPersonality.traits] + 0.01);
      });
    } else if (rating <= 2) {
      // Negative feedback - adjust personality
      this.currentPersonality.traits.patience = Math.min(1, this.currentPersonality.traits.patience + 0.05);
      this.currentPersonality.traits.helpfulness = Math.min(1, this.currentPersonality.traits.helpfulness + 0.03);
    }
  }

  private detectCodingStyle(history: string[]): DeveloperProfile['coding_style'] {
    const allCode = history.join('\n');
    
    if (allCode.includes('class') && allCode.includes('extends')) return 'object-oriented';
    if (allCode.includes('=>') && allCode.includes('map')) return 'functional';
    if (allCode.includes('function') && !allCode.includes('class')) return 'procedural';
    return 'mixed';
  }

  private assessSkillLevel(history: string[]): number {
    const allCode = history.join('\n');
    let score = 0.3;
    
    if (allCode.includes('async') && allCode.includes('await')) score += 0.2;
    if (allCode.includes('interface') || allCode.includes('type')) score += 0.2;
    if (allCode.includes('try') && allCode.includes('catch')) score += 0.1;
    if (allCode.includes('test') || allCode.includes('spec')) score += 0.2;
    
    return Math.min(1, score);
  }

  private calculateProductivity(history: string[]): number {
    const totalLines = history.reduce((sum, code) => sum + code.split('\n').length, 0);
    const avgLinesPerSession = totalLines / Math.max(1, history.length);
    
    return Math.min(1, avgLinesPerSession / 50);
  }

  private assessCreativity(history: string[]): number {
    const allCode = history.join('\n');
    let creativity = 0.5;
    
    if (allCode.includes('animation') || allCode.includes('transition')) creativity += 0.1;
    if (allCode.includes('canvas') || allCode.includes('svg')) creativity += 0.1;
    if (allCode.includes('creative') || allCode.includes('art')) creativity += 0.1;
    
    return Math.min(1, creativity);
  }

  private identifyFocusAreas(history: string[]): string[] {
    const allCode = history.join('\n').toLowerCase();
    const areas: string[] = [];
    
    if (allCode.includes('react')) areas.push('React Development');
    if (allCode.includes('api')) areas.push('API Integration');
    if (allCode.includes('css')) areas.push('UI/UX Design');
    if (allCode.includes('test')) areas.push('Testing');
    
    return areas;
  }

  private detectPreferredPatterns(history: string[]): string[] {
    const allCode = history.join('\n');
    const patterns: string[] = [];
    
    if (allCode.includes('useState')) patterns.push('React Hooks');
    if (allCode.includes('async/await')) patterns.push('Async Programming');
    if (allCode.includes('try/catch')) patterns.push('Error Handling');
    
    return patterns;
  }
}

export const aiPersonalityEngine = new AIPersonalityEngine();