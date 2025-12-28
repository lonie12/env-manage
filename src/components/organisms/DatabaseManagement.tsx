import { useState, useEffect } from "react";
import { Refresh, Play, DocumentCode } from "iconsax-react";
import { DatabaseStatusCard, MigrationRow } from "@/components/molecules";
import { databaseApi, type DatabaseInfo, type Migration } from "@/api";
import { showToast } from "@/lib/toast";

interface DatabaseManagementProps {
  appId: string;
}

export default function DatabaseManagement({ appId }: DatabaseManagementProps) {
  const [database, setDatabase] = useState<DatabaseInfo | null>(null);
  const [migrations, setMigrations] = useState<Migration[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadDatabaseInfo();
  }, [appId]);

  const loadDatabaseInfo = async () => {
    try {
      setLoading(true);
      const [statusRes, migrationsRes] = await Promise.all([
        databaseApi.getStatus(appId),
        databaseApi.listMigrations(appId),
      ]);

      if (statusRes.success) {
        setDatabase(statusRes.database);
      }

      if (migrationsRes.success) {
        setMigrations(migrationsRes.migrations);
      }
    } catch (error) {
      console.error("Failed to load database info:", error);
      showToast.error("Failed to load database information");
    } finally {
      setLoading(false);
    }
  };

  const handleSyncDatabase = async () => {
    if (!database?.connected) {
      showToast.error("Database not connected. Check your DATABASE_URL.");
      return;
    }

    try {
      setActionLoading("push");
      const result = await databaseApi.syncDatabase(appId);

      if (result.success) {
        showToast.success(result.message);
        await loadDatabaseInfo();
      }
    } catch (error) {
      console.error("Failed to sync database:", error);
      showToast.error(
        error instanceof Error ? error.message : "Failed to sync database"
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleGenerateMigration = async () => {
    try {
      setActionLoading("generate");
      const result = await databaseApi.generateMigration(appId);

      if (result.success) {
        showToast.success(result.message);
        await loadDatabaseInfo();
      }
    } catch (error) {
      console.error("Failed to generate migration:", error);
      showToast.error(
        error instanceof Error ? error.message : "Failed to generate migration"
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleRunMigrations = async () => {
    if (!database?.connected) {
      showToast.error("Database not connected. Check your DATABASE_URL.");
      return;
    }

    try {
      setActionLoading("migrate");
      const result = await databaseApi.runMigrations(appId);

      if (result.success) {
        showToast.success(result.message);
        await loadDatabaseInfo();
      }
    } catch (error) {
      console.error("Failed to run migrations:", error);
      showToast.error(
        error instanceof Error ? error.message : "Failed to run migrations"
      );
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-secondary-900 rounded-lg p-6 border border-secondary-200 dark:border-secondary-700">
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!database?.hasDatabase || !database?.hasDrizzle) {
    return (
      <div className="bg-white dark:bg-secondary-900 rounded-lg p-6 border border-secondary-200 dark:border-secondary-700">
        <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
          Database Management
        </h2>
        <DatabaseStatusCard
          database={
            database || {
              hasDatabase: false,
              dbType: null,
              connected: false,
              hasDrizzle: false,
            }
          }
        />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-secondary-900 rounded-lg p-6 border border-secondary-200 dark:border-secondary-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
          Database Management
        </h2>
        <button
          onClick={loadDatabaseInfo}
          className="p-2 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-lg transition-colors"
          title="Refresh"
        >
          <Refresh color="currentColor" size={16} />
        </button>
      </div>

      {/* Database Status */}
      <DatabaseStatusCard database={database} />

      {/* Actions */}
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={handleSyncDatabase}
          disabled={!database.connected || actionLoading !== null}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-secondary-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium"
        >
          {actionLoading === "push" ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <Refresh size={16} />
          )}
          Sync Database
        </button>

        <button
          onClick={handleGenerateMigration}
          disabled={actionLoading !== null}
          className="flex items-center gap-2 px-4 py-2 bg-secondary-600 hover:bg-secondary-700 disabled:bg-secondary-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium"
        >
          {actionLoading === "generate" ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <DocumentCode color="currentColor" size={16} variant="Bold" />
          )}
          Generate Migration
        </button>

        <button
          onClick={handleRunMigrations}
          disabled={!database.connected || actionLoading !== null}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-secondary-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium"
        >
          {actionLoading === "migrate" ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <Play color="currentColor" size={16} variant="Bold" />
          )}
          Run Migrations
        </button>
      </div>

      {/* Migrations List */}
      {migrations.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 mb-3">
            Migrations ({migrations.length})
          </h3>
          <div className="space-y-2">
            {migrations.map((migration) => (
              <MigrationRow key={migration.id} migration={migration} />
            ))}
          </div>
        </div>
      )}

      {migrations.length === 0 && (
        <div className="mt-6 p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700">
          <p className="text-sm text-secondary-600 dark:text-secondary-400 text-center">
            No migrations found. Generate your first migration to get started.
          </p>
        </div>
      )}
    </div>
  );
}
