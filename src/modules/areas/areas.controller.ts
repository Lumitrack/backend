import type { Request, Response } from "express"
import { AreasService } from "./areas.service.js"

const areasService = new AreasService()

export class AreasController {
    async create(req: Request, res: Response) {

        const { propertyId } = req.params
        const userId = req.userId

        if (!propertyId) {
            return res.status(400).json({ message: "O ID da propriedade é obrigatório." })
        }

        const data = req.body
        const newArea = await areasService.create(data, propertyId, userId)

        return res.status(201).json(newArea)
    }

    async findAllByProperty(req: Request, res: Response) {

        const { propertyId } = req.params
        const userId = req.userId

        if (!propertyId) {
            return res.status(400).json({ message: "O ID da propriedade é obrigatório." })
        }

        const areas = await areasService.findAllByProperty(propertyId, userId)

        return res.json(areas)
    }

    async update(req: Request, res: Response) {

        const { areaId } = req.params
        const userId = req.userId

        if (!areaId) {
            return res.status(400).json({ message: "O ID da área é obrigatório." })
        }

        const data = req.body
        const updatedArea = await areasService.update(areaId, data, userId)
        
        return res.json(updatedArea)
    }

    async delete(req: Request, res: Response) {
        const { areaId } = req.params
        const userId = req.userId

        if (!areaId) {
            return res.status(400).json({ message: "O ID da área é obrigatório." })
        }

        await areasService.delete(areaId, userId)

        return res.status(204).send()
    }
}