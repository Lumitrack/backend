import { prisma } from "../../lib/prisma.js"
import type { CostSimulationDTO } from "./simulation.types.js"

export class SimulationsService {
    async calculateCost(data: CostSimulationDTO, userId: string) {
        const { propertyId, period, devices } = data

        const property = await prisma.property.findFirst({
            where: {
                id: propertyId,
                userId,
            },
            include: {
                distributor: true,
            }
        })

        if (!property) {
            throw new Error("Propriedade não encontrada ou não pertence ao usuário.")
        }

        if (!property.distributor?.kwhPrice) {
            throw new Error("A distribuidora vinculada a esta propriedade não tem um preço de kWh configurado.")
        }

        const kwhPrice = property.distributor.kwhPrice

        let totalKwhPerDay = 0
        for (const device of devices) {
            const deviceKwhPerDay = (device.power / 1000) * device.usageHoursPerDay // Fórmula: (Potência em W / 1000) * Horas de Uso = Consumo em kWh por dia
            totalKwhPerDay += deviceKwhPerDay
        }

        const daysInPeriod = {
            day: 1,
            month: 30, // Usando uma média para simplificar a simulação
            year: 365,
        }[period]

        const totalConsumption = totalKwhPerDay * daysInPeriod
        const totalCost = totalConsumption * kwhPrice

        return {
            simulationPeriod: period,
            numberOfDays: daysInPeriod,
            kwhPrice,
            totalConsumptionKwh: totalConsumption,
            totalEstimatedCost: totalCost,
        }
    }
}