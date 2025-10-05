import type { Request, Response } from "express"
import { AuthService } from "./auth.service.js"

const authService = new AuthService()

export class AuthController {
    async register(req: Request, res: Response) {

        const userData = req.body // Pega os dados do corpo da requisição
        const newUser = await authService.register(userData) // Chama o service para aplicar a regra de negócio
        return res.status(201).json(newUser) // Retorna o usuário criado com status 201 (Created)

    }

    async login(req: Request, res: Response) {

        const loginData = req.body
        const result = await authService.login(loginData)
        return res.json(result)
        
    }

    async logout(req: Request, res: Response) {
        const authToken = req.headers.authorization

        if (!authToken) {
            return res.status(401).json({ message: "Token não fornecido." })
        }

        const [, token] = authToken.split(" ")

        if (!token) {
            return res.status(401).json({ message: "Token malformado." });
        }
        
        await authService.logout(token)

        return res.status(204).send()
    }
}