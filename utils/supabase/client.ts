import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL
	const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
	if (!url || !key) {
		throw new Error("Missing Supabase credentials")
	}
	return createBrowserClient(url, key)
}

export const supabase = createClient()
