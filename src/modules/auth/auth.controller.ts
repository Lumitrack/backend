import type { Request, Response } from 'express'
import { AuthService } from './auth.service.js'

const authService = new AuthService()

export class AuthController {
    async register(req: Request, res: Response) {

        const userData = req.body // Pega os dados do corpo da requisição

        const newUser = await authService.register(userData) // Chama o service para aplicar a regra de negócio

        return res.status(201).json(newUser) // Retorna o usuário criado com status 201 (Created)
    }
}