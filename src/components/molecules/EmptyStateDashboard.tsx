import { Box } from "iconsax-react";

export default function EmptyStateDashboard() {
  return (
    <div className="bg-white dark:bg-secondary-900 rounded-xl border dark:border-[0.4px] border-secondary-200 dark:border-secondary-700 p-12 text-center">
      <Box
        color="currentColor"
        size={48}
        className="mx-auto text-secondary-300 dark:text-secondary-700 mb-4"
        variant="Bulk"
      />
      <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
        No applications yet
      </h3>
      <p className="text-secondary-600 dark:text-secondary-400 mb-6 max-w-md mx-auto">
        Get started by adding your first application. Choose a repository and
        the dashboard will discover your deployed app automatically.
      </p>
      <button className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors">
        Add Your First App
      </button>
    </div>
  );
}
