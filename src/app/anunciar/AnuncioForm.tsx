"use client";

import { useActionState, useState } from "react";
import { upload } from "@vercel/blob/client";
import { Label, INPUT_CLASS, ErrorBanner } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { categorias } from "@/lib/categorias";
import { anunciar, type EstadoAnunciar } from "./actions";

const ESTADO_INICIAL: EstadoAnunciar = {};

export function AnuncioForm() {
  const [estado, formAction] = useActionState(anunciar, ESTADO_INICIAL);
  const [fotosUrls, setFotosUrls] = useState<string[]>([]);
  const [enviandoFotos, setEnviandoFotos] = useState(false);
  const [erroFotos, setErroFotos] = useState<string | null>(null);

  async function handleFotosChange(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivos = Array.from(e.target.files ?? []);
    if (arquivos.length === 0) return;

    setEnviandoFotos(true);
    setErroFotos(null);
    setFotosUrls([]);
    try {
      const enviados = await Promise.all(
        arquivos.map((arquivo) =>
          upload(arquivo.name, arquivo, {
            access: "public",
            handleUploadUrl: "/api/upload",
          })
        )
      );
      setFotosUrls(enviados.map((b) => b.url));
    } catch {
      setErroFotos("Não foi possível enviar as fotos. Tente novamente.");
    } finally {
      setEnviandoFotos(false);
    }
  }

  return (
    <form action={formAction} className="mt-8 space-y-5">
      {estado.erro && <ErrorBanner>{estado.erro}</ErrorBanner>}
      {erroFotos && <ErrorBanner>{erroFotos}</ErrorBanner>}

      <div>
        <Label htmlFor="fotos">Fotos do produto</Label>
        <input
          id="fotos"
          type="file"
          accept="image/*"
          multiple
          required={fotosUrls.length === 0}
          onChange={handleFotosChange}
          className="block w-full text-sm text-ink-soft file:mr-3 file:rounded-full file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100"
        />
        {fotosUrls.map((url) => (
          <input key={url} type="hidden" name="fotosUrls" value={url} />
        ))}
        <p className="mt-1.5 text-xs text-ink-soft">
          {enviandoFotos
            ? "Enviando fotos..."
            : fotosUrls.length > 0
              ? `${fotosUrls.length} foto(s) enviada(s) — a primeira vira a capa do anúncio.`
              : "Envie quantas fotos quiser — a primeira vira a capa do anúncio."}
        </p>
      </div>

      <div>
        <Label htmlFor="titulo">Título</Label>
        <input id="titulo" name="titulo" required className={INPUT_CLASS} placeholder="Ex: iPhone 13 128GB Meia-noite" />
      </div>

      <div>
        <Label htmlFor="categoria">Categoria</Label>
        <select id="categoria" name="categoria" required defaultValue="" className={INPUT_CLASS}>
          <option value="" disabled>
            Selecione uma categoria
          </option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="descricao">Descrição</Label>
        <textarea
          id="descricao"
          name="descricao"
          required
          rows={5}
          className={`${INPUT_CLASS} h-auto resize-none py-2.5`}
          placeholder="Estado de conservação, tempo de uso, o que acompanha, motivo da venda..."
        />
      </div>

      <div>
        <Label htmlFor="preco">Preço (o que você recebe)</Label>
        <input
          id="preco"
          name="preco"
          type="number"
          min="1"
          step="0.01"
          inputMode="decimal"
          required
          className={INPUT_CLASS}
          placeholder="0,00"
        />
        <p className="mt-1.5 text-xs text-ink-soft">
          O comprador paga esse valor + 6% de taxa de intermediação. Você recebe o valor cheio que anunciar aqui.
        </p>
      </div>

      <SubmitButton pendingText="Publicando..." className="w-full" disabled={enviandoFotos || fotosUrls.length === 0}>
        Publicar anúncio
      </SubmitButton>
    </form>
  );
}
