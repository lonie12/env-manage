import { Setting3 } from "iconsax-react";
import EmptyState from "@/components/atoms/EmptyState";

export default function EmptyStateEnvironment() {
  return (
    <EmptyState
      icon={Setting3}
      title="No environment variables"
      description="Add environment variables to configure your applications."
    />
  );
}
