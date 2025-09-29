import type { Request, Response } from "express"
import { DistributorsService } from "./distributors.service.js"

const distributorsService = new DistributorsService()

export class DistributorsController {
    async create(req: Request, res: Response) {

        const userId = req.userId
        const data = req.body
        const newDistributor = await distributorsService.create(data, userId)

        return res.status(201).json(newDistributor)
    }

    async findAllByUser(req: Request, res: Response) {

        const userId = req.userId
        const distributors = await distributorsService.findAllByUser(userId)

        return res.json(distributors)
    }

    async findById(req: Request, res: Response) {

        const userId = req.userId
        const { id } = req.params

        if (!id) {
            return res.status(400).json({ message: "O ID da distribuidora é obrigatório." })
        }

        const distributor = await distributorsService.findById(id, userId)

        return res.json(distributor)
    }

    async update(req: Request, res: Response) {

        const userId = req.userId
        const { id } = req.params
        const data = req.body

        if (!id) {
            return res.status(400).json({ message: "O ID da distribuidora é obrigatório." })
        }

        const updatedDistributor = await distributorsService.update(id, data, userId)

        return res.json(updatedDistributor)
    }

    async delete(req: Request, res: Response) {

        const userId = req.userId
        const { id } = req.params

        if (!id) {
            return res.status(400).json({ message: "O ID da distribuidora é obrigatório." })
        }

        await distributorsService.delete(id, userId)
        
        return res.status(204).send()
    }
}