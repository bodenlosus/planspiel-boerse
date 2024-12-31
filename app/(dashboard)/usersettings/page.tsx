import { logout } from "@/app/(auth)/actions"
import { ModeToggle } from "@/components/navbar/mode_toggle"
import { UserProfile } from "@/components/navbar/profile"
import { cn } from "@/lib/utils"

export default function Page() {
	const colors = [
		"bg-blue",
		"bg-blueAlt",
		"bg-turquoize",
		"bg-green",
		"bg-greenAlt",
		"bg-yellow",
		"bg-orange",
		"bg-salmon",
		"bg-red",
		"bg-pink",
		"bg-purple",
		"bg-loss",
		"bg-win",
	]
	return (
		<main>
			<ModeToggle />
			<div className="grid grid-cols-5 w-fit gap-2">
				{colors.map((color) => (
					<div className={cn("size-24 rounded-lg", color)} key={color} />
				))}
			</div>
			<UserProfile
				methods={{
					logout: logout,
				}}
			/>
		</main>
	)
}
