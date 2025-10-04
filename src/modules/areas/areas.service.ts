import { prisma } from "../../lib/prisma.js"
import type { CreateAreaDTO, UpdateAreaDTO } from "./areas.types.js"

export class AreasService {

    private async verifyPropertyOwner(propertyId: string, userId: string) {

        const property = await prisma.property.findUnique({
            where: { id: propertyId, userId },
        })
        if (!property) {
            throw new Error("Propriedade não encontrada ou não pertence ao usuário.")
        }

        return property
    }

    async create(data: CreateAreaDTO, propertyId: string, userId: string) {

        await this.verifyPropertyOwner(propertyId, userId)

        return prisma.area.create({
            data: {
                ...data,
                propertyId,
            },
        })
    }

    async findAllByProperty(propertyId: string, userId: string) {

        await this.verifyPropertyOwner(propertyId, userId)

        return prisma.area.findMany({
            where: { propertyId },
        })
    }

    async findById(areaId: string, userId: string) {
        const area = await prisma.area.findUnique({
            where: { id: areaId },
            include: { property: true }, // Inclui a propriedade para checar o dono
        })

        if (!area || area.property.userId !== userId) {
            throw new Error("Área não encontrada ou não pertence ao usuário.")
        }

        return area
    }

    async update(areaId: string, data: UpdateAreaDTO, userId: string) {
        const result = await prisma.area.updateMany({
            where: {
                id: areaId,
                property: {
                    userId: userId,
                },
            },
            data,
        })

        if (result.count === 0) {
            throw new Error("Área não encontrada ou não pertence ao usuário.")
        }
    }

    async delete(areaId: string, userId: string) {
        const result = await prisma.area.deleteMany({
            where: {
                id: areaId,
                property: {
                    userId: userId,
                },
            },
        })

        if (result.count === 0) {
            throw new Error("Área não encontrada ou não pertence ao usuário.")
        }
    }
}