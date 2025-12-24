import {
  ActionCard,
  AppCard,
  EmptyStateDashboard,
} from "@/components/molecules";
import { Box, Cpu, Setting3 } from "iconsax-react";
import { mockApps } from "@/mocks/apps.mock";
import { mockProcesses } from "@/mocks/processes.mock";
import { mockEnvVars } from "@/mocks/environment.mock";
import { useNavigate } from "react-router";

export default function Dashboard() {
  const navigate = useNavigate();
  const activeProcesses = mockProcesses.filter((p) => p.status === "online");
  const apps = mockApps; // Change to [] to see empty state

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
          Dashboard
        </h1>
        <p className="mt-2 text-secondary-600 dark:text-secondary-400">
          Manage and monitor your server applications
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ActionCard
          title="Applications"
          description="Deployed apps"
          icon={Box}
          iconVariant="Bold"
          primaryValue={apps.length}
          colorScheme="primary"
          onClick={() => navigate("/apps")}
        />
        <ActionCard
          title="Active Processes"
          description="PM2 processes running"
          icon={Cpu}
          iconVariant="Bold"
          primaryValue={activeProcesses.length}
          colorScheme="success"
          onClick={() => navigate("/processes")}
        />
        <ActionCard
          title="Environment Vars"
          description="Configured variables"
          icon={Setting3}
          iconVariant="Bold"
          primaryValue={mockEnvVars.length}
          colorScheme="warning"
          onClick={() => navigate("/environment")}
        />
        {/* <ActionCard
          title="Logs"
          description="Recent entries"
          icon={DocumentText1}
          iconVariant="Bold"
          primaryValue={mockLogs.length}
          colorScheme="warning"
          onClick={() => {}}
        /> */}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-secondary-900 rounded-xl border dark:border-[0.4px] border-secondary-200 dark:border-secondary-700 p-6">
        <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/apps")}
            className="flex items-center gap-3 p-4 rounded-lg border-2 border-dashed border-secondary-300 dark:border-secondary-700 hover:border-primary-400 dark:hover:border-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all group"
          >
            <Box
              color="currentColor"
              size={24}
              className="text-secondary-400 group-hover:text-primary-600 dark:group-hover:text-primary-400"
              variant="Bold"
            />
            <div className="text-left">
              <h3 className="font-semibold text-secondary-900 dark:text-secondary-100">
                Add Application
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Discover and add a new app
              </p>
            </div>
          </button>
          <button
            onClick={() => navigate("/processes")}
            className="flex items-center gap-3 p-4 rounded-lg border-2 border-dashed border-secondary-300 dark:border-secondary-700 hover:border-success-400 dark:hover:border-success-600 hover:bg-success-50 dark:hover:bg-success-900/10 transition-all group"
          >
            <Cpu
              color="currentColor"
              size={24}
              className="text-secondary-400 group-hover:text-success-600 dark:group-hover:text-success-400"
              variant="Bold"
            />
            <div className="text-left">
              <h3 className="font-semibold text-secondary-900 dark:text-secondary-100">
                View Processes
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Monitor PM2 processes
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Applications or Empty State */}
      {apps.length > 0 ? (
        <div className="bg-white dark:bg-secondary-900 rounded-xl border dark:border-[0.4px] border-secondary-200 dark:border-secondary-700 p-6">
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">
            Recent Applications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {apps.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        </div>
      ) : (
        <EmptyStateDashboard />
      )}
    </div>
  );
}
