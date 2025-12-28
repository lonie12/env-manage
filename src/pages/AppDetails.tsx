import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import {
  ArrowLeft,
  Play,
  Stop,
  Refresh,
  Activity,
  Add,
  DocumentText1,
  Danger,
} from "iconsax-react";
import { Button, Badge } from "@/components/atoms";
import { Header, DatabaseManagement } from "@/components/organisms";
import {
  EnvVarRow,
  EnvVarForm,
  LogEntryRow,
  RestartNotification,
  ErrorDrawer,
  DeploymentStatus,
} from "@/components/molecules";
import {
  applicationApi,
  envVarApi,
  errorApi,
  type LogEntry,
  type EnvVar,
  type ErrorLog,
} from "@/api";
import { deploymentStatusApi } from "@/api/deployment-status.api";
import type { DeploymentStatusData } from "@/components/molecules/DeploymentStatus";
import { apiAppToDisplay, type AppDisplay } from "@/lib/formatters";
import { showToast } from "@/lib/toast";

export default function AppDetails() {
  const { id } = useParams();
  const [app, setApp] = useState<AppDisplay | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEnvForm, setShowEnvForm] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [appLogs, setAppLogs] = useState<LogEntry[]>([]);
  const [envVars, setEnvVars] = useState<EnvVar[]>([]);
  const [showRestartNotification, setShowRestartNotification] = useState(false);
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [isErrorDrawerOpen, setIsErrorDrawerOpen] = useState(false);
  const [deploymentStatus, setDeploymentStatus] =
    useState<DeploymentStatusData | null>(null);

  useEffect(() => {
    loadApp();
    loadLogs();
    loadEnvVars();
    loadErrors();
    loadDeploymentStatus();
    // Refresh every 5 seconds
    const interval = setInterval(() => {
      loadApp();
      loadLogs();
      loadEnvVars();
      loadErrors();
      loadDeploymentStatus();
    }, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadApp = async () => {
    try {
      const response = await applicationApi.list();
      const appData = response.applications.find((a) => a.id.toString() === id);

      if (appData) {
        setApp(apiAppToDisplay(appData));
      } else {
        setApp(null);
      }
    } catch (error) {
      console.error("Failed to load app:", error);
      showToast.error("Failed to load application details");
    } finally {
      setLoading(false);
    }
  };

  const loadLogs = async () => {
    if (!id) return;
    try {
      const response = await applicationApi.getLogs(id, 100);
      setAppLogs(response.logs);
    } catch (error) {
      console.error("Failed to load logs:", error);
      // Don't show toast for log errors to avoid spam
    }
  };

  const loadEnvVars = async () => {
    if (!id) return;
    try {
      const response = await envVarApi.list(id);
      setEnvVars(response.variables);
    } catch (error) {
      console.error("Failed to load env vars:", error);
      // Don't show toast for env var errors to avoid spam
    }
  };

  const loadErrors = async () => {
    if (!id) return;
    try {
      const response = await errorApi.list(id);
      setErrors(response.errors);
    } catch (error) {
      console.error("Failed to load errors:", error);
      // Don't show toast for error loading errors
    }
  };

  const loadDeploymentStatus = async () => {
    if (!id) return;
    try {
      const response = await deploymentStatusApi.get(id);
      console.log("Deployment status response:", response);

      if (response.status) {
        // Show deployment status if it's not completed OR if it was completed less than 2 minutes ago
        if (!response.status.completedAt) {
          console.log(
            "Setting deployment status (in progress):",
            response.status
          );
          setDeploymentStatus(response.status);
        } else {
          const completedTime = new Date(response.status.completedAt).getTime();
          const now = Date.now();
          const twoMinutes = 2 * 60 * 1000;

          if (now - completedTime < twoMinutes) {
            console.log(
              "Setting deployment status (recently completed):",
              response.status
            );
            setDeploymentStatus(response.status);
          } else {
            console.log("Deployment completed more than 2 minutes ago, hiding");
            setDeploymentStatus(null);
          }
        }
      } else {
        console.log("No deployment status found");
        setDeploymentStatus(null);
      }
    } catch (error) {
      console.log("Error loading deployment status:", error);
      // If deployment status doesn't exist, it means deployment is complete or never happened
      setDeploymentStatus(null);
    }
  };

  const handleStart = async () => {
    if (!app || !id) return;
    setActionLoading("start");

    try {
      await showToast.promise(applicationApi.start(id), {
        loading: `Starting ${app.name}...`,
        success: `${app.name} started successfully!`,
        error: `Failed to start ${app.name}`,
      });
      await loadApp();
    } catch (error) {
      console.error("Start failed:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleStop = async () => {
    if (!app || !id) return;
    setActionLoading("stop");

    try {
      await showToast.promise(applicationApi.stop(id), {
        loading: `Stopping ${app.name}...`,
        success: `${app.name} stopped successfully!`,
        error: `Failed to stop ${app.name}`,
      });
      await loadApp();
    } catch (error) {
      console.error("Stop failed:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRestart = async () => {
    if (!app || !id) return;
    setActionLoading("restart");

    try {
      await showToast.promise(applicationApi.restart(id), {
        loading: `Restarting ${app.name}...`,
        success: `${app.name} restarted successfully!`,
        error: `Failed to restart ${app.name}`,
      });
      await loadApp();
    } catch (error) {
      console.error("Restart failed:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddEnvVar = async (key: string, value: string) => {
    if (!id) return;

    try {
      await showToast.promise(envVarApi.create(id, { key, value }), {
        loading: `Adding ${key}...`,
        success: `${key} added successfully!`,
        error: `Failed to add ${key}`,
      });
      setShowEnvForm(false);
      await loadEnvVars();
      setShowRestartNotification(true);
    } catch (error) {
      console.error("Failed to add env var:", error);
    }
  };

  const handleDeleteEnvVar = async (key: string) => {
    if (!id) return;

    if (!confirm(`Are you sure you want to delete ${key}?`)) {
      return;
    }

    try {
      await showToast.promise(envVarApi.delete(id, key), {
        loading: `Deleting ${key}...`,
        success: `${key} deleted successfully!`,
        error: `Failed to delete ${key}`,
      });
      await loadEnvVars();
      setShowRestartNotification(true);
    } catch (error) {
      console.error("Failed to delete env var:", error);
    }
  };

  const handleRestartFromNotification = async () => {
    setShowRestartNotification(false);
    await handleRestart();
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-secondary-600 dark:text-secondary-400">
              Loading application...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="h-screen flex flex-col">
        <Header />
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline mb-4"
            >
              <ArrowLeft color="currentColor" size={20} />
              Back to Applications
            </Link>
            <div className="bg-white dark:bg-secondary-900 rounded-xl border dark:border-[0.4px] border-secondary-200 dark:border-secondary-700 p-8 text-center">
              <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-2">
                Application not found
              </h1>
              <p className="text-secondary-600 dark:text-secondary-400">
                The application you're looking for doesn't exist or has been
                deleted.
              </p>
            </div>
          </div>
        </div>
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

  return (
    <div className="h-screen flex flex-col">
      <Header />

      <div className="flex-1 overflow-y-auto">
        <div className="px-8 py-8 space-y-6">
          {/* Header */}
          <div>
            <Link
              to="/"
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
                  Application #{app.id}
                </p>
              </div>
              <div className="flex gap-2">
                {app.status === "running" ? (
                  <Button
                    variant="outline"
                    size="md"
                    className="flex items-center gap-2"
                    onClick={handleStop}
                    disabled={actionLoading === "stop"}
                  >
                    {actionLoading === "stop" ? (
                      <div className="w-4 h-4 border-2 border-warning-600/30 border-t-warning-600 rounded-full animate-spin" />
                    ) : (
                      <Stop size={18} color="currentColor" />
                    )}
                    Stop
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="md"
                    className="flex items-center gap-2"
                    onClick={handleStart}
                    disabled={actionLoading === "start"}
                  >
                    {actionLoading === "start" ? (
                      <div className="w-4 h-4 border-2 border-success-600/30 border-t-success-600 rounded-full animate-spin" />
                    ) : (
                      <Play size={18} color="currentColor" />
                    )}
                    Start
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="md"
                  className="flex items-center gap-2"
                  onClick={handleRestart}
                  disabled={actionLoading === "restart"}
                >
                  {actionLoading === "restart" ? (
                    <div className="w-4 h-4 border-2 border-primary-600/30 border-t-primary-600 rounded-full animate-spin" />
                  ) : (
                    <Refresh size={18} color="currentColor" />
                  )}
                  Restart
                </Button>
                <Button
                  variant="outline"
                  size="md"
                  className={`flex items-center gap-2 relative ${
                    errors.length > 0
                      ? "border-danger-600 dark:border-danger-400 text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/20"
                      : ""
                  }`}
                  onClick={() => setIsErrorDrawerOpen(true)}
                >
                  <Danger size={18} color="currentColor" />
                  Errors
                  {errors.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-danger-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {errors.length > 9 ? "9+" : errors.length}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Deployment Status */}
          {deploymentStatus && (
            <>
              {console.log(
                "Rendering DeploymentStatus component with:",
                deploymentStatus
              )}
              <DeploymentStatus status={deploymentStatus} />
            </>
          )}

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
                <Activity
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
                <Activity
                  size={20}
                  className="text-warning-500"
                  variant="Bold"
                  color="currentColor"
                />
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
                <Refresh
                  size={20}
                  className="text-danger-500"
                  variant="Bold"
                  color="currentColor"
                />
              </div>
              <p className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
                {app.restarts}
              </p>
            </div>
          </div>

          {/* Environment Variables */}
          <div className="bg-white dark:bg-secondary-900 rounded-xl border dark:border-[0.4px] border-secondary-200 dark:border-secondary-700 overflow-hidden">
            <div className="px-6 py-4 border-b dark:border-b-[0.4px] border-secondary-200 dark:border-secondary-700 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                Environment Variables
              </h2>
              <Button
                size="sm"
                className="flex items-center gap-2"
                onClick={() => setShowEnvForm(true)}
              >
                <Add color="currentColor" size={16} />
                Add Variable
              </Button>
            </div>

            {showEnvForm && (
              <div className="px-6 py-4 border-b dark:border-b-[0.4px] border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800">
                <EnvVarForm
                  onSubmit={handleAddEnvVar}
                  onCancel={() => setShowEnvForm(false)}
                />
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary-50 dark:bg-secondary-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">
                      Key
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {envVars.length > 0 ? (
                    envVars.map((envVar) => (
                      <EnvVarRow
                        key={envVar.key}
                        envVar={envVar}
                        onDelete={() => handleDeleteEnvVar(envVar.key)}
                      />
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-8 text-center text-secondary-500 dark:text-secondary-400"
                      >
                        No environment variables configured
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Database Management */}
          {id && <DatabaseManagement appId={id} />}

          {/* Live Logs Console */}
          <div className="bg-white dark:bg-secondary-900 rounded-xl border dark:border-[0.4px] border-secondary-200 dark:border-secondary-700 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b dark:border-[0.4px] border-secondary-200 dark:border-secondary-700">
              <div className="flex items-center gap-3">
                <DocumentText1
                  size={20}
                  className="text-primary-400"
                  variant="Bold"
                  color="currentColor"
                />
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
                  Live Logs
                </h3>
                <Badge className="bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-300 text-sm">
                  {appLogs.length} entries
                </Badge>
              </div>
              <button
                className="text-xs text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-200 transition-colors"
                onClick={() => setAppLogs([])}
              >
                Clear Console
              </button>
            </div>
            <div className="p-6">
              {appLogs.length > 0 ? (
                <div className="max-h-80 overflow-y-auto font-mono text-xs space-y-2">
                  {appLogs.map((log) => (
                    <LogEntryRow key={log.id} log={log} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-secondary-500 dark:text-secondary-400 py-8">
                  No logs yet
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Restart Notification */}
        {showRestartNotification && app && (
          <RestartNotification
            appName={app.name}
            onRestart={handleRestartFromNotification}
            onDismiss={() => setShowRestartNotification(false)}
          />
        )}

        {/* Error Drawer */}
        <ErrorDrawer
          isOpen={isErrorDrawerOpen}
          onClose={() => setIsErrorDrawerOpen(false)}
          errors={errors}
          appName={app?.name}
        />
      </div>
    </div>
  );
}
