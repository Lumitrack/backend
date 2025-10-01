import { prisma } from "../../lib/prisma.js"
import type { CreateDeviceDTO, UpdateDeviceDTO } from "./devices.types.js"

export class DevicesService {

    private async verifyAreaOwner(areaId: string, userId: string) {
        const area = await prisma.area.findFirst({
            where: {
                    id: areaId,
                    property: {
                        userId: userId,
                    },
            },
        })

        if (!area) {
            throw new Error("Área não encontrada ou não pertence ao usuário.")
        }

        return area
    }

    async create(data: CreateDeviceDTO, areaId: string, userId: string) {

        await this.verifyAreaOwner(areaId, userId)

        return prisma.device.create({
            data: {
                ...data,
                areaId,
            },
        })
    }

    async findAllByArea(areaId: string, userId: string) {

        await this.verifyAreaOwner(areaId, userId)

        return prisma.device.findMany({
            where: { areaId },
        })
    }

    async findById(deviceId: string, userId: string) {

        const device = await prisma.device.findFirst({
        where: {
            id: deviceId,
            area: {
                property: {
                    userId,
                },
            },
        },
        })

        if (!device) {
            throw new Error("Dispositivo não encontrado ou não pertence ao usuário.")
        }
        return device
    }

    async update(deviceId: string, data: UpdateDeviceDTO, userId: string) {

        await this.findById(deviceId, userId) // Garante que o dispositivo pertence ao usuário

        return prisma.device.update({
            where: { id: deviceId },
            data,
        })
    }

    async delete(deviceId: string, userId: string) {
        await this.findById(deviceId, userId)

        await prisma.device.delete({
            where: { id: deviceId },
        })
    }
}