import { z } from "zod"
import { linkTargetTypeEnum } from "../iot/iot.schemas.js"

export const createAlertRuleSchema = z.object({
    name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres."),
    threshold: z.number().positive("O limite (threshold) deve ser um número positivo."),
    timeWindow: z.number().int().positive("A janela de tempo (em horas) deve ser um número inteiro positivo."),
    targetType: linkTargetTypeEnum,
    targetId: z.uuid("O ID do alvo deve ser um UUID válido."),
})

export const updateAlertRuleSchema = z.object({
    name: z.string().min(3).optional(),
    threshold: z.number().positive().optional(),
    timeWindow: z.number().int().positive().optional(),
    isEnabled: z.boolean().optional(),
})