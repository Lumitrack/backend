import type { z } from "zod"
import type { createManualConsumptionSchema } from "./consumption.schemas.js"

export type CreateManualConsumptionDTO = z.infer<typeof createManualConsumptionSchema>