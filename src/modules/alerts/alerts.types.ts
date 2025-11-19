import { z } from "zod"
import type { createAlertRuleSchema, updateAlertRuleSchema } from "./alerts.schemas.js"

export { linkTargetTypeEnum as AlertTargetType } from "../iot/iot.schemas.js"

export type CreateAlertRuleDTO = z.infer<typeof createAlertRuleSchema>
export type UpdateAlertRuleDTO = z.infer<typeof updateAlertRuleSchema>