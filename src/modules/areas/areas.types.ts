import { z } from "zod"
import type { createAreaSchema, updateAreaSchema } from "./areas.schemas.js"

export type CreateAreaDTO = z.infer<typeof createAreaSchema>
export type UpdateAreaDTO = z.infer<typeof updateAreaSchema>