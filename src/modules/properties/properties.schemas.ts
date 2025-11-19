import { z } from "zod"
import { PropertyType } from "@prisma/client"

export const createPropertySchema = z.object({
    name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres."),
    type: z.enum(PropertyType, {
            message: "O tipo de propriedade é inválido. Valores aceitos: RESIDENTIAL, COMMERCIAL, INDUSTRIAL.",
    }),
    zipCode: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    totalAreaSize: z.number().positive("A área total deve ser um número positivo.").optional(),
    distributorId: z.uuid("O ID da distribuidora deve ser um UUID válido."),
})

export const updatePropertySchema = createPropertySchema.partial()