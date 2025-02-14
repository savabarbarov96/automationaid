
import { Check } from 'lucide-react';

interface PurposeStepProps {
  selectedPurpose: string;
  onSelect: (purpose: string) => void;
}

const PurposeStep = ({ selectedPurpose, onSelect }: PurposeStepProps) => {
  const options = [
    { value: 'personal', label: 'I want an AI Agent for myself' },
    { value: 'business', label: 'I need AI for my business' },
    { value: 'looking', label: 'Just looking around' }
  ];

  return (
    <div className="space-y-6 animate-fade">
      <h2 className="text-2xl font-bold mb-6">What brings you here?</h2>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onSelect(option.value)}
          className={`w-full p-4 rounded-xl border-2 transition-all ${
            selectedPurpose === option.value
              ? 'border-black bg-black text-white'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span>{option.label}</span>
            {selectedPurpose === option.value && <Check size={20} />}
          </div>
        </button>
      ))}
    </div>
  );
};

export default PurposeStep;
