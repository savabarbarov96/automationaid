
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FinalDetailsStepProps {
  formData: {
    phone: string;
    company: string;
    message: string;
    contact_preference: string;
  };
  onChange: (field: string, value: string) => void;
}

const FinalDetailsStep = ({ formData, onChange }: FinalDetailsStepProps) => {
  return (
    <div className="space-y-6 animate-fade">
      <h2 className="text-2xl font-bold mb-6">Final Details</h2>
      {formData.contact_preference === 'phone' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <Input
            type="tel"
            value={formData.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder="Your phone number"
            required
          />
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
