
import { useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Mail, Phone, MessageSquare } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface OnboardingFlowProps {
  isOpen: boolean;
  onClose: () => void;
}

const OnboardingFlow = ({ isOpen, onClose }: OnboardingFlowProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    purpose: '',
    email: '',
    contact_preference: '',
    contact_other: '',
    phone: '',
    company: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleNextStep = () => {
    if (step === 1 && !formData.purpose) {
      toast({
        title: "Please select a purpose",
        variant: "destructive",
      });
      return;
    }
    if (step === 2 && !formData.email) {
      toast({
        title: "Please enter your email",
        variant: "destructive",
      });
      return;
    }
    if (step === 3 && !formData.contact_preference) {
      toast({
        title: "Please select a contact preference",
        variant: "destructive",
      });
      return;
    }
    setStep(step + 1);
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "Message sent!",
        description: "We'll get back to you soon.",
      });
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl w-full max-w-md p-8 shadow-xl animate-fade-up m-4">
        <div className="absolute top-4 right-4 flex space-x-2">
          {step > 1 && (
            <button 
              onClick={handlePrevStep}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            ×
          </button>
        </div>

        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`w-1/4 h-1 rounded-full mx-1 transition-colors ${
                  s === step ? 'bg-black' : s < step ? 'bg-gray-400' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-fade">
            <h2 className="text-2xl font-bold mb-6">What brings you here?</h2>
            {[
              { value: 'personal', label: 'I want an AI Agent for myself' },
              { value: 'business', label: 'I need AI for my business' },
              { value: 'looking', label: 'Just looking around' }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFormData({ ...formData, purpose: option.value })}
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  formData.purpose === option.value
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option.label}</span>
                  {formData.purpose === option.value && <Check size={20} />}
                </div>
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade">
            <h2 className="text-2xl font-bold mb-6">What's your email?</h2>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="your@email.com"
              className="w-full"
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade">
            <h2 className="text-2xl font-bold mb-6">How should we contact you?</h2>
            {[
              { value: 'phone', label: 'Phone', icon: Phone },
              { value: 'email', label: 'Email', icon: Mail },
              { value: 'viber', label: 'Viber', icon: MessageSquare },
              { value: 'other', label: 'Other', icon: MessageSquare }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setFormData({ ...formData, contact_preference: option.value })}
                className={`w-full p-4 rounded-xl border-2 transition-all ${
                  formData.contact_preference === option.value
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <option.icon size={20} />
                    <span>{option.label}</span>
                  </div>
                  {formData.contact_preference === option.value && <Check size={20} />}
                </div>
              </button>
            ))}
            {formData.contact_preference === 'other' && (
              <Input
                value={formData.contact_other}
                onChange={(e) => setFormData({ ...formData, contact_other: e.target.value })}
                placeholder="Please specify"
                className="w-full mt-4"
              />
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6 animate-fade">
            <h2 className="text-2xl font-bold mb-6">Final Details</h2>
            {formData.contact_preference === 'phone' && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Your phone number"
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Company (Optional)</label>
              <Input
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Your company name"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <Textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us about your AI needs"
                rows={4}
                required
              />
            </div>
          </div>
        )}

        <div className="mt-8">
          {step < 4 ? (
            <button
              onClick={handleNextStep}
              className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Continue</span>
              <ChevronRight size={20} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? 'Sending...' : 'Submit'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
