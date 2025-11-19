import type { Request, Response } from "express"
import { DevicesService } from "./devices.service.js"

const devicesService = new DevicesService()

export class DevicesController {
    async create(req: Request, res: Response) {

        const { areaId } = req.params

        if (!areaId) {
            return res.status(400).json({ message: "O ID da área é obrigatório." })
        }

        const userId = req.userId
        const data = req.body
        const newDevice = await devicesService.create(data, areaId, userId)

        return res.status(201).json(newDevice)
    }

    async findAllByArea(req: Request, res: Response) {

        const { areaId } = req.params

        if (!areaId) {
        return res.status(400).json({ message: "O ID da área é obrigatório." })
        }

        const userId = req.userId
        const devices = await devicesService.findAllByArea(areaId, userId)

        return res.json(devices)
    }

    async update(req: Request, res: Response) {

        const { deviceId } = req.params

        if (!deviceId) {
            return res.status(400).json({ message: "O ID do dispositivo é obrigatório." })
        }

        const userId = req.userId
        const data = req.body
        const updatedDevice = await devicesService.update(deviceId, data, userId)

        return res.json(updatedDevice)
    }

    async delete(req: Request, res: Response) {

        const { deviceId } = req.params

        if (!deviceId) {
            return res.status(400).json({ message: "O ID do dispositivo é obrigatório." })
        }

        const userId = req.userId
        await devicesService.delete(deviceId, userId)
        
        return res.status(204).send()
    }
}