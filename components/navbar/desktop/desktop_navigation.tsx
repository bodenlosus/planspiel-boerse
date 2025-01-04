"use client"

import { CandlestickChart, HomeIcon, SearchIcon, Settings2 } from "lucide-react"

import { logout } from "@/app/(auth)/actions"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { SearchBarPopOut } from "../../search_bar"
import { NavBarPageButton } from "../page_button"
import { UserProfile, UserProfileFull } from "../profile"

interface props {
	className: string
}

export default function DesktopNavigation({ className }: props) {
	return (
		<div
			className={cn(
				"w-fit items-stretch overflow-x-hidden overflow-y-hidden flex flex-col pb-8 gap-4 shrink-0",
				className,
			)}
		>
			<div className="lg:mx-6 pt-8 flex flex-row items-center gap-4 justify-center lg:mb-6 flex-wrap overflow-hidden">
				<Image
					src={"/logo_unrounded.svg"}
					alt={""}
					width={48}
					height={48}
					className="border rounded-md shadow-md shrink-0 leading-none"
				/>
				<div className="h-min text-2xl font-semibold tracking-wide grow overflow-x-hidden hidden lg:inline">
					Planspiel
					<br /> Boerse
				</div>
			</div>
			<SearchBarPopOut
				doRedirect
				trigger={(props) => (
					<Button
						className="mx-4 shadow-inner px-0 lg:px-6 flex w-auto overflow-hidden flex-row gap-4 lg:justify-start"
						variant="outline"
						{...props}
					>
						<SearchIcon className="size-5 shrink-0 stroke-muted-foreground" />
						<span className="text-muted-foreground shrink truncate hidden lg:inline">
							Search for a Stock...
						</span>
					</Button>
				)}
			/>
			<Separator className="mb-2 mx-2 w-auto" orientation="horizontal" />
			<nav
				className={cn(
					"px-2 lg:px-6 w-auto grow flex flex-col items-stretch gap-2",
				)}
			>
				<NavBarPageButton
					usePath
					title="Home"
					link="/"
					autoCompact
					icon={{
						render: (props) => <HomeIcon {...props} />,
						className: "size-6",
					}}
				/>
				<NavBarPageButton
					usePath
					title="Stocks"
					link="/search"
					autoCompact
					icon={{
						render: (props) => <CandlestickChart {...props} />,
						className: "size-6",
					}}
				/>
				<div className="grow" />
				<UserProfileFull
					methods={{ logout: logout }}
					className="ml-1 hidden lg:block"
				/>
				<UserProfile methods={{ logout: logout }} className="lg:hidden" />
				<div className="" />
				<NavBarPageButton
					usePath
					title="Settings"
					link="/usersettings"
					autoCompact
					icon={{
						render: (props) => <Settings2 {...props} />,
						className: "size-6",
					}}
				/>
			</nav>
			<div className="ml-10 mr-2">{/* <ModeToggle></ModeToggle> */}</div>
		</div>
	)
}
