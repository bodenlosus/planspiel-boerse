import { IBM_Plex_Mono as FontMono, Inter as FontSans } from "next/font/google"

import "./globals.css"
import type React from "react"

const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
})

const _fontMono = FontMono({
	subsets: ["latin"],
	variable: "--font-mono",
	weight: "400",
})

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en" className={fontSans.className}>
			<body>{children}</body>
		</html>
	)
}
