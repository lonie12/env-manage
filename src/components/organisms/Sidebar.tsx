import { Link, useLocation } from "react-router";
import {
  Home2,
  Box,
  Cpu,
  Setting3,
  DocumentText1,
  Moon,
  Sun1,
} from "iconsax-react";
import { useTheme } from "@/context";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  path: string;
  icon: typeof Home2;
}

const navItems: NavItem[] = [
  { name: "Dashboard", path: "/", icon: Home2 },
  { name: "Applications", path: "/apps", icon: Box },
  { name: "Processes", path: "/processes", icon: Cpu },
  { name: "Environment", path: "/environment", icon: Setting3 },
  { name: "Logs", path: "/logs", icon: DocumentText1 },
];

export default function Sidebar() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-secondary-900 border-r dark:border-[0.4px] border-secondary-200 dark:border-secondary-700 flex flex-col">
      {/* Header */}
      <div className="h-16 flex items-center px-6 border-b dark:border-[0.4px] border-secondary-200 dark:border-secondary-700">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
          Server Manager
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all group",
                isActive
                  ? "bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400"
                  : "text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-800"
              )}
            >
              <Icon
                size={20}
                variant={isActive ? "Bold" : "Outline"}
                color="currentColor"
                className={cn(
                  "transition-transform group-hover:scale-110",
                  isActive
                    ? "text-primary-600 dark:text-primary-400"
                    : "text-secondary-500 dark:text-secondary-400"
                )}
              />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t dark:border-[0.4px] border-secondary-200 dark:border-secondary-700">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-secondary-600 dark:text-secondary-400 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-all"
        >
          {theme === "light" ? (
            <Moon color="currentColor" size={20} variant="Outline" />
          ) : (
            <Sun1 color="currentColor" size={20} variant="Outline" />
          )}
          <span className="font-medium">
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </span>
        </button>
      </div>
    </aside>
  );
}
