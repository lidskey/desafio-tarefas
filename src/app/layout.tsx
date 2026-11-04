import type { Metadata } from "next";
import { TRPCReactProvider } from "@/server/trpc/client";
// @ts-expect-error Next.js handles global CSS imports at build time.
import "./globals.css";

export const metadata: Metadata = {
  title: "Lista de Tarefas",
  description: "Gerenciador simples de tarefas",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body >
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
