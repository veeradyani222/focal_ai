'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { MessageSquare, FileText, CheckCircle, ArrowRight } from 'lucide-react';

const debateExamples = [
  {
    agent: "Customer Agent",
    message: "The onboarding flow needs to be dead simple. Users should be able to get started in under 2 minutes.",
    color: "purple"
  },
  {
    agent: "Designer Agent", 
    message: "I agree. We should use progressive disclosure and only show essential fields initially.",
    color: "cyan"
  },
  {
    agent: "Developer Agent",
    message: "That's feasible. We can implement this with a 2-step form and save progress automatically.",
    color: "blue"
  },
  {
    agent: "Product Manager",
    message: "Perfect! Let's prioritize the simplified onboarding for v1.0. This addresses our main user pain point.",
    color: "green"
  }
];

const outputExamples = [
  {
    title: "Refined Requirements",
    content: "Simplified 2-step onboarding flow with progressive disclosure • Auto-save functionality • Mobile-responsive design",
    icon: FileText,
    color: "from-purple-500 to-purple-600"
  },
  {
    title: "Trade-offs Identified", 
    content: "Speed vs. Data Collection: Prioritized speed for v1.0 • Complexity vs. Features: Focused on core functionality",
    icon: MessageSquare,
    color: "from-cyan-500 to-cyan-600"
  },
  {
    title: "Next Steps",
    content: "1. Design wireframes for 2-step flow • 2. Implement auto-save • 3. Plan A/B testing strategy",
    icon: CheckCircle,
    color: "from-blue-500 to-blue-600"
  }
];

export default function Proof() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            See the{' '}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              magic in action
            </span>
          </h2>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            Watch how AI agents debate your ideas and generate comprehensive, 
            actionable requirements in real-time.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Debate Simulation */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6">Live AI Debate</h3>
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="space-y-4">
                {debateExamples.map((example, index) => (
                  <motion.div
                    key={example.agent}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.2 }}
                    className="flex items-start gap-3"
                  >
                    <div className={`w-8 h-8 bg-${example.color}-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                      {example.agent.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className={`text-${example.color}-300 text-sm font-medium mb-1`}>
                        {example.agent}
                      </div>
                      <div className="text-white text-sm bg-gray-800/50 rounded-lg p-3">
                        {example.message}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Debate Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="mt-6 pt-6 border-t border-white/10"
              >
                <div className="flex items-center gap-2 text-green-400 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Agents reaching consensus...</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Output Examples */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6">Generated Output</h3>
            <div className="space-y-4">
              {outputExamples.map((output, index) => (
                <motion.div
                  key={output.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${output.color} rounded-lg flex items-center justify-center`}>
                      <output.icon className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="text-lg font-semibold text-white">{output.title}</h4>
                  </div>
                  <p className="text-purple-200 text-sm leading-relaxed">{output.content}</p>
                </motion.div>
              ))}
            </div>

            {/* Action Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 1 }}
              className="mt-8"
            >
              <button className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105">
                Try It Yourself
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Screenshot Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16"
        >
          <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">App Interface Preview</h3>
              <p className="text-purple-200">Clean, intuitive design that makes requirement refinement effortless</p>
            </div>
            
            {/* Mockup */}
            <div className="bg-gray-800/50 rounded-xl p-6 border border-white/10">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="text-purple-300 text-sm">Focal AI Dashboard</div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gray-700/50 rounded-lg p-4 h-32 flex items-center justify-center">
                  <div className="text-purple-300 text-sm">Input Area</div>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4 h-32 flex items-center justify-center">
                  <div className="text-purple-300 text-sm">Live Debate</div>
                </div>
                <div className="bg-gray-700/50 rounded-lg p-4 h-32 flex items-center justify-center">
                  <div className="text-purple-300 text-sm">Output Panel</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
