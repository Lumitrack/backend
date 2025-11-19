import { z } from "zod"

export const createAreaSchema = z.object({
    name: z.string().min(1, "O nome da área é obrigatório."),
    areaSize: z.number().positive("O tamanho da área deve ser um número positivo.").optional(),
})

export const updateAreaSchema = createAreaSchema.partial()