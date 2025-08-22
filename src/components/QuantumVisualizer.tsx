import React, { useEffect, useRef, useState } from 'react';
import { Atom, Waves, Zap, TrendingUp } from 'lucide-react';

interface QuantumState {
  quantum_vector: number[];
  chaos_vector: number[];
  neural_activation: number;
  philosophy: string;
}

export function QuantumVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [quantumStates, setQuantumStates] = useState<QuantumState[]>([]);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Generate sample quantum states
    const states: QuantumState[] = Array.from({ length: 20 }, (_, i) => ({
      quantum_vector: [Math.sin(i * 0.3), Math.cos(i * 0.3)],
      chaos_vector: [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5],
      neural_activation: Math.random(),
      philosophy: Math.random() > 0.5 ? "This universe is likely awake." : "Echoes in the void."
    }));
    setQuantumStates(states);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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
      const radius = Math.min(canvas.width, canvas.height) * 0.3;

      // Draw quantum field background
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, 'rgba(147, 51, 234, 0.1)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0.05)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw quantum states as particles
      quantumStates.forEach((state, index) => {
        const angle = (index / quantumStates.length) * 2 * Math.PI + time * 0.01;
        const x = centerX + Math.cos(angle) * radius * (0.5 + state.neural_activation * 0.5);
        const y = centerY + Math.sin(angle) * radius * (0.5 + state.neural_activation * 0.5);

        // Particle glow
        const glowGradient = ctx.createRadialGradient(x, y, 0, x, y, 15);
        glowGradient.addColorStop(0, `rgba(147, 51, 234, ${state.neural_activation})`);
        glowGradient.addColorStop(1, 'rgba(147, 51, 234, 0)');
        ctx.fillStyle = glowGradient;
        ctx.fillRect(x - 15, y - 15, 30, 30);

        // Particle core
        ctx.beginPath();
        ctx.arc(x, y, 3 + state.neural_activation * 3, 0, 2 * Math.PI);
        ctx.fillStyle = state.neural_activation > 0.5 ? '#10B981' : '#8B5CF6';
        ctx.fill();

        // Quantum connections
        if (index < quantumStates.length - 1) {
          const nextAngle = ((index + 1) / quantumStates.length) * 2 * Math.PI + time * 0.01;
          const nextX = centerX + Math.cos(nextAngle) * radius * (0.5 + quantumStates[index + 1].neural_activation * 0.5);
          const nextY = centerY + Math.sin(nextAngle) * radius * (0.5 + quantumStates[index + 1].neural_activation * 0.5);

          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(nextX, nextY);
          ctx.strokeStyle = `rgba(59, 130, 246, ${state.neural_activation * 0.3})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // Central quantum core
      const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 20);
      coreGradient.addColorStop(0, 'rgba(147, 51, 234, 0.8)');
      coreGradient.addColorStop(1, 'rgba(147, 51, 234, 0)');
      ctx.fillStyle = coreGradient;
      ctx.fillRect(centerX - 20, centerY - 20, 40, 40);

      ctx.beginPath();
      ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();

      time += 1;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [quantumStates, isAnimating]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-purple-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Atom className="w-6 h-6 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Quantum State Visualizer
          </h3>
        </div>
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className="flex items-center space-x-2 px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
        >
          {isAnimating ? <Waves className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
          <span className="text-sm">{isAnimating ? 'Pause' : 'Resume'}</span>
        </button>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full h-64 rounded-lg bg-gradient-to-br from-gray-900 to-purple-900"
        />
        
        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white">
          <div className="flex items-center space-x-2 mb-1">
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <span className="text-xs">Active States: {quantumStates.length}</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full" />
            <span className="text-xs">Neural Coherence: 73%</span>
          </div>
        </div>
      </div>

      {/* Quantum Metrics */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <TrendingUp className="w-5 h-5 text-purple-600 mx-auto mb-1" />
          <p className="text-sm font-medium text-gray-800 dark:text-white">Entanglement</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">0.73</p>
        </div>
        <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Waves className="w-5 h-5 text-blue-600 mx-auto mb-1" />
          <p className="text-sm font-medium text-gray-800 dark:text-white">Coherence</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">0.89</p>
        </div>
        <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <Zap className="w-5 h-5 text-green-600 mx-auto mb-1" />
          <p className="text-sm font-medium text-gray-800 dark:text-white">Energy</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">0.67</p>
        </div>
        <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <Atom className="w-5 h-5 text-orange-600 mx-auto mb-1" />
          <p className="text-sm font-medium text-gray-800 dark:text-white">Stability</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">0.91</p>
        </div>
      </div>
    </div>
  );
}