'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, Coins, AlertTriangle, Menu, X } from 'lucide-react';
import InputBox from '../../components/InputBox';
import ResultsDisplay from '../../components/ResultsDisplay';
import LoadingAnimation from '../../components/LoadingAnimation';
import ChatHistorySidebar from '../../components/ChatHistorySidebar';
import IdeaDetailsView from '../../components/IdeaDetailsView';
import { useAuth } from '../../hooks/useAuth';
import { useUser } from '../../contexts/UserContext';
import { useRouter } from 'next/navigation';
import { BarChart3, ArrowRight } from 'lucide-react';

interface RefinementResult {
  success: boolean;
  idea_id?: string;
  refined_requirements?: string;
  debate_log?: Array<{
    agent: string;
    response: string;
    round: number;
  }>;
  error?: string;
}

export default function Dashboard() {
  const { session, isAuthenticated, isLoading, logout, redirectToHome } = useAuth();
  const { user, deductCredits, error: userError } = useUser();
  const router = useRouter();
  const [idea, setIdea] = useState('');
  const [result, setResult] = useState<RefinementResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);

  // Redirect to  if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      redirectToHome();
    }
  }, [isAuthenticated, isLoading, redirectToHome]);

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

  const handleRefineRequirements = async (ideaText: string) => {
    // Check if user has enough credits
    if (!user || user.credits < 2) {
      alert('Insufficient credits. You need at least 2 credits to generate requirements.');
      return;
    }

    // Check if we have an ID token
    if (!session?.idToken) {
      alert('Authentication required. Please log in again.');
      return;
    }

    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/refine/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.idToken}`,
        },
        body: JSON.stringify({ idea: ideaText }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Update user data with the response
        if (data.user) {
          // The backend now returns updated user data, so we can update our local state
          // No need to manually deduct credits as it's handled by the backend
        }
        setResult(data);
      } else {
        setResult(data);
      }
    } catch (error) {
      console.error('API call failed:', error);
      setResult({
        success: false,
        error: 'Failed to connect to the server. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectIdea = (ideaId: string) => {
    setSelectedIdeaId(ideaId);
    setResult(null); // Clear current result when viewing history
  };

  const handleNewChat = () => {
    setSelectedIdeaId(null);
    setResult(null);
    setIdea('');
  };

  const handleBackFromHistory = () => {
    setSelectedIdeaId(null);
  };

  const handleGoToOverview = () => {
    router.push('/overview');
  };

    return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-cyan-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main layout */}
      <div className="relative z-10 flex h-screen">
        {/* Sidebar */}
        <AnimatePresence mode="wait">
          {showSidebar && (
            <motion.div
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="h-full"
            >
              <ChatHistorySidebar
                onSelectIdea={handleSelectIdea}
                selectedIdeaId={selectedIdeaId || undefined}
                onNewChat={handleNewChat}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="flex-1 flex flex-col min-h-screen">
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
                AI-powered requirement refinement through multi-agent stakeholder simulation
              </p>
            </div>
            
            {/* User Menu with Credits and Avatar */}
            <div className="flex items-center space-x-4">
              {/* Overview Button */}
              <button
                onClick={handleGoToOverview}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 hover:from-purple-600/30 hover:to-cyan-600/30 text-white px-4 py-2 rounded-xl border border-purple-500/30 transition-all duration-300 hover:scale-105"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm font-medium">Overview</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              {/* Credits Display */}
              <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                <Coins className="w-5 h-5 text-yellow-400" />
                <span className="text-white text-sm font-medium">
                  {user?.credits || 0} Credits
                </span>
              </div>
              
              {/* User Profile */}
              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name || 'User'} 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
                <span className="text-white text-sm font-medium">
                  {user?.name || session?.user?.name || 'User'}
                </span>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={logout}
                className="flex items-center space-x-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 px-4 py-2 rounded-xl border border-red-500/30 transition-all duration-300"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </motion.header>

        {/* Credits Warning */}
        {user && user.credits < 2 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-6 mb-6"
          >
            <div className="max-w-4xl mx-auto bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <div>
                  <p className="text-yellow-200 font-medium">Low Credits</p>
                  <p className="text-yellow-300 text-sm">
                    You have {user.credits} credits remaining. You need at least 2 credits to generate requirements.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Content Area */}
        <div className="flex-1 flex flex-col">
          {selectedIdeaId ? (
            // Show idea details when an idea is selected
            <IdeaDetailsView 
              ideaId={selectedIdeaId} 
              onBack={handleBackFromHistory} 
            />
          ) : (
            // Show input and results when no idea is selected
            <>
              {/* Input box at top */}
              <div className="px-6 pb-8">
                <div className="max-w-4xl mx-auto">
                  <InputBox 
                    value={idea}
                    onChange={setIdea}
                    onSubmit={handleRefineRequirements}
                    disabled={loading || !!(user && user.credits < 2)}
                    credits={user?.credits}
                  />
                </div>
              </div>

              {/* Results area */}
              <div className="flex-1 px-6 pb-8">
                <div className="max-w-4xl mx-auto">
                  <AnimatePresence mode="wait">
                    {loading && (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mb-6"
                      >
                        <LoadingAnimation />
                      </motion.div>
                    )}

                    {result && (
                      <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6"
                      >
                        <ResultsDisplay result={result} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </>
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