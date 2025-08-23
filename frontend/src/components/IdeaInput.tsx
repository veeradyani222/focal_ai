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
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Enter Your Product Idea
      </h2>
      <p className="text-gray-600 mb-6">
        Describe your product idea in detail. Our AI stakeholders will analyze it from multiple perspectives.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="idea" className="block text-sm font-medium text-gray-700 mb-2">
            Product Idea Description
          </label>
          <textarea
            id="idea"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="e.g., A food delivery app that connects local restaurants with customers, featuring real-time tracking, personalized recommendations, and a loyalty program..."
            className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={6}
            disabled={disabled}
          />
        </div>
        
        <button
          type="submit"
          disabled={!value.trim() || disabled}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {disabled ? 'Processing...' : 'Refine Requirements with AI Stakeholders'}
        </button>
      </form>
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">💡 Tips for better results:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Be specific about the problem you're solving</li>
          <li>• Include target audience and use cases</li>
          <li>• Mention key features and functionality</li>
          <li>• Consider business model and monetization</li>
        </ul>
      </div>
    </div>
  );
}
