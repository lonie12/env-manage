import { useState } from "react";
import { Add, Global, TickCircle, CloseCircle, Shield, Edit } from "iconsax-react";
import { Button, Badge } from "@/components/atoms";
import { AddDomainModal, ConfigureDomainModal } from "@/components/molecules";
import { mockDomains } from "@/mocks/domains.mock";
import type { Domain } from "@/mocks/domains.mock";

export default function Domains() {
  const [domains, setDomains] = useState<Domain[]>(mockDomains);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null);

  const handleAddDomain = (domain: string, app: string, ssl: boolean) => {
    const newDomain: Domain = {
      id: crypto.randomUUID(),
      domain,
      app,
      status: "pending",
      ssl,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setDomains([...domains, newDomain]);
    setShowAddModal(false);
  };

  const handleRemove = (id: string) => {
    if (confirm("Are you sure you want to remove this domain?")) {
      setDomains(domains.filter((d) => d.id !== id));
    }
  };

  const handleConfigure = (domain: Domain) => {
    setEditingDomain(domain);
  };

  const handleUpdateDomain = (id: string, ssl: boolean, status: Domain["status"]) => {
    setDomains(
      domains.map((d) =>
        d.id === id ? { ...d, ssl, status } : d
      )
    );
    setEditingDomain(null);
  };

  const statusColors = {
    active: "bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-300",
    pending: "bg-warning-100 text-warning-700 dark:bg-warning-900 dark:text-warning-300",
    error: "bg-danger-100 text-danger-700 dark:bg-danger-900 dark:text-danger-300",
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
            Domains
          </h1>
          <p className="mt-2 text-secondary-600 dark:text-secondary-400">
            Manage your domain names and SSL certificates
          </p>
        </div>
        <Button
          size="lg"
          className="flex items-center gap-2"
          onClick={() => setShowAddModal(true)}
        >
          <Add color="currentColor" size={20} />
          Add Domain
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-secondary-900 rounded-xl border dark:border-[0.4px] border-secondary-200 dark:border-secondary-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-secondary-600 dark:text-secondary-400">
              Total Domains
            </span>
            <Global size={20} className="text-primary-500" variant="Bold" color="currentColor" />
          </div>
          <p className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
            {domains.length}
          </p>
        </div>
        <div className="bg-white dark:bg-secondary-900 rounded-xl border dark:border-[0.4px] border-secondary-200 dark:border-secondary-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-secondary-600 dark:text-secondary-400">
              Active
            </span>
            <TickCircle size={20} className="text-success-500" variant="Bold" color="currentColor" />
          </div>
          <p className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
            {domains.filter((d) => d.status === "active").length}
          </p>
        </div>
        <div className="bg-white dark:bg-secondary-900 rounded-xl border dark:border-[0.4px] border-secondary-200 dark:border-secondary-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-secondary-600 dark:text-secondary-400">
              SSL Enabled
            </span>
            <Shield size={20} className="text-success-500" variant="Bold" color="currentColor" />
          </div>
          <p className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
            {domains.filter((d) => d.ssl).length}
          </p>
        </div>
      </div>

      {/* Domains Table */}
      <div className="bg-white dark:bg-secondary-900 rounded-xl border dark:border-[0.4px] border-secondary-200 dark:border-secondary-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50 dark:bg-secondary-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">
                  Domain
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">
                  Application
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">
                  SSL
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-200 dark:divide-secondary-700">
              {domains.map((domain) => (
                <tr
                  key={domain.id}
                  className="hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Global
                        size={16}
                        className="text-primary-500"
                        variant="Bold"
                        color="currentColor"
                      />
                      <span className="font-medium text-secondary-900 dark:text-secondary-100">
                        {domain.domain}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-secondary-600 dark:text-secondary-400">
                      {domain.app}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge className={statusColors[domain.status]}>
                      {domain.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    {domain.ssl ? (
                      <div className="flex items-center gap-1 text-success-600 dark:text-success-400">
                        <TickCircle size={16} variant="Bold" color="currentColor" />
                        <span className="text-sm font-medium">Enabled</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-secondary-400">
                        <CloseCircle size={16} variant="Bold" color="currentColor" />
                        <span className="text-sm font-medium">Disabled</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-secondary-600 dark:text-secondary-400">
                      {domain.createdAt}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleConfigure(domain)}
                        className="px-3 py-1.5 text-xs font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Edit size={14} />
                        Configure
                      </button>
                      <button
                        onClick={() => handleRemove(domain.id)}
                        className="px-3 py-1.5 text-xs font-medium text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Domain Modal */}
      {showAddModal && (
        <AddDomainModal
          onSubmit={handleAddDomain}
          onCancel={() => setShowAddModal(false)}
        />
      )}

      {/* Configure Domain Modal */}
      {editingDomain && (
        <ConfigureDomainModal
          domain={editingDomain}
          onSubmit={handleUpdateDomain}
          onCancel={() => setEditingDomain(null)}
        />
      )}
    </div>
  );
}
