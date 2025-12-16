import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers/Providers";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import OfflineDetector from "@/components/shared/OfflineDetector";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "UNIX - Moda Inteligente & Exclusiva",
    template: "%s | UNIX"
  },
  description: "Descubre moda redefinida por inteligencia artificial. UNIX ofrece camisas y ropa personalizada con diseños únicos.",
  keywords: ["ropa", "unix", "moda", "ai", "inteligencia artificial", "estampados", "personalizado"],
  authors: [{ name: "UNIX" }],
  creator: "UNIX",
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://unix.com", // Placeholder
    title: "UNIX - Moda Inteligente",
    description: "Tu tienda de ropa favorita potenciada por IA.",
    siteName: "UNIX",
  },
  twitter: {
    card: "summary_large_image",
    title: "UNIX",
    description: "Moda Inteligente & Exclusiva.",
    creator: "@unix_fashion",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/logo.jpeg',
    shortcut: '/logo.jpeg',
    apple: '/logo.jpeg',
  },
};

// Inicializar cron jobs en el servidor
if (typeof window === 'undefined') {
  import('@/lib/cron/jobs').then(({ initCronJobs }) => {
    initCronJobs()
  }).catch(console.error)
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="light" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <OfflineDetector />
          <Providers>
            {children}
            <Toaster position="top-right" richColors />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
