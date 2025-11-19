import { z } from "zod"

const simulatedDeviceSchema = z.object({
    name: z.string().min(1, "O nome do dispositivo simulado é obrigatório."),
    power: z.number().positive("A potência deve ser um número positivo."),
    usageHoursPerDay: z.number().min(0).max(24, "As horas de uso devem estar entre 0 e 24."),
})

export const costSimulationSchema = z.object({
    propertyId: z.uuid("O ID da propriedade deve ser um UUID válido."),
    period: z.enum(["day", "month", "year"], {
        message: "O período deve ser 'day', 'month' ou 'year'.",
    }),
    devices: z.array(simulatedDeviceSchema).min(1, "A lista de dispositivos não pode estar vazia."),
})