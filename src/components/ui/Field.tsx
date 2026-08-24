import { LabelHTMLAttributes, ReactNode } from "react";
import { AlertCircle } from "lucide-react";

export const INPUT_CLASS =
  "h-11 w-full rounded-xl border border-line bg-white px-3.5 text-sm text-ink placeholder:text-ink-soft/60 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20";

export function Label({
  children,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement> & { children: ReactNode }) {
  return (
    <label className="mb-1.5 block text-sm font-medium text-ink" {...props}>
      {children}
    </label>
  );
}

export function ErrorBanner({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-xl bg-status-danger/10 px-4 py-3 text-sm text-status-danger">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} />
      {children}
    </div>
  );
}
