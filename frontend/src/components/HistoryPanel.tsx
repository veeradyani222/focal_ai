'use client';

import { useState, useEffect } from 'react';

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

export default function HistoryPanel() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/history/');
      const data = await response.json();
      
      if (data.success) {
        setHistory(data.history);
      } else {
        setError(data.error || 'Failed to load history');
      }
    } catch (error) {
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 text-sm">{error}</p>
        <button
          onClick={fetchHistory}
          className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
        >
          Try again
        </button>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-sm">No previous ideas found</p>
        <p className="text-gray-400 text-xs mt-1">Start by refining your first idea!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {history.map((item) => (
        <div key={item._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
              {item.title}
            </h4>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {new Date(item.created_at).toLocaleDateString()}
            </span>
          </div>
          
          <p className="text-gray-600 text-xs mb-3 line-clamp-2">
            {item.description}
          </p>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{item.debate_count} AI responses</span>
            {item.latest_requirement && (
              <span className="text-green-600">✓ Requirements ready</span>
            )}
          </div>
          
          {item.latest_requirement && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <details className="text-xs">
                <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                  View refined requirements
                </summary>
                <div className="mt-2 space-y-2">
                  <div>
                    <strong className="text-gray-700">Requirements:</strong>
                    <p className="text-gray-600 mt-1 line-clamp-3">
                      {item.latest_requirement.refined_requirements}
                    </p>
                  </div>
                  <div>
                    <strong className="text-gray-700">Trade-offs:</strong>
                    <p className="text-gray-600 mt-1 line-clamp-2">
                      {item.latest_requirement.trade_offs}
                    </p>
                  </div>
                </div>
              </details>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
