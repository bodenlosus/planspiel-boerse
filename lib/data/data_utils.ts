import type {
	CleanedStockPrice,
	NullableRow,
	StockPrice,
} from "@/database/custom_types"

export interface TtoRelativeValues {
	high_low: [number, number]
	open_close: [number, number]
	date: string
	closeLargerOpen: boolean
}
export default function toRelativeValues(
	data: Array<CleanedStockPrice | NullableRow<StockPrice>>,
): Array<NullableRow<TtoRelativeValues>> {
	return data.map((price) => {
		if (!price.close || !price.open || !price.high || !price.low) {
			return {
				high_low: null,
				open_close: null,
				date: price.timestamp,
				closeLargerOpen: null,
			}
		}

		return {
			high_low: [
				Math.max(price.open, price.close) - price.low,
				price.high - Math.max(price.open, price.close),
			],
			open_close: [
				Math.min(price.close, price.open),
				Math.max(price.open, price.close),
			],
			date: price.timestamp,
			closeLargerOpen: price.close > price.open,
		}
	})
}

export function toAbsoluteValues({
	open_close,
	high_low,
	closeLargerOpen,
	date,
}: TtoRelativeValues) {
	const [open, close] = closeLargerOpen ? open_close : open_close.toReversed()
	const high = high_low[1] + Math.max(open, close)
	const low = Math.max(open, close) - high_low[0]

	return { open, close, high, low, date, closeLargerOpen }
}

export function flattenOpenClose(
	rawData: Array<CleanedStockPrice | NullableRow<StockPrice>>,
) {
	const data = rawData.flatMap((entry) => {
		// if (!entry.close || !entry.open) {
		// 	return [
		// 		{date: entry.timestamp, value: 1, ax: 1}, 
		// 		{date: entry.timestamp, value: 1, ax: 1}]
		// }
		return [
			{ date: entry.timestamp, value: entry.open, ax: entry.open },
			{ date: entry.timestamp, value: entry.close, ax: entry.close },
		]
	})
	return data
}

export function calculateOffset<T extends Record<string, number | string>>(
	data: Array<T | NullableRow<T>>,
	dataKey: keyof T,
) {
	let minValue = Number.POSITIVE_INFINITY
	let maxValue = Number.NEGATIVE_INFINITY
	let startValue = null

	for (const row of data) {
		if (!row[dataKey]) {
			continue
		}
		const value = row[dataKey] as number

		if (!startValue) {
			startValue = value
		}

		if (value < minValue) {
			minValue = value
		}

		if (value > maxValue) {
			maxValue = value
		}
	}

	const offset =
		Math.abs(maxValue - (startValue ?? 0)) / Math.abs(maxValue - minValue)

	return { offset, startValue: startValue ?? 0 }
}
