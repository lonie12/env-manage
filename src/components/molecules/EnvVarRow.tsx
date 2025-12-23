import { Eye, EyeSlash, Edit, Trash } from "iconsax-react";
import { useState } from "react";
import type { EnvironmentVariable } from "@/mocks/environment.mock";
import { Badge } from "@/components/atoms";

interface EnvVarRowProps {
  envVar: EnvironmentVariable;
}

export default function EnvVarRow({ envVar }: EnvVarRowProps) {
  const [showValue, setShowValue] = useState(false);

  return (
    <tr className="border-b dark:border-[0.4px] border-secondary-200 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="font-medium text-secondary-900 dark:text-secondary-100">
            {envVar.key}
          </span>
          {envVar.isSecret && (
            <Badge className="bg-warning-100 text-warning-700 dark:bg-warning-900 dark:text-warning-300 text-xs">
              Secret
            </Badge>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-secondary-600 dark:text-secondary-400">
            {envVar.isSecret && !showValue ? "••••••••••••" : envVar.value}
          </span>
          {envVar.isSecret && (
            <button
              onClick={() => setShowValue(!showValue)}
              className="p-1 hover:bg-secondary-100 dark:hover:bg-secondary-700 rounded transition-colors"
            >
              {showValue ? (
                <EyeSlash
                  size={16}
                  className="text-secondary-500"
                  variant="Bold"
                  color="currentColor"
                />
              ) : (
                <Eye
                  size={16}
                  className="text-secondary-500"
                  variant="Bold"
                  color="currentColor"
                />
              )}
            </button>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-secondary-600 dark:text-secondary-400">
          {envVar.app}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors group">
            <Edit
              size={16}
              className="text-primary-600 dark:text-primary-400"
              variant="Bold"
              color="currentColor"
            />
          </button>
          <button className="p-2 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-lg transition-colors group">
            <Trash
              size={16}
              className="text-danger-600 dark:text-danger-400"
              variant="Bold"
              color="currentColor"
            />
          </button>
        </div>
      </td>
    </tr>
  );
}
