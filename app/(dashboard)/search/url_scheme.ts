import { z } from "zod"

export const urlSchema = z.object({
	query: z.string().min(1).max(100).optional().or(z.literal("")),
})
