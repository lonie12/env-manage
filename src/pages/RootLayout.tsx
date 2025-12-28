import { Outlet } from "react-router";

export default function RootLayout() {
  return (
    <div className="h-full bg-secondary-50 dark:bg-secondary-950">
      <Outlet />
    </div>
  );
}
