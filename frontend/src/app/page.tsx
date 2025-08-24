'use client';

import { motion } from 'framer-motion';
import { Brain, Users, Zap, Target, ArrowRight, LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';

export default function Landing() {
  const { login, isAuthenticated, isLoading, redirectToDashboard } = useAuth();

  // Use useEffect to handle redirects instead of calling during render
  useEffect(() => {
    if (isAuthenticated) {
      redirectToDashboard();
    }
  }, [isAuthenticated, redirectToDashboard]);

  // If user is authenticated, show loading or return null
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 flex items-center justify-center">
        <div className="text-white text-xl">Redirecting to dashboard...</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto"
        >
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
            Focal AI
          </h1>
          <nav className="hidden md:flex space-x-6">
            <a href="#features" className="text-purple-200 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-purple-200 hover:text-white transition-colors">How It Works</a>
            <a href="#get-started" className="text-purple-200 hover:text-white transition-colors">Get Started</a>
          </nav>
        </motion.header>

        {/* Hero Section */}
        <section className="py-20 px-6 text-center max-w-5xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent mb-6"
          >
            Transform Your Ideas with AI-Powered Refinement
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-purple-100 mb-8 max-w-3xl mx-auto"
          >
            Our multi-agent AI system simulates stakeholder debates to turn your product ideas into actionable, polished requirements. Fast, comprehensive, and always available.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <button
              onClick={login}
              disabled={isLoading}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-cyan-600 shadow-lg shadow-purple-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogIn className="w-5 h-5 mr-2" />
              {isLoading ? 'Signing in...' : 'Sign in with Google'}
            </button>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 px-6 bg-white/5 backdrop-blur-md border-t border-b border-white/10">
          <div className="max-w-6xl mx-auto">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-white text-center mb-12"
            >
              Why Choose Focal AI?
            </motion.h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: Brain,
                  title: 'Multi-Agent Analysis',
                  description: 'Five AI agents (Business, Engineering, Design, Customer, Product) analyze your idea from every angle.',
                },
                {
                  icon: Zap,
                  title: '40-80x Faster',
                  description: 'Refine requirements in minutes, not weeks, compared to traditional stakeholder meetings.',
                },
                {
                  icon: Target,
                  title: 'Actionable Outputs',
                  description: 'Get structured requirements, trade-offs, and next steps ready for implementation.',
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <feature.icon className="w-10 h-10 text-purple-400 mb-4" />
                  <h4 className="text-xl font-semibold text-white mb-2">{feature.title}</h4>
                  <p className="text-purple-200 text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 px-6 max-w-5xl mx-auto">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-white text-center mb-12"
          >
            How It Works
          </motion.h3>
          <div className="space-y-8">
            {[
              {
                step: 1,
                title: 'Submit Your Idea',
                description: 'Enter your product idea with details about the problem, audience, and features.',
              },
              {
                step: 2,
                title: 'AI Stakeholder Debate',
                description: 'Our AI agents simulate a stakeholder meeting, analyzing your idea from multiple perspectives.',
              },
              {
                step: 3,
                title: 'Get Refined Requirements',
                description: 'Receive actionable requirements, trade-offs, and a timeline to bring your idea to life.',
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="flex items-start space-x-4"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {step.step}
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-white">{step.title}</h4>
                  <p className="text-purple-200 text-sm mt-2">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Call to Action Section */}
        <section id="get-started" className="py-20 px-6 text-center bg-white/5 backdrop-blur-md border-t border-white/10">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-white mb-6"
          >
            Ready to Refine Your Ideas?
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-purple-200 text-lg mb-8 max-w-2xl mx-auto"
          >
            Join thousands of innovators using Focal AI to turn their visions into reality.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            viewport={{ once: true }}
          >
            <button
              onClick={login}
              disabled={isLoading}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-cyan-600 shadow-lg shadow-purple-500/30 transition-all duration-300 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogIn className="w-6 h-6 mr-2" />
              {isLoading ? 'Signing in...' : 'Get Started with Google'}
            </button>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-8 px-6 text-center text-purple-200 text-sm border-t border-white/10">
          <p>Powered by LangChain + Gemini AI • Built with Next.js & Tailwind CSS</p>
        </footer>

        {/* Custom animations */}
        <style jsx>{`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>
      </div>
    </div>
  );
}