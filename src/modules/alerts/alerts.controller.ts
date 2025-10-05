import type { Request, Response } from "express"
import { AlertsService } from "./alerts.service.js"

const alertsService = new AlertsService()

export class AlertsController {
    async create(req: Request, res: Response) {
        const newRule = await alertsService.create(req.body, req.userId)
        return res.status(201).json(newRule)
    }

    async findAllByUser(req: Request, res: Response) {
        const rules = await alertsService.findAllByUser(req.userId)
        return res.json(rules)
    }

    async update(req: Request, res: Response) {
        const { id } = req.params

        if(!id) {
            return res.status(400).json({ message: "O ID do alerta é obrigatório." })
        }

        const updatedRule = await alertsService.update(id, req.body, req.userId)
        return res.json(updatedRule)
    }

    async delete(req: Request, res: Response) {
        const { id } = req.params

        if(!id) {
            return res.status(400).json({ message: "O ID do alerta é obrigatório." })
        }

        await alertsService.delete(id, req.userId)
        return res.status(204).send()
    }
}