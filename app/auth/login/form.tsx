"use client"

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { login } from "../actions_client"

const formSchema = z.object({
	email: z.string().trim().email({ message: "Please provide a valid E-Mail" }),
	password: z
		.string()
		.trim()
		.min(1, { message: "Please provide a valid password" }),
	rememberUser: z.boolean(),
})

export default function LoginForm() {
	const router = useRouter()
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
			rememberUser: true,
		},
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		login(values, router.push)
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-8 flex flex-col gap-0"
			>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>E-Mail</FormLabel>
							<FormControl>
								<Input
									type="email"
									placeholder="someone@example.com"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input type="password" placeholder="password" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="rememberUser"
					render={({ field }) => (
						<FormItem className="flex flex-row items-start space-x-3 space-y-0">
							<FormControl>
								<Checkbox
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
							<FormLabel>Remember me</FormLabel>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button className="w-full mx-auto" type="submit">
					Log in
				</Button>
				<span className="text-muted-foreground text-sm">
					Forgot login credentials?{" "}
					<Link className={"underline underline-offset-2"} href="/">
						Click here.
					</Link>
				</span>
			</form>
		</Form>
	)
}
