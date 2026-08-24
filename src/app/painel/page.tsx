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
import { simularPagamento, enviarParaConferencia, concluirPedido } from "./actions";

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

  const [pedidos, produtos] = await Promise.all([
    db.pedido.findMany({
      where: { compradorId: usuario.id },
      include: { produto: { include: { vendedor: { select: { nome: true } } } } },
      orderBy: { criadoEm: "desc" },
    }),
    db.produto.findMany({
      where: { vendedorId: usuario.id },
      include: { pedidos: { orderBy: { criadoEm: "desc" } } },
      orderBy: { criadoEm: "desc" },
    }),
  ]);

  const listaPedidos = (
    <div className="space-y-3">
      {pedidos.length === 0 && (
        <EmptyState texto="Você ainda não comprou nada por aqui." href="/produtos" cta="Ver produtos" />
      )}
      {pedidos.map((pedido) => (
        <div key={pedido.id} className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-4 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-3">
            <Thumb fotos={parseFotos(pedido.produto.fotos)} categoriaId={pedido.produto.categoria} />
            <div className="min-w-0">
              <Link href={`/produto/${pedido.produtoId}`} className="line-clamp-1 font-medium text-ink hover:text-brand-700">
                {pedido.produto.titulo}
              </Link>
              <p className="text-sm text-ink-soft">Vendido por {pedido.produto.vendedor.nome}</p>
              <p className="mt-1 text-sm font-medium text-accent-600">{formatarPreco(pedido.total)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:flex-col sm:items-end">
            <StatusBadge status={pedido.status} />
            {pedido.status === "aguardando_pagamento" && (
              <form action={simularPagamento.bind(null, pedido.id)}>
                <ActionButton variant="cta">Simular pagamento</ActionButton>
              </form>
            )}
            {pedido.status === "liberado" && (
              <form action={concluirPedido.bind(null, pedido.id)}>
                <ActionButton variant="primary">Confirmar recebimento</ActionButton>
              </form>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  const listaAnuncios = (
    <div className="space-y-3">
      {produtos.length === 0 && (
        <EmptyState texto="Você ainda não anunciou nenhum produto." href="/anunciar" cta="Anunciar produto" />
      )}
      {produtos.map((produto) => {
        const pedidoAtivo = produto.pedidos.find((p) => p.status !== "reprovado");
        return (
          <div key={produto.id} className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-4 sm:flex-row sm:items-center">
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
