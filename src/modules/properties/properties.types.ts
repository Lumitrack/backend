import { z } from "zod"
import type { createPropertySchema, updatePropertySchema } from "./properties.schemas.js"


export type CreatePropertyDTO = z.infer<typeof createPropertySchema>
export type UpdatePropertyDTO = z.infer<typeof updatePropertySchema>