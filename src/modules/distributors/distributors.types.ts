import { SystemType } from "@prisma/client"

export type CreateDistributorDTO = {
    name: string
    cnpj?: string // Opcional
    systemType: SystemType // MONOPHASIC, BIPHASIC, TRIPHASIC
    voltage: number
    kwhPrice: number
}

export type UpdateDistributorDTO = {
    name?: string
    cnpj?: string
    systemType?: SystemType
    voltage?: number
    kwhPrice?: number
}