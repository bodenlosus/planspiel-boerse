"use client"

import "@/app/globals.css"

import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command"
import { type ComponentPropsWithoutRef, useEffect, useState } from "react"

import type { Stock } from "@/database/custom_types"
import { getStockFromSearchString } from "@/database/search_stock"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getStockPagePath } from "../lib/get_stock_path"
import { Button } from "./ui/button"

interface props {
	doRedirect: boolean
	className?: string
}

export default function SearchBar({ doRedirect, className }: props) {
	const router = useRouter()
	const [stocks, setStocks] = useState<Array<Stock>>([])
	const [searchQuery, setSearchQuery] = useState<string>("")
	useEffect(() => {
		// declare the data fetching function// for debugging purposes, remove
		const fetchStocks = async () => {
			if (searchQuery === "" || !searchQuery) {
				setStocks([])
				return
			}
			const { stocks, error, success } = await getStockFromSearchString(
				searchQuery,
				5,
			) // for debugging purposes, remove

			if (error) {
				console.error("Failed to fetch data from database", error)
			}

			if (success) {
				setStocks(stocks)
			}
		}

		fetchStocks().catch(console.error)
	}, [searchQuery])
	return (
		<Command
			className={cn("border-none inner-shadow", className)}
			shouldFilter={false}
		>
			<CommandList className="border-none">
				<CommandInput
					value={searchQuery}
					placeholder="Search for a Stock by Symbol, Name, Description"
					onValueChange={setSearchQuery}
					onKeyDown={(event) => {
						if (event.key === "Enter" && doRedirect && searchQuery) {
							router.push(`/search?query=${searchQuery}`)
						}
					}}
				/>
				<CommandEmpty className="h-min" />
				<CommandGroup>
					{stocks.map((stock) => (
						<CommandItem key={stock.id}>
							<Link className="w-full h-full" href={getStockPagePath(stock.id)}>
								{stock.symbol} - {stock.name}
							</Link>
						</CommandItem>
					))}
				</CommandGroup>
			</CommandList>
		</Command>
	)
}

interface PopOutProps extends props, ComponentPropsWithoutRef<"div"> {}

export function SearchBarPopOut({
	doRedirect,
	className,
	children,
}: PopOutProps) {
	const [open, setOpen] = useState(false)
	return (
		<>
			<Button
				asChild
				className={cn("p-0 m-0", className)}
				variant="ghost"
				onClick={() => setOpen(true)}
			>
				{children}
			</Button>
			<CommandDialog open={open} onOpenChange={setOpen}>
				<SearchBar doRedirect={doRedirect} className={cn("w-full border")} />
			</CommandDialog>
		</>
	)
}
