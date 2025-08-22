# Codette API Documentation

## 🚀 Overview

Codette provides a comprehensive API for integrating AI-powered development features into your applications.

## 🔑 Authentication

All API requests require authentication using JWT tokens:

```typescript
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};
```

## 🧠 AI Services API

### Quantum Optimization

```typescript
POST /api/quantum/optimize
```

**Request Body:**
```json
{
  "objectives": ["performance", "maintainability"],
  "code_context": "function example() { return 'hello'; }",
  "dimension": 20
}
```

**Response:**
```json
{
  "pareto_front_size": 15,
  "convergence_time": 2.3,
  "optimization_score": 0.87,
  "solutions": [...],
  "quantum_metrics": {
    "entanglement_factor": 0.73,
    "tunneling_events": 42,
    "superposition_states": 128
  }
}
```

### Aegis Council

```typescript
POST /api/council/convene
```

**Request Body:**
```json
{
  "input_text": "Should we implement this feature?",
  "overrides": {
    "VirtueAgent": {"influence": 0.8}
  }
}
```

**Response:**
```json
{
  "override_decision": "approved",
  "virtue_profile": {
    "compassion": 0.85,
    "integrity": 0.92,
    "wisdom": 0.88,
    "courage": 0.79
  },
  "consensus_strength": 0.86,
  "temporal_forecast": "stable"
}
```

### DreamCore Memory

```typescript
POST /api/memory/store
```

**Request Body:**
```json
{
  "emotion_tag": "curiosity",
  "content": "Learned about quantum optimization",
  "emotional_weight": 0.8
}
```

**Response:**
```json
{
  "memory_id": "mem_1642857600",
  "stored_at": "2025-01-23T10:30:00Z",
  "decay_factor": 0.95
}
```

## 🎵 Music API

### Generate Adaptive Music

```typescript
POST /api/music/generate
```

**Request Body:**
```json
{
  "genre": "ambient",
  "mood": "focused",
  "duration": 300,
  "coding_context": {
    "language": "typescript",
    "complexity": 0.7
  }
}
```

**Response:**
```json
{
  "track_id": "ai_generated_1642857600",
  "title": "Adaptive TypeScript Symphony",
  "duration": 300,
  "audio_url": "blob:...",
  "metadata": {
    "tempo": 80,
    "key": "C major",
    "mood": "focused"
  }
}
```

## 🔒 Security API

### Code Security Scan

```typescript
POST /api/security/scan
```

**Request Body:**
```json
{
  "code": "function example() { eval(userInput); }",
  "language": "javascript"
}
```

**Response:**
```json
{
  "scan_id": "scan_1642857600",
  "security_score": 0.3,
  "threats_found": [
    {
      "type": "code_injection",
      "severity": "critical",
      "description": "eval() usage detected",
      "recommendation": "Use JSON.parse() instead"
    }
  ],
  "safe_to_execute": false
}
```

## 📊 Analytics API

### Performance Metrics

```typescript
GET /api/analytics/performance
```

**Response:**
```json
{
  "execution_time": 45.2,
  "memory_usage": 52428800,
  "cpu_utilization": 0.65,
  "user_experience_score": 0.89,
  "optimization_opportunities": [
    "Enable code splitting",
    "Implement lazy loading"
  ]
}
```

## 🎯 Code Analysis API

### Comprehensive Analysis

```typescript
POST /api/analysis/comprehensive
```

**Request Body:**
```json
{
  "code": "const greeting = 'Hello, World!';",
  "language": "javascript",
  "analysis_types": ["quality", "security", "ethics", "performance"]
}
```

**Response:**
```json
{
  "overall_score": 0.85,
  "quality_metrics": {
    "maintainability": 0.9,
    "readability": 0.8,
    "testability": 0.7
  },
  "security_score": 0.95,
  "ethical_score": 0.88,
  "performance_score": 0.82,
  "recommendations": [...]
}
```

## 🔄 WebSocket Events

### Real-time Updates

Connect to WebSocket endpoint: `wss://api.codette.dev/ws`

**Events:**
- `code_analysis_complete`
- `quantum_optimization_result`
- `security_threat_detected`
- `ai_suggestion_available`
- `music_track_generated`

## 📝 Error Handling

