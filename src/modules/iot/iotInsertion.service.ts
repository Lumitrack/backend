import { prisma } from "../../lib/prisma.js"

type IoTDataPayload = {
    apiKey: string
    value: number
}

export class IoTInsertionService {
    async logConsumption(data: IoTDataPayload) {
        const { apiKey, value } = data

        const iotDevice = await prisma.ioTDevice.findUnique({
            where: { apiKey }
        })

        if (!iotDevice) {
            throw new Error("Dispositivo IoT com esta apiKey não foi encontrado.")
        }

        const target = {
            propertyId: iotDevice.propertyId,
            areaId: iotDevice.areaId,
            deviceId: iotDevice.deviceId,
        }

        if (!target.propertyId && !target.areaId && !target.deviceId) {
            throw new Error("Dispositivo IoT não está vinculado a nenhuma entidade.")
        }

        return prisma.$transaction([
            prisma.energyConsumption.create({
                data: {
                    ...target,
                    consumption: value,
                    timestamp: new Date(),
                    isManual: false,
                },
            }),
            prisma.ioTDevice.update({
                where: { id: iotDevice.id },
                data: {
                    online: true,
                    lastConnectedAt: new Date(),
                },
            }),
        ])
    }
}