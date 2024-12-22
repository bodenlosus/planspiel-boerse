import { createClient } from "@/utils/supabase/server"

export const getUser = async () => {
	const supabase = createClient()
	const user = await supabase.auth.getUser()
	return user.data.user
}
