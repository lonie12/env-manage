import { useState, useEffect } from "react";
import { Add, CloseCircle, InfoCircle } from "iconsax-react";
import { Input, Button } from "@/components/atoms";
import type { Database } from "@/mocks/databases.mock";

interface AddDatabaseModalProps {
  onSubmit: (name: string, type: Database["type"], host: string, port: number, maxConnections: number) => void;
  onCancel: () => void;
}

export default function AddDatabaseModal({ onSubmit, onCancel }: AddDatabaseModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<Database["type"]>("postgresql");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Advanced options with smart defaults
  const [host, setHost] = useState("localhost");
  const [port, setPort] = useState("5432");
  const [maxConnections, setMaxConnections] = useState("100");

  const [errors, setErrors] = useState({
    name: "",
  });

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onCancel]);

  // Set default ports and connections based on database type
  useEffect(() => {
    const defaults: Record<Database["type"], { port: number; maxConnections: number }> = {
      postgresql: { port: 5432, maxConnections: 100 },
      mysql: { port: 3306, maxConnections: 150 },
      mongodb: { port: 27017, maxConnections: 200 },
      redis: { port: 6379, maxConnections: 50 },
    };
    if (!showAdvanced) {
      setPort(defaults[type].port.toString());
      setMaxConnections(defaults[type].maxConnections.toString());
    }
  }, [type, showAdvanced]);

  const validateForm = (): boolean => {
    const newErrors = {
      name: "",
    };

    if (!name.trim()) {
      newErrors.name = "Please enter a database name";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(
        name.trim(),
        type,
        host.trim(),
        parseInt(port) || 5432,
        parseInt(maxConnections) || 100
      );
      setName("");
      setType("postgresql");
      setHost("localhost");
      setPort("5432");
      setMaxConnections("100");
      setShowAdvanced(false);
      setErrors({ name: "" });
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
      <div className="bg-white dark:bg-secondary-900 rounded-xl shadow-xl max-w-lg w-full border dark:border-[0.4px] border-secondary-200 dark:border-secondary-700">
        <div className="px-6 py-5 border-b dark:border-b-[0.4px] border-secondary-200 dark:border-secondary-700">
          <h2 className="text-xl font-bold text-secondary-900 dark:text-secondary-100">
            Add New Database
          </h2>
          <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
            Create a new database instance
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            <Input
              label="Database Name"
              placeholder="my-production-db"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              required
            />

            <div className="w-full">
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Database Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as Database["type"])}
                className="flex w-full h-10 border dark:border-[0.4px] border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 px-3 py-2 text-sm rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <option value="postgresql">PostgreSQL</option>
                <option value="mysql">MySQL</option>
                <option value="mongodb">MongoDB</option>
                <option value="redis">Redis</option>
              </select>
            </div>

            {/* Simple Info Box */}
            <div className="flex gap-3 p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg border border-secondary-200 dark:border-secondary-700">
              <InfoCircle
                color="currentColor"
                size={20}
                className="text-secondary-500 dark:text-secondary-400 shrink-0 mt-0.5"
              />
              <div className="text-sm">
                <p className="text-secondary-900 dark:text-secondary-100 font-medium">
                  We'll configure everything for you
                </p>
                <p className="text-secondary-600 dark:text-secondary-400 mt-1">
                  Default settings: localhost, standard port, optimal connections
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
                    label="Host"
                    placeholder="localhost"
                    value={host}
                    onChange={(e) => setHost(e.target.value)}
                  />
                  <Input
                    label="Port"
                    type="number"
                    placeholder="5432"
                    value={port}
                    onChange={(e) => setPort(e.target.value)}
                    min={1}
                    max={65535}
                  />
                </div>
                <Input
                  label="Max Connections"
                  type="number"
                  placeholder="100"
                  value={maxConnections}
                  onChange={(e) => setMaxConnections(e.target.value)}
                  min={1}
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t dark:border-t-[0.4px] border-secondary-200 dark:border-secondary-700">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <Add size={18} color="currentColor" />
              Add Database
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
