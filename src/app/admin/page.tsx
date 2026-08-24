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
import {
  marcarComoPago,
  enviarParaConferenciaAdmin,
  concluirPedidoAdmin,
  iniciarConferencia,
  aprovarConferencia,
  reprovarConferencia,
} from "./actions";

export default async function AdminPage() {
  await exigirAdmin();

  const [pedidos, ofertasPendentes] = await Promise.all([
    db.pedido.findMany({
      where: { status: { in: ["vendido", "pago", "a_caminho_conferencia", "em_conferencia", "liberado"] } },
      include: {
        produto: { include: { vendedor: { select: { nome: true, cidade: true, telefone: true } } } },
        comprador: { select: { nome: true, telefone: true } },
      },
      orderBy: { criadoEm: "asc" },
    }),
    db.oferta.count({ where: { status: "pendente" } }),
  ]);

  return (
    <Container className="py-10">
      <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
        Painel de vendas
      </h1>
      <p className="mt-2 text-ink-soft">
        Vendas em andamento, na ordem em que aconteceram. {ofertasPendentes > 0 && (
          <span>{ofertasPendentes} {ofertasPendentes === 1 ? "oferta" : "ofertas"} aguardando resposta do vendedor (fora dessa lista).</span>
        )}
      </p>

      <div className="mt-8 space-y-3">
        {pedidos.length === 0 && (
          <div className="rounded-2xl border border-dashed border-line py-14 text-center text-ink-soft">
            Nenhuma venda em andamento no momento.
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
                  Vendedor: {pedido.produto.vendedor.nome} · {pedido.produto.vendedor.cidade} · {pedido.produto.vendedor.telefone}
                </p>
                <p className="text-sm text-ink-soft">
                  Comprador: {pedido.comprador.nome} · {pedido.comprador.telefone}
                </p>
                <p className="mt-1 text-sm font-medium text-ink">{formatarPreco(pedido.total)}</p>
              </div>

              <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                <StatusBadge status={pedido.status} />
                {pedido.status === "vendido" && (
                  <form action={marcarComoPago.bind(null, pedido.id)}>
                    <ActionButton variant="cta">Marcar como pago</ActionButton>
                  </form>
                )}
                {pedido.status === "pago" && (
                  <form action={enviarParaConferenciaAdmin.bind(null, pedido.id)}>
                    <ActionButton variant="primary">Marcar a caminho da conferência</ActionButton>
                  </form>
                )}
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
                {pedido.status === "liberado" && (
                  <form action={concluirPedidoAdmin.bind(null, pedido.id)}>
                    <ActionButton variant="primary">Marcar como concluído</ActionButton>
                  </form>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
}
