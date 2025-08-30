// src/components/ui/badge.tsx
import * as React from "react";

type Variant = "default" | "secondary" | "destructive";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

export function Badge({
  variant = "default",
  className = "",
  ...props
}: BadgeProps) {
  const styles: Record<Variant, string> = {
    default: "bg-slate-800 text-white",
    secondary:
      "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
    destructive: "bg-rose-600 text-white",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${styles[variant]} ${className}`}
      {...props}
    />
  );
}
