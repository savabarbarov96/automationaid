
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import PurposeStep from './onboarding/PurposeStep';
import ContactStep from './onboarding/ContactStep';
import FinalDetailsStep from './onboarding/FinalDetailsStep';
import StepIndicator from './onboarding/StepIndicator';

interface OnboardingFlowProps {
  isOpen: boolean;
  onClose: () => void;
}

const OnboardingFlow = ({ isOpen, onClose }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<{
    email?: string;
    phone?: string;
  }>({});
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    purpose: '',
    contact_preference: '',
    contact_other: '',
    phone: '',
    company: '',
    message: '',
    email: ''
  });

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!formData.email || !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (formData.contact_preference === 'phone' && !formData.phone) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([
          {
            purpose: formData.purpose,
            contact_preference: formData.contact_preference,
            contact_other: formData.contact_other,
            phone: formData.phone,
            company: formData.company || '',
            message: formData.message,
            email: formData.email
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Thank you for your submission. We'll be in touch soon!",
      });

      onClose();
      setCurrentStep(1);
      setFormData({
        purpose: '',
        contact_preference: '',
        contact_other: '',
        phone: '',
        company: '',
        message: '',
        email: ''
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <StepIndicator currentStep={currentStep} totalSteps={3} />
        
        <div className="mt-6">
          {currentStep === 1 && (
            <PurposeStep
              selectedPurpose={formData.purpose}
              onSelect={(purpose) => handleFormChange('purpose', purpose)}
            />
          )}
          
          {currentStep === 2 && (
            <ContactStep
              contactPreference={formData.contact_preference}
              contactOther={formData.contact_other}
              onSelectPreference={(pref) => handleFormChange('contact_preference', pref)}
              onOtherChange={(value) => handleFormChange('contact_other', value)}
            />
          )}
          
          {currentStep === 3 && (
            <FinalDetailsStep
              formData={formData}
              onChange={handleFormChange}
              errors={errors}
            />
          )}
        </div>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            className={currentStep === 1 ? 'invisible' : ''}
          >
            Back
          </Button>
          <Button onClick={nextStep}>
            {currentStep === 3 ? 'Submit' : 'Next'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingFlow;
