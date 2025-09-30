
import type { Request, Response } from "express"
import { PropertiesService } from "./properties.service.js"

const propertiesService = new PropertiesService()

export class PropertiesController {
    async create(req: Request, res: Response) {

        const userId = req.userId
        const data = req.body
        const newProperty = await propertiesService.create(data, userId)

        return res.status(201).json(newProperty)
    }

    async findAllByUser(req: Request, res: Response) {

        const userId = req.userId
        const properties = await propertiesService.findAllByUser(userId)

        return res.json(properties)
    }

    async findById(req: Request, res: Response) {

        const userId = req.userId
        const { id } = req.params

        if (!id) {
            return res.status(400).json({ message: "O ID da propriedade é obrigatório." })
        }

        const property = await propertiesService.findById(id, userId)

        return res.json(property)
    }

    async update(req: Request, res: Response) {

        const userId = req.userId
        const { id } = req.params
        const data = req.body

        if (!id) {
            return res.status(400).json({ message: "O ID da propriedade é obrigatório." })
        }

        const updatedProperty = await propertiesService.update(id, data, userId)

        return res.json(updatedProperty)
    }

    async delete(req: Request, res: Response) {

        const userId = req.userId
        const { id } = req.params

        if (!id) {
            return res.status(400).json({ message: "O ID da propriedade é obrigatório." })
        }

        await propertiesService.delete(id, userId)
        
        return res.status(204).send()
    }
}