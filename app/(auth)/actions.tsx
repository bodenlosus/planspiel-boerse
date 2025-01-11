"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
export async function login(email: string, password: string) {
	const supabase = await createClient()

	// type-casting here for convenience
	// in practice, you should validate your inputs
	const data = {
		email: email as string,
		password: password as string,
	}

	const { error } = await supabase.auth.signInWithPassword(data)

	if (error) {
		return { error: error.message, success: false }
	}

	revalidatePath("/", "layout")

	return { error: null, success: true }
}

export async function signup(
	fullName: string,
	email: string,
	password: string,
) {
	const supabase = await createClient()

	// type-casting here for convenience
	// in practice, you should validate your inputs
	const data = {
		email: email as string,
		password: password as string,
		options: {
			data: { name: fullName as string },
		},
	}

	const { error } = await supabase.auth.signUp(data)

	if (error) {
		return { error: error.message, success: false }
	}

	revalidatePath("/", "layout")

	return { error: null, success: true }
}

export async function logout() {
	const supabase = await createClient()

	await supabase.auth.signOut()
	revalidatePath("/", "layout")
	redirect("/login")
}
