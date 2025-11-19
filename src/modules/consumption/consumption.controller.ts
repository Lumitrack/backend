import type { Request, Response } from "express"
import { ConsumptionService, type GetHistoryOptions } from "./consumption.service.js"
import type { LinkTargetType } from "modules/iot/iot.types.js"

const consumptionService = new ConsumptionService()

export class ConsumptionController {
    async createManualLog(req: Request, res: Response) {

        const userId = req.userId
        const data = req.body
        const newLog = await consumptionService.createManualLog(data, userId)
        
        return res.status(201).json(newLog)
    }

    async getHistory(req: Request, res: Response) {
        const userId = req.userId
        const { targetType, targetId, period, startDate, endDate } = req.query

        const options: GetHistoryOptions = {
            targetType: targetType as LinkTargetType,
            targetId: targetId as string,
            period: period as "daily" | "monthly" | "annual",
            startDate: startDate as string | undefined,
            endDate: endDate as string | undefined,
        }

        const history = await consumptionService.getHistory(options, userId)
        return res.json(history)
    }
}