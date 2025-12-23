import { Outlet } from "react-router";
import { Sidebar } from "@/components/organisms";

export default function RootLayout() {
  return (
    <div className="flex h-full bg-secondary-50 dark:bg-secondary-950">
      <Sidebar />
      <main className="flex-1 ml-64 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
