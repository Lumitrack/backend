import { Router } from "express"
import { NotificationsController } from "./notifications.controller.js"
import { isAuthenticated } from "../../shared/middlewares/isAuthenticated.js"

const notificationsRouter = Router()
const notificationsController = new NotificationsController()

notificationsRouter.use(isAuthenticated)

notificationsRouter.get("/count", notificationsController.getUnreadCount)
notificationsRouter.post("/read-all", notificationsController.markAllAsRead)
notificationsRouter.get("/", notificationsController.findAllByUser)
notificationsRouter.patch("/:id/read", notificationsController.markAsRead)

export { notificationsRouter }