import { prisma } from "../../lib/prisma.js"
import type { CreateManualConsumptionDTO } from "./consumption.types.js"

export class ConsumptionService {
    async createManualLog(data: CreateManualConsumptionDTO, userId: string) {
        const { targetType, targetId, consumption, timestamp } = data

        let consumptionData: any = {
            consumption,
            timestamp: new Date(timestamp),
            isManual: true,
        }

        const isMonitoredByIoT = await prisma.ioTDevice.findFirst({
            where: {
                OR: [
                    { propertyId: targetId },
                    { areaId: targetId },
                    { deviceId: targetId }
                ],
            },
        })

        if (isMonitoredByIoT) {
            throw new Error("Esta entidade já é monitorada por um dispositivo IoT e não aceita registros manuais.")
        }

        switch (targetType) {
            case "PROPERTY":
                const property = await prisma.property.findFirst({ where: {
                    id: targetId,
                    userId
                    }
                })

                if (!property) {
                    throw new Error("Propriedade não encontrada ou não pertence ao usuário.")
                }

                consumptionData.propertyId = property.id
                break
            case "AREA":
                const area = await prisma.area.findFirst({ where: {
                    id: targetId,
                    property: { userId } 
                    } 
                })

                if (!area) {
                    throw new Error("Área não encontrada ou não pertence ao usuário.")
                }

                consumptionData.areaId = area.id
                break
            case "DEVICE":
                const device = await prisma.device.findFirst({ where: { 
                    id: targetId,
                    area: { property: { userId } }
                    } 
                })

                if (!device) {
                    throw new Error("Aparelho não encontrado ou não pertence ao usuário.")
                }

                consumptionData.deviceId = device.id
                break
            default:
                throw new Error("Tipo de alvo inválido.")
        }

        return prisma.energyConsumption.create({ data: consumptionData })
    }
}