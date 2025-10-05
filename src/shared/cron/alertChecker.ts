import cron from "node-cron"
import { prisma } from "../../lib/prisma.js"
import { subHours } from "date-fns"

console.log("Checagem de alerta foi inicializado.")

/**
 * Esta tarefa roda a cada hora ("0 * * * *").
 * Busca todas as regras de alerta ativas e verifica se alguma foi violada.
 */
cron.schedule("0 * * * *", async () => {
    const jobStartTime = new Date();
    console.log(`[${jobStartTime.toISOString()}] Checando por violações das regras de alertas...`)

    try {
        const activeRules = await prisma.alertRule.findMany({
            where: { isEnabled: true }
        })

        for (const rule of activeRules) {
            const { id, threshold, timeWindow, propertyId, areaId, deviceId } = rule
            
            const startDate = subHours(jobStartTime, timeWindow)

            // Verifica se já existe uma notificação não lida para esta regra,
            // gerada dentro da janela de tempo atual. Se sim, pula para a próxima regra.
            const existingNotification = await prisma.notification.findFirst({
                where: {
                    alertRuleId: id,
                    isRead: false,
                    createdAt: {
                        gte: startDate,
                    }
                }
            })

            if (existingNotification) {
                continue // Pula para a próxima regra
            }

            let consumptionWhere: any = {
                timestamp: { gte: startDate },
            }
            if (propertyId) {
                consumptionWhere.propertyId = propertyId
            }

            if (areaId) {
                consumptionWhere.areaId = areaId
            }

            if (deviceId) {
                consumptionWhere.deviceId = deviceId
            }
            
            // Soma o consumo para o alvo no período de tempo definido
            const aggregation = await prisma.energyConsumption.aggregate({
                _sum: { consumption: true },
                where: consumptionWhere
            })

            const totalConsumption = aggregation._sum.consumption ?? 0;
            
            // Compara o consumo total com o limite da regra
            if (totalConsumption > threshold) {
                const message = `Alerta "${rule.name}": O consumo de ${totalConsumption.toFixed(2)} kWh ultrapassou o seu limite de ${threshold} kWh nas últimas ${timeWindow} horas.`;
                
                await prisma.notification.create({
                    data: {
                        message,
                        alertRuleId: id,
                    }
                })
                
                console.log(`Notificação criada para a regra"${rule.name}" (ID: ${id})`);
            }
        }
        
        console.log(`Checagem de alerta finalizado com sucesso.`);
    } catch (error) {
        console.error("Erro durante a checagem de alerta:", error);
    }
});