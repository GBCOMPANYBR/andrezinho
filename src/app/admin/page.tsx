import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ActionButton } from "@/components/ui/ActionButton";
import { CategoryIcon } from "@/components/icons/CategoryIcon";
import { getCategoriaPorId } from "@/lib/categorias";
import { parseFotos } from "@/lib/produtos";
import { formatarPreco } from "@/lib/pricing";
import { db } from "@/lib/db";
import { exigirAdmin } from "@/lib/auth";
import { iniciarConferencia, aprovarConferencia, reprovarConferencia } from "./actions";

export default async function AdminPage() {
  await exigirAdmin();

  const pedidos = await db.pedido.findMany({
    where: { status: { in: ["a_caminho_conferencia", "em_conferencia"] } },
    include: {
      produto: { include: { vendedor: { select: { nome: true, cidade: true } } } },
      comprador: { select: { nome: true } },
    },
    orderBy: { criadoEm: "asc" },
  });

  return (
    <Container className="py-10">
      <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
        Conferência de produtos
      </h1>
      <p className="mt-2 text-ink-soft">
        Produtos a caminho ou já em conferência física, na ordem em que
        chegaram.
      </p>

      <div className="mt-8 space-y-3">
        {pedidos.length === 0 && (
          <div className="rounded-2xl border border-dashed border-line py-14 text-center text-ink-soft">
            Nenhum produto aguardando conferência no momento.
          </div>
        )}

        {pedidos.map((pedido) => {
          const categoria = getCategoriaPorId(pedido.produto.categoria);
          const fotos = parseFotos(pedido.produto.fotos);

          return (
            <div key={pedido.id} className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 sm:flex-row sm:items-center">
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-brand-200 via-brand-100 to-cream-dark">
                {fotos[0] ? (
                  <Image src={fotos[0]} alt="" fill className="object-cover" sizes="64px" />
                ) : (
                  categoria && <CategoryIcon name={categoria.icone} className="h-7 w-7 text-brand-600 opacity-70" />
                )}
              </div>

              <div className="flex-1">
                <Link href={`/produto/${pedido.produtoId}`} className="font-medium text-ink hover:text-brand-700">
                  {pedido.produto.titulo}
                </Link>
                <p className="text-sm text-ink-soft">
                  Vendedor: {pedido.produto.vendedor.nome} · {pedido.produto.vendedor.cidade}
                </p>
                <p className="text-sm text-ink-soft">Comprador: {pedido.comprador.nome}</p>
                <p className="mt-1 text-sm font-medium text-ink">{formatarPreco(pedido.total)}</p>
              </div>

              <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                <StatusBadge status={pedido.status} />
                {pedido.status === "a_caminho_conferencia" && (
                  <form action={iniciarConferencia.bind(null, pedido.id)}>
                    <ActionButton variant="primary">Iniciar conferência</ActionButton>
                  </form>
                )}
                {pedido.status === "em_conferencia" && (
                  <div className="flex gap-2">
                    <form action={reprovarConferencia.bind(null, pedido.id)}>
                      <ActionButton variant="danger">Reprovar</ActionButton>
                    </form>
                    <form action={aprovarConferencia.bind(null, pedido.id)}>
                      <ActionButton variant="cta">Conferido</ActionButton>
                    </form>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
}
