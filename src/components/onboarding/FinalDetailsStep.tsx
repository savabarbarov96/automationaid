
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { AlertCircle } from 'lucide-react';

interface FinalDetailsStepProps {
  formData: {
    phone: string;
    company: string;
    message: string;
    contact_preference: string;
    email: string;
  };
  onChange: (field: string, value: string) => void;
  errors: {
    email?: string;
    phone?: string;
  };
}

const FinalDetailsStep = ({ formData, onChange, errors }: FinalDetailsStepProps) => {
  const validateEmail = (email: string) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  };

  return (
    <div className="space-y-6 animate-fade">
      <div className="flex justify-center mb-8">
        <img 
          src="/lovable-uploads/c0110f52-c24f-4c1a-8c0c-05941815b26e.png" 
          alt="Logo" 
          className="h-12 w-auto"
        />
      </div>
      
      <h2 className="text-2xl font-bold mb-6">Final Details</h2>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => {
            onChange('email', e.target.value);
            if (!validateEmail(e.target.value)) {
              errors.email = 'Please enter a valid email address';
            } else {
              errors.email = undefined;
            }
          }}
          placeholder="Your email address"
          className={errors.email ? 'border-red-500' : ''}
          required
        />
        {errors.email && (
          <div className="flex items-center text-red-500 text-sm mt-1">
            <AlertCircle className="h-4 w-4 mr-2" />
            {errors.email}
          </div>
        )}
      </div>

      {formData.contact_preference === 'phone' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <div className="phone-input-container">
            <PhoneInput
              country={'us'}
              value={formData.phone}
              onChange={(phone) => onChange('phone', phone)}
              inputClass="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              containerClass="phone-input"
              buttonClass="phone-button"
              dropdownClass="phone-dropdown"
            />
          </div>
          <style jsx global>{`
            .phone-input {
              width: 100% !important;
            }
            .phone-input input {
              width: 100% !important;
              height: 40px !important;
              border-radius: 6px !important;
              border: 1px solid #e5e7eb !important;
            }
            .phone-input .phone-button {
              background: #f9fafb !important;
              border: 1px solid #e5e7eb !important;
              border-radius: 6px 0 0 6px !important;
            }
            .phone-dropdown {
              width: 300px !important;
            }
          `}</style>
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Company (Optional)</label>
        <Input
          value={formData.company}
          onChange={(e) => onChange('company', e.target.value)}
          placeholder="Your company name"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Message</label>
        <Textarea
          value={formData.message}
          onChange={(e) => onChange('message', e.target.value)}
          placeholder="Tell us about your AI needs"
          rows={4}
          required
        />
      </div>
    </div>
  );
};

export default FinalDetailsStep;
