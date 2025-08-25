'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  MessageSquare, 
  Clock, 
  User, 
  FileText,
  Copy,
  Check,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface DebateRound {
  agent: string;
  message: string;
  timestamp: string;
}

interface Requirement {
  refined_requirements: string;
  trade_offs: string;
  next_steps: string;
}

interface IdeaDetails {
  _id: string;
  title: string;
  description: string;
  created_at: string;
  user_id: string;
}

interface IdeaDetailsViewProps {
  ideaId: string;
  onBack: () => void;
}

export default function IdeaDetailsView({ ideaId, onBack }: IdeaDetailsViewProps) {
  const { session } = useAuth();
  const [idea, setIdea] = useState<IdeaDetails | null>(null);
  const [debateRounds, setDebateRounds] = useState<{ [key: number]: DebateRound[] }>({});
  const [requirement, setRequirement] = useState<Requirement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  useEffect(() => {
    fetchIdeaDetails();
  }, [ideaId, session?.idToken]);

  const fetchIdeaDetails = async () => {
    if (!session?.idToken) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:8000/api/idea/${ideaId}/`, {
        headers: {
          'Authorization': `Bearer ${session.idToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setIdea(data.idea);
        setDebateRounds(data.debate_rounds);
        setRequirement(data.requirement);
      } else {
        setError(data.error || 'Failed to load idea details');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error('Error fetching idea details:', err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(label);
      setTimeout(() => setCopiedText(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-purple-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading idea details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchIdeaDetails}
            className="text-purple-400 hover:text-purple-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Idea not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-700/50 bg-gray-900/30">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-semibold text-white mb-1">
              {idea.title || 'Untitled Idea'}
            </h1>
            <div className="flex items-center gap-4 text-gray-400 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatDate(idea.created_at)}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                <span>{Object.keys(debateRounds).length} rounds</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Original Idea */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <h3 className="text-white font-medium mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Original Idea
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            {idea.description}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Refined Requirements */}
        {requirement && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/50 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Refined Requirements</h2>
              <button
                onClick={() => copyToClipboard(requirement.refined_requirements, 'requirements')}
                className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                {copiedText === 'requirements' ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                {requirement.refined_requirements}
              </p>
            </div>
          </motion.div>
        )}

        {/* Trade-offs */}
        {requirement?.trade_offs && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/50 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Trade-offs</h2>
              <button
                onClick={() => copyToClipboard(requirement.trade_offs, 'tradeoffs')}
                className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                {copiedText === 'tradeoffs' ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                {requirement.trade_offs}
              </p>
            </div>
          </motion.div>
        )}

        {/* Next Steps */}
        {requirement?.next_steps && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/50 rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Next Steps</h2>
              <button
                onClick={() => copyToClipboard(requirement.next_steps, 'nextsteps')}
                className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                {copiedText === 'nextsteps' ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <Copy className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                {requirement.next_steps}
              </p>
            </div>
          </motion.div>
        )}

        {/* Debate Rounds */}
        {Object.keys(debateRounds).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-semibold text-white">AI Agent Discussion</h2>
            
            {Object.entries(debateRounds).map(([roundNum, debates]) => (
              <div key={roundNum} className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Round {roundNum}
                </h3>
                
                <div className="space-y-4">
                  {debates.map((debate, index) => (
                    <div key={index} className="bg-gray-700/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-purple-400" />
                        <span className="text-purple-400 font-medium text-sm">
                          {debate.agent}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {debate.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
