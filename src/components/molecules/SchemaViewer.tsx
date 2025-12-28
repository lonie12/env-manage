import { useEffect, useState, useRef } from "react";
import { CloseCircle, DocumentCode, CodeCircle } from "iconsax-react";
import { databaseApi } from "@/api";
import { showToast } from "@/lib/toast";
import mermaid from "mermaid";

interface SchemaViewerProps {
  appId: string;
  isOpen: boolean;
  onClose: () => void;
}

// Parse Drizzle schema to extract table definitions
function parseSchemaToMermaid(schemaContent: string): string {
  const lines = schemaContent.split("\n");
  let mermaidCode = "erDiagram\n";

  // Find table definitions (pgTable, mysqlTable, sqliteTable)
  const tableRegex = /export const (\w+) = (?:pg|mysql|sqlite)Table\("(\w+)",\s*{/g;
  const columnRegex = /(\w+):\s*(\w+)\(/g;

  let currentTable: string | null = null;
  let inTableDefinition = false;
  let braceCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check for table definition
    const tableMatch = tableRegex.exec(line);
    if (tableMatch) {
      currentTable = tableMatch[2];
      inTableDefinition = true;
      braceCount = 1;
      mermaidCode += `  ${currentTable} {\n`;
      continue;
    }

    if (inTableDefinition && currentTable) {
      // Count braces to know when table definition ends
      braceCount += (line.match(/{/g) || []).length;
      braceCount -= (line.match(/}/g) || []).length;

      if (braceCount === 0) {
        mermaidCode += `  }\n`;
        inTableDefinition = false;
        currentTable = null;
        continue;
      }

      // Parse column definitions
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith("//") && !trimmedLine.startsWith("/*")) {
        const columnMatch = /(\w+):\s*(\w+)\(/.exec(trimmedLine);
        if (columnMatch) {
          const columnName = columnMatch[1];
          const columnType = columnMatch[2];

          // Map Drizzle types to SQL types
          let sqlType = columnType;
          if (columnType === "serial" || columnType === "integer") sqlType = "int";
          if (columnType === "varchar" || columnType === "text") sqlType = "string";
          if (columnType === "timestamp") sqlType = "datetime";
          if (columnType === "boolean") sqlType = "bool";
          if (columnType === "json" || columnType === "jsonb") sqlType = "json";

          mermaidCode += `    ${sqlType} ${columnName}\n`;
        }
      }
    }
  }

  return mermaidCode;
}

export default function SchemaViewer({
  appId,
  isOpen,
  onClose,
}: SchemaViewerProps) {
  const [schema, setSchema] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Mermaid
    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
      securityLevel: "loose",
      fontSize: 18,
      fontFamily: "system-ui, -apple-system, sans-serif",
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadSchema();
    }
  }, [isOpen, appId]);

  useEffect(() => {
    if (schema && mermaidRef.current && !loading) {
      renderMermaid();
    }
  }, [schema, loading]);

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

  const renderMermaid = async () => {
    if (!mermaidRef.current) return;

    try {
      const mermaidCode = parseSchemaToMermaid(schema);
      const { svg } = await mermaid.render("schema-diagram", mermaidCode);
      mermaidRef.current.innerHTML = svg;

      // Style the SVG to make it larger and centered
      const svgElement = mermaidRef.current.querySelector("svg");
      if (svgElement) {
        svgElement.style.width = "100%";
        svgElement.style.height = "auto";
        svgElement.style.maxWidth = "100%";
        svgElement.style.minHeight = "400px";

        // Scale text elements for better readability
        const textElements = svgElement.querySelectorAll("text");
        textElements.forEach((text) => {
          const currentSize = text.getAttribute("font-size") || "14";
          text.setAttribute("font-size", String(parseFloat(currentSize) * 1.2));
        });
      }
    } catch (error) {
      console.error("Failed to render Mermaid diagram:", error);
      showToast.error("Failed to render schema diagram");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-secondary-900 rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] flex flex-col">
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
            <div className="bg-white dark:bg-secondary-800 rounded-lg p-8 overflow-auto border border-secondary-200 dark:border-secondary-700 min-h-[500px]">
              <div ref={mermaidRef} className="w-full flex items-center justify-center" />
            </div>
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
