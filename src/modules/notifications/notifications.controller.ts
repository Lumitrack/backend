import type { Request, Response } from "express"
import { NotificationsService } from "./notifications.service.js"

const notificationsService = new NotificationsService()

export class NotificationsController {
    async findAllByUser(req: Request, res: Response) {
        const unreadOnly = req.query.unread === "true"
        const notifications = await notificationsService.findAllByUser(req.userId, unreadOnly)
        return res.json(notifications)
    }

    async getUnreadCount(req: Request, res: Response) {
        const count = await notificationsService.getUnreadCount(req.userId)
        return res.json({ count })
    }

    async markAsRead(req: Request, res: Response) {
        const { id } = req.params

        if(!id) {
            return res.status(400).json({ message: "O ID da notificação é obrigatório." })
        }

        await notificationsService.markAsRead(id, req.userId)
        return res.status(204).send()
    }

    async markAllAsRead(req: Request, res: Response) {
        await notificationsService.markAllAsRead(req.userId)
        return res.status(204).send()
    }
}