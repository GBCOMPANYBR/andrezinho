import { MessageCircle } from "lucide-react";

const NUMERO_WHATSAPP = "5511989635013";
const MENSAGEM_PADRAO = "Olá! Vim pelo site do Andrezinho e queria falar direto.";

export function WhatsAppButton() {
  const href = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(MENSAGEM_PADRAO)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com o Andrezinho no WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/25 transition-transform hover:scale-105 active:scale-95 sm:bottom-6 sm:right-6"
    >
      <MessageCircle className="h-7 w-7" strokeWidth={2.25} />
    </a>
  );
}
