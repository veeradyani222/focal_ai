'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  TrendingUp, 
  Clock, 
  Users, 
  CheckCircle, 
  AlertTriangle,
  ArrowRight,
  Brain,
  Calendar,
  Star,
  Zap,
  Award
} from 'lucide-react';
import ChartsDisplay from './ChartsDisplay';

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

// Helper function to format markdown text
const formatMarkdownText = (text: string) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-purple-300 font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="text-cyan-300 italic">$1</em>')
    .replace(/^(\d+)\./gm, '<span class="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-600 via-purple-500 to-cyan-500 rounded-full text-white text-sm font-bold mr-4 shadow-xl border-2 border-white/20 relative overflow-hidden"><span class="relative z-10">$1</span><div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div></span>')
    .replace(/\*\*Priority (\d+):\*\*/g, '<div class="flex items-center mb-8"><div class="w-12 h-12 bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 rounded-full flex items-center justify-center mr-4 shadow-xl border-2 border-yellow-300/30 relative overflow-hidden"><Award className="w-6 h-6 text-white relative z-10" /><div class="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div></div><span class="text-2xl font-bold text-yellow-300">Priority $1</span></div>')
    .replace(/\*\*Actionable:\*\*/g, '<span class="inline-block bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm font-medium mb-3 border border-green-500/30">Actionable</span>')
    .replace(/\*\*Balancing Strategy:\*\*/g, '<span class="inline-block bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-medium mb-3 border border-blue-500/30">Balancing Strategy</span>')
    .replace(/\*\*Decision:\*\*/g, '<span class="inline-block bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full text-sm font-medium mb-3 border border-purple-500/30">Decision</span>')
    .split('\n')
    .map((line, index) => {
      if (line.trim().startsWith('**Priority')) {
        return `<div class="mt-8 mb-6">${line}</div>`;
      }
      if (line.trim().startsWith('<span class="inline-flex')) {
        return `<div class="flex flex-col items-start mb-6 p-3 bg-white/5 rounded-lg border border-white/10">${line}</div>`;
      }
      if (line.trim().includes('**Actionable:**') || line.trim().includes('**Balancing Strategy:**') || line.trim().includes('**Decision:**')) {
        return `<div class="mt-4">${line}</div>`;
      }
      if (line.trim() === '') {
        return '<div class="h-3"></div>';
      }
      return `<div class="mb-3">${line}</div>`;
    })
    .join('');
};

