import type { Metadata } from "next";
import "./globals.css";
import { Rubik } from 'next/font/google'
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner"
import type { Viewport } from 'next'

export const viewport: Viewport = {
  width: '520',
  initialScale: 1
}

const font = Rubik({ subsets: ['cyrillic'] })

export const metadata: Metadata = {
  title: "Метеорологическая панель",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(font.className)}>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
