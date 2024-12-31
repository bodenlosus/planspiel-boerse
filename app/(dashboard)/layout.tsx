import "@/app/globals.css"
import "./layout.css"

import { IBM_Plex_Mono as FontMono, Inter as FontSans } from "next/font/google"

import PageLoader from "@/components/loaders/page_loader"
import DesktopNavigation from "@/components/navbar/desktop_navigation"
import MobileNavigation from "@/components/navbar/mobile_navigation"
import { ScrollArea } from "@/components/ui/scroll-area"
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
					"h-dvh font-sans antialiased overflow-hidden flex flex-col md:flex-row iceberg colors-vivid",
					fontSans.variable,
					fontMono.variable,
				)}
			>
				<DesktopNavigation className="hidden md:flex" />
				<MobileNavigation className="md:hidden" />
				<div
					className={cn(
						"grow h-auto bg-muted/40 pt-4 pl-4 md:m-2 md:border md:rounded-2xl",
						"md:mr-0 md:ml-0 md:my-4",
					)}
				>
					<Suspense fallback={<PageLoader />}>
						<ScrollArea className="h-full pr-3 mr-1 ">{children}</ScrollArea>
					</Suspense>
				</div>
				<Toaster />
			</body>
		</html>
	)
}
