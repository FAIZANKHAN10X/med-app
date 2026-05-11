import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
});

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "MediQuick — Order medicines fast",
  description: "Fast, minimal medicine ordering",
  manifest: "/manifest.json",
  applicationName: "MediQuick",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MediQuick",
  },
  formatDetection: { telephone: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-slate-100">
        <main
          className="mx-auto min-h-dvh max-w-md bg-white relative flex flex-col shadow-xl shadow-slate-900/5"
          style={{
            paddingTop: "var(--safe-top)",
            paddingBottom: "var(--safe-bottom)",
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
