import { Check, Dot } from 'lucide-react';
import { cn } from '@/lib/utils';

type ProgressIndicatorProps = {
  steps: string[];
  currentStep: number;
};

export default function ProgressIndicator({
  steps,
  currentStep,
}: ProgressIndicatorProps) {
  return (
    <div
      className="flex items-center justify-center p-4 bg-card rounded-xl shadow-sm border"
      aria-label="Registration Progress"
    >
      <div className="flex items-center">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;

          return (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300',
                    isCompleted
                      ? 'border-green-500 bg-green-500 text-white'
                      : isActive
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-transparent text-muted-foreground'
                  )}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span
                      className={cn(
                        'font-bold',
                        isActive && 'text-primary'
                      )}
                    >
                      {index + 1}
                    </span>
                  )}
                </div>
                <p
                  className={cn(
                    'mt-2 text-center text-xs font-medium',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {step}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'mx-4 h-1 w-8 sm:w-12 rounded-full transition-colors duration-300',
                    index < currentStep ? 'bg-green-500' : 'bg-border'
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
