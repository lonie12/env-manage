import { ProcessRow, EmptyStateProcesses } from "@/components/molecules";
import { mockProcesses } from "@/mocks/processes.mock";

export default function Processes() {
  const processes = mockProcesses; // Change to [] to see empty state

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
          Process Manager
        </h1>
        <p className="mt-2 text-secondary-600 dark:text-secondary-400">
          Monitor and control PM2 processes
        </p>
      </div>

      {/* Processes Table or Empty State */}
      {processes.length > 0 ? (
        <div className="bg-white dark:bg-secondary-900 rounded-xl border dark:border-[0.4px] border-secondary-200 dark:border-secondary-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50 dark:bg-secondary-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">
                    PID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">
                    Uptime
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">
                    Restarts
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">
                    CPU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">
                    Memory
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {processes.map((process) => (
                  <ProcessRow key={process.id} process={process} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyStateProcesses />
      )}
    </div>
  );
}
