export type StatusPedido =
  | "aguardando_pagamento"
  | "pago"
  | "a_caminho_conferencia"
  | "em_conferencia"
  | "liberado"
  | "concluido"
  | "reprovado";

export const ORDEM_STATUS: StatusPedido[] = [
  "aguardando_pagamento",
  "pago",
  "a_caminho_conferencia",
  "em_conferencia",
  "liberado",
  "concluido",
];

export const STATUS_LABEL: Record<StatusPedido, string> = {
  aguardando_pagamento: "Aguardando pagamento",
  pago: "Pago",
  a_caminho_conferencia: "Produto a caminho da conferência",
  em_conferencia: "Em conferência",
  liberado: "Liberado para retirada/envio",
  concluido: "Concluído",
  reprovado: "Reprovado na conferência",
};

export const STATUS_COR: Record<StatusPedido, string> = {
  aguardando_pagamento: "bg-status-pending/10 text-status-pending",
  pago: "bg-brand-50 text-brand-700",
  a_caminho_conferencia: "bg-status-info/10 text-status-info",
  em_conferencia: "bg-status-review/10 text-status-review",
  liberado: "bg-brand-100 text-brand-700",
  concluido: "bg-brand-600 text-white",
  reprovado: "bg-status-danger/10 text-status-danger",
};
