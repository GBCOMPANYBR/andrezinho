import { ShieldCheck } from "lucide-react";

export function TrustBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 ${className}`}
    >
      <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} />
      Conferência física garantida
    </span>
  );
}
