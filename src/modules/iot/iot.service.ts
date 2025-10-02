import { prisma } from "../../lib/prisma.js"
import type { CreateIoTDeviceDTO, UpdateIoTDeviceDTO } from "./iot.types.js";

export class IoTService {

    async create(data: CreateIoTDeviceDTO, userId: string) {

        const { name, linkTargetType, targetId } = data
        let iotDeviceData: { name: string; propertyId?: string; areaId?: string; deviceId?: string } = { name };

        switch (linkTargetType) {
        case "PROPERTY":
            const property = await prisma.property.findFirst({
                where: { 
                    id: targetId,
                    userId
                }
            });

            if (!property) {
                throw new Error("Propriedade não encontrada ou não pertence ao usuário.")
            } 

            iotDeviceData.propertyId = property.id
            break
        case "AREA":
            const area = await prisma.area.findFirst({
                where: {
                    id: targetId,
                    property: { userId }
                }
            });

            if (!area) {
                throw new Error("Área não encontrada ou não pertence ao usuário.")
            }

            iotDeviceData.areaId = area.id
            break
        case "DEVICE":
            const device = await prisma.device.findFirst({
                where: {
                    id: targetId,
                    area: { property: { userId } }
                }
            })

            if (!device) {
                throw new Error("Aparelho não encontrado ou não pertence ao usuário.")
            }

            iotDeviceData.deviceId = device.id;
            break;
        default:
            throw new Error("Tipo de alvo inválido.")
        }

        return prisma.ioTDevice.create({ data: iotDeviceData })
    }

    async findAllByUser(userId: string) {

        return prisma.ioTDevice.findMany({
        where: {
            OR: [
                { property: { userId } },
                { area: { property: { userId } } },
                { device: { area: { property: { userId } } } },
            ],
        },
        include: {
            property: { select: { id: true, name: true } },
            area: { select: { id: true, name: true } },
            device: { select: { id: true, name: true } },
        }
        });
    }

    async findById(iotDeviceId: string, userId: string) {

        const iotDevice = await this.findAllByUser(userId)
        const device = iotDevice.find(d => d.id === iotDeviceId)

        if (!device) {
            throw new Error("Dispositivo IoT não encontrado ou não pertence ao usuário.")
        }

        return device;
    }
    
    async update(iotDeviceId: string, data: UpdateIoTDeviceDTO, userId: string) {

        await this.findById(iotDeviceId, userId)

        return prisma.ioTDevice.update({
            where: { id: iotDeviceId },
            data
        })
    }

    async delete(iotDeviceId: string, userId: string) {

        await this.findById(iotDeviceId, userId)

        await prisma.ioTDevice.delete({
            where: { id: iotDeviceId }
        })
    }
}