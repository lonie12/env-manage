import { useEffect, useState } from "react";
import { CloseCircle, DocumentCode, CodeCircle } from "iconsax-react";
import { databaseApi } from "@/api";
import { showToast } from "@/lib/toast";

interface SchemaViewerProps {
  appId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function SchemaViewer({
  appId,
  isOpen,
  onClose,
}: SchemaViewerProps) {
  const [schema, setSchema] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSchema();
    }
  }, [isOpen, appId]);

  const loadSchema = async () => {
    setLoading(true);
    try {
      const result = await databaseApi.getSchema(appId);
      if (result.success && result.schema) {
        setSchema(result.schema);
      } else {
        showToast.error(result.error || "Failed to load schema");
        onClose();
      }
    } catch (error) {
      showToast.error("Failed to load schema");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-secondary-900 rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary-200 dark:border-secondary-700">
          <div className="flex items-center gap-3">
            <DocumentCode
              size={24}
              className="text-primary-600 dark:text-primary-400"
              variant="Bold"
            />
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
              Database Schema
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-200 transition-colors"
          >
            <CloseCircle size={24} variant="Bold" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center gap-3 text-secondary-500">
                <CodeCircle size={24} className="animate-spin" />
                <span>Loading schema...</span>
              </div>
            </div>
          ) : (
            <pre className="bg-secondary-50 dark:bg-secondary-800 rounded-lg p-4 overflow-x-auto text-sm font-mono text-secondary-900 dark:text-secondary-100 border border-secondary-200 dark:border-secondary-700">
              <code>{schema}</code>
            </pre>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-secondary-200 dark:border-secondary-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-secondary-700 dark:text-secondary-300 bg-secondary-100 dark:bg-secondary-800 rounded-lg hover:bg-secondary-200 dark:hover:bg-secondary-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