All API endpoints return consistent error responses:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input parameters",
    "details": {
      "field": "code",
      "reason": "Code cannot be empty"
    }
  },
  "timestamp": "2025-01-23T10:30:00Z",
  "request_id": "req_1642857600"
}
```

## 🚦 Rate Limiting

- **Free Tier**: 100 requests per hour
- **Pro Tier**: 1000 requests per hour
- **Enterprise**: Custom limits

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642857600
```

## 📚 SDK Libraries

### JavaScript/TypeScript
```bash
npm install @codette/sdk
```

```typescript
import { CodetteClient } from '@codette/sdk';

const client = new CodetteClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://api.codette.dev'
});

const result = await client.quantum.optimize({
  objectives: ['performance', 'maintainability'],
  code: 'your code here'
});
```

### Python
```bash
pip install codette-sdk
```

```python
from codette import CodetteClient

client = CodetteClient(api_key='your-api-key')

result = client.quantum.optimize(
    objectives=['performance', 'maintainability'],
    code='your code here'
)
```

## 🔧 Configuration

### Environment Variables

```bash
# Required
CODETTE_API_KEY=your_api_key_here
CODETTE_BASE_URL=https://api.codette.dev

# Optional
CODETTE_TIMEOUT=30000
CODETTE_RETRY_ATTEMPTS=3
CODETTE_DEBUG=false
```

### Client Configuration

```typescript
const config = {
  apiKey: process.env.CODETTE_API_KEY,
  baseUrl: 'https://api.codette.dev',
  timeout: 30000,
  retryAttempts: 3,
  enableLogging: true,
  ethicalMode: true // Enable virtue-driven analysis
};
```

## 🎯 Best Practices

### API Usage
- Always handle errors gracefully
- Implement proper retry logic
- Cache responses when appropriate
- Use webhooks for long-running operations
- Respect rate limits

### Security
- Never expose API keys in client-side code
- Use environment variables for configuration
- Implement proper authentication
- Validate all inputs
- Monitor for unusual activity

### Performance
- Batch requests when possible
- Use compression for large payloads
- Implement request caching
- Monitor response times
- Use appropriate timeouts

## 📖 Examples

### Complete Code Analysis Workflow

```typescript
import { CodetteClient } from '@codette/sdk';

const client = new CodetteClient({
  apiKey: process.env.CODETTE_API_KEY
});

async function analyzeCode(code: string, language: string) {
  try {
    // 1. Security scan
    const security = await client.security.scan({ code, language });
    
    // 2. Quantum optimization
    const quantum = await client.quantum.optimize({
      objectives: ['performance', 'maintainability'],
      code
    });
    
    // 3. Ethical analysis
    const ethics = await client.ethics.analyze({ code, language });
    
    // 4. Generate adaptive music
    const music = await client.music.generateAdaptive({
      code,
      language,
      complexity: quantum.optimization_score
    });
    
    return {
      security,
      quantum,
      ethics,
      music,
      overall_score: (security.security_score + quantum.optimization_score + ethics.ethical_score) / 3
    };
  } catch (error) {
    console.error('Analysis failed:', error);
    throw error;
  }
}
```

### Real-time Collaboration

```typescript
import { CodetteWebSocket } from '@codette/sdk';

const ws = new CodetteWebSocket({
  apiKey: process.env.CODETTE_API_KEY,
  sessionId: 'collaboration-session-123'
});

ws.on('code_change', (data) => {
  console.log('Collaborator changed code:', data);
});

ws.on('ai_suggestion', (suggestion) => {
  console.log('AI suggests:', suggestion);
});

// Send code changes
ws.sendCodeChange({
  code: updatedCode,
  language: 'typescript',
  cursor_position: 150
});
```

## 🔗 Related Documentation

- [Getting Started Guide](./GETTING_STARTED.md)
- [AI Features Documentation](./AI_FEATURES.md)
- [Security Best Practices](./SECURITY_BEST_PRACTICES.md)
- [Research Papers](https://zenodo.org/communities/codette)

## 📞 Support

- **API Support**: api-support@raiffsbits.com
- **Documentation**: [docs.raiffsbits.com](https://docs.raiffsbits.com)
- **Community**: [Discord](https://discord.gg/codette)
- **GitHub Issues**: [Report bugs](https://github.com/raiffsbits/codette/issues)

---

**Built with ❤️ for developers, by developers**

*"Ethical AI, transparent algorithms, and genuine innovation for the coding community."*