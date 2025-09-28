import type { Request, Response } from "express"
import { UsersService } from "./users.service.js"

const usersService = new UsersService()

export class UsersController {
    async getProfile(req: Request, res: Response) {

        // @ts-ignore
        const userId = req.userId // Pegamos o ID injetado pelo middleware!
        const profile = await usersService.getProfile(userId)
        
        return res.json(profile)

    }
}