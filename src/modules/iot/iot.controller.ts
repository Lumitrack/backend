import type { Request, Response } from "express"
import { IoTService } from "./iot.service.js"

const iotService = new IoTService()

export class IoTController {
    async create(req: Request, res: Response) {

        const userId = req.userId
        const data = req.body
        const newIoTDevice = await iotService.create(data, userId)

        return res.status(201).json(newIoTDevice)
    }

    async findAllByUser(req: Request, res: Response) {

        const userId = req.userId
        const iotDevices = await iotService.findAllByUser(userId)

        return res.json(iotDevices)
    }

    async update(req: Request, res: Response) {

        const { id } = req.params

        if (!id) {
            return res.status(400).json({ message: "O ID do dispositivo IoT é obrigatório." })
        }
        
        const userId = req.userId
        const data = req.body
        const updatedIoTDevice = await iotService.update(id, data, userId)

        return res.json(updatedIoTDevice)
    }

    async delete(req: Request, res: Response) {

        const { id } = req.params

        if (!id) {
            return res.status(400).json({ message: "O ID do dispositivo IoT é obrigatório." })
        }

        const userId = req.userId
        await iotService.delete(id, userId)
        
        return res.status(204).send()
    }
}