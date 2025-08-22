import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  Brain, 
  CheckCircle, 
  Clock, 
  Code, 
  Sparkles,
  Target,
  TrendingUp,
  Eye
} from 'lucide-react';

interface CodeCompletion {
  text: string;
  description: string;
  confidence: number;
  type: 'function' | 'variable' | 'import' | 'class' | 'method' | 'property';
  documentation?: string;
  examples?: string[];
}

interface SmartCodeCompletionProps {
  currentCode: string;
  language: string;
  cursorPosition: number;
  onCompletion: (completion: string) => void;
  visible: boolean;
}

export function SmartCodeCompletion({ 
  currentCode, 
  language, 
  cursorPosition, 
  onCompletion, 
  visible 
}: SmartCodeCompletionProps) {
  const [completions, setCompletions] = useState<CodeCompletion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const completionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible && currentCode) {
      generateSmartCompletions();
    }
  }, [currentCode, cursorPosition, language, visible]);

  const generateSmartCompletions = async () => {
    setIsLoading(true);
    try {
      // Analyze context around cursor
      const beforeCursor = currentCode.slice(0, cursorPosition);
      const afterCursor = currentCode.slice(cursorPosition);
      const currentLine = beforeCursor.split('\n').pop() || '';
      const currentWord = currentLine.split(/\s/).pop() || '';

      const completions: CodeCompletion[] = [];

      // Smart completions based on context
      if (language === 'typescript' || language === 'javascript') {
        if (currentWord === 'con') {
          completions.push({
            text: 'console.log()',
            description: 'Log output to console',
            confidence: 0.95,
            type: 'method',
            documentation: 'Outputs a message to the web console',
            examples: ['console.log("Hello World")', 'console.log(variable)']
          });
          completions.push({
            text: 'const',
            description: 'Declare a constant variable',
            confidence: 0.90,
            type: 'variable',
            documentation: 'Creates a read-only named constant',
            examples: ['const name = "value"', 'const array = [1, 2, 3]']
          });
        }

        if (currentWord === 'fun') {
          completions.push({
            text: 'function',
            description: 'Function declaration',
            confidence: 0.92,
            type: 'function',
            documentation: 'Declares a function with the specified parameters',
            examples: ['function myFunction() {}', 'function add(a, b) { return a + b; }']
          });
        }

        if (currentLine.includes('import')) {
          completions.push({
            text: 'import React from "react"',
            description: 'Import React library',
            confidence: 0.88,
            type: 'import',
            documentation: 'Imports the React library for component development'
          });
          completions.push({
            text: 'import { useState, useEffect } from "react"',
            description: 'Import React hooks',
            confidence: 0.85,
            type: 'import',
            documentation: 'Imports commonly used React hooks'
          });
        }

        if (currentLine.includes('class')) {
          completions.push({
            text: 'class MyClass {\n  constructor() {\n    // Initialize\n  }\n}',
            description: 'Class with constructor',
            confidence: 0.87,
            type: 'class',
            documentation: 'Creates a new class with constructor method'
          });
        }
      }

      if (language === 'python') {
        if (currentWord === 'def') {
          completions.push({
            text: 'def function_name(self):',
            description: 'Method definition',
            confidence: 0.90,
            type: 'function',
            documentation: 'Defines a new method in a class'
          });
          completions.push({
            text: 'def function_name():',
            description: 'Function definition',
            confidence: 0.88,
            type: 'function',
            documentation: 'Defines a new standalone function'
          });
        }

        if (currentWord === 'class') {
          completions.push({
            text: 'class MyClass:\n    def __init__(self):\n        pass',
            description: 'Class with constructor',
            confidence: 0.92,
            type: 'class',
            documentation: 'Creates a new class with initialization method'
          });
        }

        if (currentWord === 'import') {
          completions.push({
            text: 'import numpy as np',
            description: 'Import NumPy library',
            confidence: 0.85,
            type: 'import'
          });
          completions.push({
            text: 'import pandas as pd',
            description: 'Import Pandas library',
            confidence: 0.83,
            type: 'import'
          });
        }
      }

      // Add quantum-inspired completions for advanced users
      if (currentWord.includes('quantum') || currentWord.includes('ai')) {
        completions.push({
          text: 'quantumOptimize(objectives, constraints)',
          description: 'Quantum-inspired optimization function',
          confidence: 0.75,
          type: 'function',
          documentation: 'Uses quantum algorithms for multi-objective optimization',
          examples: ['quantumOptimize(["performance", "memory"], {maxTime: 1000})']
        });
      }

      setCompletions(completions);
    } catch (error) {
      console.warn('Smart completion generation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!visible || completions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % completions.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + completions.length) % completions.length);
        break;
      case 'Enter':
      case 'Tab':
        e.preventDefault();
        if (completions[selectedIndex]) {
          onCompletion(completions[selectedIndex].text);
        }
        break;
      case 'Escape':
        e.preventDefault();
        // Close completions
        break;
    }
  };

  const getTypeIcon = (type: CodeCompletion['type']) => {
    switch (type) {
      case 'function': return <Code className="w-4 h-4 text-blue-500" />;
      case 'variable': return <Target className="w-4 h-4 text-green-500" />;
      case 'import': return <TrendingUp className="w-4 h-4 text-purple-500" />;
      case 'class': return <Brain className="w-4 h-4 text-orange-500" />;
      case 'method': return <Zap className="w-4 h-4 text-cyan-500" />;
      case 'property': return <Eye className="w-4 h-4 text-pink-500" />;
      default: return <Sparkles className="w-4 h-4 text-gray-500" />;
    }
  };

  if (!visible || completions.length === 0) return null;

  return (
    <div 
      ref={completionRef}
      className="absolute z-50 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-w-md"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {isLoading ? (
        <div className="p-4 flex items-center space-x-3">
          <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Generating smart completions...</span>
        </div>
      ) : (
        <div className="max-h-64 overflow-y-auto">
          <div className="p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
            <div className="flex items-center space-x-2">
              <Brain className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-800 dark:text-white">AI Completions</span>
            </div>
          </div>
          
          {completions.map((completion, index) => (
            <div
              key={index}
              onClick={() => onCompletion(completion.text)}
              className={`p-3 cursor-pointer transition-colors border-l-4 ${
                index === selectedIndex
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700 border-transparent'
              }`}
            >
              <div className="flex items-center space-x-3 mb-2">
                {getTypeIcon(completion.type)}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm text-gray-800 dark:text-white">
                      {completion.text}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-12 bg-gray-200 dark:bg-gray-600 rounded-full h-1">
                        <div
                          className="bg-gradient-to-r from-green-500 to-blue-600 h-1 rounded-full"
                          style={{ width: `${completion.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {(completion.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {completion.description}
                  </p>
                </div>
              </div>
              
              {completion.documentation && (
                <div className="ml-7 text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {completion.documentation}
                </div>
              )}
              
              {completion.examples && (
                <div className="ml-7">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Examples:</p>
                  {completion.examples.map((example, exIndex) => (
                    <code key={exIndex} className="block text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded mb-1">
                      {example}
                    </code>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}