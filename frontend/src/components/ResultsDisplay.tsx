'use client';

import { useState } from 'react';

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

interface ResultsDisplayProps {
  result: RefinementResult;
}

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  const [activeTab, setActiveTab] = useState<'requirements' | 'debate'>('requirements');

  if (!result.success) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-700 mt-1">{result.error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 px-6">
          <button
            onClick={() => setActiveTab('requirements')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'requirements'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Refined Requirements
          </button>
          <button
            onClick={() => setActiveTab('debate')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'debate'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            AI Stakeholder Debate ({result.debate_log?.length || 0} responses)
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'requirements' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🎯 Refined Requirements
              </h3>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
                  {result.refined_requirements}
                </pre>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'debate' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🤖 AI Stakeholder Debate
            </h3>
            
            {result.debate_log && result.debate_log.length > 0 && (
              <div className="space-y-4">
                {result.debate_log.map((debate, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {debate.agent}
                        </span>
                        <span className="text-sm text-gray-500">
                          Round {debate.round}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-700 leading-relaxed">
                      {debate.response}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
