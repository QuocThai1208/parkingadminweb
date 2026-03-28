import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const _inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
});
const _jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "vietnamese"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "AI Parking Dashboard",
  description: "Real-time vehicle recognition and access control dashboard",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${_inter.variable} ${_jetbrainsMono.variable} font-sans antialiased`}>
        <TooltipProvider delayDuration={0}>
          {children}
        </TooltipProvider>
        <Toaster richColors closeButton />
        <Analytics />
      </body>
    </html>
  );
}
