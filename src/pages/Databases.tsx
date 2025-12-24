import { useState } from "react";
import { Add, Data, TickCircle, CloseCircle, Edit, Trash } from "iconsax-react";
import { Button, Badge } from "@/components/atoms";
import { AddDatabaseModal, ConfigureDatabaseModal } from "@/components/molecules";
import { mockDatabases } from "@/mocks/databases.mock";
import type { Database } from "@/mocks/databases.mock";

export default function Databases() {
  const [databases, setDatabases] = useState<Database[]>(mockDatabases);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDatabase, setEditingDatabase] = useState<Database | null>(null);

  const handleAddDatabase = (name: string, type: Database["type"], host: string, port: number, maxConnections: number) => {
    const newDatabase: Database = {
      id: crypto.randomUUID(),
      name,
      type,
      status: "offline",
      host,
      port,
      size: "0 MB",
      connections: 0,
      maxConnections,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setDatabases([...databases, newDatabase]);
    setShowAddModal(false);
  };

  const handleUpdateDatabase = (id: string, maxConnections: number, status: Database["status"]) => {
    setDatabases(
      databases.map((d) =>
        d.id === id ? { ...d, maxConnections, status } : d
      )
    );
    setEditingDatabase(null);
  };

  const handleConfigure = (database: Database) => {
    setEditingDatabase(database);
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

  const handleRemove = (id: string) => {
    if (confirm("Are you sure you want to remove this database?")) {
      setDatabases(databases.filter((d) => d.id !== id));
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
            Databases
          </h1>
          <p className="mt-2 text-secondary-600 dark:text-secondary-400">
            Manage your database instances and connections
          </p>
        </div>
        <Button
          size="lg"
          className="flex items-center gap-2"
          onClick={() => setShowAddModal(true)}
        >
          <Add color="currentColor" size={20} />
          Add Database
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-secondary-900 rounded-xl border dark:border-[0.4px] border-secondary-200 dark:border-secondary-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-secondary-600 dark:text-secondary-400">
              Total Databases
            </span>
            <Data size={20} className="text-primary-500" variant="Bold" color="currentColor" />
          </div>
          <p className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
            {databases.length}
          </p>
        </div>
        <div className="bg-white dark:bg-secondary-900 rounded-xl border dark:border-[0.4px] border-secondary-200 dark:border-secondary-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-secondary-600 dark:text-secondary-400">
              Online
            </span>
            <TickCircle size={20} className="text-success-500" variant="Bold" color="currentColor" />
          </div>
          <p className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
            {databases.filter((d) => d.status === "online").length}
          </p>
        </div>
        <div className="bg-white dark:bg-secondary-900 rounded-xl border dark:border-[0.4px] border-secondary-200 dark:border-secondary-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-secondary-600 dark:text-secondary-400">
              Total Size
            </span>
            <Data size={20} className="text-warning-500" variant="Bold" color="currentColor" />
          </div>
          <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
            9.5 GB
          </p>
        </div>
        <div className="bg-white dark:bg-secondary-900 rounded-xl border dark:border-[0.4px] border-secondary-200 dark:border-secondary-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-secondary-600 dark:text-secondary-400">
              Active Connections
            </span>
            <TickCircle size={20} className="text-success-500" variant="Bold" color="currentColor" />
          </div>
          <p className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
            {databases.reduce((acc, db) => acc + db.connections, 0)}
          </p>
        </div>
      </div>

      {/* Databases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {databases.map((db) => (
          <div
            key={db.id}
            className="bg-white dark:bg-secondary-900 rounded-xl border dark:border-[0.4px] border-secondary-200 dark:border-secondary-700 p-6 hover:shadow-lg transition-all"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                  <Data size={24} className="text-primary-600 dark:text-primary-400" variant="Bold" color="currentColor" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
                    {db.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={typeColors[db.type]}>
                      {db.type.toUpperCase()}
                    </Badge>
                    <Badge className={statusColors[db.status]}>
                      {db.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b dark:border-b-[0.4px] border-secondary-200 dark:border-secondary-700">
              <div>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">Host</p>
                <p className="text-sm font-mono font-semibold text-secondary-900 dark:text-secondary-100">
                  {db.host}:{db.port}
                </p>
              </div>
              <div>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">Size</p>
                <p className="text-sm font-semibold text-secondary-900 dark:text-secondary-100">
                  {db.size}
                </p>
              </div>
              <div>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">Connections</p>
                <p className="text-sm font-semibold text-secondary-900 dark:text-secondary-100">
                  {db.connections} / {db.maxConnections}
                </p>
              </div>
              <div>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">Created</p>
                <p className="text-sm font-semibold text-secondary-900 dark:text-secondary-100">
                  {db.createdAt}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => handleConfigure(db)}
                className="flex-1 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-lg text-sm font-medium hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors flex items-center justify-center gap-2"
              >
                <Edit size={16} color="currentColor" />
                Configure
              </button>
              <button
                onClick={() => handleRemove(db.id)}
                className="px-4 py-2 bg-danger-50 dark:bg-danger-900/20 text-danger-600 dark:text-danger-400 rounded-lg text-sm font-medium hover:bg-danger-100 dark:hover:bg-danger-900/30 transition-colors flex items-center gap-2"
              >
                <Trash size={16} color="currentColor" />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Database Modal */}
      {showAddModal && (
        <AddDatabaseModal
          onSubmit={handleAddDatabase}
          onCancel={() => setShowAddModal(false)}
        />
      )}

      {/* Configure Database Modal */}
      {editingDatabase && (
        <ConfigureDatabaseModal
          database={editingDatabase}
          onSubmit={handleUpdateDatabase}
          onCancel={() => setEditingDatabase(null)}
        />
      )}
    </div>
  );
}
