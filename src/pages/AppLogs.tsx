import { useParams, Link } from "react-router";
import { ArrowLeft } from "iconsax-react";
import { LogEntryRow, EmptyStateLogs } from "@/components/molecules";
import { Input } from "@/components/atoms";
import { mockLogs } from "@/mocks/logs.mock";
import { mockApps } from "@/mocks/apps.mock";

export default function AppLogs() {
  const { id } = useParams();
  const app = mockApps.find((a) => a.id === id);
  const appLogs = mockLogs.filter((log) => log.app === app?.name);

  if (!app) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
          Application not found
        </h1>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <Link
          to={`/apps/${app.id}`}
          className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline mb-4"
        >
          <ArrowLeft color="currentColor" size={20} />
          Back to {app.name}
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
              {app.name} - Logs
            </h1>
            <p className="mt-2 text-secondary-600 dark:text-secondary-400">
              Real-time application logs and output
            </p>
          </div>
        </div>
      </div>

      {appLogs.length > 0 && (
        <div className="flex gap-4">
          <Input placeholder="Search logs..." className="flex-1" />
          <select className="px-4 py-2 border dark:border-[0.4px] border-secondary-300 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100">
            <option>All Levels</option>
            <option>Info</option>
            <option>Warn</option>
            <option>Error</option>
            <option>Debug</option>
          </select>
          <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors">
            Clear Logs
          </button>
        </div>
      )}

      {/* Logs Display */}
      {appLogs.length > 0 ? (
        <div className="bg-white dark:bg-secondary-900 rounded-xl border dark:border-[0.4px] border-secondary-200 dark:border-secondary-700 overflow-hidden">
          <div className="max-h-[600px] overflow-y-auto">
            {appLogs.map((log) => (
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
