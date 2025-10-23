import type { Request, Response } from "express"
import { SimulationsService } from "./simulation.service.js"

const simulationsService = new SimulationsService()

export class SimulationsController {
    async calculateCost(req: Request, res: Response) {
        const userId = req.userId
        const simulationData = req.body
        const result = await simulationsService.calculateCost(simulationData, userId)
        return res.json(result)
    }
}