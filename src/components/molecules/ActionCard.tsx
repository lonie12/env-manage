import { Icon } from "iconsax-react";

interface ActionCardProps {
  title: string;
  description: string;
  icon: Icon;
  iconVariant?: "Bold" | "Broken" | "Bulk" | "Linear" | "Outline" | "TwoTone";
  onClick: () => void;
  primaryValue?: string | number;
  primaryUnit?: string;
  secondaryValue?: string;
  colorScheme?: "primary" | "success" | "warning" | "danger" | "info";
  className?: string;
}

const colorSchemes = {
  primary: {
    border: "border-primary-200 dark:border-primary-800",
    borderHover: "hover:border-primary-400",
    background:
      "from-primary-50 to-white dark:from-primary-950 dark:to-secondary-800",
    iconBg: "bg-primary-100 dark:bg-primary-900",
    iconColor: "text-primary-600 dark:text-primary-400",
    primaryText: "text-primary-600 dark:text-primary-400",
    decorativeColor: "bg-primary-100/50 dark:bg-primary-900/30",
  },
  success: {
    border: "border-success-200 dark:border-success-800",
    borderHover: "hover:border-success-400",
    background:
      "from-success-50 to-white dark:from-success-950 dark:to-secondary-800",
    iconBg: "bg-success-100 dark:bg-success-900",
    iconColor: "text-success-600 dark:text-success-400",
    primaryText: "text-success-600 dark:text-success-400",
    decorativeColor: "bg-success-100/50 dark:bg-success-900/30",
  },
  warning: {
    border: "border-warning-200 dark:border-warning-800",
    borderHover: "hover:border-warning-400",
    background:
      "from-warning-50 to-white dark:from-warning-900 dark:to-secondary-800",
    iconBg: "bg-warning-100 dark:bg-warning-900",
    iconColor: "text-warning-600 dark:text-warning-400",
    primaryText: "text-warning-600 dark:text-warning-400",
    decorativeColor: "bg-warning-100/50 dark:bg-warning-900/30",
  },
  danger: {
    border: "border-danger-200 dark:border-danger-800",
    borderHover: "hover:border-danger-400",
    background:
      "from-danger-50 to-white dark:from-danger-950 dark:to-secondary-900",
    iconBg: "bg-danger-100 dark:bg-danger-900",
    iconColor: "text-danger-600 dark:text-danger-400",
    primaryText: "text-danger-600 dark:text-danger-400",
    decorativeColor: "bg-danger-100/50 dark:bg-danger-900/30",
  },
  info: {
    border: "border-info-200 dark:border-info-800",
    borderHover: "hover:border-info-400",
    background:
      "from-info-50 to-white dark:from-info-950 dark:to-secondary-900",
    iconBg: "bg-info-100 dark:bg-info-900",
    iconColor: "text-info-600 dark:text-info-400",
    primaryText: "text-info-600 dark:text-info-400",
    decorativeColor: "bg-info-100/50 dark:bg-info-900/30",
  },
};

export default function ActionCard({
  title,
  description,
  icon: IconComponent,
  iconVariant = "Bold",
  onClick,
  primaryValue,
  primaryUnit,
  secondaryValue,
  colorScheme = "primary",
  className = "",
}: ActionCardProps) {
  const colors = colorSchemes[colorScheme];

  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden rounded-xl border-2 ${colors.border} bg-gradient-to-br ${colors.background} p-4 text-left shadow-sm transition-all ${colors.borderHover} hover:shadow-lg ${className}`}
    >
      {/* Content */}
      <div className="relative z-10 flex items-center gap-4">
        {/* Icon */}
        <div
          className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg ${colors.iconBg} transition-transform group-hover:scale-110`}
        >
          <IconComponent
            size={24}
            color="currentColor"
            className={colors.iconColor}
            variant={iconVariant}
          />
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <h3 className="mb-1 text-base font-bold text-secondary-900 dark:text-secondary-100">
            {title}
          </h3>
          <p className="mb-2 text-xs text-secondary-600 dark:text-secondary-400 line-clamp-1">
            {description}
          </p>
          <div className="flex items-center space-x-2">
            {primaryValue && (
              <div className="flex items-baseline gap-1">
                <span className={`text-xl font-bold ${colors.primaryText}`}>
                  {primaryValue}
                </span>
                {primaryUnit && (
                  <span className="text-xs text-secondary-500">
                    {primaryUnit}
                  </span>
                )}
              </div>
            )}
            {secondaryValue && (
              <div className="mt-0.5 flex items-baseline gap-1">
                <span className="text-xs text-secondary-500">
                  {secondaryValue}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Background decorative icon - large and transparent */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-10 transition-all duration-300 group-hover:scale-110 group-hover:opacity-15">
        <IconComponent
          size={64}
          color="currentColor"
          className={colors.iconColor}
          variant="Bulk"
        />
      </div>

      {/* Decorative circles */}
      <div
        className={`absolute -right-4 -bottom-4 h-16 w-16 rounded-full ${colors.decorativeColor}`}
      />
      <div
        className={`absolute -right-1 -bottom-1 h-10 w-10 rounded-full ${colors.decorativeColor} opacity-50`}
      />
    </button>
  );
}
