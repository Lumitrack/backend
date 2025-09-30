import { PropertyType } from "@prisma/client"

export type CreatePropertyDTO = {
    name: string
    type: PropertyType // RESIDENTIAL, COMMERCIAL, ou INDUSTRIAL
    zipCode: string
    address: string
    city: string
    state: string
    country: string
    totalAreaSize?: number // Opcional
    distributorId: string // ID da distribuidora a ser vinculada
}

export type UpdatePropertyDTO = {
    name?: string
    type?: PropertyType
    zipCode?: string
    address?: string
    city?: string
    state?: string
    country?: string
    totalAreaSize?: number
    distributorId?: string
}