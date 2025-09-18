import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "@/hooks/use-auth";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";
import "./globals.css";
export const metadata = {
    title: "Biblioteca Virtual - Sistema de Gestión",
    description: "Sistema de gestión de biblioteca virtual para instituciones educativas",
    generator: "v0.app",
};
export default function RootLayout({ children, }) {
    return (<html lang="es">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>);
}
