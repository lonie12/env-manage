import type { PropsWithChildren } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// eslint-disable-next-line react-refresh/only-export-components
export const buttonVariants = cva(
  "active:scale-95 inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-primary-500 text-white hover:bg-primary-600",
        secondary: "bg-secondary-200 text-secondary-900 hover:bg-secondary-300",
        outline:
          "border dark:border-[0.4px] border-primary-600 dark:text-primary-50 light:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/20",
        ghost:
          "text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-600/10",
        danger: "bg-error text-white hover:bg-red-600",
      },
      size: {
        sm: "h-9 px-3 text-sm rounded-md",
        md: "h-10 px-4 py-2 rounded-lg",
        lg: "h-11 px-8 rounded-lg",
        xl: "h-12 px-10 text-lg rounded-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export default function Button({
  children,
  className,
  variant,
  size,
  loading,
  disabled,
  ...rest
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>{children}</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}
