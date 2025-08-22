import React from 'react';
import { ExternalLink, Mail, Phone, Globe, Heart, Shield, Code } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Codette</h3>
                <p className="text-gray-400 text-sm">AI-Powered Development Environment</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              Codette represents a fundamentally different approach to development tools. Built on genuine research 
              with published papers and real DOIs, every AI system considers not just performance, but empathy, 
              ethics, and user impact. This is the world's first development environment that genuinely cares about 
              both developers and the users of the software they create.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Shield className="w-4 h-4" />
              <span>Powered by research-backed AI with virtue-driven decision making</span>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-3">
              <a 
                href="https://www.raiffsbits.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors group"
              >
                <Globe className="w-4 h-4 group-hover:text-blue-400" />
                <span>www.raiffsbits.com</span>
                <ExternalLink className="w-3 h-3 opacity-50" />
              </a>
              
              <a 
                href="tel:+12817820615"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors group"
              >
                <Phone className="w-4 h-4 group-hover:text-green-400" />
                <span>(281) 782-0615</span>
              </a>
              
              <a 
                href="mailto:jonathan@raiffsbits.com"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors group"
              >
                <Mail className="w-4 h-4 group-hover:text-purple-400" />
                <span>jonathan@raiffsbits.com</span>
              </a>
              
              <a 
                href="mailto:harrison82_96@hotmail.com"
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors group"
              >
                <Mail className="w-4 h-4 group-hover:text-blue-400" />
                <span>harrison82_96@hotmail.com</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <div className="space-y-2">
              <a href="https://www.raiffsbits.com/docs" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-white transition-colors">
                Documentation
              </a>
              <a href="https://www.raiffsbits.com/api" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-white transition-colors">
                API Reference
              </a>
              <a href="https://www.raiffsbits.com/quantum" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-white transition-colors">
                Quantum Algorithms
              </a>
              <a href="https://www.raiffsbits.com/ethics" target="_blank" rel="noopener noreferrer" className="block text-gray-300 hover:text-white transition-colors">
                Ethical AI Guide
              </a>
              <a href="mailto:harrison82_96@hotmail.com" className="block text-gray-300 hover:text-white transition-colors">
                Support
              </a>
            </div>
          </div>
        </div>

        {/* Copyright and Legal */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © {currentYear} <a href="https://www.raiffsbits.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-400 transition-colors underline">Raiff's Bits</a>. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Codette™, Quantum Multi-Objective Optimizer™, Aegis Council™, and Virtue-Driven AI™ are trademarks of Raiff's Bits.
              </p>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <a href="https://www.raiffsbits.com/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="https://www.raiffsbits.com/terms" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="https://www.raiffsbits.com/license" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">License</a>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-800">
            <p className="text-xs text-gray-500 text-center">
              This software incorporates proprietary quantum-inspired algorithms, ethical AI frameworks, 
              and virtue-based decision systems developed by Jonathan Harrison. Patent pending.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}