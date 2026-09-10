import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { AppProvider } from "@/context/AppContext";
import GlobalSearchModal from "@/components/GlobalSearchModal";
import ReminderModal from "@/components/ReminderModal";
import MobileNavigation from "@/components/MobileNavigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MediExplain AI | Understand Your Medical Reports Simply",
  description:
    "AI-powered medical report simplification and medicine organizer. Understand blood tests, prescriptions, and lab reports in simple English or Hindi.",
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
        className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans"
      >
        <LanguageProvider>
          <AppProvider>
            {children}
            <GlobalSearchModal />
            <ReminderModal />
            <MobileNavigation />
          </AppProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
