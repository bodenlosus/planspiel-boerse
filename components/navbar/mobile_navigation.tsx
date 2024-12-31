"use client"

import { Menu, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { NavBarPageButton } from "./page_button"

interface props {
	className: string
}

export default function MobileNavigation({ className }: props) {
	return (
		<nav
			className={cn(
				"border-b top-0 w-full h-fit items-baseline px-4 py-1 flex flex-row gap-4 border bg-background shadow-md  justify-between",
				className,
			)}
		>
			<Button className="w-fit !p-0 " variant={"ghost"}>
				<Menu className="!size-7 m-0 stroke-accent-foreground" />
			</Button>
			<div className="">
				<NavBarPageButton
					compact
					usePath
					title="user"
					link="/user"
					icon={{ render: (props) => <User {...props} /> }}
				/>
			</div>
		</nav>
	)
}
