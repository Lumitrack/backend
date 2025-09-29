import { prisma } from "../../lib/prisma.js"
import type { CreateDistributorDTO, UpdateDistributorDTO } from "./distributors.types.js"

export class DistributorsService {

    async create(data: CreateDistributorDTO, userId: string) {

        return prisma.energyDistributor.create({
            data: {
                ...data,
                userId, // Vincula a distribuidora ao usuário logado
            },
        })
    }

    async findAllByUser(userId: string) {

        return prisma.energyDistributor.findMany({
            where: { userId },
        })
    }

    async findById(id: string, userId: string) {
        const distributor = await prisma.energyDistributor.findUnique({
            where: { id, userId },
        })

        if (!distributor) {
            throw new Error("Distribuidora não encontrada ou não pertence ao usuário.")
        }

        return distributor
    }

    async update(id: string, data: UpdateDistributorDTO, userId: string) {

        await this.findById(id, userId)

        return prisma.energyDistributor.update({
            where: { id },
        data,
        })
    }

    async delete(id: string, userId: string) {

        await this.findById(id, userId)

        await prisma.energyDistributor.delete({
            where: { id },
        })
    }
}