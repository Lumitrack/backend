import { hash } from "bcryptjs"
import { prisma } from "../../lib/prisma.js"
import type { RegisterUserDTO } from "./auth.types.js"

export class AuthService {
    async register(data: RegisterUserDTO) {

        const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
        })

        if (existingUser) {
        throw new Error("Este e-mail já está em uso.")
        }

        const hashedPassword = await hash(data.password, 12)

        const user = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    name: data.name,
                    email: data.email,
                    password: hashedPassword,
                    userType: data.userType,
                },
            })

            if (data.userType === "PHYSICAL") {
                await tx.physicalPersonProfile.create({
                    data: {
                        userId: newUser.id,
                        birthDate: new Date(data.birthDate), // Converte a string para Data
                        zipCode: data.zipCode,
                        address: data.address,
                        city: data.city,
                        state: data.state,
                        country: data.country,
                    },
                })
            }

            if (data.userType === "CORPORATION") {
                await tx.corporationProfile.create({
                    data: {
                        userId: newUser.id,
                        fantasyName: data.fantasyName,
                        cnpj: data.cnpj,
                        zipCode: data.zipCode,
                        address: data.address,
                        city: data.city,
                        state: data.state,
                        country: data.country,
                    },
                })
            }

            return newUser
        })

        const { password, ...userWithoutPassword } = user
        return userWithoutPassword
    }
}