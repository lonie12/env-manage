import { useState } from "react";
import { Lock, User } from "iconsax-react";
import { Button } from "@/components/atoms";
import { useAuth } from "@/context";
import { useNavigate } from "react-router";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(username, password);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 dark:bg-secondary-950 p-4">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white dark:bg-secondary-900 rounded-2xl shadow-xl border dark:border-[0.4px] border-secondary-200 dark:border-secondary-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800 text-danger-700 dark:text-danger-300 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Username Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User
                    color="currentColor"
                    size={20}
                    className="text-secondary-400"
                    variant="Outline"
                  />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  className="w-full pl-10 pr-4 py-3 border dark:border-[0.4px] border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder:text-secondary-400 transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock
                    color="currentColor"
                    size={20}
                    className="text-secondary-400"
                    variant="Outline"
                  />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-4 py-3 border dark:border-[0.4px] border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent placeholder:text-secondary-400 transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          {/* Footer Info */}
          <div className="mt-6 pt-6 border-t dark:border-t-[0.4px] border-secondary-200 dark:border-secondary-700">
            <p className="text-center text-sm text-secondary-500 dark:text-secondary-400">
              Default credentials:{" "}
              <span className="font-mono font-semibold text-secondary-700 dark:text-secondary-300">
                admin / admin123
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
