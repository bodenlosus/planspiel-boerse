import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip"
import type React from "react"

interface IconT extends React.ComponentPropsWithoutRef<"div"> {
	name: string
}

export default function ChartIcon({ name, children }: IconT) {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger className="w-full h-full px-2 py-1 box-content" asChild>
					{children}
				</TooltipTrigger>
				<TooltipContent>
					<p>{name}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
