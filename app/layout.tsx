import type { Metadata } from "next";
import "./globals.css";
import { Montserrat } from 'next/font/google'
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

const font = Montserrat({subsets: ['cyrillic']})

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
          </ThemeProvider>
      </body>
    </html>
  );
}
