import { Router } from "express"
import { SimulationsController } from "./simulation.controller.js"
import { isAuthenticated } from "../../shared/middlewares/isAuthenticated.js"
import { validateRequest } from "shared/middlewares/validateRequest.js"
import { costSimulationSchema } from "./simulation.schemas.js"

const simulationsRouter = Router()
const simulationsController = new SimulationsController()

simulationsRouter.use(isAuthenticated)

simulationsRouter.post("/cost", validateRequest(costSimulationSchema) ,simulationsController.calculateCost)

export { simulationsRouter }