import React from 'react';
import { Check } from 'lucide-react';

export default function EmergencyProgress({ currentStep = 1 }) {
  const steps = [
    { number: 1, title: 'Basic Information' },
    { number: 2, title: 'Category Details' },
    { number: 3, title: 'Nearby Resources' },
    { number: 4, title: 'Confirm & Dispatch' },
  ];

  return (
    <nav aria-label="Emergency workflow progress" className="flex items-center">
      <ol className="flex items-center gap-1.5 sm:gap-2">
        {steps.map((step, index) => {
          const isActive = step.number === currentStep;
          const isCompleted = step.number < currentStep;

          return (
            <React.Fragment key={step.number}>
              {/* Step item */}
              <li className="flex items-center gap-2 group">
                {/* Circle Number */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-[#00A551] text-white shadow-sm ring-2 ring-[#00A551]/20'
                      : isCompleted
                      ? 'bg-[#00A551] text-white'
                      : 'bg-[#F1F5F9] text-[#94A3B8] border border-[#E2E8F0]'
                  }`}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : step.number}
                </div>

                {/* Step Title */}
                <div className="flex flex-col text-left">
                  <span
                    className={`text-xs font-semibold whitespace-nowrap transition-colors ${
                      isActive
                        ? 'text-[#00A551]'
                        : isCompleted
                        ? 'text-[#4A4A4A]'
                        : 'text-[#94A3B8]'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              </li>

              {/* Connecting line between steps */}
              {index < steps.length - 1 && (
                <div
                  className={`w-5 sm:w-8 h-[2px] rounded-full mx-1 ${
                    isCompleted ? 'bg-[#00A551]' : 'bg-[#E2E8F0]'
                  }`}
                  aria-hidden="true"
                />
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
