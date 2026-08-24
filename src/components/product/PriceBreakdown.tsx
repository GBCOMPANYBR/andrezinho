import {
  calcularTaxa,
  calcularTotalComprador,
  formatarPreco,
  TAXA_INTERMEDIACAO,
} from "@/lib/pricing";

/** Mostra preço do vendedor + taxa de intermediação + total, nunca escondendo o cálculo. */
export function PriceBreakdown({
  preco,
  variant = "full",
}: {
  preco: number;
  variant?: "full" | "compact";
}) {
  const taxa = calcularTaxa(preco);
  const total = calcularTotalComprador(preco);

  if (variant === "compact") {
    return (
      <div>
        <p className="text-xs text-ink-soft line-through">
          {formatarPreco(preco)}
        </p>
        <p className="font-display text-lg font-semibold text-accent-600">
          {formatarPreco(total)}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 rounded-xl border border-line bg-cream-dark/60 p-4 text-sm">
      <div className="flex items-center justify-between text-ink-soft">
        <span>Preço do vendedor</span>
        <span>{formatarPreco(preco)}</span>
      </div>
      <div className="flex items-center justify-between text-ink-soft">
        <span>Taxa de intermediação ({(TAXA_INTERMEDIACAO * 100).toFixed(0)}%)</span>
        <span>+ {formatarPreco(taxa)}</span>
      </div>
      <div className="flex items-center justify-between border-t border-line pt-2 font-display text-lg font-semibold text-ink">
        <span>Total</span>
        <span className="text-accent-600">{formatarPreco(total)}</span>
      </div>
    </div>
  );
}
