'use client';

import { motion } from 'framer-motion';
import { Brain, Users, Zap } from 'lucide-react';

export default function LoadingAnimation() {
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-8">
      <div className="text-center">
        {/* Animated brain icon */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="inline-block mb-6"
        >
          <Brain className="w-16 h-16 text-purple-400 mx-auto" />
        </motion.div>

        {/* Loading text */}
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-white mb-4"
        >
          AI Stakeholders Are Debating...
        </motion.h3>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-purple-200 mb-8"
        >
          Our multi-agent system is analyzing your idea from multiple perspectives
        </motion.p>

        {/* Animated dots */}
        <div className="flex justify-center space-x-2 mb-6">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
              className="w-3 h-3 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full"
            />
          ))}
        </div>

        {/* Agent indicators */}
        <div className="grid grid-cols-5 gap-4 max-w-md mx-auto">
          {[
            { name: 'Business', icon: Users, color: 'from-purple-500 to-purple-600' },
            { name: 'Engineering', icon: Zap, color: 'from-blue-500 to-blue-600' },
            { name: 'Design', icon: Brain, color: 'from-cyan-500 to-cyan-600' },
            { name: 'Customer', icon: Users, color: 'from-purple-500 to-purple-600' },
            { name: 'Product', icon: Brain, color: 'from-blue-500 to-blue-600' },
          ].map((agent, index) => (
            <motion.div
              key={agent.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.2
                }}
                className={`w-8 h-8 mx-auto mb-2 rounded-lg bg-gradient-to-r ${agent.color} flex items-center justify-center`}
              >
                <agent.icon className="w-4 h-4 text-white" />
              </motion.div>
              <p className="text-xs text-purple-200">{agent.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
