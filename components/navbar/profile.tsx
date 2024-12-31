"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, UserX, Users } from "lucide-react"
import { type ComponentPropsWithoutRef, useEffect, useState } from "react"

import { cn } from "@/lib/utils"
import { createClient } from "@/utils/supabase/client"
import type { UserResponse } from "@supabase/supabase-js"

interface UserProfileProps {
	className?: string
	methods: {
		logout: () => unknown
	}
}

const getInitialString = (name: string): string => {
	const initials = Array.from(name.matchAll(/(?<!\w)\w/g)) // Convert the iterator to an array
	const firstInitial = initials[0] ? initials[0][0] : "" // Extract the first match
	const lastInitial =
		initials.length > 1 ? initials[initials.length - 1][0] : "" // Extract the last match
	return `${firstInitial}${lastInitial}`
}

export function UserProfile({ className, methods }: UserProfileProps) {
	const [user, setUser] = useState<UserResponse | null>(null)
	const supabase = createClient()

	const userName = user?.data.user?.user_metadata?.name

	useEffect(() => {
		const getUser = async () => {
			const u = await supabase.auth.getUser()
			setUser(u)
		}
		getUser().catch(() => {})
	})
	return (
		<>
			<div>
				<Menu className={className} methods={methods} userName={userName}>
					<Avatar
						className={cn(
							"size-full aspect-square text-muted transition-colors hover:text-background rounded-md",
							className,
						)}
					>
						<AvatarFallback className="bg-accent-foreground rounded-sm">
							{userName ? (
								getInitialString(userName)
							) : (
								<UserX className="size-4 stroke-muted-foreground" />
							)}
						</AvatarFallback>
					</Avatar>
				</Menu>
			</div>
		</>
	)
}

export function UserProfileFull({ className, methods }: UserProfileProps) {
	const [user, setUser] = useState<UserResponse | null>(null)
	const supabase = createClient()

	const userName = user?.data.user?.user_metadata?.name

	useEffect(() => {
		const getUser = async () => {
			const u = await supabase.auth.getUser()
			setUser(u)
		}
		getUser().catch(() => {})
	})
	return (
		<>
			<div className={className}>
				<Menu methods={methods} userName={userName}>
					<div className="p-2 border rounded-lg flex flex-row items-center gap-3 flex-nowrap">
						<Avatar
							className={cn(
								"size-8 text-muted transition-colors hover:text-background rounded-md",
							)}
						>
							<AvatarFallback className="bg-accent-foreground rounded-sm">
								{userName ? (
									getInitialString(userName)
								) : (
									<UserX className="size-4 stroke-muted" />
								)}
							</AvatarFallback>
						</Avatar>
						<div className="w-fit text-sm text-muted-foreground">
							{userName}
						</div>
					</div>
				</Menu>
			</div>
		</>
	)
}
interface MenuProps extends ComponentPropsWithoutRef<"div">, UserProfileProps {
	userName: string
}
function Menu({ children, userName, methods }: MenuProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="w-full">{children}</DropdownMenuTrigger>
			<DropdownMenuContent className="w-[220px] mb-2" side="top">
				<div className="rounded h-[60px] bg-gradient-to-bl from-purple to-red flex justify-center items-center">
					<DropdownMenuLabel className="text-lg">{userName}</DropdownMenuLabel>
				</div>
				<DropdownMenuSeparator />
				<DropdownMenuItem className="gap-4">
					<Users className="size-3.5 stroke-muted-foreground" />
					Switch account
				</DropdownMenuItem>

				<DropdownMenuItem
					onClick={() => {
						methods.logout()
					}}
					className="gap-4"
				>
					<LogOut className="size-3.5 stroke-muted-foreground" />
					Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
