import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { getCategoriaPorId } from "@/lib/categorias";
import { CategoryIcon } from "@/components/icons/CategoryIcon";
import { PriceBreakdown } from "@/components/product/PriceBreakdown";
import { parseFotos, produtoDisponivel, type ProdutoComVendedor } from "@/lib/produtos";

export function ProductCard({ produto }: { produto: ProdutoComVendedor }) {
  const categoria = getCategoriaPorId(produto.categoria);
  const fotos = parseFotos(produto.fotos);
  const disponivel = produtoDisponivel(produto.pedidos);
  const gradiente = "from-brand-200 via-brand-100 to-cream-dark";

  return (
    <Link
      href={`/produto/${produto.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white transition-shadow hover:shadow-lg hover:shadow-ink/5"
    >
      <div
        className={`relative flex aspect-4/3 items-center justify-center bg-linear-to-br ${gradiente}`}
      >
        {fotos[0] ? (
          <Image
            src={fotos[0]}
            alt={produto.titulo}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover"
          />
        ) : (
          categoria && (
            <CategoryIcon name={categoria.icone} className="h-12 w-12 text-brand-600 opacity-70" />
          )
        )}
        {!disponivel && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink/50">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-ink">
              Vendido
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
            {categoria?.nome}
          </p>
          <h3 className="mt-1 line-clamp-2 font-display text-base font-semibold text-ink group-hover:text-brand-700">
            {produto.titulo}
          </h3>
        </div>
        <div className="flex items-center gap-1 text-xs text-ink-soft">
          <MapPin className="h-3.5 w-3.5" strokeWidth={1.75} />
          {produto.vendedor.cidade}
        </div>
        <div className="mt-auto">
          <PriceBreakdown preco={produto.preco} variant="compact" />
        </div>
      </div>
    </Link>
  );
}
