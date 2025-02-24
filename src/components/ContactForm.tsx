
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ContactFormProps {
  onClose?: () => void;
  language?: 'en' | 'bg';
}

export const ContactForm = ({ onClose, language = 'en' }: ContactFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const translations = {
    en: {
      name: 'Name',
      email: 'Email',
      phone: 'Phone (optional)',
      message: 'Message',
      submit: 'Submit',
      required: 'This field is required',
      invalidEmail: 'Please enter a valid email',
      success: 'Message sent successfully!',
      error: 'Error sending message',
    },
    bg: {
      name: 'Име',
      email: 'Имейл',
      phone: 'Телефон (по желание)',
      message: 'Съобщение',
      submit: 'Изпрати',
      required: 'Това поле е задължително',
      invalidEmail: 'Моля, въведете валиден имейл',
      success: 'Съобщението е изпратено успешно!',
      error: 'Грешка при изпращане на съобщението',
    }
  };

  const t = translations[language];

  const validateForm = () => {
    if (!formData.name) {
      toast({
        title: t.required,
        description: t.name,
        variant: "destructive",
      });
      return false;
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({
        title: t.invalidEmail,
        variant: "destructive",
      });
      return false;
    }

    if (!formData.message) {
      toast({
        title: t.required,
        description: t.message,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          purpose: 'contact',
          company: '',
          contact_preference: 'email'
        }]);

      if (error) throw error;

      toast({
        title: t.success,
      });

      if (onClose) {
        onClose();
      }
    } catch (error: any) {
      toast({
        title: t.error,
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Input
          type="text"
          placeholder={t.name}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Input
          type="email"
          placeholder={t.email}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <div>
        <Input
          type="tel"
          placeholder={t.phone}
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>
      <div>
        <Textarea
          placeholder={t.message}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
          rows={4}
        />
      </div>
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? '...' : t.submit}
      </Button>
    </form>
  );
};
