import { Box, Add } from "iconsax-react";
import { Button } from "@/components/atoms";

export default function EmptyStateApps() {
  return (
    <div className="bg-white dark:bg-secondary-900 rounded-xl border dark:border-[0.4px] border-secondary-200 dark:border-secondary-700 p-12 text-center">
      <Box
        color="currentColor"
        size={64}
        className="mx-auto text-secondary-300 dark:text-secondary-700 mb-4"
        variant="Bulk"
      />
      <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-2">
        No applications found
      </h3>
      <p className="text-secondary-600 dark:text-secondary-400 mb-8 max-w-md mx-auto">
        Add your first application to start monitoring and managing your server
        deployments.
      </p>
      <Button size="lg" className="flex items-center gap-2 mx-auto">
        <Add color="currentColor" size={20} />
        Add Your First Application
      </Button>
    </div>
  );
}
