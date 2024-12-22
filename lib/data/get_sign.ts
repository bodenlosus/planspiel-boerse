export default function get_sign(x: number): string {
	return x === 0 ? "" : x > 0 ? "+" : "-"
}
