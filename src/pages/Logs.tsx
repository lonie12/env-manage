import { LogEntryRow, EmptyStateLogs } from "@/components/molecules";
import { mockLogs } from "@/mocks/logs.mock";
import { Input } from "@/components/atoms";

export default function Logs() {
  const logs = mockLogs; // Change to [] to see empty state

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
          Logs
        </h1>
        <p className="mt-2 text-secondary-600 dark:text-secondary-400">
          View application and system logs
        </p>
      </div>

      {logs.length > 0 && (
        <div className="flex gap-4">
          <Input placeholder="Search logs..." className="flex-1" />
          <select className="px-4 py-2 border dark:border-[0.4px] border-secondary-300 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100">
            <option>All Levels</option>
            <option>Info</option>
            <option>Warn</option>
            <option>Error</option>
            <option>Debug</option>
          </select>
          <select className="px-4 py-2 border dark:border-[0.4px] border-secondary-300 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100">
            <option>All Apps</option>
            <option>api-backend</option>
            <option>frontend-app</option>
            <option>worker-service</option>
          </select>
        </div>
      )}

      {/* Logs Display or Empty State */}
      {logs.length > 0 ? (
        <div className="bg-white dark:bg-secondary-900 rounded-xl border dark:border-[0.4px] border-secondary-200 dark:border-secondary-700 overflow-hidden">
          <div className="max-h-[600px] overflow-y-auto">
            {logs.map((log) => (
              <LogEntryRow key={log.id} log={log} />
            ))}
          </div>
        </div>
      ) : (
        <EmptyStateLogs />
      )}
    </div>
  );
}
