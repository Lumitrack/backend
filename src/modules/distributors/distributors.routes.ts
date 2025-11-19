import { Router } from "express"
import { DistributorsController } from "./distributors.controller.js"
import { isAuthenticated } from "../../shared/middlewares/isAuthenticated.js"
import { validateRequest } from "shared/middlewares/validateRequest.js"
import { createDistributorSchema, updateDistributorSchema } from "./distributors.schemas.js"

const distributorsRouter = Router()
const distributorsController = new DistributorsController()

distributorsRouter.use(isAuthenticated)

distributorsRouter.post("/", validateRequest(createDistributorSchema) ,distributorsController.create)
distributorsRouter.get("/", distributorsController.findAllByUser)
distributorsRouter.get("/:id", distributorsController.findById)
distributorsRouter.put("/:id", validateRequest(updateDistributorSchema) ,distributorsController.update)
distributorsRouter.delete("/:id", distributorsController.delete)

export { distributorsRouter }