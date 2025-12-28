import { useState } from "react";
import { CloseCircle, Danger, InfoCircle } from "iconsax-react";
import { Button } from "@/components/atoms";

interface ErrorLog {
  id: string;
  timestamp: string;
  type: 'build' | 'deployment' | 'runtime' | 'system';
  title: string;
  message: string;
  details?: string;
}

interface ErrorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  errors: ErrorLog[];
  appName?: string;
}

export default function ErrorDrawer({
  isOpen,
  onClose,
  errors,
  appName,
}: ErrorDrawerProps) {
  const [selectedError, setSelectedError] = useState<ErrorLog | null>(null);

  const errorTypeColors = {
    build: "bg-danger-100 text-danger-700 dark:bg-danger-900 dark:text-danger-300",
    deployment: "bg-warning-100 text-warning-700 dark:bg-warning-900 dark:text-warning-300",
    runtime: "bg-danger-100 text-danger-700 dark:bg-danger-900 dark:text-danger-300",
    system: "bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-300",
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed left-0 top-0 h-full w-full md:w-[500px] bg-white dark:bg-secondary-900 z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b dark:border-b-[0.4px] border-secondary-200 dark:border-secondary-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-danger-100 dark:bg-danger-900/30 flex items-center justify-center">
              <Danger
                size={20}
                className="text-danger-600 dark:text-danger-400"
                variant="Bold"
                color="currentColor"
              />
            </div>
            <div>
              <h2 className="text-lg font-bold text-secondary-900 dark:text-secondary-100">
                Errors & Issues
              </h2>
              {appName && (
                <p className="text-xs text-secondary-500 dark:text-secondary-400">
                  {appName}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-lg transition-colors"
          >
            <CloseCircle
              size={24}
              className="text-secondary-500"
              variant="Outline"
              color="currentColor"
            />
          </button>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-73px)] overflow-y-auto">
          {errors.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              <div className="w-16 h-16 rounded-full bg-success-100 dark:bg-success-900/30 flex items-center justify-center mb-4">
                <InfoCircle
                  size={32}
                  className="text-success-600 dark:text-success-400"
                  variant="Bold"
                  color="currentColor"
                />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
                No Errors Found
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Your application is running smoothly without any errors.
              </p>
            </div>
          ) : (
            <div className="divide-y dark:divide-[0.4px] divide-secondary-200 dark:divide-secondary-700">
              {errors.map((error) => (
                <div
                  key={error.id}
                  className="p-4 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors cursor-pointer"
                  onClick={() => setSelectedError(selectedError?.id === error.id ? null : error)}
                >
                  <div className="flex items-start gap-3">
                    <Danger
                      size={20}
                      className="text-danger-600 dark:text-danger-400 flex-shrink-0 mt-0.5"
                      variant="Bold"
                      color="currentColor"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${
                            errorTypeColors[error.type]
                          }`}
                        >
                          {error.type}
                        </span>
                        <span className="text-xs text-secondary-500 dark:text-secondary-400">
                          {error.timestamp}
                        </span>
                      </div>
                      <h3 className="font-semibold text-sm text-secondary-900 dark:text-secondary-100 mb-1">
                        {error.title}
                      </h3>
                      <p className="text-xs text-secondary-600 dark:text-secondary-400 line-clamp-2">
                        {error.message}
                      </p>

                      {/* Expanded Details */}
                      {selectedError?.id === error.id && error.details && (
                        <div className="mt-3 p-3 bg-secondary-900 dark:bg-black rounded-lg">
                          <pre className="text-xs text-danger-400 font-mono whitespace-pre-wrap break-all">
                            {error.details}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
