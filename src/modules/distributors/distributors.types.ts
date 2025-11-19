import type z from "zod"
import type { createDistributorSchema, updateDistributorSchema } from "./distributors.schemas.js"

export type CreateDistributorDTO = z.infer<typeof createDistributorSchema>
export type UpdateDistributorDTO = z.infer<typeof updateDistributorSchema>