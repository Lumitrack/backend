import { z } from "zod"
import { SystemType } from "@prisma/client"

export const createDistributorSchema = z.object({
    name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres."),
    cnpj: z.string().optional(),
    systemType: z.nativeEnum(SystemType, {
        message: "O tipo de sistema é inválido. Valores aceitos: MONOPHASIC, BIPHASIC, TRIPHASIC.",
    }),
    voltage: z.number().positive("A tensão deve ser um número positivo."),
    kwhPrice: z.number().positive("O preço do kWh deve ser um número positivo."),
})

export const updateDistributorSchema = createDistributorSchema.partial()