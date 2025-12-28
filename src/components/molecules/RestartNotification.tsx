import { Refresh, CloseCircle } from "iconsax-react";
import { Button } from "@/components/atoms";

interface RestartNotificationProps {
  appName: string;
  onRestart: () => void;
  onDismiss: () => void;
}

export default function RestartNotification({
  appName,
  onRestart,
  onDismiss,
}: RestartNotificationProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div className="bg-white dark:bg-secondary-900 rounded-xl shadow-2xl border dark:border-[0.4px] border-secondary-200 dark:border-secondary-700 p-4 max-w-sm">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <div className="w-10 h-10 rounded-full bg-warning-100 dark:bg-warning-900/30 flex items-center justify-center">
              <Refresh
                size={20}
                className="text-warning-600 dark:text-warning-400"
                variant="Bold"
                color="currentColor"
              />
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 mb-1">
              Restart Required
            </h4>
            <p className="text-xs text-secondary-600 dark:text-secondary-400 mb-3">
              Environment variables updated for <span className="font-medium">{appName}</span>.
              Restart to apply changes.
            </p>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={onRestart}
                className="flex items-center gap-2 text-xs"
              >
                <Refresh size={14} color="currentColor" />
                Restart Now
              </Button>
              <button
                onClick={onDismiss}
                className="text-xs text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-200 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
          <button
            onClick={onDismiss}
            className="flex-shrink-0 p-1 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded transition-colors"
          >
            <CloseCircle
              size={16}
              className="text-secondary-400"
              variant="Outline"
              color="currentColor"
            />
          </button>
        </div>
      </div>
    </div>
  );
}
