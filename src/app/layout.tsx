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
import { QuickAddProvider } from '@/context/QuickAddContext';
import { SplashScreen } from "@/components/brand/SplashScreen";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const viewport: Viewport = {
  themeColor: '#05000A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
    <html lang="es" suppressHydrationWarning className="dark">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
      </head>
      <body className={`${inter.variable} ${orbitron.variable} ${inter.className} bg-background text-foreground flex min-h-screen min-h-[100svh] h-screen overflow-hidden transition-colors duration-300 relative`}>
        {/* Background Decorative Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-uzala-purple/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute top-[20%] -right-[10%] w-[35%] h-[35%] bg-uzala-blue/10 rounded-full blur-[100px]" />
          <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] bg-uzala-teal/5 rounded-full blur-[80px]" />
        </div>

        <ThemeProvider>
          <DesignProvider>
            <ReminderProvider>
              <AuthProvider>
                <NavigationProvider>
                  <QuickAddProvider>
                    <SplashScreen />
                    <ReminderOverlay />
                    <ReminderModal />
                    <Sidebar />
                    <div className="flex-1 flex flex-col min-h-full overflow-hidden relative z-10 w-full safe-top">
                      <Topbar />
                      <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8 pb-24 md:pb-8 main-content-mobile relative transition-all duration-300 flex flex-col items-center">
                        <div className="w-full max-w-7xl mx-auto">
                          {children}
                        </div>
                      </main>
                      <BottomNav />
                    </div>
                  </QuickAddProvider>
                </NavigationProvider>
              </AuthProvider>
            </ReminderProvider>
          </DesignProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
