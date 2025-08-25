'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Lightbulb, Users, FileText, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: Lightbulb,
    title: "Share Your Idea",
    description: "Describe your product concept in simple terms",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: Users,
    title: "AI Agents Debate",
    description: "5 specialized agents discuss requirements and trade-offs",
    color: "from-cyan-500 to-cyan-600"
  },
  {
    icon: FileText,
    title: "Get Refined Specs",
    description: "Receive prioritized requirements with clear next steps",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: CheckCircle,
    title: "Ready to Build",
    description: "Start development with confidence and clarity",
    color: "from-green-500 to-green-600"
  }
];

export default function Workflow() {
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
            How it works in{' '}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              3 simple steps
            </span>
          </h2>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            From idea to refined requirements in minutes, not hours. 
            Our AI agents simulate real stakeholder discussions to surface the best solutions.
          </p>
        </motion.div>

        {/* Workflow Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative"
            >
              {/* Step Number */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {index + 1}
              </div>

              {/* Step Card */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 h-full">
                <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-xl flex items-center justify-center mb-6`}>
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-purple-200 leading-relaxed">{step.description}</p>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                  className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 transform -translate-y-1/2 origin-left"
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Timeline Visualization */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16"
        >
          <div className="bg-gray-900/30 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-8 text-center">Timeline Comparison</h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Traditional Process */}
              <div>
                <h4 className="text-lg font-semibold text-red-400 mb-4">Traditional Process</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-purple-200">Schedule meeting (1-2 days)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-purple-200">Prepare agenda (2-3 hours)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-purple-200">Conduct meeting (4 hours)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-purple-200">Follow-up emails (1 hour)</span>
                  </div>
                  <div className="text-2xl font-bold text-red-400 mt-4">Total: 3-4 days</div>
                </div>
              </div>

              {/* Focal AI Process */}
              <div>
                <h4 className="text-lg font-semibold text-green-400 mb-4">With Focal AI</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-purple-200">Input your idea (2 minutes)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-purple-200">AI agents debate (1 minute)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-purple-200">Get refined requirements (instant)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-purple-200">Ready to build (immediate)</span>
                  </div>
                  <div className="text-2xl font-bold text-green-400 mt-4">Total: 3 minutes</div>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <div className="text-3xl font-bold text-white">
                <span className="text-red-400">80x</span> faster than traditional meetings
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
