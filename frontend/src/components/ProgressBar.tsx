import { evaluationSteps } from '@/data/evaluationQuestions';

interface ProgressBarProps {
  currentStep: number;
}

export function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <div className="w-full px-4 py-6 bg-card">
      <div className="relative flex items-center justify-between max-w-4xl mx-auto">
        {/* Line behind */}
        <div className="absolute left-0 right-0 top-1/2 h-1 bg-border -translate-y-1/2 z-0" />
        <div 
          className="absolute left-0 top-1/2 h-1 bg-accent -translate-y-1/2 z-0 transition-all duration-300"
          style={{ width: `${(currentStep / (evaluationSteps.length - 1)) * 100}%` }}
        />
        
        {evaluationSteps.map((step, index) => (
          <div key={step} className="relative z-10 flex flex-col items-center" style={{top: `${index >= 2 ? "18px" : "12px"}`}}>
            <div 
              className={`w-4 h-4 rounded-full border-2 transition-colors ${
                index <= currentStep 
                  ? 'bg-accent border-accent' 
                  : 'bg-card border-muted-foreground'
              }`}
            />
            <span 
              className={`mt-2 text-xs text-center max-w-[80px] leading-tight ${
                index <= currentStep ? 'text-accent font-medium' : 'text-muted-foreground'
              }`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
