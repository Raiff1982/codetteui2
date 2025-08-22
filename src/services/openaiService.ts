// Secure OpenAI Service - Routes through backend to protect API key
class OpenAIService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
  }

  async answerQuestion(question: string, context?: string): Promise<string> {
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
        })
      });

      if (!response.ok) {
        throw new Error(`Backend AI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.response || 'No response generated';
    } catch (error) {
      console.error('Backend AI API call failed:', error);
      // Fallback response
      return 'I apologize, but I cannot process your request right now. The AI service is temporarily unavailable.';
    }
  }

  isConfigured(): boolean {
    // Always return true since we route through backend
    return true;
  }
}

export const openaiService = new OpenAIService();