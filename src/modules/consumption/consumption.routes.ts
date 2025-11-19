import { Router } from "express"
import { ConsumptionController } from "./consumption.controller.js"
import { isAuthenticated } from "../../shared/middlewares/isAuthenticated.js"
import { validateRequest } from "shared/middlewares/validateRequest.js"
import { createManualConsumptionSchema, getHistorySchema } from "./consumption.schemas.js"
import { validateQuery } from "shared/middlewares/validateQuery.js"

const consumptionRouter = Router()
const consumptionController = new ConsumptionController()

consumptionRouter.use(isAuthenticated)

consumptionRouter.post("/manual", validateRequest(createManualConsumptionSchema) ,consumptionController.createManualLog)
consumptionRouter.get('/history', validateQuery(getHistorySchema) ,consumptionController.getHistory)

export { consumptionRouter }