"use server"

import SearchBar from "@/components/search_bar"
import {
	type TgetStockFromSearchString,
	getStockFromSearchString,
} from "@/database/search_stock"

import { ErrorCard } from "@/components/cards/cards"
import { StockList } from "./stock_list"
import { urlSchema } from "./url_scheme"

interface props {
	searchParams: { query: string }
}

export default async function Page({ searchParams }: props) {
	const { data: urlParams, error: parseError } =
		urlSchema.safeParse(searchParams)

	if (parseError) {
		console.error("Invalid URL parameters:", parseError)
		return <ErrorCard error={parseError} />
	}

	const { stocks, error }: TgetStockFromSearchString = urlParams.query
		? await getStockFromSearchString(urlParams.query, 5)
		: { stocks: [], error: null, success: false }

	if (error) {
		return (
			<h1 className="text-destructive">Failed to fetch data from database</h1>
		)
	}

	return (
		<main className="w-full h-full overflow-hidden">
			<div className="w-full flex justify-center">
				<SearchBar className="w-full bg-background" doRedirect />
			</div>
			<StockList stocks={stocks} />
		</main>
	)
}
