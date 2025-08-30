import * as React from "react";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className = "", ...props }, ref) => (
  <input
    ref={ref}
    className={`h-9 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none ring-0 placeholder:text-slate-400 focus:border-teal-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 ${className}`}
    {...props}
  />
));
Input.displayName = "Input";
