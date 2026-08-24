import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { LinkButton } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ActionButton } from "@/components/ui/ActionButton";
import { CategoryIcon } from "@/components/icons/CategoryIcon";
import { getCategoriaPorId } from "@/lib/categorias";
import { parseFotos } from "@/lib/produtos";
import { formatarPreco } from "@/lib/pricing";
import { db } from "@/lib/db";
import { exigirUsuario } from "@/lib/auth";
import { PainelTabs } from "./PainelTabs";
import { aceitarOferta, recusarOferta, enviarParaConferencia, concluirPedido } from "./actions";

function Thumb({ fotos, categoriaId }: { fotos: string[]; categoriaId: string }) {
  const categoria = getCategoriaPorId(categoriaId);
  return (
    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-linear-to-br from-brand-200 via-brand-100 to-cream-dark">
      {fotos[0] ? (
        <Image src={fotos[0]} alt="" fill className="object-cover" sizes="64px" />
      ) : (
        categoria && <CategoryIcon name={categoria.icone} className="h-7 w-7 text-brand-600 opacity-70" />
      )}
    </div>
  );
}

function EmptyState({ texto, href, cta }: { texto: string; href: string; cta: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-line py-14 text-center">
      <p className="text-ink-soft">{texto}</p>
      <LinkButton href={href} variant="outline" size="md" className="mt-4">
        {cta}
      </LinkButton>
    </div>
  );
}

