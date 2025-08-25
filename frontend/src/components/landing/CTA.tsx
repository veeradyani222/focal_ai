'use client';

import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Star } from 'lucide-react';

interface CTAProps {
  email: string;
  setEmail: (email: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitted: boolean;
}

export default function CTA({ email, setEmail, onSubmit, isSubmitted }: CTAProps) {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 backdrop-blur-sm rounded-3xl p-12 border border-purple-500/30"
        >
          <div className="flex justify-center mb-6">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
              ))}
            </div>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to transform your{' '}
            <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              product process?
            </span>
          </h2>
          
          <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
            Join the waitlist and be among the first to experience AI-powered requirement refinement. 
            No more scheduling nightmares, no more endless meetings.
          </p>

          {/* Signup Form */}
          <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-8">
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

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-white font-semibold mb-1">Free Beta Access</div>
                <div className="text-purple-200 text-sm">Be among the first 100 users</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-white font-semibold mb-1">Priority Support</div>
                <div className="text-purple-200 text-sm">Direct access to our team</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-white font-semibold mb-1">Lifetime Discount</div>
                <div className="text-purple-200 text-sm">50% off when we launch</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12"
        >
          <p className="text-purple-300 text-sm mb-4">Already trusted by product teams at:</p>
          <div className="flex justify-center items-center gap-8 opacity-60">
            <div className="w-20 h-10 bg-white/10 rounded"></div>
            <div className="w-20 h-10 bg-white/10 rounded"></div>
            <div className="w-20 h-10 bg-white/10 rounded"></div>
            <div className="w-20 h-10 bg-white/10 rounded"></div>
          </div>
        </motion.div>

        {/* Final Message */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-purple-200 text-lg">
            Stop wasting time in meetings. Start building better products.
          </p>
          <div className="text-3xl font-bold text-white mt-2">
            Focal AI
          </div>
        </motion.div>
      </div>
    </section>
  );
}
