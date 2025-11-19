import { z } from "zod"

export const linkTargetTypeEnum = z.enum(["PROPERTY", "AREA", "DEVICE"], {
    message: "O tipo de alvo é inválido. Valores aceitos: PROPERTY, AREA, DEVICE.",
})

export const createIoTDeviceSchema = z.object({
    name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres."),
    linkTargetType: linkTargetTypeEnum,
    targetId: z.string().uuid("O ID do alvo deve ser um UUID válido."),
})

export const updateIoTDeviceSchema = z.object({
    name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres.").optional(),
})