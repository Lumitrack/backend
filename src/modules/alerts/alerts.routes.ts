import { Router } from "express"
import { AlertsController } from "./alerts.controller.js"
import { isAuthenticated } from "../../shared/middlewares/isAuthenticated.js"
import { validateRequest } from "shared/middlewares/validateRequest.js"
import { createAlertRuleSchema, updateAlertRuleSchema } from "./alerts.schemas.js"

const alertsRouter = Router()
const alertsController = new AlertsController()

alertsRouter.use(isAuthenticated)

alertsRouter.post("/", validateRequest(createAlertRuleSchema) ,alertsController.create)
alertsRouter.get("/", alertsController.findAllByUser)
alertsRouter.put("/:id", validateRequest(updateAlertRuleSchema) ,alertsController.update)
alertsRouter.delete("/:id", alertsController.delete)

export { alertsRouter }