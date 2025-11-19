import { Router } from "express"
import { ConsumptionController } from "./consumption.controller.js"
import { isAuthenticated } from "../../shared/middlewares/isAuthenticated.js"
import { validateRequest } from "shared/middlewares/validateRequest.js"
import { createManualConsumptionSchema } from "./consumption.schemas.js"

const consumptionRouter = Router()
const consumptionController = new ConsumptionController()

consumptionRouter.use(isAuthenticated)

consumptionRouter.post("/manual", validateRequest(createManualConsumptionSchema) ,consumptionController.createManualLog)
consumptionRouter.get('/history', consumptionController.getHistory)

export { consumptionRouter }