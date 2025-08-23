'use client';

import { useState } from 'react';
import IdeaInput from '../components/IdeaInput';
import ResultsDisplay from '../components/ResultsDisplay';
import HistoryPanel from '../components/HistoryPanel';
import LoadingSpinner from '../components/LoadingSpinner';

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

export default function Home() {
  const [idea, setIdea] = useState('');
  const [result, setResult] = useState<RefinementResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleRefineRequirements = async (ideaText: string) => {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('http://localhost:8000/api/refine/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idea: ideaText }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Failed to connect to the server. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🧠 Multi-Agent AI Requirement Refinement
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform your product ideas into refined requirements through AI-powered stakeholder debates. 
            Our multi-agent system simulates Business, Engineering, Design, Customer, and Product Management perspectives.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <IdeaInput 
                value={idea}
                onChange={setIdea}
                onSubmit={handleRefineRequirements}
                disabled={loading}
              />
              
              {loading && (
                <div className="mt-6">
                  <LoadingSpinner />
                  <p className="text-center text-gray-600 mt-4">
                    AI stakeholders are debating your idea... This may take a minute.
                  </p>
                </div>
              )}
            </div>

            {/* Results Section */}
            {result && (
              <div className="mt-8">
                <ResultsDisplay result={result} />
              </div>
            )}
          </div>

          {/* History Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">History</h3>
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  {showHistory ? 'Hide' : 'Show'}
                </button>
              </div>
              
              {showHistory && (
                <HistoryPanel />
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500">
          <p>
            Powered by LangChain + Gemini AI • Multi-Agent Stakeholder Simulation
          </p>
        </div>
      </div>
    </div>
  );
}
