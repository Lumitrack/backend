import { Router } from "express"
import { ConsumptionController } from "./consumption.controller.js"
import { isAuthenticated } from "../../shared/middlewares/isAuthenticated.js"

const consumptionRouter = Router()
const consumptionController = new ConsumptionController()

consumptionRouter.use(isAuthenticated)

consumptionRouter.post("/manual", consumptionController.createManualLog)
consumptionRouter.get('/history', consumptionController.getHistory)

export { consumptionRouter }