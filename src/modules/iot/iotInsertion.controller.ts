import type { Request, Response } from "express"
import { IoTInsertionService } from "./iotInsertion.service.js"

const insertionService = new IoTInsertionService()

export class IoTInsertionController {
    async logConsumption(req: Request, res: Response) {

        const data = req.body

        try {
            const [log] = await insertionService.logConsumption(data)
            return res.status(201).json(log)
        } catch (error: any) {
            if(error.message.includes("não foi encontrado")){
                return res.status(401).json({ message: error.message })
            }
            return res.status(400).json({ message: error.message })
        }
    }
}