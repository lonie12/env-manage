import { Box, Activity, Calendar, Refresh, Trash, Play, Stop } from "iconsax-react";
import { useNavigate } from "react-router";
import type { AppDisplay } from "@/lib/formatters";

interface AppCardProps {
  app: AppDisplay;
  onRemove?: () => void;
  onStart?: () => void;
  onStop?: () => void;
  onRestart?: () => void;
}

export default function AppCard({ app, onRemove, onStart, onStop, onRestart }: AppCardProps) {
  const navigate = useNavigate();

  const statusColors = {
    running:
      "bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-300",
    stopped:
      "bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-300",
    error:
      "bg-danger-100 text-danger-700 dark:bg-danger-900 dark:text-danger-300",
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove?.();
  };

  const handleStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onStart?.();
  };

  const handleStop = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onStop?.();
  };

  const handleRestart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRestart?.();
  };

  return (
    <div
      onClick={() => navigate(`/apps/${app.id}`)}
      className="group bg-white dark:bg-secondary-900 rounded-xl border dark:border-[0.4px] border-secondary-200 dark:border-secondary-700 p-6 hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-700 transition-all cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-lg group-hover:bg-primary-200 dark:group-hover:bg-primary-900/30 transition-colors">
            <Box
              size={24}
              className="text-primary-600 dark:text-primary-400"
              variant="Bold"
              color="currentColor"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {app.name}
            </h3>
            <p className="text-sm text-secondary-500 dark:text-secondary-400">
              {app.repository}
            </p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            statusColors[app.status]
          }`}
        >
          {app.status}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Activity
            size={16}
            className="text-secondary-400"
            variant="Outline"
            color="currentColor"
          />
          <div>
            <p className="text-xs text-secondary-500 dark:text-secondary-400">
              CPU
            </p>
            <p className="text-sm font-semibold text-secondary-900 dark:text-secondary-100">
              {app.cpu}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Activity
            size={16}
            className="text-secondary-400"
            variant="Outline"
            color="currentColor"
          />
          <div>
            <p className="text-xs text-secondary-500 dark:text-secondary-400">
              Memory
            </p>
            <p className="text-sm font-semibold text-secondary-900 dark:text-secondary-100">
              {app.memory}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t dark:border-t-[0.4px] border-secondary-200 dark:border-secondary-700">
        <div className="flex items-center gap-2 text-xs text-secondary-500 dark:text-secondary-400">
          <Calendar size={14} variant="Outline" color="currentColor" />
          <span>Uptime: {app.uptime}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-secondary-500 dark:text-secondary-400">
          <Refresh size={14} variant="Outline" color="currentColor" />
          <span>{app.restarts} restarts</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-4">
        {app.status === 'running' ? (
          <button
            onClick={handleStop}
            className="flex-1 px-4 py-2 bg-warning-50 dark:bg-warning-900/20 text-warning-600 dark:text-warning-400 rounded-lg text-sm font-medium hover:bg-warning-100 dark:hover:bg-warning-900/30 transition-colors text-center flex items-center justify-center gap-2"
          >
            <Stop size={16} color="currentColor" />
            Stop
          </button>
        ) : (
          <button
            onClick={handleStart}
            className="flex-1 px-4 py-2 bg-success-50 dark:bg-success-900/20 text-success-600 dark:text-success-400 rounded-lg text-sm font-medium hover:bg-success-100 dark:hover:bg-success-900/30 transition-colors text-center flex items-center justify-center gap-2"
          >
            <Play size={16} color="currentColor" />
            Start
          </button>
        )}
        <button
          onClick={handleRestart}
          className="px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg text-sm font-medium hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors flex items-center gap-2"
        >
          <Refresh size={16} color="currentColor" />
        </button>
        <button
          onClick={handleRemove}
          className="px-4 py-2 bg-danger-50 dark:bg-danger-900/20 text-danger-600 dark:text-danger-400 rounded-lg text-sm font-medium hover:bg-danger-100 dark:hover:bg-danger-900/30 transition-colors flex items-center gap-2"
        >
          <Trash size={16} color="currentColor" />
        </button>
      </div>
    </div>
  );
}
