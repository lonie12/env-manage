import type { Icon } from "iconsax-react";
import Button from "./Button";

interface EmptyStateProps {
  icon: Icon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  iconSize?: number;
}

export default function EmptyState({
  icon: IconComponent,
  title,
  description,
  actionLabel,
  onAction,
  iconSize = 64,
}: EmptyStateProps) {
  return (
    <div className="bg-white dark:bg-secondary-900 rounded-xl border dark:border-[0.4px] border-secondary-200 dark:border-secondary-700 p-12 text-center">
      <IconComponent
        color="currentColor"
        size={iconSize}
        className="mx-auto text-secondary-300 dark:text-secondary-700 mb-4"
        variant="Bulk"
      />
      <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
        {title}
      </h3>
      <p className="text-secondary-600 dark:text-secondary-400 mb-8 max-w-md mx-auto">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button size="lg" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
