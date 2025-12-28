import { TickCircle, CloseCircle, Clock } from "iconsax-react";

export type DeploymentStep =
  | "cloning"
  | "installing"
  | "building"
  | "starting";

export type StepStatus = "pending" | "in_progress" | "success" | "error";

export interface DeploymentStatusData {
  currentStep: DeploymentStep;
  steps: {
    cloning: StepStatus;
    installing: StepStatus;
    building: StepStatus;
    starting: StepStatus;
  };
  completedAt?: string;
  error?: {
    step: DeploymentStep;
    message: string;
  };
}

interface DeploymentStatusProps {
  status: DeploymentStatusData;
}

const stepLabels: Record<DeploymentStep, string> = {
  cloning: "Cloning repository",
  installing: "Installing dependencies",
  building: "Building application",
  starting: "Starting application",
};

export default function DeploymentStatus({ status }: DeploymentStatusProps) {
  const steps: DeploymentStep[] = ["cloning", "installing", "building", "starting"];

  const getStepIcon = (step: DeploymentStep) => {
    const stepStatus = status.steps[step];

    if (stepStatus === "success") {
      return (
        <div className="w-8 h-8 rounded-full bg-success-100 dark:bg-success-900/30 flex items-center justify-center">
          <TickCircle size={20} className="text-success-600 dark:text-success-400" variant="Bold" />
        </div>
      );
    }

    if (stepStatus === "error") {
      return (
        <div className="w-8 h-8 rounded-full bg-danger-100 dark:bg-danger-900/30 flex items-center justify-center">
          <CloseCircle size={20} className="text-danger-600 dark:text-danger-400" variant="Bold" />
        </div>
      );
    }

    if (stepStatus === "in_progress") {
      return (
        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    // pending
    return (
      <div className="w-8 h-8 rounded-full bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center">
        <Clock size={20} className="text-secondary-400" variant="Outline" />
      </div>
    );
  };

  const getStepTextColor = (step: DeploymentStep) => {
    const stepStatus = status.steps[step];

    if (stepStatus === "success") return "text-success-600 dark:text-success-400";
    if (stepStatus === "error") return "text-danger-600 dark:text-danger-400";
    if (stepStatus === "in_progress") return "text-primary-600 dark:text-primary-400";
    return "text-secondary-500 dark:text-secondary-400";
  };

  const getLineColor = (step: DeploymentStep) => {
    const stepStatus = status.steps[step];
    if (stepStatus === "success") return "bg-success-200 dark:bg-success-800";
    if (stepStatus === "error") return "bg-danger-200 dark:bg-danger-800";
    if (stepStatus === "in_progress") return "bg-primary-200 dark:bg-primary-800";
    return "bg-secondary-200 dark:bg-secondary-700";
  };

  return (
    <div className="bg-white dark:bg-secondary-900 rounded-xl border dark:border-[0.4px] border-secondary-200 dark:border-secondary-700 p-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-secondary-900 dark:text-secondary-100">
            Deploying Application
          </h3>
          <p className="text-sm text-secondary-600 dark:text-secondary-400">
            {stepLabels[status.currentStep]}...
          </p>
        </div>
      </div>

      {/* Horizontal Timeline */}
      <div className="relative">
        {/* Icons and connecting lines */}
        <div className="flex items-center mb-4">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center" style={{ flex: index === steps.length - 1 ? '0 0 auto' : '1 1 0' }}>
              {getStepIcon(step)}
              {index < steps.length - 1 && (
                <div className={`h-0.5 flex-1 mx-3 ${getLineColor(step)}`} />
              )}
            </div>
          ))}
        </div>

        {/* Labels */}
        <div className="grid grid-cols-4 gap-2">
          {steps.map((step) => (
            <div key={step} className="text-left">
              <p className={`text-sm font-medium ${getStepTextColor(step)}`}>
                {stepLabels[step]}
              </p>
              {status.error && status.error.step === step && (
                <p className="text-xs text-danger-600 dark:text-danger-400 mt-1 line-clamp-2">
                  {status.error.message}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
