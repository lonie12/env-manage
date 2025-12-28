import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Header } from "@/components/organisms";
import {
  AppCard,
  EmptyStateApps,
  AddApplicationModal,
} from "@/components/molecules";
import {
  applicationApi,
  type DeployApplicationData,
} from "@/api";
import { apiAppToDisplay, type AppDisplay } from "@/lib/formatters";
import { showToast } from "@/lib/toast";

export default function Apps() {
  const navigate = useNavigate();
  const [apps, setApps] = useState<AppDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddAppModal, setShowAddAppModal] = useState(false);

  // Load applications from API
  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const response = await applicationApi.list();
      setApps(response.applications.map(apiAppToDisplay));
    } catch (err) {
      console.error("Failed to load applications:", err);
      showToast.error("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const handleAddApp = async (formData: DeployApplicationData) => {
    setShowAddAppModal(false);

    // Start deployment and navigate immediately
    try {
      // Fire deployment request (we'll navigate before it finishes)
      applicationApi.deploy(formData).catch((err) => {
        console.error("Deployment error:", err);
      });

      // Poll for the app to appear in PM2 (max 10 seconds)
      let attempts = 0;
      const maxAttempts = 20; // 20 attempts * 500ms = 10 seconds
      let newApp = null;

      while (attempts < maxAttempts && !newApp) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        const updatedApps = await applicationApi.list();
        newApp = updatedApps.applications.find(
          (app) => app.name === formData.name
        );
        attempts++;
      }

      if (newApp) {
        await loadApplications();
        navigate(`/apps/${newApp.id}`);
      } else {
        showToast.error("Deployment is taking longer than expected. Please check the apps list.");
        await loadApplications();
      }
    } catch (navError) {
      console.error("Failed to navigate to app details:", navError);
      showToast.error("Failed to open application details");
    }
  };

  const handleRemoveApp = async (id: string) => {
    const app = apps.find((a) => a.id === id);
    if (!confirm("Are you sure you want to remove this application?")) {
      return;
    }

    try {
      await showToast.promise(applicationApi.delete(id), {
        loading: `Deleting ${app?.name || "application"}...`,
        success: `${app?.name || "Application"} deleted successfully!`,
        error: `Failed to delete ${app?.name || "application"}`,
      });
      await loadApplications();
    } catch (err) {
      console.error("Failed to remove application:", err);
    }
  };

  const handleStartApp = async (id: string) => {
    const app = apps.find((a) => a.id === id);
    try {
      await showToast.promise(applicationApi.start(id), {
        loading: `Starting ${app?.name || "application"}...`,
        success: `${app?.name || "Application"} started successfully!`,
        error: `Failed to start ${app?.name || "application"}`,
      });
      await loadApplications();
    } catch (err) {
      console.error("Failed to start application:", err);
    }
  };

  const handleStopApp = async (id: string) => {
    const app = apps.find((a) => a.id === id);
    try {
      await showToast.promise(applicationApi.stop(id), {
        loading: `Stopping ${app?.name || "application"}...`,
        success: `${app?.name || "Application"} stopped successfully!`,
        error: `Failed to stop ${app?.name || "application"}`,
      });
      await loadApplications();
    } catch (err) {
      console.error("Failed to stop application:", err);
    }
  };

  const handleRestartApp = async (id: string) => {
    const app = apps.find((a) => a.id === id);
    try {
      await showToast.promise(applicationApi.restart(id), {
        loading: `Restarting ${app?.name || "application"}...`,
        success: `${app?.name || "Application"} restarted successfully!`,
        error: `Failed to restart ${app?.name || "application"}`,
      });
      await loadApplications();
    } catch (err) {
      console.error("Failed to restart application:", err);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Header onAddApp={() => setShowAddAppModal(true)} />

      <div className="flex-1 overflow-y-auto">
        <div className="px-8 py-8">
          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-secondary-500 dark:text-secondary-400">
                  Loading applications...
                </p>
              </div>
            </div>
          ) : apps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {apps.map((app) => (
                <AppCard
                  key={app.id}
                  app={app}
                  onRemove={() => handleRemoveApp(app.id)}
                  onStart={() => handleStartApp(app.id)}
                  onStop={() => handleStopApp(app.id)}
                  onRestart={() => handleRestartApp(app.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyStateApps />
          )}
        </div>
      </div>

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
