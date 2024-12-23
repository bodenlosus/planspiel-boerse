import "@/app/globals.css"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"
import { Inter as FontSans } from "next/font/google"
import Image from "next/image"
import type React from "react"
export const metadata: Metadata = {
	title: "Boersenspiel",
	description: "Boersenspiel",
}

const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
})

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</head>
			<body
				className={cn(
					"h-dvh bg-background font-sans antialiased flex flex-col overflow-hidden w-full",
					fontSans.variable,
				)}
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<Image
						src={"/frosted.png"}
						alt=""
						width={1920}
						height={1080}
						className="absolute -z-10 aspect-video opacity-70 max-h-nonee max-w-none min-w-full min-h-full"
					/>
					<div className="absolute w-[calc(100%-4rem)] left-1/2 -translate-x-1/2 pt-8 pb-8 px-2 flex flex-row items-center gap-4 justify-center flex-wrap overflow-hidden border-b">
						<Image
							src={"/logo_unrounded.svg"}
							alt={""}
							width={48}
							height={48}
							className="border rounded-md shadow-md shrink-0 leading-none"
						/>
						<div className="h-min text-2xl font-semibold tracking-wide overflow-x-hidden">
							Planspiel
							<br /> Boerse
						</div>
					</div>
					{children}
				</ThemeProvider>
				<Toaster />
			</body>
		</html>
	)
}
