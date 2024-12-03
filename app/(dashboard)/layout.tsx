import "@/app/globals.css";
import "./layout.css";

import { IBM_Plex_Mono as FontMono, Inter as FontSans } from "next/font/google";

import DesktopNavigation from "@/components/navbar/desktop_navigation";
import type { Metadata } from "next";
import MobileNavigation from "@/components/navbar/mobile_navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import PageLoader from "@/components/loaders/page_loader";

export const metadata: Metadata = {
  title: "Planspiel Boerse",
  description: "Planspiel Boerse",
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: "400",
});

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/apple-touch-icon.png"
        />
        <link rel="icon" type="image/png" sizes="any" href="/favicon.ico" />
      </head>

      <body
        className={cn(
          "h-dvh font-sans antialiased overflow-hidden flex flex-row iceberg colors-vivid",
          fontSans.variable,
          fontMono.variable,
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <DesktopNavigation className="max-md:hidden"></DesktopNavigation>
          <MobileNavigation className="md:hidden" />
          <div
            className={cn(
              "grow h-auto bg-muted/40 pt-4 pl-4 mx-2 my-2 border rounded-2xl",
              "md:mr-0 md:ml-0 md:my-4 gradient-fade-out",
            )}
          >
            <Suspense fallback={<PageLoader></PageLoader>}>
              <ScrollArea className="h-full pr-3 mr-1 ">
                {children}
              </ScrollArea>
            </Suspense>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
