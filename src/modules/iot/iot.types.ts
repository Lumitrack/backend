import { z } from "zod"
import type { createIoTDeviceSchema, linkTargetTypeEnum, updateIoTDeviceSchema } from "./iot.schemas.js"

export type LinkTargetType = z.infer<typeof linkTargetTypeEnum>
export type CreateIoTDeviceDTO = z.infer<typeof createIoTDeviceSchema>
export type UpdateIoTDeviceDTO = z.infer<typeof updateIoTDeviceSchema>