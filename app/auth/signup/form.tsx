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
import { signup } from "../actions_client"

const formSchema = z
	.object({
		fullName: z
			.string({ message: "Please provide your full name" })
			.trim()
			.regex(/^[\w\s]*$/, { message: "Can only include letters and numbers." })
			.min(1)
			.max(100),
		email: z.string().trim().email({
			message: "Please provide a valid E-Mail",
		}),
		password: z
			.string()
			.trim()
			.min(8, { message: "Please provide a valid password" }),
		confirmPassword: z
			.string()
			.trim()
			.min(8, { message: "Please provide a valid password" }),
		termsAccepted: z.boolean({ message: "" }),
	})
	.superRefine(({ password, confirmPassword }, ctx) => {
		if (password === confirmPassword) {
			return
		}
		ctx.addIssue({
			code: "custom",
			message: "Passwords do not match",
			path: ["confirmPassword"],
		})
	})

export default function SignUpForm() {
	const router = useRouter()
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			fullName: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		signup(router.push, values)
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-8 flex flex-col gap-0"
			>
				<FormField
					control={form.control}
					name="fullName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Full Name</FormLabel>
							<FormControl>
								<Input type="text" placeholder="John Doe" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
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
							<FormMessage />
							<FormControl>
								<Input
									className="rounded-b-none border-b-0 focus-visible:ring-2 ring-inset"
									type="password"
									placeholder="Password"
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="confirmPassword"
					render={({ field }) => (
						<FormItem className="!mt-0">
							<FormControl>
								<Input
									className="rounded-t-none focus-visible:ring-2 ring-inset"
									type="password"
									placeholder="Confirm Password"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="termsAccepted"
					render={({ field }) => (
						<FormItem className="flex flex-row items-start space-x-3 space-y-0">
							<FormControl>
								<Checkbox
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
							<FormLabel>
								I accept the{" "}
								<Link className="underline underline-offset-2" href={"/"}>
									Terms
								</Link>
							</FormLabel>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button className="w-full mx-auto" type="submit">
					Create account
				</Button>
			</form>
		</Form>
	)
}
