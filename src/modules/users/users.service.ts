import { prisma } from "../../lib/prisma.js"

export class UsersService {
    async getProfile(userId: string) {
        
        const user = await prisma.user.findUnique({

            where: { id: userId },
            include: {
                physicalPersonProfile: true,
                corporationProfile: true,
            },
        })

        if (!user) {
            throw new Error("Usuário não encontrado.")
        }

        const { password, ...profile } = user

        return profile

    }
}