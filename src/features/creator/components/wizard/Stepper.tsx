import React from "react";
import type { WizardStep, WizardStepMeta } from "../../hooks/useCreatorWizard";

type StepperProps = {
  steps: WizardStepMeta[];
  currentStep: WizardStep;
  progress: number;
  onSelect: (step: WizardStep) => void;
};

export const WizardStepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  progress,
  onSelect,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ol className="flex flex-wrap gap-2 text-sm text-neutral-500">
          {steps.map((stepMeta) => {
            const isActive = stepMeta.value === currentStep;
            const isCompleted = stepMeta.value < currentStep;

            return (
              <li key={stepMeta.value}>
                <button
                  type="button"
                  onClick={() => onSelect(stepMeta.value)}
                  className={`flex items-center gap-2 rounded-full border px-3 py-1 transition ${
                    isActive
                      ? "border-neutral-900 bg-neutral-900 text-white"
                      : isCompleted
                        ? "border-neutral-900/20 bg-neutral-900/10 text-neutral-900"
                        : "border-neutral-200 bg-white text-neutral-500 hover:border-neutral-900 hover:text-neutral-900"
                  }`}
                >
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-semibold">
                    {stepMeta.value}
                  </span>
                  <span className="flex flex-col items-start">
                    <span className="text-xs font-semibold">
                      {stepMeta.title}
                    </span>
                    <span className="text-[11px]">{stepMeta.description}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        <p className="text-xs text-neutral-500">
          진행률{" "}
          <span className="font-semibold text-neutral-900">
            {Math.round(progress)}%
          </span>
        </p>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
        <div
          className="h-full rounded-full bg-neutral-900 transition-all"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
};
