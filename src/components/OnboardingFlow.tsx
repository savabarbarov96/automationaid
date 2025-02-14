
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Input } from "@/components/ui/input";
import StepIndicator from './onboarding/StepIndicator';
import PurposeStep from './onboarding/PurposeStep';
import ContactStep from './onboarding/ContactStep';
import FinalDetailsStep from './onboarding/FinalDetailsStep';

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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Save to database
      const { error: dbError } = await supabase
        .from('contact_submissions')
        .insert([formData]);

      if (dbError) throw dbError;

      // Send confirmation email
      const { error: emailError } = await supabase.functions.invoke('send-onboarding-email', {
        body: formData
      });

      if (emailError) throw emailError;

      toast({
        title: "Message sent!",
        description: "We'll get back to you soon. Check your email for confirmation.",
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
              onClick={() => setStep(step - 1)}
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

        <StepIndicator currentStep={step} totalSteps={4} />

        {step === 1 && (
          <PurposeStep
            selectedPurpose={formData.purpose}
            onSelect={(purpose) => setFormData({ ...formData, purpose })}
          />
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
          <ContactStep
            contactPreference={formData.contact_preference}
            contactOther={formData.contact_other}
            onSelectPreference={(preference) => setFormData({ ...formData, contact_preference: preference })}
            onOtherChange={(value) => setFormData({ ...formData, contact_other: value })}
          />
        )}

        {step === 4 && (
          <FinalDetailsStep
            formData={formData}
            onChange={(field, value) => setFormData({ ...formData, [field]: value })}
          />
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
