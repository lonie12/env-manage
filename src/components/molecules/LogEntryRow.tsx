import type { LogEntry } from "@/api";

interface LogEntryRowProps {
  log: LogEntry;
}

export default function LogEntryRow({ log }: LogEntryRowProps) {
  const levelColors = {
    info: "bg-info-100 text-info-700 dark:bg-info-900 dark:text-info-300",
    warn: "bg-warning-100 text-warning-700 dark:bg-warning-900 dark:text-warning-300",
    error: "bg-danger-100 text-danger-700 dark:bg-danger-900 dark:text-danger-300",
    debug: "bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-300",
  };

  return (
    <div className="flex items-start gap-4 px-6 py-3 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors border-b dark:border-[0.4px] border-secondary-200 dark:border-secondary-700">
      <span className="text-xs font-mono text-secondary-500 dark:text-secondary-400 whitespace-nowrap">
        {log.timestamp}
      </span>
      <span
        className={`px-2 py-0.5 rounded text-xs font-medium ${levelColors[log.level]} uppercase`}
      >
        {log.level}
      </span>
      <span className="text-xs font-medium text-primary-600 dark:text-primary-400 whitespace-nowrap">
        {log.app}
      </span>
      <span className="text-sm text-secondary-700 dark:text-secondary-300 flex-1">
        {log.message}
      </span>
    </div>
  );
}
