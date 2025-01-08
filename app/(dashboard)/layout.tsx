import "@/app/globals.css"
import "./layout.css"

import { IBM_Plex_Mono as FontMono, Inter as FontSans } from "next/font/google"

import PageLoader from "@/components/loaders/page_loader"
import { AppSidebar } from "@/components/navbar/desktop/sidebar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"
import { Suspense } from "react"
import type React from "react"
export const metadata: Metadata = {
	title: "Planspiel Boerse",
	description: "Planspiel Boerse",
}

const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
})

const fontMono = FontMono({
	subsets: ["latin"],
	variable: "--font-mono",
	weight: "400",
})

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode
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
					"h-dvh font-sans antialiased overflow-hidden flex flex-col md:flex-row iceberg colors-vivid dark",
					fontSans.variable,
					fontMono.variable,
				)}
			>
				<SidebarProvider>
					<AppSidebar />
					{/* <SidebarTrigger /> */}
					<Suspense fallback={<PageLoader />}>
						<ScrollArea className="h-full pt-3 px-3 mx-2 mt-2 w-full">
							{children}
						</ScrollArea>
					</Suspense>
				</SidebarProvider>
				<Toaster />
			</body>
		</html>
	)
}
