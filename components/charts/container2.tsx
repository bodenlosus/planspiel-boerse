import "./container.css"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import React, { Suspense } from "react"
import PageLoader from "../loaders/page_loader"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip"

interface ChartT extends React.ComponentPropsWithoutRef<"div"> {
	name: string
}

interface ChartContainerT extends React.ComponentPropsWithoutRef<"div"> {
	defaultName?: string
}

interface IconT extends React.ComponentPropsWithoutRef<"div"> {
	name: string
}

export function Chart({ name: _, children }: ChartT) {
	return children
}

export function ChartIcon({ name: _, children }: IconT) {
	return children
}

export function ChartContainer({
	defaultName,
	children,
	className,
}: ChartContainerT) {
	return (
		<Suspense fallback={<PageLoader />}>
			<Tabs defaultValue={defaultName} className={className}>
				{React.Children.map(children, (child) => {
					if (!React.isValidElement(child)) {
						return <></>
					}
					if (child.type === Chart) {
						return (
							<TabsContent key={child.key} value={child.props.name}>
								{React.cloneElement(child)}
							</TabsContent>
						)
					}

					return <></>
				})}
				<div className="w-full h-fit p-2 bg-background border-t md:p-0">
					<TabsList className="bg-transparent flex flex-row gap-2 justify-around justify-items-stretch md:justify-start">
						{React.Children.map(children, (child) => {
							if (!React.isValidElement(child)) {
								return <></>
							}
							if (child.type === ChartIcon) {
								return (
									<TabsTrigger
										className="grow md:grow-0 p-0 data-[state=active]:bg-secondary *:data-[state=active]:stroke-foreground *:hover:stroke-foreground hover:bg-secondary/50 transition-colors *:transition-colors"
										key={child.key}
										value={child.props.name}
									>
										<TooltipProvider>
											<Tooltip>
												<TooltipTrigger
													className="w-full h-full px-2 py-1 box-content"
													asChild
												>
													{React.cloneElement(child)}
												</TooltipTrigger>
												<TooltipContent>
													<p>{child.props.name}</p>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									</TabsTrigger>
								)
							}
						})}
					</TabsList>
				</div>
			</Tabs>
		</Suspense>
	)
}
