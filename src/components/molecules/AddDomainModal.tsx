import { useState, useEffect } from "react";
import { Add, CloseCircle, InfoCircle } from "iconsax-react";
import { Input, Button } from "@/components/atoms";
import { mockApps } from "@/mocks/apps.mock";

interface AddDomainModalProps {
  onSubmit: (domain: string, app: string, ssl: boolean) => void;
  onCancel: () => void;
}

export default function AddDomainModal({ onSubmit, onCancel }: AddDomainModalProps) {
  const [domain, setDomain] = useState("");
  const [selectedApp, setSelectedApp] = useState("");
  const [enableSSL, setEnableSSL] = useState(true);

  const [errors, setErrors] = useState({
    domain: "",
    app: "",
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

  const validateForm = (): boolean => {
    const newErrors = {
      domain: "",
      app: "",
    };

    if (!domain.trim()) {
      newErrors.domain = "Please enter a domain name";
    } else if (!/^[a-zA-Z0-9][a-zA-Z0-9-_.]+\.[a-zA-Z]{2,}$/.test(domain)) {
      newErrors.domain = "Please enter a valid domain (e.g., example.com)";
    }

    if (!selectedApp) {
      newErrors.app = "Please select an application";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(domain.trim(), selectedApp, enableSSL);
      setDomain("");
      setSelectedApp("");
      setEnableSSL(true);
      setErrors({ domain: "", app: "" });
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
            Add New Domain
          </h2>
          <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
            Connect a domain to your application
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            <Input
              label="Domain Name"
              placeholder="example.com"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              error={errors.domain}
              required
            />

            <div className="w-full">
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Application
              </label>
              <select
                value={selectedApp}
                onChange={(e) => setSelectedApp(e.target.value)}
                className="flex w-full h-10 border dark:border-[0.4px] border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 px-3 py-2 text-sm rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <option value="">Select an application</option>
                {mockApps.map((app) => (
                  <option key={app.id} value={app.name}>
                    {app.name}
                  </option>
                ))}
              </select>
              {errors.app && (
                <p className="text-xs text-danger-600 dark:text-danger-400 mt-1">
                  {errors.app}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="ssl"
                checked={enableSSL}
                onChange={(e) => setEnableSSL(e.target.checked)}
                className="w-4 h-4 text-primary-600 bg-secondary-100 border-secondary-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="ssl" className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                Enable SSL Certificate (Recommended)
              </label>
            </div>

            <div className="flex gap-3 p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg border border-secondary-200 dark:border-secondary-700">
              <InfoCircle
                color="currentColor"
                size={20}
                className="text-secondary-500 dark:text-secondary-400 shrink-0 mt-0.5"
              />
              <div className="text-sm">
                <p className="text-secondary-900 dark:text-secondary-100 font-medium">
                  DNS Configuration Required
                </p>
                <p className="text-secondary-600 dark:text-secondary-400 mt-1">
                  Point your domain's A record to your server IP address
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t dark:border-t-[0.4px] border-secondary-200 dark:border-secondary-700">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <Add size={18} color="currentColor" />
              Add Domain
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
