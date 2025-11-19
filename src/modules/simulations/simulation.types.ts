import { z } from "zod"
import type { costSimulationSchema } from "./simulation.schemas.js"

export type CostSimulationDTO = z.infer<typeof costSimulationSchema>