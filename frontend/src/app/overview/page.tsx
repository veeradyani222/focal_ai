'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  Lightbulb, 
  TrendingUp, 
  Target, 
  Sparkles,
  RefreshCw,
  Brain,
  Rocket
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useUser } from '../../contexts/UserContext';
import { useRouter } from 'next/navigation';

interface UserInsight {
  total_ideas: number;
  most_common_domain: string;
  average_complexity: string;
  growth_trend: string;
  recommendations: string[];
  ai_insight: string;
}

export default function Overview() {
  const { session, isAuthenticated, isLoading, redirectToHome } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [insight, setInsight] = useState<UserInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      redirectToHome();
    }
  }, [isAuthenticated, isLoading, redirectToHome]);

  useEffect(() => {
    if (session?.idToken) {
      fetchUserInsights();
    }
  }, [session?.idToken]);

  const fetchUserInsights = async () => {
    if (!session?.idToken) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:8000/api/user-insights/', {
        headers: {
          'Authorization': `Bearer ${session.idToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setInsight(data.insight);
      } else {
        setError(data.error || 'Failed to load insights');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error('Error fetching insights:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewPRD = () => {
    router.push('/dashboard');
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
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
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center py-8 px-6 max-w-7xl mx-auto"
        >
          <div className="text-center flex-1">
            <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent mb-4 tracking-tight">
              🧠 Focal AI
            </h1>
            <p className="text-purple-100 text-xl max-w-2xl mx-auto font-light leading-relaxed">
              Your AI-powered product development companion
            </p>
          </div>
        </motion.header>

        {/* Main content area */}
        <div className="flex-1 px-6 pb-8">
          <div className="max-w-6xl mx-auto">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Hello, {user?.name || 'there'}! 👋
              </h2>
              <p className="text-purple-200 text-lg max-w-2xl mx-auto">
                Welcome to your personalized AI insights dashboard. Let's explore what your ideas reveal about your product development journey.
              </p>
            </motion.div>

            {/* Loading State */}
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <RefreshCw className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
                <p className="text-purple-200 text-lg">Analyzing your ideas with AI...</p>
              </motion.div>
            )}

            {/* Error State */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <p className="text-red-400 text-lg mb-4">{error}</p>
                <button
                  onClick={fetchUserInsights}
                  className="text-purple-400 hover:text-purple-300 text-lg"
                >
                  Try Again
                </button>
              </motion.div>
            )}

            {/* Insights Content */}
            {insight && !loading && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  {/* AI Insight Card */}
                  <div className="bg-gradient-to-r from-purple-600/20 to-cyan-600/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
                    <div className="flex items-center gap-3 mb-6">
                      <Brain className="w-8 h-8 text-purple-400" />
                      <h3 className="text-2xl font-bold text-white">AI Analysis</h3>
                    </div>
                    <p className="text-purple-100 text-lg leading-relaxed">
                      {insight.ai_insight}
                    </p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <Lightbulb className="w-6 h-6 text-yellow-400" />
                        <h4 className="text-white font-semibold">Total Ideas</h4>
                      </div>
                      <p className="text-3xl font-bold text-white">{insight.total_ideas}</p>
                      <p className="text-gray-400 text-sm mt-2">Products in development</p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <Target className="w-6 h-6 text-green-400" />
                        <h4 className="text-white font-semibold">Focus Area</h4>
                      </div>
                      <p className="text-xl font-bold text-white">{insight.most_common_domain}</p>
                      <p className="text-gray-400 text-sm mt-2">Primary domain</p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <TrendingUp className="w-6 h-6 text-blue-400" />
                        <h4 className="text-white font-semibold">Growth Trend</h4>
                      </div>
                      <p className="text-xl font-bold text-white">{insight.growth_trend}</p>
                      <p className="text-gray-400 text-sm mt-2">Your momentum</p>
                    </motion.div>
                  </div>

                  {/* Recommendations */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700/50"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <Sparkles className="w-6 h-6 text-purple-400" />
                      <h3 className="text-xl font-bold text-white">AI Recommendations</h3>
                    </div>
                    <div className="space-y-4">
                      {insight.recommendations.map((recommendation, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-gray-300 leading-relaxed">{recommendation}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* CTA Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-center bg-gradient-to-r from-purple-600/20 to-cyan-600/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30"
                  >
                    <Rocket className="w-16 h-16 text-purple-400 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-white mb-4">
                      Ready to Build Something Amazing?
                    </h3>
                    <p className="text-purple-200 text-lg mb-8 max-w-2xl mx-auto">
                      Transform your next idea into a detailed Product Requirements Document with our AI-powered multi-agent system.
                    </p>
                    <button
                      onClick={handleCreateNewPRD}
                      className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Get a PRD for Your New Idea
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>

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
  );
}
