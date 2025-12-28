import { Box, TickCircle, CloseCircle, InfoCircle } from "iconsax-react";
import type { DatabaseInfo } from "@/api";

interface DatabaseStatusCardProps {
  database: DatabaseInfo;
}

export default function DatabaseStatusCard({
  database,
}: DatabaseStatusCardProps) {
  if (!database.hasDatabase || !database.hasDrizzle) {
    return (
      <div className="bg-secondary-100 dark:bg-secondary-800 rounded-lg p-4 border border-secondary-200 dark:border-secondary-700">
        <div className="flex items-center gap-3">
          <Box color="currentColor" size={20} className="text-secondary-400" />
          <div>
            <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
              No Database Detected
            </p>
            <p className="text-xs text-secondary-500 dark:text-secondary-400">
              This application doesn't use Drizzle ORM
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusIcon = () => {
    if (database.connected) {
      return (
        <TickCircle
          color="currentColor"
          size={20}
          className="text-green-500"
          variant="Bold"
        />
      );
    }
    return (
      <CloseCircle
        color="currentColor"
        size={20}
        className="text-red-500"
        variant="Bold"
      />
    );
  };

  const getStatusText = () => {
    if (database.connected) {
      return "Connected";
    }
    return "Not Connected";
  };

  const getDbTypeLabel = () => {
    switch (database.dbType) {
      case "postgresql":
        return "PostgreSQL";
      case "mysql":
        return "MySQL";
      case "sqlite":
        return "SQLite";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="bg-white dark:bg-secondary-900 rounded-lg p-4 border border-secondary-200 dark:border-secondary-700">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Box
            color="currentColor"
            size={20}
            className="text-primary-600 dark:text-primary-400"
            variant="Bold"
          />
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                {getDbTypeLabel()} Database
              </p>
              {getStatusIcon()}
              <span
                className={`text-xs font-medium ${
                  database.connected
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {getStatusText()}
              </span>
            </div>
            {database.databaseUrl && (
              <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1 font-mono">
                {database.databaseUrl}
              </p>
            )}
            {database.configPath && (
              <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                Config: {database.configPath}
              </p>
            )}
          </div>
        </div>

        {!database.connected && (
          <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
            <InfoCircle color="currentColor" size={16} />
            <span>Check DATABASE_URL</span>
          </div>
        )}
      </div>
    </div>
  );
}
