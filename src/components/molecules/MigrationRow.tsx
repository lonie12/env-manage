import { DocumentText1, Calendar } from "iconsax-react";
import type { Migration } from "@/api";

interface MigrationRowProps {
  migration: Migration;
}

export default function MigrationRow({ migration }: MigrationRowProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="flex items-center justify-between p-3 bg-secondary-50 dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors">
      <div className="flex items-center gap-3 flex-1">
        <DocumentText1
          color="currentColor"
          size={16}
          className="text-primary-600 dark:text-primary-400 shrink-0"
          variant="Bold"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100 truncate">
            {migration.name}
          </p>
          <p className="text-xs text-secondary-500 dark:text-secondary-400 font-mono">
            {migration.filePath}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-secondary-500 dark:text-secondary-400 shrink-0 ml-4">
        <Calendar color="currentColor" size={14} />
        <span>{formatDate(migration.createdAt)}</span>
      </div>
    </div>
  );
}
