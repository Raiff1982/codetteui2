// Neural Code Predictor - AI-Powered Code Prediction
export interface CodePrediction {
  next_line: string;
  confidence: number;
  reasoning: string;
  alternatives: string[];
  completion_time_estimate: number;
  difficulty_level: 'easy' | 'medium' | 'hard';
}

export interface DeveloperProfile {
  coding_style: 'functional' | 'object-oriented' | 'procedural' | 'mixed';
  skill_level: number;
  productivity_score: number;
  creativity_index: number;
  focus_areas: string[];
  preferred_patterns: string[];
}

class NeuralCodePredictor {
  private userProfile: DeveloperProfile | null = null;
  private predictionHistory: CodePrediction[] = [];
  private learningData: Array<{ input: string; output: string; accepted: boolean }> = [];

  async predictNextLine(code: string, cursorPosition: number, language: string): Promise<CodePrediction> {
    const context = this.analyzeContext(code, cursorPosition);
    const prediction = this.generatePrediction(context, language);
    
    this.predictionHistory.push(prediction);
    return prediction;
  }

  buildDeveloperProfile(codingHistory: string[]): DeveloperProfile {
    const profile: DeveloperProfile = {
      coding_style: this.detectCodingStyle(codingHistory),
      skill_level: this.assessSkillLevel(codingHistory),
      productivity_score: this.calculateProductivity(codingHistory),
      creativity_index: this.assessCreativity(codingHistory),
      focus_areas: this.identifyFocusAreas(codingHistory),
      preferred_patterns: this.detectPreferredPatterns(codingHistory)
    };

    this.userProfile = profile;
    return profile;
  }

  learnFromUserBehavior(prediction: CodePrediction, actualCode: string, accepted: boolean): void {
    this.learningData.push({
      input: prediction.next_line,
      output: actualCode,
      accepted
    });

    // Update user profile based on behavior
    if (this.userProfile) {
      if (accepted && prediction.confidence > 0.8) {
        this.userProfile.productivity_score = Math.min(1, this.userProfile.productivity_score + 0.01);
      }
    }
  }

  getUserInsights(): { recommendations: string[]; patterns: string[] } | null {
    if (!this.userProfile) return null;

    const recommendations: string[] = [];
    
    if (this.userProfile.skill_level < 0.5) {
      recommendations.push('Consider learning more about code organization and best practices');
    }
    
    if (this.userProfile.productivity_score < 0.6) {
      recommendations.push('Try using more keyboard shortcuts and code snippets');
    }
    
    if (this.userProfile.creativity_index > 0.8) {
      recommendations.push('Your creative coding style is excellent! Consider sharing your patterns');
    }

    return {
      recommendations,
      patterns: this.userProfile.preferred_patterns
    };
  }

  private analyzeContext(code: string, cursorPosition: number): any {
    const beforeCursor = code.slice(0, cursorPosition);
    const afterCursor = code.slice(cursorPosition);
    const currentLine = beforeCursor.split('\n').pop() || '';
    
    return {
      beforeCursor,
      afterCursor,
      currentLine,
      indentLevel: this.getIndentLevel(currentLine),
      inFunction: this.isInFunction(beforeCursor),
      inClass: this.isInClass(beforeCursor)
    };
  }

  private generatePrediction(context: any, language: string): CodePrediction {
    const predictions = this.getPredictionsForContext(context, language);
    const selected = predictions[0] || { text: '', confidence: 0.5 };

    return {
      next_line: selected.text,
      confidence: selected.confidence,
      reasoning: selected.reasoning || 'Pattern-based prediction',
      alternatives: predictions.slice(1, 4).map(p => p.text),
      completion_time_estimate: 2 + Math.random() * 3,
      difficulty_level: selected.confidence > 0.8 ? 'easy' : selected.confidence > 0.6 ? 'medium' : 'hard'
    };
  }

  private getPredictionsForContext(context: any, language: string): Array<{ text: string; confidence: number; reasoning?: string }> {
    const predictions: Array<{ text: string; confidence: number; reasoning?: string }> = [];
    
    if (context.currentLine.includes('function') && !context.currentLine.includes('{')) {
      predictions.push({
        text: ' {',
        confidence: 0.9,
        reasoning: 'Function declaration needs opening brace'
      });
    }
    
    if (context.currentLine.includes('if') && !context.currentLine.includes('{')) {
      predictions.push({
        text: ' {',
        confidence: 0.85,
        reasoning: 'Conditional statement needs opening brace'
      });
    }
    
    if (context.currentLine.trim() === '') {
      predictions.push({
        text: '  // TODO: Implement',
        confidence: 0.6,
        reasoning: 'Empty line suggests need for implementation'
      });
    }
    
    return predictions;
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
    
    return Math.min(1, avgLinesPerSession / 50); // Normalize to 50 lines per session
  }

  private assessCreativity(history: string[]): number {
    const allCode = history.join('\n');
    let creativity = 0.5;
    
    if (allCode.includes('animation') || allCode.includes('transition')) creativity += 0.1;
    if (allCode.includes('canvas') || allCode.includes('svg')) creativity += 0.1;
    if (allCode.includes('creative') || allCode.includes('art')) creativity += 0.1;
    
    const uniquePatterns = new Set(allCode.match(/\w+/g)).size;
    const totalWords = (allCode.match(/\w+/g) || []).length;
    const vocabularyDiversity = uniquePatterns / Math.max(1, totalWords);
    
    creativity += vocabularyDiversity * 0.3;
    
    return Math.min(1, creativity);
  }

  private identifyFocusAreas(history: string[]): string[] {
    const allCode = history.join('\n').toLowerCase();
    const areas: string[] = [];
    
    if (allCode.includes('react') || allCode.includes('component')) areas.push('React Development');
    if (allCode.includes('api') || allCode.includes('fetch')) areas.push('API Integration');
    if (allCode.includes('css') || allCode.includes('style')) areas.push('UI/UX Design');
    if (allCode.includes('test') || allCode.includes('spec')) areas.push('Testing');
    if (allCode.includes('algorithm') || allCode.includes('optimize')) areas.push('Algorithms');
    
    return areas;
  }

  private detectPreferredPatterns(history: string[]): string[] {
    const allCode = history.join('\n');
    const patterns: string[] = [];
    
    if (allCode.includes('useState') && allCode.includes('useEffect')) {
      patterns.push('React Hooks Pattern');
    }
    
    if (allCode.includes('try') && allCode.includes('catch')) {
      patterns.push('Error Handling Pattern');
    }
    
    if (allCode.includes('async') && allCode.includes('await')) {
      patterns.push('Async/Await Pattern');
    }
    
    return patterns;
  }

  private getIndentLevel(line: string): number {
    return line.length - line.trimStart().length;
  }

  private isInFunction(code: string): boolean {
    const functionStarts = (code.match(/function|def /g) || []).length;
    const functionEnds = (code.match(/^}/gm) || []).length;
    return functionStarts > functionEnds;
  }

  private isInClass(code: string): boolean {
    const classStarts = (code.match(/class /g) || []).length;
    const classEnds = (code.match(/^}/gm) || []).length;
    return classStarts > classEnds;
  }
}

export const neuralCodePredictor = new NeuralCodePredictor();