import type { Request, Response } from "express"
import { ConsumptionService } from "./consumption.service.js"

const consumptionService = new ConsumptionService()

export class ConsumptionController {
    async createManualLog(req: Request, res: Response) {

        const userId = req.userId
        const data = req.body
        const newLog = await consumptionService.createManualLog(data, userId)
        
        return res.status(201).json(newLog)
    }
}