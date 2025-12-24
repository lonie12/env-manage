import { useState, useEffect } from "react";
import { TickCircle, CloseCircle, Shield, Global } from "iconsax-react";
import { Button, Badge } from "@/components/atoms";
import type { Domain } from "@/mocks/domains.mock";

interface ConfigureDomainModalProps {
  domain: Domain;
  onSubmit: (id: string, ssl: boolean, status: Domain["status"]) => void;
  onCancel: () => void;
}

export default function ConfigureDomainModal({
  domain,
  onSubmit,
  onCancel,
}: ConfigureDomainModalProps) {
  const [enableSSL, setEnableSSL] = useState(domain.ssl);
  const [status, setStatus] = useState(domain.status);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onCancel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(domain.id, enableSSL, status);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const statusColors = {
    active: "bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-300",
    pending: "bg-warning-100 text-warning-700 dark:bg-warning-900 dark:text-warning-300",
    error: "bg-danger-100 text-danger-700 dark:bg-danger-900 dark:text-danger-300",
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-secondary-900 rounded-xl shadow-xl max-w-lg w-full border dark:border-[0.4px] border-secondary-200 dark:border-secondary-700">
        <div className="px-6 py-5 border-b dark:border-b-[0.4px] border-secondary-200 dark:border-secondary-700">
          <h2 className="text-xl font-bold text-secondary-900 dark:text-secondary-100">
            Configure Domain
          </h2>
          <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
            Update domain settings and SSL configuration
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            {/* Domain Info - Read Only */}
            <div className="bg-secondary-50 dark:bg-secondary-800/50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Global size={24} className="text-primary-500" variant="Bold" color="currentColor" />
                <div>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">Domain</p>
                  <p className="font-semibold text-secondary-900 dark:text-secondary-100">
                    {domain.domain}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-secondary-600 dark:text-secondary-400">Application</p>
                  <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                    {domain.app}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-secondary-600 dark:text-secondary-400">Created</p>
                  <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                    {domain.createdAt}
                  </p>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="w-full">
              <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Domain["status"])}
                className="flex w-full h-10 border dark:border-[0.4px] border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 px-3 py-2 text-sm rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="error">Error</option>
              </select>
              <div className="mt-2">
                <Badge className={statusColors[status]}>
                  Current: {status}
                </Badge>
              </div>
            </div>

            {/* SSL Configuration */}
            <div className="border dark:border-[0.4px] border-secondary-200 dark:border-secondary-700 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield size={24} className="text-success-500 mt-1" variant="Bold" color="currentColor" />
                <div className="flex-1">
                  <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-1">
                    SSL Certificate
                  </h3>
                  <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-3">
                    Secure your domain with HTTPS encryption
                  </p>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="ssl-config"
                      checked={enableSSL}
                      onChange={(e) => setEnableSSL(e.target.checked)}
                      className="w-4 h-4 text-primary-600 bg-secondary-100 border-secondary-300 rounded focus:ring-primary-500"
                    />
                    <label
                      htmlFor="ssl-config"
                      className="text-sm font-medium text-secondary-700 dark:text-secondary-300"
                    >
                      Enable SSL Certificate
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t dark:border-t-[0.4px] border-secondary-200 dark:border-secondary-700">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <TickCircle size={18} color="currentColor" />
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
