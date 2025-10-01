export type CreateDeviceDTO = {
    name: string
    model?: string
    brand?: string
    voltage: number
    power: number // Potência em Watts
}

export type UpdateDeviceDTO = {
    name?: string
    model?: string
    brand?: string
    voltage?: number
    power?: number
}