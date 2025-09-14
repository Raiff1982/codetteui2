import React, { useEffect, useRef, useState } from 'react';
import { Atom, Zap, Activity, TrendingUp, Eye, Play, Pause } from 'lucide-react';
import { quantumCodeAnalyzer, QuantumCodeMetrics, CodeDNA } from '../services/quantumCodeAnalyzer';

interface QuantumCodeVisualizerProps {
  currentCode: string;
  language: string;
}

export function QuantumCodeVisualizer({ currentCode, language }: QuantumCodeVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [metrics, setMetrics] = useState<QuantumCodeMetrics | null>(null);
  const [codeDNA, setCodeDNA] = useState<CodeDNA | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);
  const [quantumStates, setQuantumStates] = useState<any[]>([]);

  useEffect(() => {
    if (currentCode && currentCode.trim()) {
      analyzeCode();
    }
  }, [currentCode, language]);

  useEffect(() => {
    if (metrics && isAnimating) {
      startQuantumVisualization();
    }
  }, [metrics, isAnimating]);

  const analyzeCode = async () => {
    setIsAnalyzing(true);
    try {
      const [quantumMetrics, dnaAnalysis] = await Promise.all([
        quantumCodeAnalyzer.analyzeQuantumProperties(currentCode, language),
        quantumCodeAnalyzer.analyzeCodeDNA(currentCode)
      ]);
      
      setMetrics(quantumMetrics);
      setCodeDNA(dnaAnalysis);
      
      // Generate quantum states for visualization
      const states = Array.from({ length: quantumMetrics.superposition_states }, (_, i) => ({
        id: i,
        x: Math.random() * 400,
        y: Math.random() * 300,
        energy: Math.random(),
        entangled: Math.random() > 0.5,
        coherence: quantumMetrics.coherence_level,
        phase: Math.random() * 2 * Math.PI,
        frequency: 0.01 + Math.random() * 0.05
      }));
      
      setQuantumStates(states);
    } catch (error) {
      console.error('Quantum analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startQuantumVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas || !metrics) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const animate = () => {
      if (!isAnimating) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set canvas size
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw quantum field background
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.min(canvas.width, canvas.height) / 2);
      gradient.addColorStop(0, `rgba(147, 51, 234, ${metrics.coherence_level * 0.1})`);
      gradient.addColorStop(0.5, `rgba(59, 130, 246, ${metrics.entanglement_score * 0.05})`);
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw quantum states
      quantumStates.forEach((state, index) => {
        // Update state position based on quantum properties
        state.x += Math.sin(time * state.frequency + state.phase) * 2;
        state.y += Math.cos(time * state.frequency + state.phase) * 1.5;
        
        // Keep states within bounds
        if (state.x < 0 || state.x > canvas.width) state.x = Math.random() * canvas.width;
        if (state.y < 0 || state.y > canvas.height) state.y = Math.random() * canvas.height;

        // Draw quantum particle
        const radius = 3 + state.energy * 5;
        const alpha = 0.3 + state.energy * 0.7;
        
        // Particle glow
        const glowGradient = ctx.createRadialGradient(state.x, state.y, 0, state.x, state.y, radius * 3);
        glowGradient.addColorStop(0, `rgba(147, 51, 234, ${alpha})`);
        glowGradient.addColorStop(1, 'rgba(147, 51, 234, 0)');
        ctx.fillStyle = glowGradient;
        ctx.fillRect(state.x - radius * 3, state.y - radius * 3, radius * 6, radius * 6);

        // Particle core
        ctx.beginPath();
        ctx.arc(state.x, state.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = state.entangled ? '#10B981' : '#8B5CF6';
        ctx.fill();

        // Draw entanglement connections
        if (state.entangled) {
          quantumStates.forEach((otherState, otherIndex) => {
            if (otherIndex !== index && otherState.entangled) {
              const distance = Math.sqrt(
                Math.pow(state.x - otherState.x, 2) + Math.pow(state.y - otherState.y, 2)
              );
              
              if (distance < 100) {
                ctx.beginPath();
                ctx.moveTo(state.x, state.y);
                ctx.lineTo(otherState.x, otherState.y);
                ctx.strokeStyle = `rgba(16, 185, 129, ${0.3 * (1 - distance / 100)})`;
                ctx.lineWidth = 1;
                ctx.stroke();
              }
            }
          });
        }
      });

      // Draw quantum metrics overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(10, 10, 200, 120);
      
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '12px monospace';
      ctx.fillText(`Entanglement: ${(metrics.entanglement_score * 100).toFixed(0)}%`, 20, 30);
      ctx.fillText(`Coherence: ${(metrics.coherence_level * 100).toFixed(0)}%`, 20, 50);
      ctx.fillText(`States: ${metrics.superposition_states}`, 20, 70);
      ctx.fillText(`Complexity: ${(metrics.quantum_complexity * 100).toFixed(0)}%`, 20, 90);
      ctx.fillText(`Optimization: ${(metrics.optimization_potential * 100).toFixed(0)}%`, 20, 110);

      time += 0.016; // ~60fps
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-purple-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Atom className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Quantum Code Visualizer
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsAnimating(!isAnimating)}
            className="flex items-center space-x-2 px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
          >
            {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="text-sm">{isAnimating ? 'Pause' : 'Resume'}</span>
          </button>
          <button
            onClick={analyzeCode}
            disabled={isAnalyzing}
            className="flex items-center space-x-2 px-3 py-1 bg-blue-500 text-gray-50 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span className="text-sm">{isAnalyzing ? 'Analyzing...' : 'Analyze'}</span>
          </button>
        </div>
      </div>

      {/* Quantum Visualization Canvas */}
      <div className="relative mb-6">
        <canvas
          ref={canvasRef}
          className="w-full h-64 rounded-lg bg-gradient-to-br from-gray-900 to-purple-900 border border-purple-300 dark:border-purple-700"
        />
        
        {isAnalyzing && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-gray-50 text-sm">Quantum Analysis...</p>
            </div>
          </div>
        )}
      </div>

      {/* Quantum Metrics */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <Atom className="w-5 h-5 text-purple-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-gray-800 dark:text-gray-50">Entanglement</p>
            <p className="text-lg font-bold text-purple-600">{(metrics.entanglement_score * 100).toFixed(0)}%</p>
          </div>
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Zap className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-gray-800 dark:text-gray-50">Coherence</p>
            <p className="text-lg font-bold text-blue-600">{(metrics.coherence_level * 100).toFixed(0)}%</p>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <Activity className="w-5 h-5 text-green-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-gray-800 dark:text-gray-50">States</p>
            <p className="text-lg font-bold text-green-600">{metrics.superposition_states}</p>
          </div>
          <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <TrendingUp className="w-5 h-5 text-orange-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-gray-800 dark:text-gray-50">Complexity</p>
            <p className="text-lg font-bold text-orange-600">{(metrics.quantum_complexity * 100).toFixed(0)}%</p>
          </div>
          <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <Eye className="w-5 h-5 text-red-600 mx-auto mb-1" />
            <p className="text-sm font-medium text-gray-800 dark:text-gray-50">Optimization</p>
            <p className="text-lg font-bold text-red-600">{(metrics.optimization_potential * 100).toFixed(0)}%</p>
          </div>
        </div>
      )}

      {/* Code DNA Analysis */}
      {codeDNA && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 rounded-lg">
          <h4 className="font-medium text-gray-800 dark:text-gray-50 mb-3">Code DNA Analysis</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Genetic Signature:</span>
              <p className="font-mono text-gray-800 dark:text-gray-50">{codeDNA.genetic_signature}</p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Mutation Potential:</span>
              <p className="font-bold text-blue-600">{(codeDNA.mutation_potential * 100).toFixed(0)}%</p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Evolutionary Fitness:</span>
              <p className="font-bold text-green-600">{(codeDNA.evolutionary_fitness * 100).toFixed(0)}%</p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Adaptation Score:</span>
              <p className="font-bold text-purple-600">{(codeDNA.adaptation_score * 100).toFixed(0)}%</p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Survival Probability:</span>
              <p className="font-bold text-orange-600">{(codeDNA.survival_probability * 100).toFixed(0)}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Quantum Patterns */}
      {metrics && metrics.quantum_patterns.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium text-gray-800 dark:text-gray-50 mb-3">Detected Quantum Patterns</h4>
          <div className="space-y-2">
            {metrics.quantum_patterns.map((pattern, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <Zap className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{pattern}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Parallel Opportunities */}
      {metrics && metrics.parallel_opportunities.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium text-gray-800 dark:text-gray-50 mb-3">Parallelization Opportunities</h4>
          <div className="space-y-2">
            {metrics.parallel_opportunities.map((opportunity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <Activity className="w-4 h-4 text-green-600" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{opportunity}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}