export default async function PainelPage() {
  const usuario = await exigirUsuario();

  const [pedidosComoComprador, ofertasComoComprador, produtos, ofertasRecebidas] = await Promise.all([
    db.pedido.findMany({
      where: { compradorId: usuario.id },
      include: { produto: { include: { vendedor: { select: { cidade: true } } } } },
      orderBy: { criadoEm: "desc" },
    }),
    db.oferta.findMany({
      where: { compradorId: usuario.id, status: { in: ["pendente", "recusada"] } },
      include: { produto: { include: { vendedor: { select: { cidade: true } } } } },
      orderBy: { criadoEm: "desc" },
    }),
    db.produto.findMany({
      where: { vendedorId: usuario.id },
      include: { pedidos: { orderBy: { criadoEm: "desc" } } },
      orderBy: { criadoEm: "desc" },
    }),
    db.oferta.findMany({
      where: { produto: { vendedorId: usuario.id }, status: "pendente" },
      include: { comprador: { select: { cidade: true } } },
      orderBy: { criadoEm: "desc" },
    }),
  ]);

  const itensComprador = [
    ...pedidosComoComprador.map((p) => ({ tipo: "pedido" as const, criadoEm: p.criadoEm, pedido: p })),
    ...ofertasComoComprador.map((o) => ({ tipo: "oferta" as const, criadoEm: o.criadoEm, oferta: o })),
  ].sort((a, b) => b.criadoEm.getTime() - a.criadoEm.getTime());

  const listaPedidos = (
    <div className="space-y-3">
      {itensComprador.length === 0 && (
        <EmptyState texto="Você ainda não fez nenhuma oferta por aqui." href="/produtos" cta="Ver produtos" />
      )}
      {itensComprador.map((item) => {
        if (item.tipo === "oferta") {
          const oferta = item.oferta;
          return (
            <div key={`oferta-${oferta.id}`} className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-4 sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-3">
                <Thumb fotos={parseFotos(oferta.produto.fotos)} categoriaId={oferta.produto.categoria} />
                <div className="min-w-0">
                  <Link href={`/produto/${oferta.produtoId}`} className="line-clamp-1 font-medium text-ink hover:text-brand-700">
                    {oferta.produto.titulo}
                  </Link>
                  <p className="text-sm text-ink-soft">Vendedor de {oferta.produto.vendedor.cidade}</p>
                  <p className="mt-1 text-sm font-medium text-accent-600">Sua oferta: {formatarPreco(oferta.valor)}</p>
                </div>
              </div>
              <StatusBadge status={oferta.status} />
            </div>
          );
        }

        const pedido = item.pedido;
        return (
          <div key={`pedido-${pedido.id}`} className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-4 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-3">
              <Thumb fotos={parseFotos(pedido.produto.fotos)} categoriaId={pedido.produto.categoria} />
              <div className="min-w-0">
                <Link href={`/produto/${pedido.produtoId}`} className="line-clamp-1 font-medium text-ink hover:text-brand-700">
                  {pedido.produto.titulo}
                </Link>
                <p className="text-sm text-ink-soft">Vendedor de {pedido.produto.vendedor.cidade}</p>
                <p className="mt-1 text-sm font-medium text-accent-600">{formatarPreco(pedido.total)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:flex-col sm:items-end">
              <StatusBadge status={pedido.status} />
              {pedido.status === "liberado" && (
                <form action={concluirPedido.bind(null, pedido.id)}>
                  <ActionButton variant="primary">Confirmar recebimento</ActionButton>
                </form>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  const listaAnuncios = (
    <div className="space-y-3">
      {produtos.length === 0 && (
        <EmptyState texto="Você ainda não anunciou nenhum produto." href="/anunciar" cta="Anunciar produto" />
      )}
      {produtos.map((produto) => {
        const pedidoAtivo = produto.pedidos.find((p) => p.status !== "reprovado");
        const ofertasDoProduto = ofertasRecebidas.filter((o) => o.produtoId === produto.id);
        return (
          <div key={produto.id} className="rounded-2xl border border-line bg-white p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center gap-3">
                <Thumb fotos={parseFotos(produto.fotos)} categoriaId={produto.categoria} />
                <div className="min-w-0">
                  <Link href={`/produto/${produto.id}`} className="line-clamp-1 font-medium text-ink hover:text-brand-700">
                    {produto.titulo}
                  </Link>
                  <p className="text-sm text-ink-soft">{formatarPreco(produto.preco)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                {pedidoAtivo ? (
                  <StatusBadge status={pedidoAtivo.status} />
                ) : (
                  <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
                    Disponível
                  </span>
                )}
                {pedidoAtivo?.status === "pago" && (
                  <form action={enviarParaConferencia.bind(null, pedidoAtivo.id)}>
                    <ActionButton variant="primary">Enviar para conferência</ActionButton>
                  </form>
                )}
                {pedidoAtivo?.status === "liberado" && (
                  <form action={concluirPedido.bind(null, pedidoAtivo.id)}>
                    <ActionButton variant="primary">Confirmar entrega</ActionButton>
                  </form>
                )}
              </div>
            </div>

            {ofertasDoProduto.length > 0 && (
              <div className="mt-4 space-y-2 border-t border-line pt-4">
                <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
                  {ofertasDoProduto.length} {ofertasDoProduto.length === 1 ? "oferta recebida" : "ofertas recebidas"}
                </p>
                {ofertasDoProduto.map((oferta) => (
                  <div key={oferta.id} className="flex flex-col gap-2 rounded-xl bg-cream-dark/60 p-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-ink">
                        {formatarPreco(oferta.valor)} <span className="font-normal text-ink-soft">— comprador de {oferta.comprador.cidade}</span>
                      </p>
                      {oferta.mensagem && <p className="mt-0.5 text-sm text-ink-soft">&ldquo;{oferta.mensagem}&rdquo;</p>}
                    </div>
                    <div className="flex gap-2">
                      <form action={recusarOferta.bind(null, oferta.id)}>
                        <ActionButton variant="danger">Recusar</ActionButton>
                      </form>
                      <form action={aceitarOferta.bind(null, oferta.id)}>
                        <ActionButton variant="cta">Aceitar</ActionButton>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <Container className="py-10">
      <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
        Meu painel
      </h1>
      <p className="mt-2 text-ink-soft">Olá, {usuario.nome.split(" ")[0]}.</p>

      <div className="mt-8">
        <PainelTabs pedidos={listaPedidos} anuncios={listaAnuncios} />
      </div>
    </Container>
  );
}
