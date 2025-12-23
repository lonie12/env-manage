import { DocumentText1 } from "iconsax-react";
import EmptyState from "@/components/atoms/EmptyState";

export default function EmptyStateLogs() {
  return (
    <EmptyState
      icon={DocumentText1}
      title="No logs available"
      description="Application logs will appear here once you have deployed apps."
    />
  );
}
