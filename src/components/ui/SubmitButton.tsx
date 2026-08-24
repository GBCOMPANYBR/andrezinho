"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/Button";

export function SubmitButton({
  children,
  pendingText = "Enviando...",
  variant = "primary",
  className = "",
  disabled = false,
}: {
  children: React.ReactNode;
  pendingText?: string;
  variant?: "primary" | "cta" | "outline" | "ghost";
  className?: string;
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant={variant}
      size="lg"
      disabled={pending || disabled}
      className={className}
    >
      {pending ? pendingText : children}
    </Button>
  );
}
