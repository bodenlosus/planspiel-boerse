import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import type { ComponentPropsWithoutRef } from "react"
import { Button } from "./ui/button"

interface props extends ComponentPropsWithoutRef<"div"> {
	title?: string
	buttonTitle?: string
}
export default function AdditionalContent({
	children,
	title,
	buttonTitle,
	className,
}: props) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button className="text-muted-foreground" variant={"outline"}>
					{buttonTitle}
				</Button>
			</DialogTrigger>

			<DialogContent className={className}>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				{children}
			</DialogContent>
		</Dialog>
	)
}
