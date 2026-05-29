import type { Metadata, Viewport } from "next";
import { Inter, Orbitron } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeProvider";
import { ReminderProvider } from "@/context/ReminderContext";
import { ReminderOverlay } from "@/components/reminders/ReminderOverlay";
import { ReminderModal } from "@/components/reminders/ReminderModal";
import { DesignProvider } from "@/context/DesignContext";
import { NavigationProvider } from "@/context/NavigationContext";
import { SplashScreen } from "@/components/brand/SplashScreen";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const viewport: Viewport = {
  themeColor: '#050508',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: "UZALA | Gestión Inteligente",
  description: "¿Tienes que recordar algo? UZALA — app de actividades, pendientes y productividad.",
  applicationName: "UZALA",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "UZALA",
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
      <body className={`${inter.variable} ${orbitron.variable} ${inter.className} bg-background text-foreground flex h-screen overflow-hidden transition-colors duration-300`}>
        <ThemeProvider>
          <DesignProvider>
            <ReminderProvider>
              <AuthProvider>
                <NavigationProvider>
                  <SplashScreen />
                  <ReminderOverlay />
                  <ReminderModal />
                  <Sidebar />
                  <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10 w-full safe-top">
                    <Topbar />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 md:p-6 lg:p-8 pb-24 md:pb-8 relative transition-all duration-300">
                      {children}
                    </main>
                    <BottomNav />
                  </div>
                </NavigationProvider>
              </AuthProvider>
            </ReminderProvider>
          </DesignProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
