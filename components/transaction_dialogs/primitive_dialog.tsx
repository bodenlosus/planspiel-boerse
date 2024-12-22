import { useRouter } from "next/navigation"
import React from "react"
import { Button } from "../ui/button"
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog"
import { useToast } from "../ui/use-toast"
import BuyStockForm, { type onSubmitValues } from "./buy_stock_form"

interface props extends React.ComponentPropsWithoutRef<"div"> {
	stock: TStock
	depot: TDepot
	handleTransaction: TTransactionHandler
	description?: string
	title?: string
	action?: string
	reload?: boolean
	limit: number
	triggerVariant?: "default" | "secondary" | "outline"
}

export type TStock = {
	name: string
	id: number
	price: number
}

export type TDepot = {
	id: number
	monetaryAssets: number
}
export type TTransactionHandler = (
	stock: TStock,
	amount: number,
	depot: TDepot,
) => Promise<{ error: Error | null; success: { message: string } | null }>

export default function PrimitiveDialog({
	stock,
	depot,
	handleTransaction,
	reload,
	limit,
	description,
	title,
	action,
	triggerVariant,
}: props) {
	const router = useRouter()
	const handleSubmit = async ({ amount }: onSubmitValues) => {
		const { error, success } = await handleTransaction(stock, amount, depot)

		if (error) {
			toast({
				title: "Failed Transaction",
				description: error?.message,
				variant: "destructive",
			})
			return
		}

		toast({
			title: "Successfull Transaction",
			description: success?.message,
			variant: "default",
		})
		setOpen(false)
		if (reload) {
			router.refresh()
		}
	}

	const [isOpen, setOpen] = React.useState(false)
	const { toast } = useToast()
	return (
		<Dialog onOpenChange={(open) => setOpen(open)} open={isOpen}>
			<DialogTrigger asChild>
				<Button
					variant={triggerVariant}
					disabled={limit === 0}
					onClick={() => {
						setOpen(true)
					}}
				>
					{action}
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					<DialogDescription>{description}</DialogDescription>
					<DialogClose />
				</DialogHeader>
				<BuyStockForm onSubmit={handleSubmit} limit={limit} />
			</DialogContent>
		</Dialog>
	)
}
