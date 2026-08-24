export type StatusPedido =
  | "vendido"
  | "pago"
  | "a_caminho_conferencia"
  | "em_conferencia"
  | "liberado"
  | "concluido"
  | "reprovado";

export const ORDEM_STATUS: StatusPedido[] = [
  "vendido",
  "pago",
  "a_caminho_conferencia",
  "em_conferencia",
  "liberado",
  "concluido",
];

export const STATUS_LABEL: Record<StatusPedido, string> = {
  vendido: "Vendido — aguardando pagamento",
  pago: "Pago",
  a_caminho_conferencia: "Produto a caminho da conferência",
  em_conferencia: "Em conferência",
  liberado: "Liberado para retirada/envio",
  concluido: "Concluído",
  reprovado: "Reprovado na conferência",
};

export const STATUS_COR: Record<StatusPedido, string> = {
  vendido: "bg-status-pending/10 text-status-pending",
  pago: "bg-brand-50 text-brand-700",
  a_caminho_conferencia: "bg-status-info/10 text-status-info",
  em_conferencia: "bg-status-review/10 text-status-review",
  liberado: "bg-brand-100 text-brand-700",
  concluido: "bg-brand-600 text-white",
  reprovado: "bg-status-danger/10 text-status-danger",
};

export type StatusOferta = "pendente" | "aceita" | "recusada";

export const OFERTA_LABEL: Record<StatusOferta, string> = {
  pendente: "Aguardando resposta do vendedor",
  aceita: "Aceita",
  recusada: "Recusada",
};

export const OFERTA_COR: Record<StatusOferta, string> = {
  pendente: "bg-status-pending/10 text-status-pending",
  aceita: "bg-brand-100 text-brand-700",
  recusada: "bg-status-danger/10 text-status-danger",
};
