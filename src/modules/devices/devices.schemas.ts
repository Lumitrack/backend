import { z } from "zod"

export const createDeviceSchema = z.object({
    name: z.string().min(1, "O nome é obrigatório."),
    model: z.string().optional(),
    brand: z.string().optional(),
    voltage: z.number().positive("A tensão deve ser um número positivo."),
    power: z.number().positive("A potência deve ser um número positivo."),
})

export const updateDeviceSchema = createDeviceSchema.partial()