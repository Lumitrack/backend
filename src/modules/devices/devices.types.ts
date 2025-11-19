import { z } from "zod"
import type { createDeviceSchema, updateDeviceSchema } from "./devices.schemas.js"

export type CreateDeviceDTO = z.infer<typeof createDeviceSchema>
export type UpdateDeviceDTO = z.infer<typeof updateDeviceSchema>