// Timeline component for next steps
const TimelineComponent = ({ steps }: { steps: string[] }) => {
  return (
    <div className="space-y-8">
      {steps.map((step, index) => {
        const timeMatch = step.match(/\((\d+)\s*Month[s]?\)/);
        const timeText = timeMatch ? timeMatch[1] : '';
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -30, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ 
              delay: index * 0.15,
              duration: 0.6,
              ease: "easeOut"
            }}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            className="flex items-start space-x-6"
          >
            {/* Timeline dot */}
            <div className="flex-shrink-0">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-br from-purple-600 via-purple-500 to-cyan-500 rounded-full flex items-center justify-center shadow-xl border-2 border-white/20 relative overflow-hidden"
                whileHover={{ 
                  scale: 1.1,
                  boxShadow: "0 0 25px rgba(147, 51, 234, 0.6)"
                }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-white text-sm font-bold relative z-10">{index + 1}</span>
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full"></div>
              </motion.div>
              {index < steps.length - 1 && (
                <motion.div 
                  className="w-1 h-16 bg-gradient-to-b from-purple-500 to-cyan-500 mx-auto mt-3 rounded-full"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: index * 0.15 + 0.3, duration: 0.5 }}
                />
              )}
            </div>
            
            {/* Content */}
            <motion.div 
              className="flex-1 bg-white/5 rounded-xl p-6 border border-white/10 backdrop-blur-sm"
              whileHover={{ 
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                borderColor: "rgba(147, 51, 234, 0.3)"
              }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-white text-lg">
                  {step.split('(')[0].replace(/^\d+\.\s*/, '')}
                </h4>
                {timeText && (
                  <motion.span 
                    className="bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-purple-300 px-4 py-2 rounded-full text-sm font-medium border border-purple-500/30"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.15 + 0.4, type: "spring", stiffness: 200 }}
                  >
                    {timeText} Month{timeText !== '1' ? 's' : ''}
                  </motion.span>
                )}
              </div>
              <div 
                className="text-purple-100 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formatMarkdownText(step) }}
              />
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  const [activeTab, setActiveTab] = useState<'requirements' | 'debate'>('requirements');

  if (!result.success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-2xl p-6"
      >
        <div className="flex items-center">
          <AlertTriangle className="h-6 w-6 text-red-400 mr-3" />
          <div>
            <h3 className="text-lg font-semibold text-red-200">Error</h3>
            <p className="text-red-100">{result.error}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Parse the refined requirements text into sections
  const parseRequirements = (text: string) => {
    const sections = {
      refined_requirements: '',
      trade_offs: '',
      next_steps: ''
    };

    const lines = text.split('\n');
    let currentSection = '';

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.toUpperCase().includes('REFINED REQUIREMENTS')) {
        currentSection = 'refined_requirements';
      } else if (trimmedLine.toUpperCase().includes('TRADE-OFFS') || trimmedLine.toUpperCase().includes('TRADE OFFS')) {
        currentSection = 'trade_offs';
      } else if (trimmedLine.toUpperCase().includes('NEXT STEPS')) {
        currentSection = 'next_steps';
      } else if (currentSection && trimmedLine) {
        sections[currentSection as keyof typeof sections] += trimmedLine + '\n';
      }
    }

    return sections;
  };

  const sections = parseRequirements(result.refined_requirements || '');
  
  // Parse next steps into individual steps
  const nextSteps = sections.next_steps
    .split('\n')
    .filter(line => line.trim().match(/^\d+\./))
    .map(line => line.trim());

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden"
    >
      {/* Tab Navigation */}
      <div className="border-b border-white/10">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('requirements')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 ${
              activeTab === 'requirements'
                ? 'text-white bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border-b-2 border-purple-400'
                : 'text-purple-200 hover:text-white hover:bg-white/5'
            }`}
          >
            <Target className="w-5 h-5 inline mr-2" />
            Refined Requirements
          </button>
          <button
            onClick={() => setActiveTab('debate')}
            className={`flex-1 py-4 px-6 text-center font-medium transition-all duration-300 ${
              activeTab === 'debate'
                ? 'text-white bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border-b-2 border-purple-400'
                : 'text-purple-200 hover:text-white hover:bg-white/5'
            }`}
          >
            <Brain className="w-5 h-5 inline mr-2" />
            AI Debate ({result.debate_log?.length || 0})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'requirements' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Refined Requirements Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <motion.div 
                className="flex flex-col items-center mb-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div 
                  className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center mr-4 shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Target className="w-6 h-6 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-white">Refined Requirements</h3>
              </motion.div>
              
              <motion.div 
                className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-xl p-8 border border-purple-500/20 backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                whileHover={{ scale: 1.01 }}
              >
                <div 
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: formatMarkdownText(sections.refined_requirements || result.refined_requirements || '') }}
                />
              </motion.div>
            </motion.div>

            {/* Trade-offs Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mr-3">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Trade-offs Analysis</h3>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-6 border border-blue-500/20">
                <ChartsDisplay debateLog={result.debate_log || []} />
                <div className="mt-6">
                  <div 
                    className="prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: formatMarkdownText(sections.trade_offs) }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Next Steps Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-600 flex items-center justify-center mr-3">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Next Steps & Timeline</h3>
              </div>
              
              <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl p-6 border border-cyan-500/20">
                <TimelineComponent steps={nextSteps} />
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'debate' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <Brain className="w-6 h-6 mr-3 text-purple-400" />
              AI Stakeholder Debate
            </h3>
            
            {result.debate_log && result.debate_log.length > 0 && (
              <div className="space-y-4">
                {result.debate_log.map((debate, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-purple-200 border border-purple-500/30">
                          <Users className="w-4 h-4 mr-2" />
                          {debate.agent}
                        </span>
                        <span className="text-sm text-purple-300 bg-purple-500/20 px-2 py-1 rounded">
                          Round {debate.round}
                        </span>
                      </div>
                    </div>
                    <div className="text-purple-100 leading-relaxed">
                      {debate.response}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}