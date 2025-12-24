import { useState, useEffect } from "react";
import { InfoCircle } from "iconsax-react";
import { Input, Button } from "@/components/atoms";
import type { Application } from "@/mocks/apps.mock";

interface AddApplicationModalProps {
  onSubmit: (
    app: Omit<
      Application,
      "id" | "uptime" | "memory" | "cpu" | "restarts" | "lastDeployed"
    >
  ) => void;
  onCancel: () => void;
}

export default function AddApplicationModal({
  onSubmit,
  onCancel,
}: AddApplicationModalProps) {
  const [name, setName] = useState("");
  const [repository, setRepository] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Advanced options with smart defaults
  const [branch, setBranch] = useState("main");
  const [path, setPath] = useState("");
  const [port, setPort] = useState("3000");

  const [errors, setErrors] = useState({
    name: "",
    repository: "",
  });

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onCancel]);

  const validateForm = (): boolean => {
    const newErrors = {
      name: "",
      repository: "",
    };

    if (!name.trim()) {
      newErrors.name = "Please enter an application name";
    }
    if (!repository.trim()) {
      newErrors.repository = "Please enter your repository URL";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Auto-generate path if not manually set
      const finalPath = path.trim() || `/var/www/${name.toLowerCase().replace(/[^a-z0-9-]/g, "-")}`;

      onSubmit({
        name: name.trim(),
        repository: repository.trim(),
        branch: branch.trim(),
        path: finalPath,
        port: parseInt(port) || 3000,
        status: "stopped",
      });

      // Reset form
      setName("");
      setRepository("");
      setBranch("main");
      setPath("");
      setPort("3000");
      setShowAdvanced(false);
      setErrors({ name: "", repository: "" });
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-secondary-900 rounded-xl shadow-xl max-w-xl w-full border dark:border-[0.4px] border-secondary-200 dark:border-secondary-700">
        {/* Simple Header */}
        <div className="px-6 py-5 border-b dark:border-b-[0.4px] border-secondary-200 dark:border-secondary-700">
          <h2 className="text-xl font-bold text-secondary-900 dark:text-secondary-100">
            Deploy New Application
          </h2>
          <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
            Let's get your project up and running
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            {/* Main Fields - Clean & Simple */}
            <Input
              label="Application Name"
              placeholder="my-awesome-app"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              required
            />

            <Input
              label="Repository URL"
              placeholder="https://github.com/username/repository"
              value={repository}
              onChange={(e) => setRepository(e.target.value)}
              error={errors.repository}
              required
            />

            {/* Simple Info Box */}
            <div className="flex gap-3 p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg border border-secondary-200 dark:border-secondary-700">
              <InfoCircle
                color="currentColor"
                size={20}
                className="text-secondary-500 dark:text-secondary-400 shrink-0 mt-0.5"
              />
              <div className="text-sm">
                <p className="text-secondary-900 dark:text-secondary-100 font-medium">
                  We'll handle the configuration
                </p>
                <p className="text-secondary-600 dark:text-secondary-400 mt-1">
                  Default settings: main branch, port 3000, auto-generated path
                </p>
              </div>
            </div>

            {/* Advanced Options Toggle */}
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              {showAdvanced ? "Hide" : "Show"} advanced options
            </button>

            {/* Advanced Options */}
            {showAdvanced && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Branch"
                    placeholder="main"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                  />
                  <Input
                    label="Port"
                    type="number"
                    placeholder="3000"
                    value={port}
                    onChange={(e) => setPort(e.target.value)}
                    min={1}
                    max={65535}
                  />
                </div>
                <Input
                  label="Deployment Path"
                  placeholder="/var/www/my-app"
                  value={path}
                  onChange={(e) => setPath(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t dark:border-t-[0.4px] border-secondary-200 dark:border-secondary-700">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Deploy Application</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
