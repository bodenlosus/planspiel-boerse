export const toISODateOnly = (date: Date) => date.toISOString().slice(0, 10)
export const msPerDay = 1000 * 3600 * 24
export const getCurrentDate = () => new Date()

export const getDateCertainDaysAgo = (days: number) => {
	const date = new Date()
	date.setUTCHours(0, 0, 0, 0)
	date.setUTCDate(date.getUTCDate() - days)
	return date
}

export const getDateOneWeekAgo = () => getDateCertainDaysAgo(7)

export const getTimeBetweenDates = (startDate: Date, endDate: Date) => {
	const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
	return Math.round(diffTime / msPerDay)
}

export function relativeTimeString(
	date: Date,
	absolute: "necessary" | "never" = "necessary",
): string {
	const diff = getTimeBetweenDates(new Date(), date)

	if (diff <= 1) {
		return "today"
	}

	if (diff === 2) {
		return "yesterday"
	}

	if (diff < 7) {
		const days = [
			"Sunday",
			"Monday",
			"Tuesday",
			"Wednesday",
			"Thursday",
			"Friday",
			"Saturday",
		]
		return days[date.getDay()]
	}

	if (absolute === "necessary" && diff > 30) {
		return date.toLocaleDateString("de")
	}

	return `${diff} days ago`
}
