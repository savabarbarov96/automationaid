
interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator = ({ currentStep, totalSteps }: StepIndicatorProps) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between mb-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`w-1/4 h-1 rounded-full mx-1 transition-colors ${
              index + 1 === currentStep 
                ? 'bg-black' 
                : index + 1 < currentStep 
                  ? 'bg-gray-400' 
                  : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
