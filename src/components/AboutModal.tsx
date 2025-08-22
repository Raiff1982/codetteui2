import React from 'react';
import { X, ExternalLink, Mail, Phone, Globe, Code, Brain, Atom, Shield, Heart } from 'lucide-react';

interface AboutModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export function AboutModal({ isVisible, onClose }: AboutModalProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Code className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Codette</h2>
                <p className="text-blue-100">AI-Powered Development Environment</p>
                <p className="text-sm text-blue-200 mt-1">Version 5.0 - Quantum Edition</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Company Information */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">About Raiff's Bits</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              Raiff's Bits represents a fundamentally different approach to technology development. Founded by Jonathan Harrison, 
              we don't just build tools - we conduct genuine research and create systems that enhance human creativity while 
              maintaining the highest ethical standards.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              Every AI system in Codette is built on documented research with real DOIs, mathematical foundations, and 
              transparent algorithms. This isn't just marketing - it's a genuine commitment to advancing the field of 
              ethical AI and human-computer collaboration.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-xl">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-blue-600" />
                  <span>Our Mission</span>
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  To create development tools that are not just intelligent, but genuinely empathetic and ethical. 
                  We believe technology should enhance human creativity and wisdom, not replace it. Every feature 
                  is designed to make developers more effective while ensuring responsible AI development.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl">
                <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center space-x-2">
                  <Atom className="w-5 h-5 text-green-600" />
                  <span>Innovation</span>
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Pioneering genuine quantum-inspired computing with mathematical rigor, multi-agent AI systems 
                  with transparent reasoning, and virtue-based decision making that considers compassion, integrity, 
                  wisdom, and courage in every choice. This is innovation with purpose and ethical foundation.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Get in Touch</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <a 
                  href="https://www.raiffsbits.com"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
                >
                  <Globe className="w-6 h-6 text-blue-600 group-hover:text-blue-700" />
                  <div>
                    <div className="font-medium text-gray-800 dark:text-white">Visit Our Website</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">www.raiffsbits.com</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                </a>
                
                <a 
                  href="tel:+12817820615"
                  className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
                >
                  <Phone className="w-6 h-6 text-green-600 group-hover:text-green-700" />
                  <div>
                    <div className="font-medium text-gray-800 dark:text-white">Call Us</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">(281) 782-0615</div>
                  </div>
                </a>
              </div>
              
              <div className="space-y-4">
                <a 
                  href="mailto:jonathan@raiffsbits.com"
                  className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
                >
                  <Mail className="w-6 h-6 text-purple-600 group-hover:text-purple-700" />
                  <div>
                    <div className="font-medium text-gray-800 dark:text-white">Business Inquiries</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">jonathan@raiffsbits.com</div>
                  </div>
                </a>
                
                <a 
                  href="mailto:harrison82_96@hotmail.com"
                  className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group"
                >
                  <Mail className="w-6 h-6 text-blue-600 group-hover:text-blue-700" />
                  <div>
                    <div className="font-medium text-gray-800 dark:text-white">General Contact</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">harrison82_96@hotmail.com</div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Technologies */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Core Technologies</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Quantum Optimization', icon: Atom, color: 'text-purple-600' },
                { name: 'Aegis Council AI', icon: Brain, color: 'text-blue-600' },
                { name: 'Virtue Ethics', icon: Heart, color: 'text-red-600' },
                { name: 'Ethical Governance', icon: Shield, color: 'text-green-600' }
              ].map((tech, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <tech.icon className={`w-8 h-8 ${tech.color} mx-auto mb-2`} />
                  <p className="text-sm font-medium text-gray-800 dark:text-white">{tech.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Copyright Notice */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20 p-6 rounded-xl">
            <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Copyright & Legal</h4>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <p>
                © {new Date().getFullYear()} Raiff's Bits. All rights reserved. No part of this software may be reproduced, 
                distributed, or transmitted in any form or by any means without the prior written permission of the publisher.
              </p>
              <p>
                Codette™, Quantum Multi-Objective Optimizer™, Aegis Council™, Virtue-Driven AI™, 
                DreamCore™, and Nexus Signal Engine™ are registered trademarks of Raiff's Bits.
              </p>
              <p>
                The quantum-inspired algorithms, ethical AI frameworks, and virtue-based decision systems 
                are proprietary technologies developed by Jonathan Harrison and protected by intellectual property law.
              </p>
              <p className="font-medium">
                For licensing inquiries, please contact: 
                <a href="mailto:jonathan@raiffsbits.com" className="text-blue-600 hover:text-blue-700 ml-1">
                  jonathan@raiffsbits.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}