interface SimulatedDevice {
    name: string
    power: number // Potência em Watts
    usageHoursPerDay: number // Horas de uso por dia
}

export type CostSimulationDTO = {
    propertyId: string
    period: "day" | "month" | "year"
    devices: SimulatedDevice[]
}