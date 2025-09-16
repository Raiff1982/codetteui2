import { env } from '../utils/env';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = env.VITE_API_URL || window.location.origin;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Health check
  async checkHealth() {
    return this.request<{status: string}>('/api/health');
  }

  // AI Systems
  async runQuantumOptimization(data: any) {
    return this.request('/api/quantum/optimize', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async conveneCouncil(data: any) {
    return this.request('/api/council/convene', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async storeMemory(data: any) {
    return this.request('/api/memory/store', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async analyzeCode(data: any) {
    return this.request('/api/analysis/comprehensive', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async generateMusic(data: any) {
    return this.request('/api/music/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Export types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}