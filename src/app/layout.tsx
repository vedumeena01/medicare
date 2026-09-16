import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { AppProvider } from "@/context/AppContext";
import GlobalSearchModal from "@/components/GlobalSearchModal";
import ReminderModal from "@/components/ReminderModal";
import MobileNavigation from "@/components/MobileNavigation";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import NetworkStatusIndicator from "@/components/NetworkStatusIndicator";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "MediExplain AI | Understand Your Medical Reports Simply",
  description:
    "AI-powered medical report simplification and medicine organizer. Understand blood tests, prescriptions, and lab reports in simple English or Hindi.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MediExplain AI",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans relative"
      >
        {/* WCAG 2.1 AA (2.4.1) Bypass Blocks / Skip to Main Content */}
        <a href="#main-content" className="skip-to-content">
          Skip to main content / मुख्य सामग्री पर जाएं
        </a>

        <LanguageProvider>
          <AppProvider>
            <div id="app-root" className="min-h-full flex flex-col">
              {children}
            </div>
            <GlobalSearchModal />
            <ReminderModal />
            <MobileNavigation />
            <ServiceWorkerRegister />
            <NetworkStatusIndicator />
          </AppProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
