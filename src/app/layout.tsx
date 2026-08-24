import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getUsuarioAtual } from "@/lib/auth";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://oandrezinho.com.br"),
  title: "Andrezinho — preço de oportunidade, negócio de verdade",
  description:
    "Encontre produtos com preços bem abaixo do mercado. O Andrezinho é a ponte que transforma a oportunidade em negócio pago e entregue com segurança.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Andrezinho",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const usuario = await getUsuarioAtual();

  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-cream font-sans text-ink">
        <Navbar usuario={usuario ? { nome: usuario.nome, isAdmin: usuario.isAdmin } : null} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
