import { useState, useEffect } from "react";
import { TickCircle, CloseCircle, Data } from "iconsax-react";
import { Input, Button, Badge } from "@/components/atoms";
import type { Database } from "@/mocks/databases.mock";

interface ConfigureDatabaseModalProps {
  database: Database;
  onSubmit: (id: string, maxConnections: number, status: Database["status"]) => void;
  onCancel: () => void;
}

export default function ConfigureDatabaseModal({
  database,
  onSubmit,
  onCancel,
}: ConfigureDatabaseModalProps) {
  const [maxConnections, setMaxConnections] = useState(database.maxConnections.toString());
  const [status, setStatus] = useState(database.status);

  const [errors, setErrors] = useState({
    maxConnections: "",
  });

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onCancel]);

  const validateForm = (): boolean => {
    const newErrors = {
      maxConnections: "",
    };

    const maxConn = parseInt(maxConnections);
    if (!maxConnections || isNaN(maxConn) || maxConn < 1) {
      newErrors.maxConnections = "Max connections must be at least 1";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(database.id, parseInt(maxConnections), status);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const statusColors = {
    online: "bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-300",
    offline: "bg-danger-100 text-danger-700 dark:bg-danger-900 dark:text-danger-300",
    maintenance: "bg-warning-100 text-warning-700 dark:bg-warning-900 dark:text-warning-300",
  };

  const typeColors = {
    postgresql: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    mysql: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    mongodb: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    redis: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-secondary-900 rounded-xl shadow-xl max-w-lg w-full border dark:border-[0.4px] border-secondary-200 dark:border-secondary-700">
        <div className="px-6 py-5 border-b dark:border-b-[0.4px] border-secondary-200 dark:border-secondary-700">
          <h2 className="text-xl font-bold text-secondary-900 dark:text-secondary-100">
            Configure Database
          </h2>
          <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
            Update database settings and status
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            {/* Database Info - Read Only */}
            <div className="bg-secondary-50 dark:bg-secondary-800/50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Data size={24} className="text-primary-500" variant="Bold" color="currentColor" />
                <div>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">Database Name</p>
                  <p className="font-semibold text-secondary-900 dark:text-secondary-100">
                    {database.name}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-secondary-600 dark:text-secondary-400">Type</p>
                  <Badge className={`${typeColors[database.type]} mt-1`}>
                    {database.type.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-secondary-600 dark:text-secondary-400">Host:Port</p>
                  <p className="text-sm font-mono font-medium text-secondary-900 dark:text-secondary-100 mt-1">
                    {database.host}:{database.port}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-secondary-600 dark:text-secondary-400">Size</p>
                  <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100 mt-1">
                    {database.size}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-secondary-600 dark:text-secondary-400">Connections</p>
                  <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100 mt-1">
                    {database.connections} active
                  </p>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="w-full">
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Database["status"])}
                className="flex w-full h-10 border dark:border-[0.4px] border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 px-3 py-2 text-sm rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="maintenance">Maintenance</option>
              </select>
              <div className="mt-2">
                <Badge className={statusColors[status]}>
                  Current: {status}
                </Badge>
              </div>
            </div>

            {/* Max Connections */}
            <Input
              label="Max Connections"
              type="number"
              placeholder="100"
              value={maxConnections}
              onChange={(e) => setMaxConnections(e.target.value)}
              error={errors.maxConnections}
              min={1}
              required
            />

            {/* Connection Info */}
            <div className="border dark:border-[0.4px] border-secondary-200 dark:border-secondary-700 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                    Connection Usage
                  </p>
                  <p className="text-xs text-secondary-600 dark:text-secondary-400 mt-1">
                    {database.connections} / {database.maxConnections} connections
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {Math.round((database.connections / database.maxConnections) * 100)}%
                  </p>
                  <p className="text-xs text-secondary-500">Usage</p>
                </div>
              </div>
              <div className="mt-3 bg-secondary-200 dark:bg-secondary-700 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full transition-all"
                  style={{
                    width: `${Math.min((database.connections / database.maxConnections) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t dark:border-t-[0.4px] border-secondary-200 dark:border-secondary-700">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <TickCircle size={18} color="currentColor" />
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
