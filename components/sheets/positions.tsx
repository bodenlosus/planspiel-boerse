"use client"
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import type { ComponentPropsWithoutRef } from "react"
import { Button } from "../ui/button"

interface props extends ComponentPropsWithoutRef<"div"> {
	depotID: number
	stockID: number
}
export function PositionSheet({ className }: props) {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button
					variant={"outline"}
					className={cn("text-muted-foreground text-sm", className)}
				>
					show more
				</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Are you absolutely sure?</SheetTitle>
					<SheetDescription />
				</SheetHeader>
			</SheetContent>
		</Sheet>
	)
}
