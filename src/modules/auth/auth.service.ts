import { compare, hash } from "bcryptjs"
import jwt from "jsonwebtoken"
import { prisma } from "../../lib/prisma.js"
import type { LoginUserDTO, RegisterUserDTO } from "./auth.types.js"

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

    async login(data: LoginUserDTO) {
        const user = await prisma.user.findUnique({
            where: { email: data.email },
        })

        if (!user) {
            throw new Error("Credenciais inválidas.")
        }

        const isPasswordValid = await compare(data.password, user.password)

        if (!isPasswordValid) {
            throw new Error("Credenciais inválidas.")
        }

        const jwtSecret = process.env.JWT_SECRET

        if (!jwtSecret) {
            throw new Error("Variável de ambiente JWT_SECRET não configurada.")
        }

        const token = jwt.sign(
            {
                // Payload: informações que queremos guardar no token
                name: user.name,
                email: user.email,
            },
            jwtSecret,
            {
                subject: user.id, // O "dono" do token, geralmente o ID do usuário
                expiresIn: "1d", // O token expira em 1 dia
            },
        )

        const { password, ...userWithoutPassword } = user
        return {
            user: userWithoutPassword,
            token,
        }
    }

    async logout(token: string) {
        await prisma.revokedToken.create({
            data: {
                token,
            }
        })
    }

}