import type { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { prisma } from "lib/prisma.js"

// Adiciona o ID do usuário ao objeto Request do Express
interface TokenPayload {
  sub: string // "sub" é o "subject", onde guardamos o ID do usuário
}

export async function isAuthenticated(req: Request, res: Response, next: NextFunction) {

    const authToken = req.headers.authorization // Recebe token do cabeçalho de autorização

    if (!authToken) {
        return res.status(401).json({ message: "Token não fornecido." })
    }

    //const [, token] = authToken.split(" ")
    const tokenParts = authToken.split(" ")


    // Verifica se o formato do token é "Bearer [token]"
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
        return res.status(401).json({ message: "Token com formato inválido." })
    }

    const token = tokenParts[1]
    
    if (!token) {
        return res.status(401).json({ message: "Token malformado." });
    }

    const isTokenRevoked = await prisma.revokedToken.findUnique({
        where: { token },
    })

    if (isTokenRevoked) {
        return res.status(401).json({ message: "Token revogado. Faça login novamente." })
    }

    const jwtSecret = process.env.JWT_SECRET

    if (!jwtSecret) {
        throw new Error("Variável de ambiente JWT_SECRET não configurada.")
    }

    try {
        const { sub } = jwt.verify(token!, jwtSecret) as TokenPayload

        req.userId = sub

        return next()
    } catch (err) {
        return res.status(401).json({ message: "Token inválido." })
    }

}