import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeProvider";
import { ReminderProvider } from "@/context/ReminderContext";
import { ReminderOverlay } from "@/components/reminders/ReminderOverlay";
import { ReminderModal } from "@/components/reminders/ReminderModal";

import { DesignProvider } from "@/context/DesignContext";
import { ThemeCustomizer } from "@/components/layout/ThemeCustomizer";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: '#6366f1',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: "FlowControl | Productividad Premium",
  description: "Plataforma inteligente de gestión de actividades y productividad empresarial.",
  applicationName: "FlowControl",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FlowControl",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
      </head>
      <body className={`${inter.className} bg-background text-foreground flex h-screen overflow-hidden transition-colors duration-300`}>
        <ThemeProvider>
          <DesignProvider>
            <ReminderProvider>
              <AuthProvider>
                <ReminderOverlay />
                <ReminderModal />
                <ThemeCustomizer />
                <Sidebar />
                <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
                  <Topbar />
                  <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6 lg:p-8 relative transition-colors duration-300">
                    {children}
                  </main>
                </div>
              </AuthProvider>
            </ReminderProvider>
          </DesignProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
