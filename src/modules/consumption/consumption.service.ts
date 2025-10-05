import type { LinkTargetType } from "modules/iot/iot.types.js"
import { prisma } from "../../lib/prisma.js"
import type { CreateManualConsumptionDTO } from "./consumption.types.js"
import { Prisma } from "@prisma/client"

export type GetHistoryOptions = {
    targetType: LinkTargetType
    targetId: string
    period: "daily" | "monthly" | "annual"
    startDate?: string | undefined
    endDate?: string | undefined
}

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

    async getHistory(options: GetHistoryOptions, userId: string) {
        const { targetType, targetId, period, startDate, endDate } = options

        switch (targetType) {
            case "PROPERTY":
                const property = await prisma.property.findFirst({ where: { 
                    id: targetId, userId } 
                })

                if (!property) {
                    throw new Error("Propriedade não encontrada ou não pertence ao usuário.")
                }

                break
            case "AREA":
                const area = await prisma.area.findFirst({ where: { 
                    id: targetId, 
                    property: { userId } } 
                })

                if (!area) {
                    throw new Error("Área não encontrada ou não pertence ao usuário.")
                }

                break
            case "DEVICE":
                const device = await prisma.device.findFirst({ where: { 
                    id: targetId, 
                    area: { property: { userId } } } 
                })

                if (!device) {
                    throw new Error("Aparelho não encontrado ou não pertence ao usuário.")
                }

                break
            default:
                throw new Error("Tipo de alvo inválido.")
        }

        // Montagem da query SQL Raw
        const targetColumn = `${targetType.toLowerCase()}Id`

        // Mapeia o período para o formato do DATE_TRUNC do PostgreSQL
        const periodFormat = {
            daily: "day",
            monthly: "month",
            annual: "year",
        }[period]

        // Cláusulas de data opcionais
        let dateFilters = ""
        const queryParams = [targetId]

        if (startDate) {
            dateFilters += `AND "timestamp" >= $${queryParams.length + 1}`
            queryParams.push(startDate)
        }

        if (endDate) {
            dateFilters += `AND "timestamp" <= $${queryParams.length + 1}`;
            queryParams.push(endDate);
        }
        
        const query = Prisma.sql`
        SELECT
            DATE_TRUNC(${periodFormat}, "timestamp") as "date",
            SUM("consumption") as "totalConsumption"
        FROM
            "EnergyConsumption"
        WHERE
            "${Prisma.raw(targetColumn)}" = $1
            ${Prisma.raw(dateFilters)}
        GROUP BY
            "date"
        ORDER BY
            "date" ASC;
        `;

        // Execução da query
        const result: { date: Date, totalConsumption: number }[] = await prisma.$queryRaw(query, ...queryParams)
        
        // O retorno do Prisma é BigInt para a soma, converte para Number
        return result.map(row => ({
            ...row,
            totalConsumption: Number(row.totalConsumption)
        }));
    }

}