import { useState } from "react";
import { Add, CloseCircle } from "iconsax-react";
import { Input, Button } from "@/components/atoms";

interface EnvVarFormProps {
  onSubmit: (key: string, value: string, isSecret: boolean) => void;
  onCancel: () => void;
}

export default function EnvVarForm({ onSubmit, onCancel }: EnvVarFormProps) {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [isSecret, setIsSecret] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key && value) {
      onSubmit(key, value, isSecret);
      setKey("");
      setValue("");
      setIsSecret(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-secondary-50 dark:bg-secondary-800 rounded-lg p-4 space-y-3"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input
          placeholder="KEY"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          required
        />
        <Input
          placeholder="value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
        />
      </div>
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isSecret}
            onChange={(e) => setIsSecret(e.target.checked)}
            className="w-4 h-4 text-primary-600 bg-white dark:bg-secondary-700 border-secondary-300 dark:border-secondary-600 rounded focus:ring-primary-500"
          />
          <span className="text-sm text-secondary-700 dark:text-secondary-300">
            Mark as secret
          </span>
        </label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="flex items-center gap-2"
          >
            <CloseCircle size={16} color="currentColor" />
            Cancel
          </Button>
          <Button type="submit" size="sm" className="flex items-center gap-2">
            <Add size={16} color="currentColor" />
            Add Variable
          </Button>
        </div>
      </div>
    </form>
  );
}
