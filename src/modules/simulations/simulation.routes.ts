import { Router } from "express"
import { SimulationsController } from "./simulation.controller.js"
import { isAuthenticated } from "../../shared/middlewares/isAuthenticated.js"

const simulationsRouter = Router()
const simulationsController = new SimulationsController()

simulationsRouter.use(isAuthenticated)

simulationsRouter.post("/cost", simulationsController.calculateCost)

export { simulationsRouter }