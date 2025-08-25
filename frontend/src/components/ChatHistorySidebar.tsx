'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Clock, 
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useUser } from '../contexts/UserContext';

interface HistoryItem {
  _id: string;
  title: string;
  description: string;
  created_at: string;
  debate_count: number;
  latest_requirement?: {
    refined_requirements: string;
    trade_offs: string;
    next_steps: string;
  };
}

interface ChatHistorySidebarProps {
  onSelectIdea: (ideaId: string) => void;
  selectedIdeaId?: string;
  onNewChat: () => void;
}

export default function ChatHistorySidebar({ 
  onSelectIdea, 
  selectedIdeaId, 
  onNewChat 
}: ChatHistorySidebarProps) {
  const { session } = useAuth();
  const { user } = useUser();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, [session?.idToken]);

  useEffect(() => {
    // Generate clean titles for all ideas
    const generateTitles = async () => {
      for (const item of history) {
        if (!titleCache[item._id]) {
          await generateCleanTitle(item.description, item._id);
        }
      }
    };

    if (history.length > 0) {
      generateTitles();
    }
  }, [history, session?.idToken]);

  const fetchHistory = async () => {
    if (!session?.idToken) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:8000/api/user-history/', {
        headers: {
          'Authorization': `Bearer ${session.idToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        setHistory(data.history);
      } else {
        setError(data.error || 'Failed to load history');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshHistory = async () => {
    setIsRefreshing(true);
    await fetchHistory();
    setIsRefreshing(false);
  };

  const [titleCache, setTitleCache] = useState<{ [key: string]: string }>({});

  const generateCleanTitle = async (description: string, ideaId: string): Promise<string> => {
    // Check cache first
    if (titleCache[ideaId]) {
      return titleCache[ideaId];
    }

    try {
      const response = await fetch('http://localhost:8000/api/generate-title/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.idToken}`,
        },
        body: JSON.stringify({ 
          description: description,
          idea_id: ideaId
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        const cleanTitle = data.title;
        // Cache the result
        setTitleCache(prev => ({ ...prev, [ideaId]: cleanTitle }));
        return cleanTitle;
      } else {
        // Fallback to simple transformation
        return transformTitleSimple(description);
      }
    } catch (error) {
      console.error('Error generating title:', error);
      // Fallback to simple transformation
      return transformTitleSimple(description);
    }
  };

  const transformTitleSimple = (description: string): string => {
    // Simple fallback transformation
    let cleanTitle = description
      .replace(/^(i want|create|build|develop|make)\s+(an?\s+)?/i, '')
      .replace(/^(app|application|platform|system|tool|website|webapp)\s+(for|to|that)\s+/i, '')
      .replace(/^(that|which|to)\s+/i, '')
      .trim();

    cleanTitle = cleanTitle
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    if (!cleanTitle.toLowerCase().includes('app') && 
        !cleanTitle.toLowerCase().includes('platform') && 
        !cleanTitle.toLowerCase().includes('system') &&
        !cleanTitle.toLowerCase().includes('tool')) {
      cleanTitle += ' App';
    }

    if (cleanTitle.length > 40) {
      cleanTitle = cleanTitle.substring(0, 37) + '...';
    }

    return cleanTitle;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInHours < 168) { // 7 days
      const days = Math.floor(diffInHours / 24);
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredHistory = history.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleIdeaClick = (ideaId: string) => {
    onSelectIdea(ideaId);
  };

  if (loading) {
    return (
      <div className="w-80 bg-gray-900/50 backdrop-blur-sm border-r border-gray-700/50 flex flex-col h-full">
        <div className="p-4 border-b border-gray-700/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-lg">Chat History</h2>
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-purple-500"></div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-400">Loading history...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-gray-900/50 backdrop-blur-sm border-r border-gray-700/50 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold text-lg flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Chat History
          </h2>
          <button
            onClick={refreshHistory}
            disabled={isRefreshing}
            className="p-1.5 rounded-lg hover:bg-gray-700/50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 text-gray-400 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors mb-4"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto">
        {error && (
          <div className="p-4 text-center">
            <p className="text-red-400 text-sm mb-2">{error}</p>
            <button
              onClick={fetchHistory}
              className="text-purple-400 hover:text-purple-300 text-sm"
            >
              Try Again
            </button>
          </div>
        )}

        {!error && filteredHistory.length === 0 && (
          <div className="p-4 text-center">
            <Sparkles className="w-8 h-8 text-gray-500 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">No chats yet</p>
            <p className="text-gray-500 text-xs mt-1">Start your first conversation!</p>
          </div>
        )}

        <AnimatePresence>
          {filteredHistory.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <button
                onClick={() => handleIdeaClick(item._id)}
                className={`w-full p-3 text-left hover:bg-gray-800/50 transition-colors border-b border-gray-700/30 ${
                  selectedIdeaId === item._id ? 'bg-purple-600/20 border-purple-500/30' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium text-sm truncate mb-1">
                      {titleCache[item._id] || transformTitleSimple(item.description)}
                    </h3>
                    <p className="text-gray-400 text-xs line-clamp-2 mb-2">
                      {item.description.length > 60 
                        ? item.description.substring(0, 60) + '...' 
                        : item.description
                      }
                    </p>
                    <div className="flex items-center gap-3 text-gray-500 text-xs">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        <span>{item.debate_count} debates</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDate(item.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700/50">
        <div className="flex items-center justify-between text-gray-400 text-sm">
          <span>{filteredHistory.length} chats</span>
          {user && (
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>{user.name || 'User'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
