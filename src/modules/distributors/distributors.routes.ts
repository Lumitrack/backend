import { Router } from "express"
import { DistributorsController } from "./distributors.controller.js"
import { isAuthenticated } from "../../shared/middlewares/isAuthenticated.js"

const distributorsRouter = Router()
const distributorsController = new DistributorsController()

distributorsRouter.use(isAuthenticated)

distributorsRouter.post("/", distributorsController.create)
distributorsRouter.get("/", distributorsController.findAllByUser)
distributorsRouter.get("/:id", distributorsController.findById)
distributorsRouter.put("/:id", distributorsController.update)
distributorsRouter.delete("/:id", distributorsController.delete)

export { distributorsRouter }