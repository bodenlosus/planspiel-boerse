export function to_display_string(
	amount: number,
	dec_places: number,
	absolute?: boolean,
): string {
	const sign = absolute ? 1 : Math.sign(amount)
	const money_amount: number = Math.abs(amount)

	const abbreviations: Map<number, string> = new Map([
		[1, ""],
		[1000, "k"],
		[1000 * 1000, "M"],
		[1000 * 1000 * 1000, "B"],
	])

	let display_string = ""
	let biggest_divisor = 0

	const pre_round_fac = 10 ** dec_places

	for (const [divisor, short] of abbreviations) {
		if (biggest_divisor < divisor && money_amount >= divisor) {
			biggest_divisor = divisor
			display_string = `${
				(Math.round((money_amount / divisor) * pre_round_fac) / pre_round_fac) *
				sign
			}${short}`
		}
	}

	return display_string
}
