'use client';

import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';

interface HeroProps {
  email: string;
  setEmail: (email: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitted: boolean;
}

export default function Hero({ email, setEmail, onSubmit, isSubmitted }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-7xl mx-auto text-center">
        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
        >
          Replace 4-hour meetings with{' '}
          <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            3-minute AI debates
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-xl md:text-2xl text-purple-200 mb-12 max-w-4xl mx-auto leading-relaxed"
        >
          Focal AI simulates stakeholder debates to refine product requirements in minutes, not hours. 
          Get complete coverage without the scheduling nightmare.
        </motion.p>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mb-16"
        >
          <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-sm"
              required
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg"
            >
              {isSubmitted ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Thanks!
                </>
              ) : (
                <>
                  Get Early Access
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Animated Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
          className="relative max-w-4xl mx-auto"
        >
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-purple-300 text-sm">Focal AI - Product Requirements Debate</div>
            </div>
            
            {/* Mockup Content */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="flex items-start gap-3"
              >
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  C
                </div>
                <div className="flex-1 bg-purple-900/30 rounded-lg p-3">
                  <div className="text-purple-300 text-sm font-medium mb-1">Customer Agent</div>
                  <div className="text-white text-sm">This feature needs to be intuitive for non-technical users. The current flow is too complex.</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5, duration: 0.5 }}
                className="flex items-start gap-3"
              >
                <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  D
                </div>
                <div className="flex-1 bg-cyan-900/30 rounded-lg p-3">
                  <div className="text-cyan-300 text-sm font-medium mb-1">Designer Agent</div>
                  <div className="text-white text-sm">I agree. We should simplify the onboarding flow and add progressive disclosure.</div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2, duration: 0.5 }}
                className="flex items-start gap-3"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  PM
                </div>
                <div className="flex-1 bg-blue-900/30 rounded-lg p-3">
                  <div className="text-blue-300 text-sm font-medium mb-1">Product Manager</div>
                  <div className="text-white text-sm">Perfect! Let's prioritize the simplified onboarding for v1.0 and add advanced features later.</div>
                </div>
              </motion.div>
            </div>

            {/* Output Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5, duration: 0.5 }}
              className="mt-6 pt-6 border-t border-white/10"
            >
              <div className="text-green-400 text-sm font-medium mb-2">✓ Refined Requirements Generated</div>
              <div className="text-white text-sm opacity-80">
                Simplified onboarding flow with progressive disclosure • Priority: High • Timeline: v1.0
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-16 text-purple-300 text-sm"
        >
          <p>Trusted by product teams at leading companies</p>
          <div className="flex justify-center items-center gap-8 mt-4 opacity-60">
            <div className="w-16 h-8 bg-white/10 rounded"></div>
            <div className="w-16 h-8 bg-white/10 rounded"></div>
            <div className="w-16 h-8 bg-white/10 rounded"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
