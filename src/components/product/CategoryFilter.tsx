"use client";

import { useState, useMemo } from "react";
import { categorias } from "@/lib/categorias";
import type { ProdutoComVendedor } from "@/lib/produtos";
import { CategoryIcon } from "@/components/icons/CategoryIcon";
import { ProductCard } from "@/components/product/ProductCard";

export function CategoryFilter({ produtos }: { produtos: ProdutoComVendedor[] }) {
  const [ativa, setAtiva] = useState<string | null>(null);

  const produtosFiltrados = useMemo(
    () => (ativa ? produtos.filter((p) => p.categoria === ativa) : produtos),
    [ativa, produtos]
  );

  return (
    <div>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        <button
          onClick={() => setAtiva(null)}
          className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
            ativa === null
              ? "border-brand-600 bg-brand-600 text-white"
              : "border-line bg-white text-ink-soft hover:border-brand-300 hover:text-brand-700"
          }`}
        >
          Todas
        </button>
        {categorias.map((categoria) => (
          <button
            key={categoria.id}
            onClick={() => setAtiva(categoria.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              ativa === categoria.id
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-line bg-white text-ink-soft hover:border-brand-300 hover:text-brand-700"
            }`}
          >
            <CategoryIcon name={categoria.icone} className="h-4 w-4" />
            {categoria.nome}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm text-ink-soft">
        {produtosFiltrados.length}{" "}
        {produtosFiltrados.length === 1
          ? "produto encontrado"
          : "produtos encontrados"}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {produtosFiltrados.map((produto) => (
          <ProductCard key={produto.id} produto={produto} />
        ))}
      </div>

      {produtosFiltrados.length === 0 && (
        <div className="mt-12 rounded-2xl border border-dashed border-line py-16 text-center text-ink-soft">
          Nenhum produto nessa categoria ainda.
        </div>
      )}
    </div>
  );
}
