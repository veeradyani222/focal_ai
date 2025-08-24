'use client';

interface IdeaInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (idea: string) => void;
  disabled?: boolean;
}

export default function IdeaInput({ value, onChange, onSubmit, disabled }: IdeaInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      onSubmit(value.trim());
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-indigo-900 mb-4">
        Share Your Product Vision
      </h2>
      <p className="text-gray-600 mb-6 text-sm leading-relaxed">
        Describe your idea in detail, and our AI stakeholders will refine it into actionable requirements.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="idea" className="block text-sm font-medium text-gray-700 mb-2">
            Your Idea
          </label>
          <textarea
            id="idea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g., An e-book platform connecting authors directly with readers, featuring secure uploads, real-time sales tracking, and personalized recommendations..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 resize-none transition-all duration-200"
            rows={8}
            disabled={disabled}
          />
        </div>
        
        <button
          type="submit"
          disabled={!value.trim() || disabled}
          className="w-full bg-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {disabled ? 'Processing...' : 'Refine with AI Stakeholders'}
        </button>
      </form>
      
      <div className="mt-6 p-5 bg-indigo-50 rounded-xl">
        <h3 className="font-semibold text-indigo-900 mb-3">💡 Pro Tips</h3>
        <ul className="text-sm text-indigo-800 space-y-2">
          <li className="flex items-start">
            <span className="mr-2">•</span> Specify the problem your product solves
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span> Define your target audience and use cases
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span> Highlight key features and functionality
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span> Consider your business model
          </li>
        </ul>
      </div>
    </div>
  );
}