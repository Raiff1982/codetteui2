import React, { useState, useEffect, useRef } from 'react';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { 
  MessageCircle, 
  Send, 
  Brain, 
  Sparkles, 
  Heart,
  Lightbulb,
  Code,
  Zap,
  Shield,
  Music,
  X,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Settings,
  RotateCcw,
  Download,
  Star,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { useAdvancedAI } from '../hooks/useAdvancedAI';
import { openaiService } from '../services/openaiService';

interface ChatMessage {
  id: string;
  role: 'user' | 'codette';
  content: string;
  timestamp: Date;
  type: 'text' | 'code' | 'suggestion' | 'analysis';
  metadata?: {
    confidence?: number;
    category?: string;
    helpful?: boolean;
    rating?: number;
  };
}

interface CodetteChatProps {
  isVisible: boolean;
  onClose: () => void;
  currentCode?: string;
  language?: string;
  onCodeGenerated?: (code: string, title?: string) => void;
}

export function CodetteChat({ 
  isVisible, 
  onClose, 
  currentCode = '', 
  language = 'typescript',
  onCodeGenerated 
}: CodetteChatProps) {
  const chatScroll = useAutoScroll({ 
    speed: 0, // Disable auto-scroll for chat
    pauseOnHover: true,
    resetOnInteraction: false 
  });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [chatPersonality, setChatPersonality] = useState<'helpful' | 'creative' | 'technical' | 'friendly'>('helpful');
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { 
    conveneAegisCouncil, 
    runQuantumOptimization, 
    storeDreamMemory,
    isProcessing 
  } = useAdvancedAI();

  useEffect(() => {
    if (isVisible && messages.length === 0) {
      // Add welcome message
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        role: 'codette',
        content: `Hello! I'm Codette, your AI coding companion! 🚀\n\nI'm here to help you with:\n• Code optimization and debugging\n• Learning new programming concepts\n• Best practices and design patterns\n• Ethical AI and security guidance\n• Creative coding solutions\n\nWhat would you like to work on today?`,
        timestamp: new Date(),
        type: 'text',
        metadata: { confidence: 1.0, category: 'welcome' }
      };
      setMessages([welcomeMessage]);
    }
  }, [isVisible]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isProcessing) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Generate AI response based on message content
      const response = await generateCodetteResponse(inputMessage);
      
      const codetteMessage: ChatMessage = {
        id: `codette-${Date.now()}`,
        role: 'codette',
        content: response.content,
        timestamp: new Date(),
        type: response.type,
        metadata: response.metadata
      };

      setMessages(prev => [...prev, codetteMessage]);

      // Store memory of the conversation
      await storeDreamMemory(
        'curiosity',
        `User asked: "${inputMessage}" - Provided helpful response about ${response.metadata?.category || 'general coding'}`,
        0.7
      );

    } catch (error) {
      console.error('Chat response failed:', error);
      
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'codette',
        content: "I apologize, but I'm having trouble processing your request right now. Please try again or rephrase your question. 🤔",
        timestamp: new Date(),
        type: 'text',
        metadata: { confidence: 0.5, category: 'error' }
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const generateCodetteResponse = async (userInput: string): Promise<{
    content: string;
    type: ChatMessage['type'];
    metadata: any;
  }> => {
    try {
      // Try to use OpenAI for more intelligent responses
      if (openaiService.isConfigured()) {
        const context = currentCode ? `Current code context (${language}):\n${currentCode.slice(0, 500)}...` : undefined;
        const response = await openaiService.answerQuestion(userInput, context);
        
        return {
          content: response,
          type: 'text',
          metadata: { confidence: 0.95, category: 'openai_response' }
        };
      }
    } catch (error) {
      console.warn('OpenAI response failed, using fallback:', error);
    }

    // Fallback to existing logic
    const input = userInput.toLowerCase();

    // Code-related questions
    if (input.includes('code') || input.includes('function') || input.includes('bug') || input.includes('error')) {
      if (input.includes('optimize') || input.includes('improve')) {
        // Use quantum optimization
        try {
          const result = await runQuantumOptimization(['performance', 'maintainability'], currentCode);
          return {
            content: `I've analyzed your code with quantum optimization! 🔬\n\nFound ${result.pareto_front_size} optimal solutions with ${(result.optimization_score * 100).toFixed(0)}% efficiency score.\n\nKey insights:\n• Convergence time: ${result.convergence_time.toFixed(2)}s\n• Optimization potential: ${(result.optimization_score * 100).toFixed(0)}%\n• Solutions discovered: ${result.pareto_front_size}\n\nWould you like me to apply the optimizations to your code?`,
            type: 'analysis',
            metadata: { confidence: 0.92, category: 'optimization', helpful: true }
          };
        } catch (error) {
          return {
            content: "I'd love to help optimize your code! Here are some general optimization tips:\n\n• Use const/let instead of var\n• Implement proper error handling\n• Add type annotations for better performance\n• Consider using memoization for expensive calculations\n\nShare your specific code and I can provide more targeted suggestions! 💡",
            type: 'suggestion',
            metadata: { confidence: 0.8, category: 'optimization' }
          };
        }
      }

      if (input.includes('debug') || input.includes('fix') || input.includes('error')) {
        return {
          content: `Let's debug this together! 🔍\n\nHere's my systematic debugging approach:\n\n1. **Identify the problem**: What exactly is happening vs. what should happen?\n2. **Check the console**: Look for error messages and stack traces\n3. **Add logging**: Use console.log() to track variable values\n4. **Test incrementally**: Comment out code sections to isolate the issue\n5. **Use the debugger**: Set breakpoints to step through code execution\n\nIf you share your specific error or code, I can provide more targeted help! What's the issue you're facing?`,
          type: 'suggestion',
          metadata: { confidence: 0.9, category: 'debugging' }
        };
      }

      if (input.includes('learn') || input.includes('how') || input.includes('what')) {
        return {
          content: `I love helping people learn! 📚✨\n\nWhat specific topic would you like to explore?\n\n**Popular learning paths:**\n• JavaScript fundamentals (variables, functions, objects)\n• React components and hooks\n• TypeScript for type safety\n• CSS styling and responsive design\n• API integration and async programming\n• Testing and debugging techniques\n\nI can explain concepts, provide examples, and even generate practice exercises for you! What interests you most?`,
          type: 'suggestion',
          metadata: { confidence: 0.95, category: 'learning' }
        };
      }
    }

    // AI and ethics questions
    if (input.includes('ai') || input.includes('ethical') || input.includes('virtue')) {
      try {
        const decision = await conveneAegisCouncil(userInput);
        return {
          content: `The Aegis Council has convened to address your question! 🏛️\n\n**Council Decision**: ${decision.override_decision}\n**Consensus Strength**: ${(decision.consensus_strength * 100).toFixed(0)}%\n\n**Virtue Analysis**:\n• Compassion: ${(decision.virtue_profile.compassion * 100).toFixed(0)}%\n• Integrity: ${(decision.virtue_profile.integrity * 100).toFixed(0)}%\n• Wisdom: ${(decision.virtue_profile.wisdom * 100).toFixed(0)}%\n• Courage: ${(decision.virtue_profile.courage * 100).toFixed(0)}%\n\n**Temporal Forecast**: ${decision.temporal_forecast}\n\nThis analysis considers both technical excellence and ethical implications. How can I help you implement these insights?`,
          type: 'analysis',
          metadata: { confidence: 0.88, category: 'ethics', helpful: true }
        };
      } catch (error) {
        return {
          content: `Great question about AI ethics! 🤖💭\n\nI'm built on virtue-driven principles that consider:\n\n• **Compassion**: How does this code affect users emotionally?\n• **Integrity**: Is the code honest, secure, and reliable?\n• **Wisdom**: Does it demonstrate deep understanding?\n• **Courage**: Does it tackle difficult but necessary improvements?\n\nEvery suggestion I make is filtered through these ethical lenses. What specific ethical aspect of coding would you like to explore?`,
          type: 'suggestion',
          metadata: { confidence: 0.85, category: 'ethics' }
        };
      }
    }

    // Music and creativity questions
    if (input.includes('music') || input.includes('creative') || input.includes('inspiration')) {
      return {
        content: `Let's spark some creativity! 🎵✨\n\nI can help with:\n\n**Music for Coding**:\n• Generate adaptive music that matches your coding rhythm\n• Classical masters (Mozart, Bach) for elegant problem-solving\n• Electronic beats for high-energy coding sessions\n• Ambient soundscapes for deep focus\n\n**Creative Coding**:\n• Artistic algorithm design\n• Generative art and visualizations\n• Creative problem-solving approaches\n• Unique code architectures\n\nWhat kind of creative inspiration are you looking for today?`,
        type: 'suggestion',
        metadata: { confidence: 0.87, category: 'creativity' }
      };
    }

    // General programming help
    if (input.includes('help') || input.includes('stuck') || input.includes('problem')) {
      return {
        content: `I'm here to help! 💪 Let's tackle this together.\n\n**Tell me more about:**\n• What you're trying to build\n• What's not working as expected\n• Any error messages you're seeing\n• Your experience level with this technology\n\n**I can assist with:**\n• Writing and debugging code\n• Explaining programming concepts\n• Suggesting best practices\n• Code reviews and optimization\n• Architecture and design decisions\n\nDon't worry - every expert was once a beginner! What specific challenge are you facing?`,
        type: 'suggestion',
        metadata: { confidence: 0.93, category: 'general_help' }
      };
    }

    // Default friendly response
    return {
      content: getPersonalityResponse(userInput, chatPersonality),
      type: 'text',
      metadata: { confidence: 0.75, category: 'conversation' }
    };
  };

  const getPersonalityResponse = (input: string, personality: string): string => {
    const responses = {
      helpful: [
        "I'm here to help! Could you tell me more about what you're working on? 🤝",
        "That's an interesting question! Let me think about the best way to assist you. 💭",
        "I'd love to help you with that! Can you provide more details about your specific needs? 🎯"
      ],
      creative: [
        "Ooh, that sounds like a fun challenge! Let's brainstorm some creative solutions! 🎨",
        "I love creative problems! Let's think outside the box and explore innovative approaches! ✨",
        "That's exciting! Let's combine art and code to create something amazing! 🚀"
      ],
      technical: [
        "Let me analyze this from a technical perspective and provide you with precise solutions. 🔬",
        "I'll break this down systematically and give you the most efficient approach. ⚙️",
        "Let's examine the technical requirements and implement the optimal solution. 📊"
      ],
      friendly: [
        "Hey there! I'm excited to chat with you! What's on your mind today? 😊",
        "Hi! I'm Codette, and I'm here to make coding fun and accessible! How can I brighten your day? 🌟",
        "Hello, wonderful human! Ready to create some amazing code together? 💖"
      ]
    };

    const personalityResponses = responses[personality];
    return personalityResponses[Math.floor(Math.random() * personalityResponses.length)];
  };

  const rateMessage = (messageId: string, helpful: boolean) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, metadata: { ...msg.metadata, helpful, rating: helpful ? 5 : 2 } }
        : msg
    ));
  };

  const clearChat = () => {
    setMessages([]);
    // Re-add welcome message
    const welcomeMessage: ChatMessage = {
      id: 'welcome-new',
      role: 'codette',
      content: `Chat cleared! I'm ready for a fresh conversation. 🆕\n\nWhat would you like to explore today?`,
      timestamp: new Date(),
      type: 'text',
      metadata: { confidence: 1.0, category: 'welcome' }
    };
    setMessages([welcomeMessage]);
  };

  const exportChat = () => {
    const chatExport = {
      timestamp: new Date().toISOString(),
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp.toISOString(),
        type: msg.type
      }))
    };

    const blob = new Blob([JSON.stringify(chatExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `codette-chat-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert('Speech recognition not supported in this browser');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                  Chat with Codette
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your AI coding companion • Powered by Virtue-Driven AI
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <select
                value={chatPersonality}
                onChange={(e) => setChatPersonality(e.target.value as any)}
                className="px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-800 dark:text-white"
              >
                <option value="helpful">Helpful</option>
                <option value="creative">Creative</option>
                <option value="technical">Technical</option>
                <option value="friendly">Friendly</option>
              </select>
              
              <button
                onClick={clearChat}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Clear chat"
              >
                <RotateCcw className="w-5 h-5 text-gray-500" />
              </button>
              
              <button
                onClick={exportChat}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Export chat"
              >
                <Download className="w-5 h-5 text-gray-500" />
              </button>
              
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 max-h-96">
          <div 
            ref={chatScroll.elementRef}
            className="space-y-4"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                  message.role === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : message.type === 'analysis' 
                      ? 'bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 text-gray-800 dark:text-white border border-purple-200 dark:border-purple-700'
                      : message.type === 'code'
                        ? 'bg-gray-800 text-green-400 font-mono'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
                } rounded-2xl px-4 py-3 shadow-lg`}>
                  
                  {message.role === 'codette' && (
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                        <Brain className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        Codette AI
                      </span>
                      {message.metadata?.confidence && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {(message.metadata.confidence * 100).toFixed(0)}% confidence
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content}
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    
                    {message.role === 'codette' && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => rateMessage(message.id, true)}
                          className={`p-1 rounded transition-colors ${
                            message.metadata?.helpful === true 
                              ? 'text-green-600 bg-green-100 dark:bg-green-900' 
                              : 'text-gray-400 hover:text-green-600'
                          }`}
                          title="Helpful"
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => rateMessage(message.id, false)}
                          className={`p-1 rounded transition-colors ${
                            message.metadata?.helpful === false 
                              ? 'text-red-600 bg-red-100 dark:bg-red-900' 
                              : 'text-gray-400 hover:text-red-600'
                          }`}
                          title="Not helpful"
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                      <Brain className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Codette is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Codette anything about coding, AI, ethics, or creativity..."
                className="w-full px-4 py-3 bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-xl text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-12"
                disabled={isProcessing}
              />
              
              {voiceEnabled && (
                <button
                  onClick={startVoiceInput}
                  disabled={isListening || isProcessing}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-colors ${
                    isListening 
                      ? 'bg-red-500 text-white animate-pulse' 
                      : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
                  title={isListening ? 'Listening...' : 'Voice input'}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              )}
            </div>
            
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isProcessing}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-xl hover:from-purple-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              <span className="font-medium">Send</span>
            </button>
          </div>
          
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setInputMessage("How do I optimize my code for better performance?")}
              className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            >
              💡 Code Optimization
            </button>
            <button
              onClick={() => setInputMessage("I'm getting an error in my code, can you help debug it?")}
              className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-full text-xs hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
            >
              🐛 Debug Help
            </button>
            <button
              onClick={() => setInputMessage("Explain how React hooks work")}
              className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
            >
              📚 Learn Concepts
            </button>
            <button
              onClick={() => setInputMessage("Generate some creative coding music for me")}
              className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-xs hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
            >
              🎵 Creative Help
            </button>
            <button
              onClick={() => setInputMessage("What are the ethical considerations in AI development?")}
              className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full text-xs hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors"
            >
              🛡️ Ethics & AI
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Brain className="w-4 h-4 text-purple-600" />
                <span className="text-gray-600 dark:text-gray-400">Powered by Virtue-Driven AI</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-gray-600 dark:text-gray-400">Ethical & Transparent</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-pink-600" />
                <span className="text-gray-600 dark:text-gray-400">Built with Compassion</span>
              </div>
            </div>
            
            <div className="text-gray-500 dark:text-gray-400">
              {messages.length - 1} messages • {isProcessing ? 'AI thinking...' : 'Ready'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}