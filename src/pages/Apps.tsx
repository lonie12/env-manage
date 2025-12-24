import { useState } from "react";
import { Add } from "iconsax-react";
import { Button } from "@/components/atoms";
import { AppCard, EmptyStateApps, AddApplicationModal } from "@/components/molecules";
import { mockApps } from "@/mocks/apps.mock";
import type { Application } from "@/mocks/apps.mock";

export default function Apps() {
  const [apps, setApps] = useState(mockApps);
  const [showAddAppModal, setShowAddAppModal] = useState(false);

  const handleAddApp = (formData: Omit<Application, 'id' | 'uptime' | 'memory' | 'cpu' | 'restarts' | 'lastDeployed'>) => {
    // Generate new application with auto-generated fields
    const newApp: Application = {
      ...formData,
      id: crypto.randomUUID(),
      uptime: "0m",
      memory: "0 MB",
      cpu: "0%",
      restarts: 0,
      lastDeployed: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    setApps([...apps, newApp]);
    setShowAddAppModal(false);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
            Applications
          </h1>
          <p className="mt-2 text-secondary-600 dark:text-secondary-400">
            Manage your deployed applications
          </p>
        </div>
        <Button
          size="lg"
          className="flex items-center gap-2"
          onClick={() => setShowAddAppModal(true)}
        >
          <Add color="currentColor" size={20} />
          Add Application
        </Button>
      </div>

      {/* Apps Grid or Empty State */}
      {apps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      ) : (
        <EmptyStateApps />
      )}

      {/* Add Application Modal */}
      {showAddAppModal && (
        <AddApplicationModal
          onSubmit={handleAddApp}
          onCancel={() => setShowAddAppModal(false)}
        />
      )}
    </div>
  );
}
