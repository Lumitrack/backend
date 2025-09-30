import { prisma } from "../../lib/prisma.js"
import type { CreatePropertyDTO, UpdatePropertyDTO } from "./properties.types.js"

export class PropertiesService {

    async create(data: CreatePropertyDTO, userId: string) {

        const distributorExists = await prisma.energyDistributor.findFirst({
            where: {
                id: data.distributorId,
                userId,
            },
        })

        if (!distributorExists) {
            throw new Error("Distribuidora não encontrada ou não pertence ao usuário.")
        }

        return prisma.property.create({
            data: {
                ...data,
                userId, // Vincula a propriedade ao usuário logado
            },
        })
    }

    async findAllByUser(userId: string) {

        return prisma.property.findMany({
            where: { userId },
            include: {
                distributor: true, // Inclui os dados da distribuidora vinculada
            },
        })
    }

    async findById(id: string, userId: string) {

        const property = await prisma.property.findUnique({
            where: { id, userId },
            include: {
                distributor: true,
            },
        })

        if (!property) {
            throw new Error("Propriedade não encontrada ou não pertence ao usuário.")
        }

        return property
    }

    async update(id: string, data: UpdatePropertyDTO, userId: string) {

        await this.findById(id, userId)

        if (data.distributorId) {
            const distributorExists = await prisma.energyDistributor.findFirst({
                where: {
                    id: data.distributorId,
                    userId,
                },
            })

            if (!distributorExists) {
                throw new Error("Nova distribuidora não encontrada ou não pertence ao usuário.")
            }
        }

        return prisma.property.update({
            where: { id },
            data,
        })
    }

    async delete(id: string, userId: string) {

        await this.findById(id, userId)

        await prisma.property.delete({
            where: { id },
        })
    }
}