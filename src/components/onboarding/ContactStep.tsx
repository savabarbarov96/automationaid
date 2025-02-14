
import { Check, Mail, Phone, MessageSquare } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface ContactStepProps {
  contactPreference: string;
  contactOther: string;
  onSelectPreference: (preference: string) => void;
  onOtherChange: (value: string) => void;
}

const ContactStep = ({ 
  contactPreference, 
  contactOther, 
  onSelectPreference, 
  onOtherChange 
}: ContactStepProps) => {
  const options = [
    { value: 'phone', label: 'Phone', icon: Phone },
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'viber', label: 'Viber', icon: MessageSquare },
    { value: 'other', label: 'Other', icon: MessageSquare }
  ];

  return (
    <div className="space-y-6 animate-fade">
      <h2 className="text-2xl font-bold mb-6">How should we contact you?</h2>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onSelectPreference(option.value)}
          className={`w-full p-4 rounded-xl border-2 transition-all ${
            contactPreference === option.value
              ? 'border-black bg-black text-white'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <option.icon size={20} />
              <span>{option.label}</span>
            </div>
            {contactPreference === option.value && <Check size={20} />}
          </div>
        </button>
      ))}
      {contactPreference === 'other' && (
        <Input
          value={contactOther}
          onChange={(e) => onOtherChange(e.target.value)}
          placeholder="Please specify"
          className="w-full mt-4"
        />
      )}
    </div>
  );
};

export default ContactStep;
