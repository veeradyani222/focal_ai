'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface DebateEntry {
  agent: string;
  response: string;
  round: number;
}

interface ChartsDisplayProps {
  debateLog: DebateEntry[];
}

export default function ChartsDisplay({ debateLog }: ChartsDisplayProps) {
  const agentContributions = debateLog.reduce((acc, entry) => {
    acc[entry.agent] = (acc[entry.agent] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = {
    labels: Object.keys(agentContributions),
    datasets: [
      {
        label: 'Contributions per Agent',
        data: Object.values(agentContributions),
        backgroundColor: [
          'rgba(147, 51, 234, 0.6)', // purple-600
          'rgba(59, 130, 246, 0.6)', // blue-600
          'rgba(6, 182, 212, 0.6)', // cyan-500
          'rgba(168, 85, 247, 0.6)', // purple-500
          'rgba(37, 99, 235, 0.6)', // blue-700
        ],
        borderColor: [
          'rgba(147, 51, 234, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(6, 182, 212, 1)',
          'rgba(168, 85, 247, 1)',
          'rgba(37, 99, 235, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          color: '#E2E8F0', // slate-200 for dark theme
        },
      },
      title: {
        display: true,
        text: 'AI Stakeholder Contributions',
        font: {
          size: 16,
          family: "'Inter', sans-serif",
          weight: 'bold' as const,
        },
        color: '#F1F5F9', // slate-100 for dark theme
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Contributions',
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          color: '#E2E8F0', // slate-200 for dark theme
        },
        ticks: {
          color: '#CBD5E1', // slate-300 for dark theme
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.1)', // slate-400 with opacity
        },
      },
      x: {
        title: {
          display: true,
          text: 'AI Agents',
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
          color: '#E2E8F0', // slate-200 for dark theme
        },
        ticks: {
          color: '#CBD5E1', // slate-300 for dark theme
        },
        grid: {
          color: 'rgba(148, 163, 184, 0.1)', // slate-400 with opacity
        },
      },
    },
  };

  return (
    <div className="h-80 bg-transparent">
      <Bar data={data} options={options} />
    </div>
  );
}