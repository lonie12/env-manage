import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// eslint-disable-next-line react-refresh/only-export-components
export const inputVariants = cva(
  "flex w-full border dark:border-[0.4px] border-secondary-300 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-secondary-500 dark:placeholder:text-secondary-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-secondary-950 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-9 px-2 text-sm rounded-md",
        md: "h-10 px-3 rounded-lg",
        lg: "h-11 px-4 rounded-lg",
      },
      variant: {
        default:
          "border-secondary-300 dark:border-secondary-700 focus-visible:ring-primary-500",
        error: "border-error focus-visible:ring-error",
        success: "border-success focus-visible:ring-success",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
);

type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  VariantProps<typeof inputVariants> & {
    label?: string;
    error?: string;
    helperText?: string;
  };

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, size, variant, label, error, helperText, type, ...props },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1">
            {label}
          </label>
        )}
        <input
          className={cn(
            inputVariants({
              size,
              variant: error ? "error" : variant,
              className,
            })
          )}
          type={type}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-error">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
