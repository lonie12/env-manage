import { useState } from "react";
import { useParams, Link } from "react-router";
import {
  ArrowLeft,
  Play,
  Stop,
  Refresh,
  Trash,
  Setting3,
  Activity,
  Add,
  DocumentText1,
} from "iconsax-react";
import { Button, Badge } from "@/components/atoms";
import { EnvVarRow, EnvVarForm, LogEntryRow } from "@/components/molecules";
import { mockApps } from "@/mocks/apps.mock";
import { mockEnvVars } from "@/mocks/environment.mock";
import { mockProcesses } from "@/mocks/processes.mock";
import { mockLogs } from "@/mocks/logs.mock";

export default function AppDetails() {
  const { id } = useParams();
  const [showEnvForm, setShowEnvForm] = useState(false);

  const app = mockApps.find((a) => a.id === id);
  const appEnvVars = mockEnvVars.filter((env) => env.app === app?.name);
  const appProcess = mockProcesses.find((p) => p.name === app?.name);
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

  const statusColors = {
    running:
      "bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-300",
    stopped:
      "bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-300",
    error:
      "bg-danger-100 text-danger-700 dark:bg-danger-900 dark:text-danger-300",
  };

  const handleAddEnvVar = (key: string, value: string, isSecret: boolean) => {
    console.log("Adding env var:", { key, value, isSecret });
    setShowEnvForm(false);
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {/* Header */}
        <div>
          <Link
            to="/apps"
            className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline mb-4"
          >
            <ArrowLeft color="currentColor" size={20} />
            Back to Applications
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
                  {app.name}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    statusColors[app.status]
                  }`}
                >
                  {app.status}
                </span>
              </div>
              <p className="text-secondary-600 dark:text-secondary-400">
                {app.repository}
              </p>
              <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
                Branch: <span className="font-mono">{app.branch}</span> • Path:{" "}
                <span className="font-mono">{app.path}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="md"
                className="flex items-center gap-2"
              >
                <Play size={18} color="currentColor" />
                Start
              </Button>
              <Button
                variant="outline"
                size="md"
                className="flex items-center gap-2"
              >
                <Stop size={18} color="currentColor" />
                Stop
              </Button>
              <Button
                variant="outline"
                size="md"
                className="flex items-center gap-2"
              >
                <Refresh size={18} color="currentColor" />
                Restart
              </Button>
              <Button
                variant="danger"
                size="md"
                className="flex items-center gap-2"
              >
                <Trash size={18} color="currentColor" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-secondary-900 rounded-xl border dark:border-[0.4px] border-secondary-200 dark:border-secondary-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-secondary-600 dark:text-secondary-400">
                CPU Usage
              </span>
              <Activity
                size={20}
                className="text-primary-500"
                variant="Bold"
                color="currentColor"
              />
            </div>
            <p className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
              {app.cpu}
            </p>
          </div>
          <div className="bg-white dark:bg-secondary-900 rounded-xl border dark:border-[0.4px] border-secondary-200 dark:border-secondary-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-secondary-600 dark:text-secondary-400">
                Memory
              </span>
              <Setting3
                size={20}
                className="text-success-500"
                variant="Bold"
                color="currentColor"
              />
            </div>
            <p className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
              {app.memory}
            </p>
          </div>
          <div className="bg-white dark:bg-secondary-900 rounded-xl border dark:border-[0.4px] border-secondary-200 dark:border-secondary-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-secondary-600 dark:text-secondary-400">
                Uptime
              </span>
            </div>
            <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
              {app.uptime}
            </p>
          </div>
          <div className="bg-white dark:bg-secondary-900 rounded-xl border dark:border-[0.4px] border-secondary-200 dark:border-secondary-700 p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-secondary-600 dark:text-secondary-400">
                Restarts
              </span>
            </div>
            <p className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
              {app.restarts}
            </p>
          </div>
        </div>

        {/* Process Info */}
        {appProcess && (
          <div className="bg-white dark:bg-secondary-900 rounded-xl border dark:border-[0.4px] border-secondary-200 dark:border-secondary-700 p-6">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
              Process Information
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-1">
                  Process ID
                </p>
                <p className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                  {appProcess.pid || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-1">
                  Port
                </p>
                <p className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                  {app.port}
                </p>
              </div>
              <div>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-1">
                  Watching
                </p>
                <p className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                  {appProcess.watching ? "Yes" : "No"}
                </p>
              </div>
              <div>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-1">
                  Last Deployed
                </p>
                <p className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                  {app.lastDeployed}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Environment Variables */}
        <div className="bg-white dark:bg-secondary-900 rounded-xl border dark:border-[0.4px] border-secondary-200 dark:border-secondary-700 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b dark:border-[0.4px] border-secondary-200 dark:border-secondary-700">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
                Environment Variables
              </h2>
              <Badge className="bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                {appEnvVars.length} variables
              </Badge>
            </div>
            <Button
              size="md"
              className="flex items-center gap-2"
              onClick={() => setShowEnvForm(!showEnvForm)}
            >
              <Add size={18} color="currentColor" />
              Add Variable
            </Button>
          </div>
          <div className="p-6 space-y-3">
            {showEnvForm && (
              <EnvVarForm
                onSubmit={handleAddEnvVar}
                onCancel={() => setShowEnvForm(false)}
              />
            )}
            {appEnvVars.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-secondary-50 dark:bg-secondary-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">
                        Key
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">
                        Value
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">
                        App
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {appEnvVars.map((envVar) => (
                      <EnvVarRow key={envVar.id} envVar={envVar} />
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-secondary-500 dark:text-secondary-400 py-8">
                No environment variables configured
              </p>
            )}
          </div>

          </div>

          {/* Live Logs Console */}
          <div className="bg-white dark:bg-secondary-900 rounded-xl border dark:border-[0.4px] border-secondary-200 dark:border-secondary-700 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b dark:border-[0.4px] border-secondary-200 dark:border-secondary-700">
              <div className="flex items-center gap-3">
                <DocumentText1 size={20} className="text-primary-400" variant="Bold" color="currentColor" />
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">Live Logs</h3>
                <Badge className="bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-300 text-sm">
                  {appLogs.length} entries
                </Badge>
              </div>
              <button className="text-xs text-secondary-400 hover:text-secondary-200 transition-colors">Clear Console</button>
            </div>
            <div className="p-6">
              {appLogs.length > 0 ? (
                <div className="max-h-80 overflow-y-auto font-mono text-xs space-y-2">
                  {appLogs.map((log) => (
                    <LogEntryRow key={log.id} log={log} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-secondary-500 dark:text-secondary-400 py-8">No logs yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
}
