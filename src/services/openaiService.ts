// Secure OpenAI Service - Routes through backend to protect API key
class OpenAIService {
  private baseUrl: string;
  private backendAvailable: boolean = false;

  constructor() {
    this.baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
    this.checkBackendAvailability();
  }

  private async checkBackendAvailability(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/api/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(2000) // 2 second timeout
      });
      this.backendAvailable = response.ok;
    } catch (error) {
      this.backendAvailable = false;
    }
  }

  async answerQuestion(question: string, context?: string): Promise<string> {
    // Check backend availability first
    await this.checkBackendAvailability();
    
    if (!this.backendAvailable) {
      // Return a helpful fallback response instead of throwing an error
      return this.generateFallbackResponse(question, context);
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: question,
          context: context,
          max_tokens: 150,
          temperature: 0.7
        }),
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`Backend AI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.response || 'No response generated';
    } catch (error) {
      console.error('Backend AI API call failed:', error);
      // Use fallback response
      return this.generateFallbackResponse(question, context);
    }
  }

  private generateFallbackResponse(question: string, context?: string): string {
    const questionLower = question.toLowerCase();
    
    // Provide helpful responses based on question content
    if (questionLower.includes('help') || questionLower.includes('how')) {
      return "I'd be happy to help! While the full AI backend isn't available right now, I can still provide guidance. Try using the AI panels in the interface for code analysis, or check out the beginner's guide for step-by-step tutorials.";
    }
    
    if (questionLower.includes('error') || questionLower.includes('bug')) {
      return "For debugging help, try these steps: 1) Check the browser console for error messages, 2) Use console.log() to track variable values, 3) Break down complex code into smaller parts, 4) Use the AI code assistant in the editor for suggestions.";
    }
    
    if (questionLower.includes('code') || questionLower.includes('function')) {
      return "For coding help, you can use the built-in AI features like auto-completion, code optimization, and the various AI panels. The interface includes quantum optimization, ethical analysis, and creative code generation tools.";
    }
    
    if (questionLower.includes('learn') || questionLower.includes('tutorial')) {
      return "Great question! Codette has built-in learning features: enable beginner mode for helpful tips, check out the How-To guide, try the interactive tutorials, and use the AI assistant panels for guidance. Start with simple console.log() statements and build from there!";
    }
    
    return "I'm here to help! While the full AI backend is in demo mode, you can still use many AI features through the interface. Try the AI panels, code optimization tools, or check out the beginner's guide for tutorials. What specific aspect of coding would you like to explore?";
  }
  isConfigured(): boolean {
    return this.backendAvailable;
  }
}

export const openaiService = new OpenAIService();