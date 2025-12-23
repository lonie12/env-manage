import { Cpu } from "iconsax-react";
import EmptyState from "@/components/atoms/EmptyState";

export default function EmptyStateProcesses() {
  return (
    <EmptyState
      icon={Cpu}
      title="No processes running"
      description="Your PM2 processes will appear here once you deploy an application."
    />
  );
}
