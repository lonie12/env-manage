import { Trash } from "iconsax-react";
import type { EnvVar } from "@/api";

interface EnvVarRowProps {
  envVar: EnvVar;
  onDelete: () => void;
}

export default function EnvVarRow({ envVar, onDelete }: EnvVarRowProps) {

  return (
    <tr className="border-b dark:border-[0.4px] border-secondary-200 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors">
      <td className="px-6 py-4">
        <span className="font-medium text-secondary-900 dark:text-secondary-100">
          {envVar.key}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="font-mono text-sm text-secondary-600 dark:text-secondary-400">
          {envVar.value}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onDelete}
            className="p-2 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-lg transition-colors group"
          >
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
