"use client";

import { useActionState } from "react";
import { Label, INPUT_CLASS, ErrorBanner } from "@/components/ui/Field";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { enviarOferta, type EstadoOferta } from "./actions";

const ESTADO_INICIAL: EstadoOferta = {};

export function OfertaForm({ produtoId, precoSugerido }: { produtoId: string; precoSugerido: number }) {
  const acaoComId = enviarOferta.bind(null, produtoId);
  const [estado, formAction] = useActionState(acaoComId, ESTADO_INICIAL);

  return (
    <form action={formAction} className="mt-6 space-y-5">
      {estado.erro && <ErrorBanner>{estado.erro}</ErrorBanner>}

      <div>
        <Label htmlFor="valor">Sua oferta (R$)</Label>
        <input
          id="valor"
          name="valor"
          type="number"
          min="1"
          step="0.01"
          inputMode="decimal"
          required
          defaultValue={precoSugerido}
          className={INPUT_CLASS}
        />
        <p className="mt-1.5 text-xs text-ink-soft">
          O vendedor pediu {precoSugerido.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}. Você pode manter esse valor ou propor outro — a taxa de 6% é calculada em cima do valor combinado.
        </p>
      </div>

      <div>
        <Label htmlFor="mensagem">Mensagem (opcional)</Label>
        <textarea
          id="mensagem"
          name="mensagem"
          rows={4}
          className={`${INPUT_CLASS} h-auto resize-none py-2.5`}
          placeholder="Alguma condição ou observação pro vendedor..."
        />
      </div>

      <SubmitButton pendingText="Enviando..." variant="cta" className="w-full">
        Enviar oferta
      </SubmitButton>
      <p className="text-center text-xs text-ink-soft">
        O vendedor vai receber sua oferta e pode aceitar ou recusar. Nenhum dado de contato é compartilhado nessa etapa.
      </p>
    </form>
  );
}
