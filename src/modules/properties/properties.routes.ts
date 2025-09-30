import { Router } from "express"
import { PropertiesController } from "./properties.controller.js"
import { isAuthenticated } from "../../shared/middlewares/isAuthenticated.js"

const propertiesRouter = Router()
const propertiesController = new PropertiesController()

propertiesRouter.use(isAuthenticated)

propertiesRouter.post("/", propertiesController.create)
propertiesRouter.get("/", propertiesController.findAllByUser)
propertiesRouter.get("/:id", propertiesController.findById)
propertiesRouter.put("/:id", propertiesController.update)
propertiesRouter.delete("/:id", propertiesController.delete)

export { propertiesRouter }