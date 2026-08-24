"use client";

import { useState, type ReactNode } from "react";
import { ShoppingBag, Store } from "lucide-react";

export function PainelTabs({
  pedidos,
  anuncios,
}: {
  pedidos: ReactNode;
  anuncios: ReactNode;
}) {
  const [aba, setAba] = useState<"pedidos" | "anuncios">("pedidos");

  return (
    <div>
      <div className="flex gap-2 border-b border-line">
        <button
          onClick={() => setAba("pedidos")}
          className={`flex items-center gap-2 border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
            aba === "pedidos"
              ? "border-brand-600 text-ink"
              : "border-transparent text-ink-soft hover:text-ink"
          }`}
        >
          <ShoppingBag className="h-4 w-4" strokeWidth={1.75} />
          Meus pedidos
        </button>
        <button
          onClick={() => setAba("anuncios")}
          className={`flex items-center gap-2 border-b-2 px-1 pb-3 text-sm font-medium transition-colors ${
            aba === "anuncios"
              ? "border-brand-600 text-ink"
              : "border-transparent text-ink-soft hover:text-ink"
          }`}
        >
          <Store className="h-4 w-4" strokeWidth={1.75} />
          Meus anúncios
        </button>
      </div>

      <div className="mt-6">
        {aba === "pedidos" ? pedidos : anuncios}
      </div>
    </div>
  );
}
