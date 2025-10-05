import cron from "node-cron"
import { prisma } from "../../lib/prisma.js"
import jwt from "jsonwebtoken"

console.log("Limpeza de tokens foi inicializada.")

/**
 * Roda todos os dias à meia-noite ("0 0 * * *").
 * Revoga todos os tokens expirados
 */
cron.schedule("0 0 * * *", async () => {
    console.log(`[${new Date().toISOString()}] Executando cron: Limpando tokens expirados...`)

    try {
        const allRevokedTokens = await prisma.revokedToken.findMany()
        const tokensToDelete: string[] = []
        const currentTimeInSeconds = Math.floor(Date.now() / 1000)

        for (const record of allRevokedTokens) {
            const decodedToken = jwt.decode(record.token) as { exp?: number }

            if (decodedToken && decodedToken.exp && decodedToken.exp < currentTimeInSeconds) {
                tokensToDelete.push(record.id)
            }
        }

        if (tokensToDelete.length > 0) {
            const { count } = await prisma.revokedToken.deleteMany({
                where: {
                    id: {
                        in: tokensToDelete,
                    }
                }
            })
            console.log(`${count} tokens expirados removidos com sucesso.`)
        } else {
            console.log("Não há tokens expirados para remover.");
        }
    } catch (error) {
        console.error("Erro durante a limpeza de tokens:", error);
    }
});