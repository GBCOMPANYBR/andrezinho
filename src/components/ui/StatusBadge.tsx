import { STATUS_COR, STATUS_LABEL, type StatusPedido } from "@/lib/status";

export function StatusBadge({ status }: { status: string }) {
  const s = status as StatusPedido;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COR[s] ?? "bg-cream-dark text-ink-soft"}`}
    >
      {STATUS_LABEL[s] ?? status}
    </span>
  );
}
