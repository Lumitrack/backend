import { Router } from "express"
import { AlertsController } from "./alerts.controller.js"
import { isAuthenticated } from "../../shared/middlewares/isAuthenticated.js"

const alertsRouter = Router()
const alertsController = new AlertsController()

alertsRouter.use(isAuthenticated)

alertsRouter.post("/", alertsController.create)
alertsRouter.get("/", alertsController.findAllByUser)
alertsRouter.put("/:id", alertsController.update)
alertsRouter.delete("/:id", alertsController.delete)

export { alertsRouter }