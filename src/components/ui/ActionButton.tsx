"use client";

import { useFormStatus } from "react-dom";

const VARIANT_CLASSES = {
  primary: "bg-brand-600 text-white hover:bg-brand-700",
  cta: "bg-accent-500 text-white hover:bg-accent-600",
  outline: "border border-line bg-white text-ink hover:border-brand-300",
  danger: "border border-status-danger/30 bg-white text-status-danger hover:bg-status-danger/5",
};

export function ActionButton({
  children,
  variant = "primary",
}: {
  children: React.ReactNode;
  variant?: keyof typeof VARIANT_CLASSES;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex h-9 items-center justify-center rounded-full px-4 text-sm font-medium transition-colors disabled:opacity-50 ${VARIANT_CLASSES[variant]}`}
    >
      {pending ? "..." : children}
    </button>
  );
}
