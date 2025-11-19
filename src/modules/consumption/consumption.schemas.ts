import { z } from "zod"
import { linkTargetTypeEnum } from "../iot/iot.schemas.js"

export const createManualConsumptionSchema = z.object({
    targetType: linkTargetTypeEnum,
    targetId: z.uuid("O ID do alvo deve ser um UUID válido."),
    consumption: z.number().positive("O valor de consumo deve ser um número positivo."),
    timestamp: z.iso.datetime({ message: "O timestamp deve estar no formato ISO 8601." }),
})