"use client"

import {
	CandlestickChart,
	HomeIcon,
	SearchIcon,
	Settings2,
	User,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { SearchBarPopOut } from "../search_bar"
import { NavBarPageButton } from "./page_button"

interface props {
	className: string
}

export default function MobileNavigation({ className }: props) {
	return (
		<nav
			className={cn(
				"z-50 border-b-0 absolute bottom-0 w-full h-fit items-baseline px-4 pb-4 pt-4 flex rounded-t-3xl flex-row gap-4 border bg-gradient-to-b from-background/50 to-background/90 backdrop-blur-md shadow-md  justify-between",
				className,
			)}
		>
			<NavBarPageButton
				compact
				usePath
				title="home"
				link="/"
				icon={{ render: (props) => <HomeIcon {...props} /> }}
			/>
			<NavBarPageButton
				compact
				usePath
				title="Stocks"
				link="/search"
				icon={{ render: (props) => <CandlestickChart {...props} /> }}
			/>
			<SearchBarPopOut
				doRedirect
				trigger={(props) => (
					<Button
						className="flex items-center bg-transparent border-none h-fit p-0 m-0 aspect-square hover:bg-transparent"
						variant="outline"
						{...props}
					>
						<SearchIcon className="size-7 stroke-muted-foreground" />
					</Button>
				)}
			/>
			<NavBarPageButton
				compact
				usePath
				title="settings"
				link="/usersettings"
				icon={{ render: (props) => <Settings2 {...props} /> }}
			/>
			<NavBarPageButton
				compact
				usePath
				title="user"
				link="/user"
				icon={{ render: (props) => <User {...props} /> }}
			/>
		</nav>
	)
}
