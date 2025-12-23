import { Add } from "iconsax-react";
import { Button } from "@/components/atoms";
import { EnvVarRow, EmptyStateEnvironment } from "@/components/molecules";
import { mockEnvVars } from "@/mocks/environment.mock";

export default function Environment() {
  const envVars = mockEnvVars; // Change to [] to see empty state

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
            Environment Variables
          </h1>
          <p className="mt-2 text-secondary-600 dark:text-secondary-400">
            Manage application environment configuration
          </p>
        </div>
        <Button size="lg" className="flex items-center gap-2">
          <Add color="currentColor" size={20} />
          Add Variable
        </Button>
      </div>

      {/* Environment Variables Table or Empty State */}
      {envVars.length > 0 ? (
        <div className="bg-white dark:bg-secondary-900 rounded-xl border dark:border-[0.4px] border-secondary-200 dark:border-secondary-700 overflow-hidden">
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
                    Application
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {envVars.map((envVar) => (
                  <EnvVarRow key={envVar.id} envVar={envVar} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyStateEnvironment />
      )}
    </div>
  );
}
