import { STATUS_COR, STATUS_LABEL, OFERTA_COR, OFERTA_LABEL } from "@/lib/status";

const LABEL: Record<string, string> = { ...STATUS_LABEL, ...OFERTA_LABEL };
const COR: Record<string, string> = { ...STATUS_COR, ...OFERTA_COR };

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${COR[status] ?? "bg-cream-dark text-ink-soft"}`}
    >
      {LABEL[status] ?? status}
    </span>
  );
}
