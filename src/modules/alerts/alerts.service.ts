import { prisma } from "../../lib/prisma.js"
import type { CreateAlertRuleDTO, UpdateAlertRuleDTO } from "./alerts.types.js";

export class AlertsService {
    async create(data: CreateAlertRuleDTO, userId: string) {
        const { name, threshold, timeWindow, targetType, targetId } = data
        
        let createData: any = { name, threshold, timeWindow };

        switch (targetType) {
            case "PROPERTY":
                const property = await prisma.property.findFirst({ where: { 
                    id: targetId, 
                    userId } 
                })

                if (!property) {
                    throw new Error("Propriedade não encontrada ou não pertence ao usuário.")
                }

                createData.property = { connect: { id: property.id } }
                break
            case "AREA":
                const area = await prisma.area.findFirst({ where: { 
                    id: targetId, 
                    property: { userId } } 
                })

                if (!area) {
                    throw new Error("Área não encontrada ou não pertence ao usuário.")
                }

                createData.area = { connect: { id: area.id } }
                break
            case "DEVICE":
                const device = await prisma.device.findFirst({ where: { 
                    id: targetId, 
                    area: { property: { userId } } } 
                })

                if (!device) {
                    throw new Error("Dispositivo não encontrado ou não pertence ao usuário.")
                }

                createData.device = { connect: { id: device.id } }
                break
            default:
                throw new Error("Tipo de alvo inválido.")
        }

        return prisma.alertRule.create({ data: createData })
    }

    async findAllByUser(userId: string) {
        return prisma.alertRule.findMany({
            where: {
                OR: [
                    { property: { userId } },
                    { area: { property: { userId } } },
                    { device: { area: { property: { userId } } } }
                ],
            },
        })
    }
    
    async update(alertRuleId: string, data: UpdateAlertRuleDTO, userId: string) {
        const ruleExists = await prisma.alertRule.findFirst({
            where: {
                id: alertRuleId,
                OR: [
                    { property: { userId } },
                    { area: { property: { userId } } },
                    { device: { area: { property: { userId } } } }
                ],
            }
        })

        if (!ruleExists) {
            throw new Error("Regra de alerta não encontrada ou não pertence ao usuário.")
        }

        return prisma.alertRule.update({
            where: { id: alertRuleId },
            data
        })
    }

    async delete(alertRuleId: string, userId: string) {
        const result = await prisma.alertRule.deleteMany({
            where: {
                id: alertRuleId,
                OR: [
                    { property: { userId } },
                    { area: { property: { userId } } },
                    { device: { area: { property: { userId } } } },
                ],
            }
        })

        if (result.count === 0) {
            throw new Error("Regra de alerta не encontrada ou não pertence ao usuário.")
        }
    }
}