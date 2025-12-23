import { Play, Stop, Refresh, Eye } from "iconsax-react";
import type { Process } from "@/mocks/processes.mock";

interface ProcessRowProps {
  process: Process;
}

export default function ProcessRow({ process }: ProcessRowProps) {
  const statusColors = {
    online: "bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-300",
    stopped: "bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-300",
    errored: "bg-danger-100 text-danger-700 dark:bg-danger-900 dark:text-danger-300",
  };

  return (
    <tr className="border-b dark:border-[0.4px] border-secondary-200 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-success-500 animate-pulse" />
          <span className="font-medium text-secondary-900 dark:text-secondary-100">
            {process.name}
          </span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-secondary-600 dark:text-secondary-400">
          {process.pid || "-"}
        </span>
      </td>
      <td className="px-6 py-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[process.status]}`}
        >
          {process.status}
        </span>
      </td>
      <td className="px-6 py-4 text-secondary-600 dark:text-secondary-400">
        {process.uptime}
      </td>
      <td className="px-6 py-4 text-secondary-600 dark:text-secondary-400">
        {process.restarts}
      </td>
      <td className="px-6 py-4 text-secondary-600 dark:text-secondary-400">
        {process.cpu}
      </td>
      <td className="px-6 py-4 text-secondary-600 dark:text-secondary-400">
        {process.memory}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-success-50 dark:hover:bg-success-900/20 rounded-lg transition-colors group">
            <Play
              size={16}
              className="text-success-600 dark:text-success-400"
              variant="Bold"
              color="currentColor"
            />
          </button>
          <button className="p-2 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-lg transition-colors group">
            <Stop
              size={16}
              className="text-danger-600 dark:text-danger-400"
              variant="Bold"
              color="currentColor"
            />
          </button>
          <button className="p-2 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors group">
            <Refresh
              size={16}
              className="text-primary-600 dark:text-primary-400"
              variant="Bold"
              color="currentColor"
            />
          </button>
          <button className="p-2 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded-lg transition-colors group">
            <Eye
              size={16}
              className="text-secondary-600 dark:text-secondary-400"
              variant="Bold"
              color="currentColor"
            />
          </button>
        </div>
      </td>
    </tr>
  );
}
