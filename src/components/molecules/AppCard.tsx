import { Box, Activity, Calendar, Refresh, Trash } from "iconsax-react";
import { Link, useNavigate } from "react-router";
import type { Application } from "@/mocks/apps.mock";

interface AppCardProps {
  app: Application;
}

export default function AppCard({ app }: AppCardProps) {
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
    console.log("Removing app:", app.name);
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

      {/* Stats */}
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
          <Box
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

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <Link
          to={`/apps/${app.id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex-1 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg text-sm font-medium hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors text-center"
        >
          Manage
        </Link>
        <button
          onClick={handleRemove}
          className="px-4 py-2 bg-danger-50 dark:bg-danger-900/20 text-danger-600 dark:text-danger-400 rounded-lg text-sm font-medium hover:bg-danger-100 dark:hover:bg-danger-900/30 transition-colors flex items-center gap-2"
        >
          <Trash size={16} color="currentColor" />
          Remove
        </button>
      </div>
    </div>
  );
}
