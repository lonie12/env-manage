import { useNavigate } from "react-router";
import { Add, Moon, Sun1, Logout } from "iconsax-react";
import { useTheme, useAuth } from "@/context";
import { Button } from "@/components/atoms";

interface HeaderProps {
  onAddApp?: () => void;
}

export default function Header({ onAddApp }: HeaderProps) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-secondary-900 border-b dark:border-b-[0.4px] border-secondary-200 dark:border-secondary-700">
      <div className="px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
          Server Manager
        </h1>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden md:block text-right mr-4">
              <p className="text-sm font-semibold text-secondary-900 dark:text-secondary-100">
                {user.username}
              </p>
              <p className="text-xs text-secondary-500 dark:text-secondary-400 capitalize">
                {user.role}
              </p>
            </div>
          )}

          {onAddApp && (
            <Button
              size="md"
              className="flex items-center gap-2"
              onClick={onAddApp}
            >
              <Add color="currentColor" size={20} />
              Add Application
            </Button>
          )}

          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-all"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon color="currentColor" size={20} variant="Outline" />
            ) : (
              <Sun1 color="currentColor" size={20} variant="Outline" />
            )}
          </button>

          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-all"
            aria-label="Sign out"
          >
            <Logout color="currentColor" size={20} variant="Outline" />
          </button>
        </div>
      </div>
    </header>
  );
}
